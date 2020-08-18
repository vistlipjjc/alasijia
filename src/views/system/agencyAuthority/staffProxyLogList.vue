<style scoped>
    .layout{
        background-color: #fff;
        padding: 10px;
    }
    .ivu-layout-sider{
        background-color: #fff;
    }
</style>
<template>
    <Layout class="layout">
        <Sider width="230">
            <Tree :data="unitTree" @on-select-change="clickNode" style="max-height: 500px; overflow-y: auto;"></Tree>
        </Sider>
            <Content>
                <Card>
                    <j-table ref="staffTable" pagination autoSearch
                             :queryForm="queryForm"
                             :server="server.query"
                             :columns-list="columns" v-model="staffTable"
                             :input-col="6"
                             @on-row-click="rowClick">
                        <template slot="input-col">
                            <Col span="6">
                            <FormItem label="用户账号" prop="__LIKES_staffCode">
                                <Input v-model="queryForm.__LIKES_staffCode" placeholder="用户账号"></Input>
                            </FormItem>
                            </Col>
                            <Col span="6">
                            <FormItem label="用户名称" prop="__LIKES_staffName">
                                <Input v-model="queryForm.__LIKES_staffName" placeholder="用户名称"></Input>
                            </FormItem>
                            </Col>
                        </template>
                        <template slot="toolbar">
                            <Button type="primary" @click="setProxyLog" >借调</Button>
                        </template>
                    </j-table>
                    <j-table ref="staffProxyLogTable" pagination hiddenForm
                             :server="server.staffProxyLog"
                             :default-params="staffParam"
                             :columns-list="columnsR" v-model="staffProxyLogTable"
                             @on-row-click="staffProxyLogRow"
                                >
                        <template slot="toolbar">
                            <Button type="primary" @click="cancelProxy" >取消借调</Button>
                        </template>
                    </j-table>
                </Card>
            </Content>
    </Layout>
</template>

<script>
    export default {
        data() {
            return {
                unitTree: [],
                server: {
                    query: this.$services.sysService.staffRestController.queryByUnitCode,
                    staffProxyLog: this.$services.sysService.staffProxyLogRestController.query
                },
                queryForm: {
                    __LIKES_staffCode: '',
                    __LIKES_staffName: ''
                },

                staffTable: [],
                columns: [
                    { type: 'index', align: 'center', width: 50 },
                    { title: '用户账号', align: 'center', key: 'staffCode' },
                    { title: '用户名称', align: 'center', key: 'staffName' },
                    { title: '关联的角色', align: 'center', key: 'roleName' },
                    { title: '所在用户组', align: 'center', key: 'staffGroupName' },
                    { title: '移动电话', align: 'center', key: 'mobile' },
                    { title: '状态', align: 'center', key: 'status', formatter: 'fixedDict:StaffStatus@system' },
                    { title: '是否被借调', align: 'center', key: 'isProxy',formatter: 'fixedDict:YesNo@system' }
                    ],
                staffProxyLogTable: [],
                columnsR: [
                    { type: 'index', align: 'center', width: 50 },
                    // { title: '借调人编码', align: 'center', key: 'proxyStaffCode' },
                    { title: '借调人名称', align: 'center', key: 'proxyStaffName' },
                    { title: '借调起始时间', align: 'center', key: 'startDateString' },
                    { title: '借调结束时间', align: 'center', key: 'preEndDateString' },
                    { title: '实际结束时间', align: 'center', key: 'endDateString' },
                    { title: '借调部门名称', align: 'center', key: 'deptName' },
                    { title: '状态', align: 'center', key: 'status' },
                ],
                staffParam: {},
                selectedStaffRow: {},
                selectedRow: {}
            }
        },
        mounted() {
            this.init();
        },
        methods:{
            init(){
                this.$net.send({
                    server: this.$services.sysService.staffRestController.load
                }).then(
                    (data) => {
                        this.unitTree = data;
                    });
            },
            rowClick(row, index){
                this.selectedStaffRow = row;
                this.staffParam = {__EQS_staffCode: row.staffCode};
            },
            clickNode(data) {
                this.dept = data[0];
                this.$net.send({
                    server: this.$services.sysService.staffRestController.get,
                    data: this.dept
                }).then(
                    (data) => {
                        this.tableData = data;
                    });

            },
            setProxyLog(){
                this.$router.push({
                    path:'/staffProxyLogEdit',
                    query: {row: this.selectedStaffRow}
                });
            },
            staffProxyLogRow(row, index){
                this.selectedRow = row;
            },
            cancelProxy(){
                this.$net.send({
                    server: this.$services.sysService.staffProxyLogRestController.remove,
                    append: this.selectedRow.proxyStaffCode
                }).then((data) => {
                    if (data.success) {
                        this.$Message.success(data.msg);
                        this.$refs.staffProxyLogTable   .refresh();
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