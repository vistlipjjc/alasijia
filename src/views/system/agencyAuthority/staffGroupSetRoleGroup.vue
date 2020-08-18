<template>
    <div>
        <Card>
            <p slot="title">添加角色组</p>
            <j-table ref="staffGroupSetRoleGroupTable" pagination autoSearch hiddenForm
                     :server="server.query"
                     :columns-list="columns" v-model="tableData"
                     @on-select="selectRow">
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
        name: "staffGroupSetRoleGroup",
        data(){
            return {
                server: {
                    query: this.$services.sysService.roleGroupRestController.query,
                },
                tableData: [],
                columns: [
                    {type: 'selection', align: 'center', width: 80},
                    {title: '角色组编码', align: 'center', key: 'roleGroupCode'},
                    {title: '角色组名称', align: 'center', key: 'roleGroupName'},
                    {title: '角色组描述', align: 'center', key: 'roleGroupDesc'},
                ],
            }
        },
        mounted(){
            this.init();
        },
        methods:{
            init(){

            },
            selectRow(selection, row){
                console.log(selection, row);
                this.selectedRow = selection;
            },
            /*完成设置*/
            btnComp(){
                let obj = {
                    staffGroupCode: this.$route.query.groupSetRoleGroup,
                    jsonRoleGroupList: JSON.stringify(this.selectedRow)
                };
                this.$net.send({
                    server: this.$services.sysService.staffGroupRoleGroupMapRestController.saveRoleGroup,
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
                this.$store.commit('removeTag', 'staffGroupSetRoleGroup');
                this.$store.commit('closePage', 'staffGroupSetRoleGroup');
            }
        },

    }
</script>

<style scoped>

</style>