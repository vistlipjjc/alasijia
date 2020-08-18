<template>
    <div>
        <Card>
            <j-table ref="suppliersTable" pagination autoSearch
                     :queryForm="queryForm"
                     :server="server.query" @on-row-click="onSelect"
                     :columns-list="columns" v-model="tableData"
                     :label-width="90"
                     :input-col="8"
                     @on-delete="remove">
                <template slot="input-col">
                    <Col span="15">
                        <FormItem label="资产编码" prop="__LIKES_code">
                            <Input v-model="queryForm.__LIKES_code" placeholder="资产编码"></Input>
                        </FormItem>
                        <FormItem label="资产名称" prop="__LIKES_name">
                            <Input v-model="queryForm.__LIKES_name" placeholder="资产名称"></Input>
                        </FormItem>
                    </Col>
                </template>
                <template slot="toolbar">
                    <Button type="primary" @click="wfStart" >启动工作流</Button>
                    <Button type="primary" @click="wfStartAnd" :disabled="!bizData.code">编辑启动工作流</Button>
                </template>
            </j-table>
        </Card>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                server: {
                    query: this.$services.demoService.suppliersRestController.query
                },
                queryForm: {
                    __LIKES_code: '',
                    __LIKES_name: ''
                },
                tableData: [],
                bizData: {},
                columns: [
                    { type: 'index', align: 'center', width: 50 },
                    { title: '资产编码', align: 'center', key: 'code' },
                    { title: '资产名称', align: 'center', key: 'name' },
                    { title: '购入日期', align: 'center', key: 'purchaseDt' },
                    { title: '单价', align: 'center', key: 'price' },
                    { title: '使用者编码', align: 'center', key: 'staffCode' },
                    { title: '使用者名称', align: 'center', key: 'staffName' },
                    { title: '备注', align: 'center', key: 'remark' },
                    { title: '操作', align: 'center', key: 'action', width: 120, handler: [
                            {action: 'edit', path: '/suppliersEdit/edit'},
                            {action: 'view', path: '/suppliersView'},
                            {action: 'delete'}
                        ]
                    }],
            }
        },
        methods: {
            remove(data, index) {
                this.$net.send({
                    server: this.$services.demoService.suppliersRestController.remove,
                    append: data.id
                }).then((data) => {
                    if (data.success) {
                        this.$Message.success(data.msg);
                        this.$refs.suppliersTable.refresh();
                    } else {
                        this.$Message.error(data.msg);
                    }
                });
            },
            onSelect(row, ee){
                debugger;
                console.info(row);
                this.bizData = row;
            },
            wfStart(){
                this.$router.push({path: '/wfStart', query: {procCode: 'concur'}});
            },
            wfStartAnd(){
                this.$router.push({path: '/wfStart', query: {procCode: 'concur', bizData: this.bizData, opt: 'EDIT'}});
            }
        }
    }
</script>
