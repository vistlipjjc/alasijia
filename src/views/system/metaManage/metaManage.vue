<template>
    <Layout class="layout">
        <Sider>
            <j-tree ref="metaTreeRef" :data="metaTree"
                    :query-server="queryServer"
                    @on-select-node="selectNode">
            </j-tree>
        </Sider>
        <Content>
            <Card style="margin-left: 5%">
                <j-table ref="metaManageTable" pagination
                         :queryForm="queryForm"
                         :server="server.query"
                         :defaultParams="metaParam"
                         :columns-list="columns" v-model="tableData"
                         :label-width="70" :input-col="7"
                         @on-delete="remove"
                         @on-row-click="rowClick">
                    <template slot="input-col">
                        <Col span="8">
                            <FormItem label="表名" prop="__LIKES_tableCode">
                                <Input v-model="queryForm.__LIKES_tableCode" placeholder="表名" />
                            </FormItem>
                        </Col>
                        <Col span="8">
                            <FormItem label="表中文名" prop="__LIKES_tableName">
                                <Input v-model="queryForm.__LIKES_tableName" placeholder="表中文名" />
                            </FormItem>
                        </Col>
                    </template>
                    <template slot="toolbar">
                        <Button type="primary" @click="syncTable" >同步</Button>
                        <Button type="ghost" @click="exportExcel" >导出</Button>
                    </template>
                </j-table>
                <Spin size="large" fix v-if="spinShow">
                    <Icon type="ios-loading" size=18 class="demo-spin-icon-load"></Icon>
                    <div>Loading</div>
                </Spin>
                <Modal
                        v-model="dataModel" title="同步数据表" width="900px" :mask-closable="false"
                        ok-text="同步" cancel-text="取消"
                        @on-ok="confirmSyncData"
                        @on-cancel="cancel">
                    <Card>
                        <j-table ref="syncDataTable"
                                 :height="260"
                                 :queryForm="syncQueryForm"
                                 :server="server.syncQuery"
                                 :columns-list="syncColumns" v-model="syncTableData"
                                 :label-width="50" :input-col="8"
                                 :show-refresh="false"
                                 @on-select="syncRowClick" >
                            <template slot="input-col">
                                <Col span="15">
                                    <FormItem label="表模式" prop="schema">
                                        <j-select v-model="syncQueryForm.schema" url="custom:metaTable/querySchema@system"
                                            style="width: 150px" @on-change="selectChange('schema', $event)">
                                        </j-select>
                                    </FormItem>
                                    <FormItem label="表名" prop="tableCodes">
                                        <Input v-model="syncQueryForm.tableCodes" placeholder="表名" />
                                       <!-- <span style="display: inline-block">百分号“%”代表多个字符，下划线“_”代表一个字符。如需要查询多个表用“,”分隔。</span>-->
                                    </FormItem>
                                </Col>
                            </template>
                        </j-table>
                    </Card>
                </Modal>
            </Card>
        </Content>
    </Layout>
</template>

<script>
    export default {
        name: "metaManage",

        data() {
            return {

                treeNode: [],  //treeNode节点的数据
                regionId: '',  //地区的id

                metaParam:{}, //默认的查询参数
                metaRegionTable:{},  //元数据地区table对象
                spinShow: false,

                //jtree
                queryServer: this.$services.sysService.metaRegionRestController.treeNode,
                metaTree: [],


                //jtable
                dataModel: false,  //同步数据表模态框
                server: {
                    query: this.$services.sysService.metaTableRestController.queryMetaTable,
                    syncQuery: this.$services.sysService.metaTableRestController.queryTables,
                },
                queryForm:{
                    __LIKES_tableCode:'',
                    __LIKES_tableName:'',
                },
                tableData: [],
                columns:[
                    { type: 'index', align: 'center', width: 50 },
                    { title: '表模式', align: 'center', key: 'schema' },
                    { title: '表名', align: 'center', key: 'tableCode' },
                    { title: '表中文名', align: 'center', key: 'tableName' },
                    { title: '对象类型', align: 'center', key: 'objectType' ,formatter: 'fixedDict:MetaTableObjectType@system'},
                    { title: '操作', align: 'center', key: 'action', width: 120, handler: [
                            {action: 'edit', path: '/metaColumnTable'},
                            {action: 'delete'}
                        ]
                    }],
                selectedRow: {},

                syncSelectRow: {},

                syncQueryForm:{
                    schema: '',
                    tableCodes: '%',
                },

                syncTableData:[],

                syncColumns: [
                    { type: 'selection', align: 'center', width: 60 },
                    { title: '表模式', align: 'center', key: 'schema' },
                    { title: '表名', align: 'center', key: 'tableCode' },
                    { title: '表中文名', align: 'center', key: 'tableName' },
                    { title: '对象类型', align: 'center', key: 'objectType',formatter: 'fixedDict:MetaTableObjectType@system'
                    }],
            }
        },

        mounted(){
            this.init();
        },

        methods:{
            init(){

            },

            selectNode(treeNode){
                this.treeNode=treeNode[0];
                this.regionId=treeNode[0].regionId;
                this.metaParam={ __EQS_regionId: treeNode[0].regionId}
            },

            //导出元数据表的excel
            exportExcel(){
                this.$Message.info({duration: 5, content: '导出功能暂未开发！'})
                /*this.$net.send({
                    server: this.$services.sysService.metaTableRestController.exportAll,
                    data: {regionId: this.regionId},
                }).then((data) => {
                });*/
            },

            //下拉框选择变换函数
            selectChange(name, value){
                this.syncQueryForm.schema = value;
            },

            //table中的删除
            remove(data){
                this.$net.send({
                    server: this.$services.sysService.metaTableRestController.remove,
                    data: {
                        regionId: this.regionId,
                        tableId: data.tableId,
                    },
                }).then((data) => {
                    if (data.success) {
                        this.$Message.success(data.msg);
                        this.$refs.metaManageTable.refresh();
                    } else {
                        this.$Message.error(data.msg);
                    }
                });
            },
            syncTable(){
                if(this.regionId && this.regionId != ''){
                    this.dataModel = true;
                }
                else {
                    this.$Message.info("请选择你要同步到那个数据区域下。");
                }
            },
            //table中的选择行方法
            rowClick(row, index){
                this.selectedRow = row;
                this.syncQueryForm.schema = row.schema;
                // this.$refs.syncDataTable.refresh();
            },

            syncRowClick(selection){
                this.syncSelectRow = selection;
            },

            //模态框中的同步
            confirmSyncData(){
                this.spinShow = true;
                this.$net.send({
                    server: this.$services.sysService.metaTableRestController.syncCheckMetaTable,
                    data: {
                        mId: this.regionId,
                        mts: JSON.stringify(this.$refs.syncDataTable.getSelections()),
                    },
                }).then((data) => {
                    this.spinShow = false;
                    if (data.success) {
                        this.$Message.success(data.msg);
                        this.$refs.metaManageTable.refresh();
                    } else {
                        this.$Message.error(data.msg);
                    }
                });
            },

            //取消
            cancel(){

            },
        },
    }
</script>

<style scoped>
    .layout{
        background-color: #fff;
        padding: 10px;
    }
    .ivu-layout-sider{
        background-color: #fff;
    }
</style>