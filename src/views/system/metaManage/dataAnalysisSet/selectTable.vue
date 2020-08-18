<template>
    <Modal	width="60%"
              v-model="tableModal"
              title="选择关联表"
              @on-ok="checkedTable()"
              @on-cancel="cancel"
              :transfer="false"
              :mask-closable = "false"
              cancel-txt="取消"
              ok-text="确定">
        <template>
            <Row>
                <Col span="7">
                    <Card>
                        <j-tree ref="metaTreeRef" :data="metaTree"
                                :query-server="queryServer"
                                @on-select-node="selectNode">
                        </j-tree>
                    </Card>
                </Col>
                <Col span="17">
                    <Card style="margin-left: 10px;">
                        <div class="j-table-header">
                            <Form ref="j-table-form" :model="queryForm" :inline="true"
                                  :show-message="true">
                                <Row>
                                    <Col span="8">
                                        <Input v-model="queryForm.tableCode" placeholder="表名" />
                                    </Col>
                                    <Col span="8" style="margin-left: 10px;">
                                        <Input v-model="queryForm.tableName" placeholder="表中文名" />
                                    </Col>
                                    <Col span="3" style="margin-left: 10px;">
                                        <Button @click="btnQuery" type="primary" icon="search">搜索</Button>
                                    </Col>
                                    <Col span="3" style="margin-left: 10px;">
                                        <Button @click="btnReset" type="ghost" icon="refresh">重置</Button>
                                    </Col>
                                </Row>
                            </Form>
                        </div>
                        <div style="margin-top: 10px;">
                            <Table border ref="metaManageTable" height="300" :highlight-row="true" :columns="columns" :data="tableData" @on-row-click="rowClick" @on-row-dblclick="rowClick"></Table>
                        </div>
                        <div style="margin-top: 10px;" v-if="total > 0">
                            <Page size="small" :total="total" :current="currentPage" :page-size="pageSize" placement="top" @on-page-size-change="pageSizeChange" @on-change="changePage" show-sizer show-total></Page>
                        </div>
                    </Card>
                </Col>
            </Row>
        </template>
    </Modal>
</template>

<script>
    export default {
        name: "select-join-table",
        data() {
            return {
               tableModal: false,
                queryServer: this.$services.sysService.metaRegionRestController.treeNode,
                metaTree: [],
                queryForm:{
                    regionId: '',
                    tableCode:'',
                    tableName:'',
                },
                server: {
                    query: this.$services.sysService.metaRegionTableRestController.queryMetaRegionTableNameDto,
                },
                columns:[
                    { type: 'index', align: 'center', width: 50 },
                    { title: '表模式', align: 'center', key: 'schema', width: 80 },
                    { title: '表名', align: 'center', key: 'tableCode' },
                    { title: '表中文名', align: 'center', key: 'tableName' },
                    { title: '对象类型', align: 'center', key: 'objectType' ,formatter: 'fixedDict:MetaTableObjectType@system',
                        render: (h, params) => {
                            return  h('span', this.$store.getters['cache/getCacheDictName']('MetaTableObjectType', params.row['objectType']));
                        }
                    },
                    ],
                tableData: [],
                selectedRow: '',
                currentPage: 1, //当前页码
                pageSize: 5, //每页条数
                total: 0 //总条数
            }
        },
        mounted(){
            this.init();
        },
        methods: {
            init(){
                /* 获取列枚举数据、后端查询数据，并缓存 */
                this.$store.dispatch('cache/cacheDict', {type: 'fixedDict', url: 'MetaTableObjectType', service: 'sys'});
            },
            openSelectTable(data){
                this.tableModal = true;
            },
            checkedTable(){
                if(this.selectedRow && this.selectedRow.tableCode){
                   let data =  {
                        'code': this.selectedRow.tableCode,
                        'name': this.selectedRow.tableName,
                        'schema': this.selectedRow.schema,
                        'id': this.selectedRow.tableId,
                        'tableType': this.selectedRow.tableType,
                        'objectSource': this.selectedRow.objectSource,
                        'objectType': this.selectedRow.objectType,
                        'regionTableId' : this.selectedRow.regionTableId
                    };
                    this.$emit('closeSelectTable', false, data);
                }
            },
            cancel(){
                this.$emit('closeSelectTable', true);
            },
            selectNode(treeNode){
                if(treeNode[0] && treeNode[0].regionId != this.queryForm['regionId']){
                    this.treeNode=treeNode[0];
                    this.queryForm['regionId']=treeNode[0].regionId;
                    this.btnReset();
                }
            },
            //table中的选择行方法
            rowClick(row, index){
                this.selectedRow = row;
            },
            /* 搜索 */
            btnQuery () {
                this.currentPage = 1;
                this.handleQuery();
            },
            /* 重置 */
            btnReset () {
                this.currentPage = 1;
                this.queryForm['tableCode'] = '';
                this.queryForm['tableName'] = '';
                this.handleQuery();
            },
            handleQuery(){
                /*如果重新查询，则当前选择行失效*/
                this.selectedRow = {};
                // 获取传递参数
                let params = this.queryForm;
                // 获取分页设置
                let pageConfig = {
                    pageSize: this.pageSize,
                    pageNumber: this.currentPage
                };
                //更新查询数据
                this.$net.send({
                    server: this.server.query,
                    data: {
                        ...params,
                        ...pageConfig
                    }
                }).then((data) => {
                    data.rows.forEach(item => {
                        item._checked = false;
                        item._disabled = false;
                        item._highlight = false;
                    });
                    // 更新数据信息
                    this.tableData = data.rows || [];

                    // 更新分页信息
                    this.total = data.total;

                }, err => {
                    this.$Message.error(err.reason);
                });
            },
            // 改变每页条数
            pageSizeChange(val) {
                this.pageSize = val
                this.handleQuery();
            },
            // 翻页
            changePage (val) {
                this.currentPage = val;
                this.handleQuery();
            },
        }
    }
</script>

<style scoped>

</style>