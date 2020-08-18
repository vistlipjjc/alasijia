<template>
    <div>
        <card title="流程模板">
            <j-table
                    ref="tableData" pagination autoSearch hiddenForm
                    :server="server.query"
                    :columns-list="columns"
                    v-model="tableData"
                    @on-row-click="selectRow"
            >
                <template slot="toolbar">

                    <Button type="primary" @click="viewBizHandler">查看业务数据</Button>
                    <Button type="primary" @click="processHandler">处理</Button>
                    <Button type="primary" @click="beforeHandler">前加签</Button>
                    <Button type="primary" @click="afterHandler">后加签</Button>
                    <Button type="primary" @click="transferHandler">转办</Button>
                </template>
            </j-table>

        </card>
        <card>
            <Tabs value="name1">
                <TabPane label="审批记录" name="name1">
                    <div style="overflow:auto;" id="logContent">
                    </div>
                </TabPane>
                <TabPane label="流程模板" name="name2">
                    <div style="overflow:auto;">
                        <img id="img" alt="流程图片"/>
                    </div>
                </TabPane>
            </Tabs>
        </card>
        <Modal
                v-model="beforeModel"
                title="前加签"
                @on-ok="btnSave('before')"
                @on-cancel="cancel">
            <Row style="align-content: center">
                <Form ref="before" :model="beforeForm" :label-width="180"
                      style="margin-left: -68px;margin-right: 60px;">

                    <FormItem label="新增处理人" prop="roleGroupCode">
                        <jStaff :value="beforeForm.assigneeText" :staffTransfer="staffTransfer"
                                @on-select="selectStaffList($event,'before')" id="staff">
                        </jStaff>
                    </FormItem>

                    <FormItem label="加签原因" prop="roleGroupCode">
                        <Input type="textarea" v-model="beforeForm.memo" placeholder="模块编码"></Input>
                    </FormItem>
                </Form>
            </Row>
        </Modal>

        <Modal
                v-model="afterModel"
                title="后加签"
                @on-ok="btnSave('after')"
                @on-cancel="cancel">
            <Row style="align-content: center">
                <Form ref="after" :model="afterForm" :label-width="180"
                      style="margin-left: -68px;margin-right: 60px;">

                    <FormItem label="新增处理人" prop="roleGroupCode">
                        <jStaff :value="afterForm.assigneeText" :staffTransfer="staffTransfer"
                                @on-select="selectStaffList($event,'after')" id="staff">
                        </jStaff>
                    </FormItem>

                    <FormItem label="加签原因" prop="roleGroupCode">
                        <Input type="textarea" v-model="afterForm.memo" placeholder="模块编码"></Input>
                    </FormItem>
                </Form>
            </Row>
        </Modal>


        <Modal
                v-model="transferModel"
                title="转办流程"
                @on-ok="btnSave('transfer')"
                @on-cancel="cancel">
            <Row style="align-content: center">
                <Form ref="transfer" :model="transferForm" :label-width="180"
                      style="margin-left: -68px;margin-right: 60px;">

                    <FormItem label="处理人" prop="roleGroupCode">
                        <jStaff :value="transferForm.assigneeText" :staffTransfer="staffTransfer"
                                @on-select="selectStaffList($event,'transfer')" id="staff">
                        </jStaff>
                    </FormItem>

                    <FormItem label="转办原因" prop="roleGroupCode">
                        <Input type="textarea" v-model="transferForm.memo" placeholder="模块编码"></Input>
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
                server: {
                    query: this.$services.wfService.approveRestController.query
                },
                rowData: {},
                tableData: [],
                columns: [
                    {type: 'index', align: 'center', width: 50},
                    {title: '业务流程编码', align: 'center', key: 'procCode'},
                    {title: '业务流程名称', align: 'center', key: 'procName'},
                    {title: '模块名称', align: 'center', key: 'moduleName'},
                    {title: '任务名称', align: 'center', key: 'taskName'},
                    {title: '发起人', align: 'center', key: 'starterName'},
                    {title: '开始时间', align: 'center', key: 'startTimeString'},
                    {title: '状态', align: 'center', key: 'status', formatter: "fixedDict:ProcInstStatus@wf"}
                ],
                staffTransfer: false,
                beforeModel: false,
                beforeForm: {
                    assigneeText: "",
                    assignee: "",
                    memo: ""
                },
                afterModel: false,
                afterForm: {
                    assigneeText: "",
                    assignee: "",
                    memo: ""
                },
                transferModel: false,
                transferForm: {
                    assigneeText: "",
                    assignee: "",
                    memo: ""
                }
            }
        },
        methods: {
            selectRow(data, index) {
                if(data['id']){
                    this.rowData = data;
                    this.$net.send({
                        server: this.$services.wfService.processRestController.getProcInstDiagram,
                        append: data['id']
                    }).then((data) => {
                        /*加载流程图片  */
                        document.getElementById("img").src = "data:image/png;base64," + data.data;
                    });

                    if (data['id']) {
                        this.$net.send({
                            server: this.$services.wfService.procLogRestController.hisLog,
                            append: data['id']
                        }).then((data) => {
                            $('#logContent').html(data.logContent);
                        });
                    }
                }

            },
            //查看业务数据
            viewBizHandler() {
                if (this.rowData.id) {
                    this.$net.send({
                        server: this.$services.wfService.processRestController.getProcInstData,
                        data: {
                            procInstId: this.rowData.id,
                        }
                    }).then((data) => {
                        let bizData = JSON.parse(data.data.formData);
                        this.$router.push({
                            path: '/processView',
                            query: {procCode: this.rowData.procCode, bizData: bizData, opt: "VIEW",nodeKey:data.nodeKey}
                        });
                    });
                }else{
                    this.$Message.error("请先选择需要查看的业务数据");
                }
            },

            //处理
            processHandler() {
                if (this.rowData.id) {
                    this.$net.send({
                        server: this.$services.wfService.processRestController.getProcInstData,
                        data: {
                            procInstId: this.rowData.id,
                        }
                    }).then((data) => {
                        let bizData = JSON.parse(data.data.formData);
                        this.$router.push({
                            path: '/taskProcess',
                            query: {procCode: this.rowData.procCode, procId: this.rowData.procId, bizData: bizData, opt: "EDIT",taskId:this.rowData.taskId,procInstId: this.rowData.id,nodeKey:data.nodeKey}
                        });
                    });
                }else{
                    this.$Message.error("请先选择需要处理的数据");
                }
            },

            //前加签
            beforeHandler() {
                if (this.rowData.id) {
                    this.beforeModel = true;
                } else {
                    this.$Message.error("请先选择需要前加签的数据");
                }
            },
            //后加签
            afterHandler() {
                if (this.rowData.id) {
                    this.afterModel = true;
                } else {
                    this.$Message.error("请先选择需要前加签的数据");
                }
            },
            transferHandler() {
                if (this.rowData.id) {
                    this.transferModel = true;
                } else {
                    this.$Message.error("请先选择需要转办的数据");
                }
            },
            selectStaffList(value, name) {
                if (name == "before") {
                    this.beforeForm.assigneeText = value.staffName;
                    this.beforeForm.assignee = value.staffCode;
                } else if (name == "after") {
                    this.afterForm.assigneeText = value.staffName;
                    this.afterForm.assignee = value.staffCode;
                } else {
                    this.transferForm.assigneeText = value.staffName;
                    this.transferForm.assignee = value.staffCode;
                }
            },
            btnSave(name) {
                if (name == "before") {
                    this.beforeForm.taskId = this.rowData.taskId;
                    this.beforeForm.procInstId = this.rowData.id;
                    this.$net.send({
                        server: this.$services.wfService.approveRestController.insertTasksBefore,
                        data: this.beforeForm
                    }).then((data) => {
                        if (data.success) {
                            this.$Message.success(data.msg);
                            this.$refs.tableData.refresh();
                        } else {
                            this.$Message.error(data.msg);
                        }
                    });
                } else if (name == "after") {
                    this.afterForm.taskId = this.rowData.taskId;
                    this.afterForm.procInstId = this.rowData.id;
                    this.$net.send({
                        server: this.$services.wfService.approveRestController.insertTasksAfter,
                        data: this.afterForm
                    }).then((data) => {
                        if (data.success) {
                            this.$Message.success(data.msg);
                            this.$refs.tableData.refresh();
                        } else {
                            this.$Message.error(data.msg);
                        }
                    });
                } else {
                    this.transferForm.taskId = this.rowData.taskId;
                    this.transferForm.procInstId = this.rowData.id;
                    this.$net.send({
                        server: this.$services.wfService.approveRestController.transfer,
                        data: this.transferForm
                    }).then((data) => {
                        if (data.success) {
                            this.$Message.success(data.msg);
                            this.$refs.tableData.refresh();
                        } else {
                            this.$Message.error(data.msg);
                        }
                    });
                }
            },
            cancel() {

            }
        }
    }
</script>
