<template>
    <div>
        <Card>
            <j-table ref="roleTable" pagination autoSearch
                     :queryForm="queryForm"
                     :server="server.query"
                     :columns-list="columns" v-model="tableData"
                     :input-col="6"
                     @on-select="selectRow"
                     @on-select-cancel="selectCancel"
                     @on-select-all="selectAll">
                <template slot="input-col">
                    <Col span="6">
                    <FormItem label="角色编码" prop="__LIKES_roleStdCode">
                        <Input v-model="queryForm.__LIKES_roleCode" placeholder="标准角色编码"></Input>
                    </FormItem>
                    </Col>
                    <Col span="6">
                    <FormItem label="角色名称" prop="__LIKES_roleStdName">
                        <Input v-model="queryForm.__LIKES_roleName" placeholder="标准角色名称"></Input>
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
                    query: this.$services.sysService.roleRestController.query
                },
                queryForm: {
                    __LIKES_roleCode: '',
                    __LIKES_roleName: ''
                },
                selectedRow:[],
                tableData: [],
                columns: [
                    { type: 'selection', align: 'center', width: 60 },
                    { title: '角色编码', align: 'center', key: 'roleCode' },
                    { title: '角色名称', align: 'center', key: 'roleName' },
                    { title: '角色描述', align: 'center', key: 'roleDesc' }
                ]
            }
        },
        methods: {
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
                    jsonRoleList: JSON.stringify(this.selectedRow)
                };
                this.$net.send({
                    server: this.$services.sysService.dutyRestController.saveRoleStaff,
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
