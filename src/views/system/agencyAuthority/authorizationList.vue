<template>
    <div class="authotizationListCtnr">
        <Card>
            <p slot="title">授权管理</p>
            <j-table ref="roleListTable" pagination autoSearch hiddenForm
                     :server="server.queryRole"
                     :default-params="roleTableDefaultParam"
                     :columns-list="roleColumns"
                     v-model="roleTable"
                     :showQuery="false"
                     :showReset="false"
                     @on-current-change="getSelectRoleRow">
                <template slot="toolbar">
                    <Button type="primary" @click="$router.push({path:'/authorizeMent/edit', query: roleParams})">授权</Button>
                </template>
            </j-table>

            <!-- 目前用不到角色组，先隐藏 -->
            <!-- <j-table ref="roleGroupListTable" pagination autoSearch hiddenForm
                     :server="server.queryRoleGroup"
                     :columns-list="roleGroupColumns"
                     v-model="roleGroupTable"
                     :showQuery="false"
                     :showReset="false"
                     @on-current-change="getSelectRoleGroupRow">
                <template slot="toolbar">
                    <router-link :to="{name:'authorizeSet', params: roleGroupParams}">
                        <Button type="primary">授权</Button>
                    </router-link>
                </template>
            </j-table> -->
        </Card>
    </div>
</template>

<script>
    export default {
        name: 'authorizationList',
        data() {
            return {
                roleTableDefaultParam: {__EQS_delflag: 'N'},
                roleParams: {},
                roleGroupParams: {},
                server: {
                    queryRole: this.$services.sysService.roleRestController.query,
                    queryRoleGroup: this.$services.sysService.roleGroupRestController.query,
                },
                roleTable: [],
                roleColumns: [
                    { type: 'index', title: '序号', align: 'center', width: 80 },
                    { title: '角色编码', align: 'center', key: 'roleCode' },
                    { title: '角色名称', align: 'center', key: 'roleName' },
                    { title: '角色描述', align: 'center', key: 'roleDesc' },
                    { title: '角色类型', align: 'center', key: 'roleStdCode', formatter: 'custom:roleStd/queryAll@system' },
                    { title: '状态', align: 'center', key: 'status', formatter: 'fixedDict:RoleStatus@system' },
                ],
                roleGroupTable: [],
                roleGroupColumns: [
                    { type: 'index', align: 'center', width: 80 },
                    { title: '角色组编码', align: 'center', key: 'roleGroupCode' },
                    { title: '角色组名称', align: 'center', key: 'roleGroupName' },
                    /*{ title: '角色组层级', align: 'center', key: 'hierarchy', formatter: 'fixedDict:UnitHierarchy@system' },*/
                    { title: '角色组描述', align: 'center', key: 'roleGroupDesc' },
                ],
            }
        },
        methods:{
            getSelectRoleRow(row){
                this.roleParams = {code: row.roleCode, name: row.roleName, type: 'ROLE'}
            },
            getSelectRoleGroupRow(row){
                this.roleGroupParams = {code: row.roleGroupCode, name: row.roleGroupName, type: 'ROLEGROUP'}
            }
        }
    };
</script>
