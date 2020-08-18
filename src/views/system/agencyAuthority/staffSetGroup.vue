<template>
    <div>
        <Card>
            <j-table ref="staffGroupTable" pagination autoSearch
                   :queryForm="queryForm"
                   :server="server.query"
                   :columns-list="columns" v-model="staffGroupTable"
                    :input-col="6"
                   @on-row-click="rowClick"
                   @on-select="selectRow"
                    @on-select-all="selectAll"
                    @on-select-cancel="selectCancel">
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
                <Button type="primary" @click="btnComp('editForm')">完成设置</Button>
                <Button type="ghost" @click="btnBack">返回</Button>
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
                    query: this.$services.sysService.staffGroupRestController.query,
                },
                queryForm: {
                    __LIKES_staffGroupCode: '',
                    __LIKES_staffGroupName: ''
                },
                staffGroupTable: [],
                columns: [
                    { type: 'selection', align: 'center', width: 60 },
                    { title: '用户组编码', align: 'center', key: 'staffGroupCode' },
                    { title: '用户组名称', align: 'center', key: 'staffGroupName' },
                    { title: '用户组描述', align: 'center', key: 'staffGroupDesc' }],

                groupCodeSetStaff: '',
                groupSetRole: '',
                groupSetRoleGroup: '',
                selectedRow: []
            }
        },
        mounted() {
            this.init();
        },
        methods:{
            init() {
                /* 查询用户组数据 */
                this.$net.send({
                    server: this.server.query
                }).then((data) => {
                    if (data.total > 0) {
                        this.total = data.total;
                        this.$net.send({
                            server: this.$services.sysService.staffGroupMapRestController.selectStaffGroupByStaffCode,
                            append: this.$route.query.staffCode
                        }).then((groupData) => {
                            data.rows.forEach(item => {
                                groupData.forEach(tmp => {
                                    if (item.staffGroupCode == tmp.staffGroupCode) {
                                        item._checked = true;
                                    }
                                });
                            });
                            this.staffGroupTable = data.rows;
                        });
                    }
                });
            },
            selectRow(selection, row){
                this.selectedRow = selection;
            },
            selectAll(selection){
                this.selectedRow = selection;
            },
            selectCancel(selection, row){
                this.selectedRow = selection;
            },
            rowClick(row, index){
                this.staffParam = {__EQS_staffGroupCode: row.staffGroupCode};
                this.groupCodeSetStaff = row.staffGroupCode;
                this.groupSetRole = row.staffGroupCode;
                this.groupSetRoleGroup = row.staffGroupCode;

            },
            btnComp(){
                let obj = {
                    staffCode: this.$route.query.staffCode,
                    jsonStaffList: JSON.stringify(this.selectedRow)
                };
                this.$net.send({
                    server: this.$services.sysService.staffGroupMapRestController.saveStaffGroup,
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
                this.$store.commit('removeTag', 'staffSetGroup');
                this.$store.commit('closePage', 'staffSetGroup');
            }
        }

    }
</script>

<style scoped>

</style>