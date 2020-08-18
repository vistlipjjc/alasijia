<template>
    <div>
        <Card>
            <p slot="title">添加用户</p>
            <j-table ref="staffGroupSetStaffTable"  hiddenForm
                     :jtotal="total"
                     :server="server.query"
                     :columns-list="columns" :value="tableData"
                     @on-selection-change="selectRow">
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
        name: "staffGroupSetStaff",
        data(){
            return {
                server:  {
                   query:  this.$services.sysService.staffRestController.query,
                },
                total: 0,
                tableData: [],
                columns: [
                    {type: 'selection', align: 'center', key: '_checked', width: 80},
                    {title: '用户账号', align: 'center', key: 'staffCode'},
                    {title: '用户名称', align: 'center', key: 'staffName'},
                    {title: '电话', align: 'center', key: 'mobile'}
                ],
                selectedRow: []
            }
        },
        mounted(){
            this.init();
        },
        methods:{
            init(){
                /* 查询用户数据 */
                this.$net.send({
                    server: this.server.query
                }).then((data) => {
                   if(data.total > 0)
                   {
                       /* 查询已当前用户组中的用户数据，并勾选*/
                       this.total = data.total;
                       this.$net.send({
                           server: this.$services.sysService.staffGroupMapRestController.queryStaff,
                           data: {__EQS_staffGroupCode: this.$route.query.groupCodeSetStaff}
                       }).then((staffData) => {
                           data.rows.forEach(item => {
                               staffData.rows.forEach(tmp => {
                                   if (item.staffCode == tmp.staffCode)
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
            pageChange(number, rows){
                // console.log(this.tableData,rows);
            },
            selectRow(selection, row){
                // console.log(selection, row);
                this.selectedRow = selection;
            },
            /*完成设置*/
            btnComp(){
                let obj = {
                    staffCode: this.$route.query.groupCodeSetStaff,
                    jsonStaffList: JSON.stringify(this.selectedRow)
                };
                this.$net.send({
                    server: this.$services.sysService.staffGroupMapRestController.saveStaffMap,
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
            btnBack(){
                this.$router.go(-1);
                this.$store.commit('removeTag', 'staffGroupSetStaff');
                this.$store.commit('closePage', 'staffGroupSetStaff');
            }
        },

    }
</script>

<style scoped>

</style>