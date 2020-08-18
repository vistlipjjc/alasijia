<template>
    <div>
        <!--<j-table ref="metaManageTable" pagination
                 :queryForm="queryForm"
                 :server="server.query"
                 :defaultParams="queryParam"
                 :columns-list="columns" v-model="tableData"
                 @on-delete="remove"
                 @on-row-click="rowClick"
                 @on-select="getRows">
            <template slot="input">
                <FormItem label="列名" prop="__LIKES_columnCode">
                    <Input v-model="queryForm.__LIKES_columnCode" placeholder="列名" />
                </FormItem>
                <FormItem label="列中文名" prop="__LIKES_columnName">
                    <Input v-model="queryForm.__LIKES_columnName" placeholder="列中文名" />
                </FormItem>
            </template>
            <template slot="toolbar">
                <Button type="primary" @click="syncDataModel = true" >同步</Button>
                <Button type="primary" @click="saveDataModel = true" >保存</Button>
                <Button type="primary" @click="back" >返回</Button>
            </template>
        </j-table>-->
        <Card>
            <Form ref="editForm" :model="editForm"  :label-width="180">
                <template slot="input">
                    <FormItem label="列名" prop="__LIKES_columnCode">
                        <Input v-model="queryForm.__LIKES_columnCode" placeholder="列名" />
                    </FormItem>
                    <FormItem label="列中文名" prop="__LIKES_columnName">
                        <Input v-model="queryForm.__LIKES_columnName" placeholder="列中文名" />
                    </FormItem>
                </template>
                <Button type="primary" @click="syncDataModel = true" >同步</Button>
                <Button type="primary" @click="saveDataModel = true" >保存</Button>
                <Button type="primary" @click="back" >返回</Button>
            </Form>
            <meta-column-edit
                    refs="metaColumnTableEdit"
                    :value="tableData"
                    :tableId="row.tableId"
                    @on-change="changeParam"
                    :columns-list="columns">
            </meta-column-edit>
        </Card>
        <Modal
                v-model="syncDataModel" title="提示"  :mask-closable="false"
                ok-text="同步" cancel-text="关闭"
                @on-ok="syncColumns"
                @on-cancel="cancel">
            <p>确定要同步元数据列？</p>
        </Modal>
        <Modal
                v-model="saveDataModel" title="提示"  :mask-closable="false"
                ok-text="保存" cancel-text="关闭"
                @on-ok="saveColumns"
                @on-cancel="cancel">
            <p>确定要保存修改的列吗？</p>
        </Modal>
    </div>
</template>

<script>
    const overflowHidden = (h, params, code) =>{
        return h('div', [
            h('span', {
                style: {
                    display: 'inline-block',
                    width: '100%',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                },
                domProps: {
                    title: params.row[code]
                }
            }, params.row[code])
        ]);
    }
    import MetaColumnEdit from "./component/metaColumnEdit";
    export default {
        components: {MetaColumnEdit},
        name: "metaColumnTable",

        data(){
            return{
                row: this.$route.query.row,
                syncDataModel: false,  //同步数据表模态框
                saveDataModel: false,
                selectionParam: '',
                editForm: {},
                server: {
                    query: this.$services.sysService.metaColumnRestController.selectMetaColumnDto
                },
                queryParam: {},
                queryForm:{
                    __LIKES_columnCode:'',
                    __LIKES_columnName:'',
                },
                editRow: {},
                tableData: [],
                columns:[
                    { title: '列名', align: 'center', key: 'columnCode' , render: (h, params) => {
                            return overflowHidden(h, params, 'columnCode')
                        }},
                    { title: '列中文名', align: 'center', key: 'columnName', editable: true, width: 150},
                    { title: '字段属性', align: 'center', key: 'prop', formatter: 'fixedDict:ColumnAttribute@system', editable: true , width: 150},
                    { title: '外键', align: 'center', key: 'isForeignKey', formatter: 'fixedDict:YesNo@system', editable: true, width: 150},
                    { title: '关联表', align: 'center', key: 'masterTableDisplayName', render: (h, params) => {
                            return overflowHidden(h, params, 'masterTableDisplayName')
                        } },
                    { title: '关联字段', align: 'center', key: 'masterColumnCode' , render: (h, params) => {
                            return overflowHidden(h, params, 'masterColumnCode')
                        }},
                    { title: '数据类型', align: 'center', key: 'dataType' },
                    { title: '主键', align: 'center', key: 'isKey', formatter: 'fixedDict:YesNo@system' },
                    { title: '字段长度', align: 'center', key: 'length' },
                    { title: '字段精度', align: 'center', key: 'scale' },
                    { title: '字段顺序', align: 'center', key: 'order' },
                    ],
                selectedRow: {},
            }
        },

        created(){
            this.init();
        },

        methods:{
            init(){
                this.queryParam = {tableId: this.row.tableId}
                this.$net.send({
                    server: this.server.query,
                    data: this.queryParam
                }).then((data) => {
                    this.tableData = data.rows
                });

            },

            //同步列表
            syncColumns(){
                this.$net.send({
                    server: this.$services.sysService.metaColumnRestController.update,
                    data: {tableId: this.row.tableId},
                }).then((data) => {
                    if (data.success) {
                        this.$Message.success(data.msg);
                    } else {
                        this.$Message.error(data.msg);
                    }
                });
            },
            getRows(selection, row){

            },
            //保存修改
            saveColumns(){
              // console.info(JSON.stringify(this.$refs.metaManageTable.getTableData()));
                console.info(this.tableData);
                this.$net.send({
                    server: this.$services.sysService.metaColumnRestController.updateMetaColumn,
                    data: {mcList: JSON.stringify(this.tableData),
                        tableId: this.row.tableId
                    },
                }).then((data) => {
                    if (data.success) {
                        this.$Message.success(data.msg);
                    } else {
                        this.$Message.error(data.msg);
                    }
                });
            },


            //取消
            cancel(){

            },

            remove(){},

            rowClick(){},

            //返回
            back(){
                this.$router.go(-1);
                this.$store.commit('removeTag', 'metaColumnTable');
                this.$store.commit('closePage', 'metaColumnTable');
            },
            // selectionChange(data){
            //     // this.row = data[0];
            //     this.selectionParam = data;
            //
            // },
            changeParam(param,tableData, index){
                param[index].formCode = this.$route.query.row.code;
                this.editForm.param = JSON.stringify(param);
                this.tableData = tableData;
            }
        },
    }
</script>

<style scoped>

</style>