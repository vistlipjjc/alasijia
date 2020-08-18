<template>
    <div title="布局授权">

        <Card title="角色授权">
            <j-table ref="roleTable" pagination autoSearch
                     :server="server.queryRole"
                     :queryForm="roleFrom"
                     :columns-list="columnsR" v-model="roleTable"
                     :input-col="6"
                     @on-row-click="selectRoleRow">
                <template slot="input-col">
                    <Col span="6">
                    <FormItem label="岗位编码" prop="roleCode">
                        <Input v-model="roleFrom.roleCode" placeholder="岗位编码"></Input>
                    </FormItem>
                    </Col>
                    <Col span="6">
                    <FormItem label="岗位名称" prop="roleName">
                        <Input v-model="roleFrom.roleName" placeholder="岗位名称"></Input>
                    </FormItem>
                    </Col>
                </template>
                <template slot="toolbar">
                      <Button type="primary" @click="setData('roleForm')">设置</Button>
                </template>
            </j-table>
        </Card>

        <Card title="角色组授权">
            <j-table ref="dashLayoutMapTable" pagination autoSearch
                     :queryForm="queryForm"
                     :server="server.query"
                     :columns-list="columns" v-model="dashLayoutMapTable"
                     @on-row-click="selectRow">
                <template slot="input">
                    <FormItem label="角色组编码" prop="roleGroupCode">
                        <Input v-model="queryForm.roleGroupCode" placeholder="角色组编码"></Input>
                    </FormItem>
                    <FormItem label="角色组名称" prop="roleGroupName">
                        <Input v-model="queryForm.roleGroupName" placeholder="角色组名称"></Input>
                    </FormItem>
                </template>
                <template slot="toolbar">
                    <Button type="primary" @click="setData('roleGroupForm')" >设置</Button>
                </template>
            </j-table>



        </Card>
        <Modal
                v-model="roleGroupModel"
                title="编辑角色组仪表盘布局映射"
                @on-ok="btnSave('roleGroupForm')"
                @on-cancel="cancel">
            <Row style="align-content: center">
                <Form ref="roleGroupForm" :model="roleGroupForm" :label-width="180" style="margin-left: -68px;margin-right: 60px;">


                    <FormItem label="角色组编码" prop="roleGroupCode">
                        <Input v-model="roleGroupForm.roleGroupCode" disabled></Input>
                    </FormItem>

                    <FormItem label="角色组名称" prop="roleGroupName">
                        <Input v-model="roleGroupForm.roleGroupName" disabled></Input>
                    </FormItem>
                    <FormItem label="布局" prop="layoutName">
                        <j-select v-model="roleGroupForm.layoutCode" url="custom:dashLayout/getAll@system"
                                  @on-change="selectChange($event, 'layoutCode')">
                        </j-select>
                    </FormItem>
                </Form>
            </Row>
        </Modal>

        <Modal
                v-model="roleModel"
                title="编辑岗位仪表盘布局映射"
                @on-ok="btnSave('roleForm')"
                @on-cancel="cancel">
            <Row>
                <Form ref="roleForm" :model="roleForm" :label-width="180" style="margin-left: -68px;margin-right: 60px;">

                    <FormItem label="岗位编码" prop="roleCode">
                        <Input v-model="roleForm.roleCode" disabled></Input>
                    </FormItem>

                    <FormItem label="岗位名称" prop="roleName">
                        <Input v-model="roleForm.roleName" disabled></Input>
                    </FormItem>

                    <FormItem label="岗位类型" prop="roleStdName">
                        <Input v-model="roleForm.roleStdName" disabled></Input>
                    </FormItem>
                    <FormItem label="布局" prop="layoutName">
                        <j-select v-model="roleForm.layoutCode" url="custom:dashLayout/getAll@system"
                                  @on-change="selectChange($event, 'layoutCode')">
                        </j-select>
                    </FormItem>
                </Form>
            </Row>
        </Modal>
    </div>


</template>

<script>
    export default {
        data() {
            return {
                roleGroupModel:false,
                roleModel:false,
                roleGroupData:'',
                roleData:'',
                server: {
                    query: this.$services.sysService.dashLayoutMapRestController.searchDashLayoutRoleGroupMap,
                    queryRole: this.$services.sysService.dashLayoutMapRestController.searchDashLayoutRoleMap
                },
                queryForm: {
                    roleGroupCode: '',
                    roleGroupName: '',
                },
                roleFrom: {
                    roleCode: '',
                    roleName: ''
                },
                roleGroupForm: {
                    roleGroupCode:'',
                    roleGroupName:'',
                    roleGroupDesc:'',
                    layoutCode:'',
                    layoutName:'',
                },
                roleForm: {
                    roleCode:'',
                    roleName:'',
                    roleDesc:'',
                    roleStdName:'',
                    layoutCode:'',
                    layoutName:'',
                },
                dashLayoutMapTable: [],
                columns: [
                    {type: 'index', align: 'center', width: 50},
                    {title: '角色组编码', align: 'center', key: 'roleGroupCode'},
                    {title: '角色组名称', align: 'center', key: 'roleGroupName'},
                    {title: '角色组描述', align: 'center', key: 'roleGroupDesc'},
                    {title: '布局编码', align: 'center', key: 'layoutCode'},
                    {title: '布局名称', align: 'center', key: 'layoutName'},
                    {
                        title: '操作', align: 'center', key: 'action', width: 120, handler: [
                            {action: 'view', path: '/dashRoleGroupView'}
                        ]
                    }],
                roleTable: [],
                columnsR: [
                    {type: 'index', align: 'center', width: 50},
                    {title: '岗位编码', align: 'center', key: 'roleCode'},
                    {title: '岗位名称', align: 'center', key: 'roleName'},
                    {title: '岗位描述', align: 'center', key: 'roleDesc'},
                    {title: '岗位类型', align: 'center', key: 'roleStdName'},
                    {title: '布局编码', align: 'center', key: 'layoutCode'},
                    {title: '布局名称', align: 'center', key: 'layoutName'},
                    {
                        title: '操作', align: 'center', key: 'action', width: 120, handler: [
                            {action: 'view', path: '/dashRoleView'}
                        ]
                    }
                ],
                roleParam: {},
                groupCode: ''
            }
        },
        methods: {
            rowClick(row, index) {
                this.roleParam = {__EQS_dashLayoutMapCode: row.dashLayoutMapCode};
                this.groupCode = row.dashLayoutMapCode;
            },
            selectRow(data, index) {
                this.roleGroupData = data;
            },

            selectRoleRow(data, index) {
                this.roleaDta = data;
            },
            setData(val) {
                if (val == 'roleGroupForm') {
                    this.roleGroupForm = this.roleGroupData;
                    this.roleModel = false;
                    this.roleGroupModel = true;
                }else{
                    this.roleForm = this.roleaDta;
                    this.roleGroupModel = false;
                    this.roleModel = true;
                }

            },
            /*保存*/
            btnSave(name) {
                this.$refs[name].validate((valid) => { // 数据校验
                    if (!valid) {
                        return
                    }
                    if(name=='roleGroupForm'){
                        this.$net.send({
                            server: this.$services.sysService.dashLayoutMapRestController.roleGroupSave,
                            data: this.roleGroupForm
                        }).then((data) => {
                            if (data.success) {
                                this.$Message.success(data.msg);
                                this.$refs.dashLayoutMapTable.refresh();
                            } else {
                                this.$Message.error(data.msg);
                            }
                        });
                    }else{
                        this.$net.send({
                            server: this.$services.sysService.dashLayoutMapRestController.roleLayoutMapSave,
                            data: this.roleForm
                        }).then((data) => {
                            if (data.success) {
                                this.$Message.success(data.msg);
                                this.$refs.roleTable.refresh();
                            } else {
                                this.$Message.error(data.msg);
                            }
                        });
                    }


                });
            },
            selectChange(val, name) {
                this.roleGroupForm[name] = val;
                this.roleForm[name] = val;
            },
            cancel(){}
        }

    }
</script>

<style scoped>

</style>