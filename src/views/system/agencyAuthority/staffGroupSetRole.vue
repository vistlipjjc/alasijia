<template>
    <div>
        <Card>
            <p slot="title">添加角色</p>
            <j-table ref="staffGroupSetRoleTable" pagination autoSearch hiddenForm
                     :server="server.query"
                     :columns-list="columns" v-model="tableData"
                     @on-select="selectRow">
                <template slot="toolbar">
                    <Button type="primary" @click="btnComp('editForm')"a>完成设置</Button>
                    <Button type="ghost" @click="btnBack">返回</Button>
                </template>
            </j-table>
        </Card>
    </div>
</template>

<script>
    export default {
        name: "staffGroupSetRole",
        data(){
            return {
                server: {
                    query: this.$services.sysService.roleRestController.query
                },
                tableData: [],
                columns: [
                    {type: 'selection', align: 'center', width: 80},
                    {title: '角色编码', align: 'center', key: 'roleCode'},
                    {title: '角色名称', align: 'center', key: 'roleName'},
                    {title: '角色描述', align: 'center', key: 'roleDesc'},
                ],
            }
        },
        methods: {
            selectRow(selection, row){
                this.selectedRow = selection;
            },
            /*完成设置*/
            btnComp(){
                let obj = {
                    staffGroupCode: this.$route.query.groupSetRole,
                    jsonRoleList: JSON.stringify(this.selectedRow)
                };
                this.$net.send({
                    server: this.$services.sysService.staffGroupRoleMapRestController.saveRole,
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
                this.$store.commit('removeTag', 'staffGroupSetRole');
                this.$store.commit('closePage', 'staffGroupSetRole');
            }
        }
    }
</script>

<style scoped>

</style>