<template>
    <div>
        <Card>
            <j-table ref="bizDeptProxyTable" pagination autoSearch
                     :queryForm="queryForm"
                     :server="server.query"
                     :columns-list="columns" v-model="tableData"
                     :input-col="4"
                     :label-width="60"
                     @on-delete="remove">
                <template slot="input-col">
                        <Col span="4">
                        <FormItem label="部门" prop="__LIKES_deptName">
                            <Input v-model="queryForm.__LIKES_deptName" placeholder="部门"></Input>
                        </FormItem>
                        </Col>
                        <Col span="4">
                        <FormItem label="标准角色" prop="__LIKES_stdRoleName">
                            <Input v-model="queryForm.__LIKES_stdRoleName" placeholder="标准角色" ></Input>
                        </FormItem>
                        </Col>
                        <Col span="4">
                        <FormItem label="代管部门" prop="__LIKES_proxyDeptName">
                            <Input v-model="queryForm.__LIKES_proxyDeptName" placeholder="代管部门"></Input>
                        </FormItem>
                        </Col>
                        <Col span="5">
                        <FormItem label="代管标准角色" prop="__LIKES_proxyStdRoleName" :label-width=100>
                            <Input v-model="queryForm.__LIKES_proxyStdRoleName" placeholder="代管标准角色"></Input>
                        </FormItem>
                        </Col>
                </template>
                <template slot="toolbar">
                    <router-link to="/bizDeptProxyEdit/add"><Button type="primary">新增</Button></router-link>
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
                    query: this.$services.sysService.bizDeptProxyRestController.query
                },
                queryForm: {
                    __LIKES_deptName: '',
                    __LIKES_stdRoleName: '',
                    __LIKES_proxyDeptName: '',
                    __LIKES_proxyStdRoleName: ''
                },
                tableData: [],
                columns: [
                    {type: 'index', align: 'center', width: 50},
                    {title: '部门', align: 'center', key: 'deptName'},
                    {title: '标准角色', align: 'center', key: 'stdRoleName'},
                    {title: '代管部门', align: 'center', key: 'proxyDeptName'},
                    {title: '代管标准角色', align: 'center', key: 'proxyStdRoleName'},
                    {title: '备注', align: 'center', key: 'remark'},
                    {
                        title: '操作', align: 'center', key: 'action', width: 120, handler: [
                            {action: 'edit', path: '/bizDeptProxyEdit/edit'},
                            {action: 'view', path: '/bizDeptProxyView'},
                            {action: 'delete'}
                        ]
                    }],
            }
        },
        methods: {
            remove(data, index) {
                console.log(data);
                this.$net.send({
                    server: this.$services.sysService.bizDeptProxyRestController.remove,
                    append: data.id
                }).then((data) => {
                    if (data.success) {
                        this.$Message.success(data.msg);
                        this.$refs.bizDeptProxyTable.refresh();
                    } else {
                        this.$Message.error(data.msg);
                    }
                });
            }
        }
    }
</script>