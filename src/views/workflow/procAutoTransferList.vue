<template>
    <div class="procAutoTransferList">
        <Card>
            <j-table ref="procAutoTransferTable" pagination autoSearch
                     :queryForm="queryForm"
                     :server="server.query"
                     :columns-list="columns" v-model="tableData"
                     :label-width="90" :input-col="5"
                     @on-delete="remove">
                <template slot="input-col">
                    <Col span="8">
                    <FormItem label="转办用户编码" prop="__LIKES_transferStaffCode">
                        <Input v-model="queryForm.__LIKES_transferStaffCode"></Input>
                    </FormItem>
                    </Col>
                    <Col span="8">
                    <FormItem label="转办用户名称" prop="__LIKES_transferStaffName">
                        <Input v-model="queryForm.__LIKES_transferStaffName"></Input>
                    </FormItem>
                    </Col>
                </template>
                <template slot="toolbar">
                    <router-link to="/procAutoTransferEdit/add">
                        <Button type="primary">新增</Button>
                    </router-link>
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
                    query: this.$services.wfService.procAutoTransferRestController.query
                },
                editForm: {
                    transferStaffCode: '',
                    transferStaffName: '',
                },
                queryForm: {
                    __LIKES_transferStaffCode: '',
                    __LIKES_transferStaffName: ''
                },
                tableData: [],
                columns: [
                    {type: 'index', align: 'center', width: 50},
                    {title: '转办用户编码', align: 'center', key: 'transferStaffCode'},
                    {title: '转办用户名称', align: 'center', key: 'transferStaffName'},
                    {title: '开始时间', align: 'center', key: 'startTimeString'},
                    {title: '结束时间', align: 'center', key: 'endTimeString'},
                    {title: '备注', align: 'center', key: 'remark'},
                    {
                        title: '操作', align: 'center', key: 'action', width: 120, handler: [
                            {action: 'edit', path: '/procAutoTransferEdit/edit'},
                            {action: 'view', path: '/procAutoTransferView'},
                            {action: 'delete'}
                        ]
                    }
                ],
                row:{}
            }

        },
        name: "procAutoTransferList",
        beforeRouteEnter(to, from, next){
            next(vm=>{
                vm.$refs.procAutoTransferTable.handleQuery();
            })
        },
        methods: {
            remove(data){
                this.$net.send({
                    server: this.$services.wfService.procAutoTransferRestController.remove,
                    append: data.id
                }).then((data) => {
                    if (data.success) {
                        this.$Message.success(data.msg);
                        this.$refs.procAutoTransferTable.refresh();
                    } else {
                        this.$Message.error(data.msg);
                    }
                });
            }
        },
        mounted() {
        }

    }
</script>
