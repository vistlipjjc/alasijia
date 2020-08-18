<template>
    <div>
        <Card>
            <p slot="title">用户组列表</p>
            <j-table ref="staffGroupTable" pagination autoSearch
                   :queryForm="queryForm"
                   :server="server.query"
                   :columns-list="columns" v-model="staffGroupTable"
                    :input-col="6"
                   @on-row-click="rowClick"
                   @on-delete="remove">
                <template slot="input-col">
                    <Col span="6">
                <FormItem label="用户组编码" prop="__LIKES_staffGroupCode">
                    <Input v-model="queryForm.__LIKES_staffGroupCode" placeholder="用户组编码"></Input>
                </FormItem>
                    </Col>
                    <Col span="6">
                <FormItem label="用户组名称" prop="__LIKES_staffGroupName">
                    <Input v-model="queryForm.__LIKES_staffGroupName" placeholder="用户组名称"></Input>
                </FormItem>
                    </Col>
            </template>
            <template slot="toolbar">
                <router-link to="/staffGroupEdit/add">
                    <Button type="primary">新增</Button>
                </router-link>
                <router-link :to="{path: '/staffGroupSetStaff', query: {groupCodeSetStaff: groupCodeSetStaff}}">
                    <Button type="ghost">添加用户</Button>
                </router-link>
                <router-link :to="{path: '/staffGroupSetRole', query: {groupSetRole: groupSetRole}}">
                    <Button type="ghost">关联角色</Button>
                </router-link>
                <router-link :to="{path: '/staffGroupSetRoleGroup', query: {groupSetRoleGroup: groupSetRoleGroup}}">
                    <Button type="ghost">关联角色组</Button>
                </router-link>
            </template>
        </j-table>
            <j-table ref="staffTable" pagination hiddenForm
                     :server="server.queryStaff"
                     :default-params="staffParam"
                     :columns-list="columnsR" :value="staffTable"
                     @on-delete="remove">
            </j-table>
        </Card>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                server: {
                    query: this.$services.sysService.staffGroupRestController.query,
                    queryStaff: this.$services.sysService.staffGroupMapRestController.queryStaff
                },
                queryForm: {
                    __LIKES_staffGroupCode: '',
                    __LIKES_staffGroupName: ''
                },
                staffGroupTable: [],
                columns: [
                    { type: 'index', align: 'center', width: 50 },
                    { title: '用户组编码', align: 'center', key: 'staffGroupCode' },
                    { title: '用户组名称', align: 'center', key: 'staffGroupName' },
                    { title: '用户组描述', align: 'center', key: 'staffGroupDesc' },
                    { title: '操作', align: 'center', key: 'action', width: 120, handler: [
                            {action: 'edit', path: '/staffGroupEdit/edit'},
                            {action: 'view', path: '/staffGroupView'},
                            {action: 'delete'}
                        ]
                    }],
                staffTable: [],
                columnsR: [
                    { type: 'index', align: 'center', width: 50 },
                    { title: '用户账号', align: 'center', key: 'staffCode' },
                    { title: '用户名称', align: 'center', key: 'staffName' },
                    ],
                staffParam: {},
                groupCodeSetStaff: '',
                groupSetRole: '',
                groupSetRoleGroup: ''
            }
        },
        methods:{
            rowClick(row, index){
                this.staffParam = {__EQS_staffGroupCode: row.staffGroupCode};
                this.groupCodeSetStaff = row.staffGroupCode;
                this.groupSetRole = row.staffGroupCode;
                this.groupSetRoleGroup = row.staffGroupCode;

            },
            remove(data){
                this.$net.send({
                    server: this.$services.sysService.staffGroupRestController.remove,
                    append: data.staffGroupCode
                }).then((data) => {
                    if (data.success) {
                        this.$Message.success(data.msg);
                        this.$refs.staffGroupTable.refresh();
                    } else {
                        this.$Message.error(data.msg);
                    }
                });
            }
        }

    }
</script>

<style scoped>

</style>