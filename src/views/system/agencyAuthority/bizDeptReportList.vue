<template>
    <div>
        <Card>
            <j-table ref="bizDeptReportTable" pagination autoSearch
                     :queryForm="queryForm"
                     :server="server.query"
                     :columns-list="columns" v-model="tableData"
                     :input-col="4"
                     :label-width="60"
                     @on-delete="remove">
                <template slot="input-col">
                        <Col span="6">
                    <FormItem label="上报部门" prop="__LIKES_deptName">
                        <Input v-model="queryForm.__LIKES_deptName" placeholder="上报部门"></Input>
                    </FormItem>
                        </Col>
                        <Col span="6">
                    <FormItem label="业务类型" prop="__LIKES_bizName">
                        <Input v-model="queryForm.__LIKES_bizName" placeholder="业务类型"></Input>
                    </FormItem>
                        </Col>
                        <Col span="6">
                    <FormItem label="管理部门" prop="__LIKES_managerDeptName">
                        <Input v-model="queryForm.__LIKES_managerDeptName" placeholder="管理部门"></Input>
                    </FormItem>
                        </Col>
                </template>
                <template slot="toolbar">
                    <router-link to="/bizDeptReportEdit/add"><Button type="primary">新增</Button></router-link>
                </template>
            </j-table>
        </Card>
    </div>
</template>

<script>
    export default {
        data () {
            return {
                server: {
                    query: this.$services.sysService.bizDeptReportRestController.query
                },
                queryForm: {
                    __LIKES_deptName: '',
                    __LIKES_bizName: '',
                    __LIKES_managerDeptName: ''
                },
                tableData: [],
                columns: [
                    { type: 'index', align: 'center', width: 50 },
                    { title: '上报部门', align: 'center', key: 'deptName' },
                    { title: '业务种类', align: 'center', key: 'bizName' },
                    { title: '管理部门', align: 'center', key: 'managerDeptName' },
                    { title: '备注', align: 'center', key: 'remark' },
                    { title: '操作', align: 'center', key: 'action', width: 120, handler: [
                            {action: 'edit', path: '/bizDeptReportEdit/edit'},
                            {action: 'view', path: '/bizDeptReportView'},
                            {action: 'delete'}
                        ]
                    }],
            }
        },
        methods: {
            remove (data, index) {
                this.$net.send({
                    server: this.$services.sysService.bizDeptReportRestController.remove,
                    append: data.id
                }).then((data) => {
                    if (data.success) {
                        this.$Message.success(data.msg);
                        this.$refs.bizDeptReportTable.refresh();
                    } else {
                        this.$Message.error(data.msg);
                    }
                });
            }
        }
    }
</script>
