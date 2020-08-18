<template>
    <Card>
        <j-table ref="dataProviderTable" pagination auto-search
                 :queryForm="queryForm"
                 :server="server.query"
                 :defaultParams="defaultStatus"
                 :columns-list="columns" v-model="tableData"
                 :input-col="6"
                 @on-delete="remove"
                 @on-row-click="rowClick">
            <template slot="input-col">
                <Col span="16">
                <FormItem label="查询名称" prop="__LIKES_queryName" style="width: 100%">
                    <Input v-model="queryForm.__LIKES_queryName" placeholder="查询名称" />
                </FormItem>
                </Col>
            </template>
            <template slot="toolbar">
                <Button type="primary" @click="dataModel = true" >同步数据源</Button>
            </template>
        </j-table>
        <Modal
                v-model="dataModel" title="同步数据源" width="900px" :mask-closable="false"
                ok-text="同步" cancel-text="取消"
            @on-ok="confirmSyncData"
            @on-cancel="cancelSyncData">
            <Card>
                <j-table ref="syncDataTable"  pagination auto-search
                         :queryForm="syncQueryForm"
                         :server="server.syncQuery"
                         :columns-list="syncColumns" v-model="syncTableData"
                         @on-delete="remove"
                         @on-selection-change="modelRowClick">
                    <template slot="input">
                        <FormItem label="查询名称" prop="__LIKES_queryName">
                            <Input v-model="syncQueryForm.__LIKES_queryName" placeholder="查询名称"></Input>
                        </FormItem>
                    </template>
                </j-table>
            </Card>
        </Modal>
    </Card>
</template>

<script>
    export default {
        name: "dataProvider",

        data() {
            return {
                dataModel: false,//同步数据源模态框

                server: {
                    query: this.$services.sysService.dataProviderRestController.query,
                    syncQuery: this.$services.sysService.metaQueryRestController.syncQuery,
                },
                queryForm: {
                    __LIKES_queryName: ''
                },
                defaultStatus:{
                    status: 30
                },
                tableData: [],
                columns: [
                    { type: 'index', align: 'center', width: 50 },
                    { title: '查询名称', align: 'center', key: 'queryName' },
                    { title: '机构名称', align: 'center', key: 'unitName' },
                    { title: '部门名称', align: 'center', key: 'deptName' },
                    { title: '用户名称', align: 'center', key: 'staffName' },
                    { title: '操作', align: 'center', key: 'action', width: 120, handler: [
                            {action: 'view', path: '/dataProviderDetail'},
                            {action: 'delete'}
                        ]
                    }],
                selectedRow: {},
                modelSelectedRow: {},
                //同步数据源的table
                syncQueryForm: {
                    __LIKES_queryName: ''
                },
                syncTableData: [],
                syncColumns: [
                    { type: 'selection', align: 'center', width: 60 },
                    { title: '查询名称', align: 'center', key: 'queryName' },
                    { title: '查询类型', align: 'center', key: 'queryType' },
                    { title: '状态', align: 'center', key: 'status' },
                    { title: '操作', align: 'center', key: 'action', width: 120, handler: [
                            {action: 'view', path: '/dataProviderDetail'},
                        ]
                    }],
            }
        },
        methods: {
            rowClick(row, index){
                this.selectedRow = row;
            },
            modelRowClick(selection){
                this.modelSelectedRow = selection;
            },

            remove(data) {
                this.$net.send({
                    server: this.$services.sysService.dataProviderRestController.remove,
                    data: {},
                    append: data.queryId,
                }).then((data) => {
                    if (data.success) {
                        this.$Message.success(data.msg);
                        this.$refs.dataProviderTable.refresh();
                    } else {
                        this.$Message.error(data.msg);
                    }
                });
            },

            //同步数据源模态框确认同步数据源
            confirmSyncData(){
                this.$net.send({
                    server: this.$services.sysService.dataProviderRestController.save,
                    data:  JSON.stringify(this.$refs.syncDataTable.getSelections()),
                }).then((data) => {
                    if (data.success) {
                        this.$Message.success(data.msg);
                        this.$refs.dataProviderTable.refresh();
                    } else {
                        this.$Message.error(data.msg);
                    }
                })
            },
            //同步数据源模态框取消同步数据源
            cancelSyncData(){

            },
        }
    }
</script>

<style scoped>

</style>