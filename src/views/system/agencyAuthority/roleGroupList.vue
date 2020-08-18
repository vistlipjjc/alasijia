<template>
    <div>
        <Card>
            <p slot="title">角色组列表</p>
            <j-table ref="roleTable" pagination autoSearch
                     :queryForm="queryForm"
                     :server="server.query"
                     :columns-list="columns" v-model="roleGroupTable"
                     :input-col="6"
                     @on-row-click="rowClick"
                     @on-delete="remove">
                <template slot="input-col">
                    <Col span="6">
                    <FormItem label="角色组编码" prop="__LIKES_roleGroupCode">
                        <Input v-model="queryForm.__LIKES_roleGroupCode" placeholder="角色组编码"></Input>
                    </FormItem>
                    </Col>
                    <Col span="6">
                    <FormItem label="角色组名称" prop="__LIKES_roleGroupName">
                        <Input v-model="queryForm.__LIKES_roleGroupName" placeholder="角色组名称"></Input>
                    </FormItem>
                    </Col>
                </template>
                <template slot="toolbar">
                    <router-link to="/roleGroupEdit/add">
                        <Button type="primary">新增</Button>
                    </router-link>
                    <router-link :to="{path:'/roleGroupSetRole', query: {groupRoleCode: groupRoleCode}}">
                        <Button type="ghost">设置包含的角色</Button>
                    </router-link>
                </template>
            </j-table>
            <j-table ref="staffTable" pagination hiddenForm
                     :server="server.queryRole"
                     :default-params="indexCode"
                     :columns-list="columnsR" v-model="roleTable">
            </j-table>
        </Card>
    </div>
</template>

<script>
    export default {
        name: "roleGroupList",
        data() {
            return {
                server: {
                    query: this.$services.sysService.roleGroupRestController.query,
                    queryRole: this.$services.sysService.roleRestController.queryByRoleGroupCode,
                },
                queryForm: {
                    __LIKES_roleGroupCode: '',
                    __LIKES_roleGroupName: ''
                },
                roleGroupTable: [],
                columns: [
                    { type: 'index', align: 'center', width: 80 },
                    { title: '角色组编码', align: 'center', key: 'roleGroupCode' },
                    { title: '角色组名称', align: 'center', key: 'roleGroupName' },
                    { title: '角色组层级', align: 'center', key: 'hierarchy' },
                    { title: '角色组描述', align: 'center', key: 'roleGroupDesc' },
                    { title: '操作', align: 'center', key: 'action', width: 120, handler: [
                            {action: 'edit', path: '/roleGroupEdit/edit'},
                            {action: 'view', path: '/roleGroupView'},
                            {action: 'delete'}
                        ]
                    }],
                roleTable: [],
                columnsR: [
                    { type: 'index', align: 'center', width: 80 },
                    { title: '角色编码', align: 'center', key: 'roleCode' },
                    { title: '角色名称', align: 'center', key: 'roleName' },
                    { title: '角色描述', align: 'center', key: 'roleDesc' },

                ],
                indexCode: {},
                groupRoleCode: ''
            }
        },
        methods:{
            rowClick(row, index){
                this.indexCode = {__EQS_roleGroupCode: row.roleGroupCode};
                this.groupRoleCode = row.roleGroupCode;
            },
            remove(data){
                this.$net.send({
                    server: this.$services.sysService.remove,
                    append: data.roleGroupCode
                }).then((data) => {
                    if (data.success) {
                        this.$Message.success(data.msg);
                        this.$refs.roleTable.refresh();
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
