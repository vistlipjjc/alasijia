<template>
    <div>
        <Card>
            <j-table ref="roleGroupTable" pagination autoSearch
                     :queryForm="queryForm"
                     :server="server.query"
                     :columns-list="columns" v-model="tableData"
                     :input-col="6"
                     @on-select="selectRow"
                     @on-select-cancel="selectCancel"
                     @on-select-all="selectAll">
                <template slot="input-col">
                    <Col span="6">
                    <FormItem label="角色组编码" prop="__LIKES_roleGroupCode">
                        <Input v-model="queryForm.__LIKES_roleGroupCode" placeholder="标准角色组编码"></Input>
                    </FormItem>
                    </Col>
                    <Col span="6">
                    <FormItem label="角色组名称" prop="__LIKES_roleStdName">
                        <Input v-model="queryForm.__LIKES_roleGroupName" placeholder="标准角色组名称"></Input>
                    </FormItem>
                    </Col>
                </template>
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
        data() {
            return {
                server: {
                    query: this.$services.sysService.roleGroupRestController.query
                },
                queryForm: {
                    __LIKES_roleGroupCode: '',
                    __LIKES_roleGroupName: ''
                },
                tableData: [],
                columns: [
                    { type: 'selection', align: 'center', width: 60 },
                    { title: '角色组编码', align: 'center', key: 'roleGroupCode' },
                    { title: '角色组名称', align: 'center', key: 'roleGroupName' },
                    { title: '角色组描述', align: 'center', key: 'roleGroupDesc' }
                ]
            }
        },
        mounted() {
            this.init()
        },
        methods: {
            init() {
                /* 查询角色组数据 */
                this.$net.send({
                    server: this.server.query
                }).then((data) => {
                    if (data.total > 0) {
                        this.total = data.total;
                        this.$net.send({
                            server: this.$services.sysService.roleGroupRestController.selectRoleGroupByStaffCode,
                            append: this.$route.query.staffCode
                        }).then((roleData) => {
                            data.rows.forEach(item => {
                                roleData.forEach(tmp => {
                                    if (item.roleGroupCode == tmp.roleGroupCode) {
                                        item._checked = true;
                                    }
                                });
                            });
                            this.tableData = data.rows;
                        });
                    }
                });
            },
            selectRow(selection, row){
                this.selectedRow = selection;
            },
            selectCancel(selection, row){
                this.selectedRow = selection;
            },
            selectAll(selection){
                this.selectedRow = selection;
            },
            btnComp(){
                let obj = {
                    staffCode: this.$route.query.staffCode,
                    unitCode: this.$route.query.unitCode,
                    jsonRoleGroupList: JSON.stringify(this.selectedRow)
                };
                this.$net.send({
                    server: this.$services.sysService.dutyRestController.saveRoleGroupStaff,
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
                this.$store.commit('removeTag', 'staffSetRole');
                this.$store.commit('closePage', 'staffSetRole');
            }
        }
    }
</script>
