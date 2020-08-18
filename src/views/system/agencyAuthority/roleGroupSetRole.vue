<template>
    <div>
        <Card>
            <p slot="title">设置包含的角色</p>
            <j-table ref="roleGroupSetRoleTable" pagination autoSearch hiddenForm
                     :server="server.query"
                     :columns-list="columns" v-model="tableData"
                     @on-selection-change="getSelections">
                <template slot="toolbar">
                    <Button type="primary" @click="btnComp('editForm')">完成设置</Button>
                    <Button type="ghost" @click="btnBack">返回</Button>
                </template>
            </j-table>
        </Card>
    </div>
</template>

<script>
    export default {
        name: "roleGroupSetRole",
        data(){
            return {
                server: {
                    query: this.$services.sysService.roleRestController.query,
                },
                tableData: [],
                columns: [
                    {type: 'selection', align: 'center', key: '_checked', width: 80},
                    {title: '角色编码', align: 'center', key: 'roleCode'},
                    {title: '角色名称', align: 'center', key: 'roleName'},
                    {title: '角色描述', align: 'center', key: 'roleDesc'},
                ],
                selectedRow: []
            }
        },
        mounted(){
            this.init();
        },
        methods: {
            init(){
                /* 查询角色数据 */
                this.$net.send({
                    server: this.server.query
                }).then((data) => {
                    if(data.total > 0)
                    {
                        /* 查询已当前用户组中的用户数据，并勾选*/
                        this.total = data.total;
                        this.$net.send({
                            server: this.$services.sysService.roleRestController.queryByRoleGroupCode,
                            data: {__EQS_roleGroupCode: this.$route.query.groupRoleCode}
                        }).then((roleData) => {
                            data.rows.forEach(item => {
                                roleData.rows.forEach(tmp => {
                                    if (item.roleCode == tmp.roleCode)
                                    {
                                        item._checked = true;
                                        this.selectedRow.push(tmp);
                                    }
                                });
                            });
                            this.tableData = data.rows;
                        });
                    }
                });
            },
            getSelections(selection, row){
                console.log(selection, row)
                // console.log(this.$refs.roleGroupSetRoleTable.selectAll())
                this.selectedRow = selection;
            },
            /*完成设置*/
            btnComp(){
                let obj = {
                    roleGroupCode: this.$route.query.groupRoleCode,
                    jsonRoleList: JSON.stringify(this.selectedRow)
                };
                this.$net.send({
                    server: this.$services.sysService.roleGroupMapRestController.saveRoleMap,
                    data: obj
                }).then((data) => {
                    if (data.success) {
                        this.$Message.success(data.msg);
                        this.btnBack();
                    } else {
                        this.$Message.error(data.msg);
                    }
                });
            },
            /*返回*/
            btnBack() {
                this.$router.go(-1);
                this.$store.commit('removeTag', 'roleGroupSetRole');
                this.$store.commit('closePage', 'roleGroupSetRole');
            }
        }
    }
</script>