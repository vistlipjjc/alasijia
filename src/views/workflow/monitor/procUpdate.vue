<template>
    <div>
        <card>
            <j-table
                    ref="tableData" pagination autoSearch
                    :queryForm="queryForm"
                    :server="server.query"
                    :columns-list="columns"
                    v-model="tableData"
                    :input-col="8" :label-width="90"
                    @on-row-click="selectRow"
            >
                <template slot="input-col">
                    <Col span="15">
                        <FormItem label="业务流程名称" prop="__LIKES_procName">
                            <Input v-model="queryForm.__LIKES_procName" placeholder="业务流程名称"></Input>
                        </FormItem>
                        <FormItem label="模块名称" prop="__LIKES_moduleName">
                            <Input v-model="queryForm.__LIKES_moduleName" placeholder="模块名称"></Input>
                        </FormItem>
                        <FormItem label="状态" prop="__INS_status" v-show="false">
                            <Input v-model="queryForm.__INS_status" placeholder="状态"></Input>
                        </FormItem>
                    </Col>
                </template>
                <template slot="toolbar">
                    <Button type="primary"  :disabled="enable" @click="viewBizHandler">查看业务数据</Button>
                    <Button type="primary" :disabled="disabledSuspend" @click="suspendHandler">挂起</Button>
                    <Button type="primary" :disabled="disabledActivate" @click="activateHandler">激活</Button>
                    <Button type="primary"  @click="terminateHandler">终止</Button>
                    <Button type="primary" :disabled="disabledBefore" @click="beforeHandler">前加签</Button>
                    <Button type="primary" :disabled="disabledAfter" @click="afterHandler">后加签</Button>
                    <Button type="primary" :disabled="disabledTransfer" @click="transferHandler">指定操作人</Button>
                    <Button type="primary" :disabled="disabledMove" @click="moveToHandler">跳到指定点</Button>
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
                v-model="model"
                :title="title"
                @on-ok="btnSave('form')"
                @on-cancel="cancel">
            <Row style="align-content: center">
                <Form ref="form" :model="form" :label-width="180" :rules="editRules"
                      style="margin-left: -68px;margin-right: 60px;">

                    <FormItem label="新增处理人" prop="assigneeText">
                        <jStaff  v-model="form.assigneeText" :staffTransfer="staffTransfer"
                                @on-select="selectStaffList($event,'before')" id="staff">
                        </jStaff>
                    </FormItem>
                    <FormItem label="任务" prop="taskId">
                        <j-select  v-model="form.taskId" :optionList="taskList"
                                  @on-change="selectChange($event,'taskId')"
                        >
                        </j-select>
                    </FormItem>
                    <FormItem label="加签原因" prop="memo">
                        <Input type="textarea" v-model="form.memo" placeholder="加签原因"></Input>
                    </FormItem>
                </Form>
            </Row>
        </Modal>
        <Modal
                v-model="stopModel"
                title="终止流程"
                @on-ok="stop('stopForm')"
                @on-cancel="cancel">
            <Row style="align-content: center">
                <Form ref="stopForm" :model="stopForm" :label-width="180" :rules="editRules"
                      style="margin-left: -68px;margin-right: 60px;">
                    <FormItem label="终止原因" prop="memo">
                        <Input type="textarea" v-model="stopForm.memo" placeholder="终止原因"></Input>
                    </FormItem>
                </Form>
            </Row>
        </Modal>

        <Modal
                v-model="gotoModel"
                title="跳转流程"
                @on-ok="goto('gotoForm')"
                @on-cancel="cancel">
            <Row style="align-content: center">
                <Form ref="gotoForm" :model="gotoForm" :label-width="180" :rules="editRules"
                      style="margin-left: -68px;margin-right: 60px;">
                    <FormItem label="任务" prop="taskId">
                        <j-select v-model="gotoForm.taskId" :optionList="taskList"
                                  @on-change="selectChange($event,'taskId')"
                        >
                        </j-select>
                    </FormItem>
                    <FormItem label="跳转到的节点" prop="nodeKey">
                        <j-select v-model="gotoForm.nodeKey" :optionList="nodeList"
                                  @on-change="selectChange($event,'nodeKey')"
                        >
                        </j-select>
                    </FormItem>
                    <FormItem label="跳转原因" prop="memo">
                        <Input type="textarea" v-model="gotoForm.memo" placeholder="跳转原因"></Input>
                    </FormItem>
                </Form>
            </Row>
        </Modal>
    </div>
</template>
<script>
    import Card from "iview/src/components/card/card";

    export default {
        components: {Card},
        data() {
            return {
                server: {
                    query: this.$services.wfService.processRestController.queryHistory,
                },
                queryForm: {
                    __LIKES_procName: '',
                    __LIKES_moduleName: '',
                    __INS_status: "30,20,50"
                },
                tableData: [],
                rowData: {},
                disabledActivate: false,
                disabledSuspend: false,
                disabledMove: false,
                disabledTransfer: false,
                disabledBefore: false,
                disabledAfter: false,
                columns: [
                    {type: 'index', align: 'center', width: 40},
                    {title: '业务流程编码', align: 'center', key: 'procCode'},
                    {title: '业务流程名称', align: 'center', key: 'procName'},
                    {title: '模块名称', align: 'center', key: 'moduleName'},
                    {title: '模板名称', align: 'center', key: 'templateName'},
                    {title: '表单名称', align: 'center', key: 'formName'},
                    {title: '发起人', align: 'center', key: 'starterName'},
                    {title: '开始时间', align: 'center', key: 'startTimeString'},
                    {title: '状态', align: 'center', key: 'status', formatter: "fixedDict:ProcInstStatus@wf"}
                ],
                enable: false,
                staffTransfer: false,
                title: "",
                name: "",
                model: false,
                form: {
                    assigneeText: "",
                    assignee: "",
                    memo: "",
                    taskId: ""
                },
                stopModel: false,
                stopForm: {
                    memo: ""
                },
                gotoModel: false,
                gotoForm: {
                    memo: "",
                    nodeKey: "",
                    taskId: ""
                },
                taskList: [],
                nodeList: [],
                action: "",
                insertTasksBefore: this.$services.wfService.approveRestController.insertTasksBefore,
                insertTasksAfter: this.$services.wfService.approveRestController.insertTasksAfter,
                transfer: this.$services.wfService.approveRestController.transfer,
                editRules: {
                    assigneeText: [
                        {required: true, message: '必填项', trigger: 'blur'},
                    ],
                    memo: [
                        {required: true, message: '必填项', trigger: 'blur'}
                    ]
                }
            }
        },
        methods: {

            selectRow(data, index) {
                this.rowData = data;
                if (this.rowData.status != "50") {
                    this.disabledMove = false;
                    this.disabledTransfer = false;
                    this.disabledAfter = false;
                    this.disabledBefore = false;
                    this.disabledSuspend = false;
                    this.disabledActivate = true;
                } else {
                    this.disabledMove = true;
                    this.disabledTransfer = true;
                    this.disabledAfter = true;
                    this.disabledBefore = true;
                    this.disabledSuspend = true;
                    this.disabledActivate = false;
                }
                if (this.rowData.status != "40") {
                    this.enable = false;
                } else {
                    this.enable = true;
                }
                if(data['id']){
                    this.$net.send({
                        server: this.$services.wfService.processRestController.getProcInstDiagram,
                        append: data['id']
                    }).then((data) => {
                        /*加载流程图片  */
                        document.getElementById("img").src = "data:image/png;base64," + data.data;
                    });
                }

                if (data['id']) {
                    this.$net.send({
                        server: this.$services.wfService.procLogRestController.hisLog,
                        append: data['id']
                    }).then((data) => {
                        $('#logContent').html(data.logContent);
                    });
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
                            query: {
                                procCode: this.rowData.procCode,
                                bizData: bizData,
                                opt: "VIEW",
                                nodeKey: data.nodeKey
                            }
                        });
                    });
                } else {
                    this.$Message.info("请先选择需要查看的业务数据");
                }
            },
            //挂起
            suspendHandler() {
                if (this.rowData.id) {
                    this.$net.send({
                        server: this.$services.wfService.approveRestController.suspend,
                        append: this.rowData.id
                    }).then((data) => {
                        if (data.success) {
                            this.$Message.success(data.msg);
                            this.$refs.tableData.refresh();
                        } else {
                            this.$Message.error(data.msg);
                        }
                    });
                }
                else {
                    this.$Message.info('请先选择需要挂起的流程。');
                }
            },
            //激活
            activateHandler() {
                if (this.rowData.id) {
                    this.$net.send({
                        server: this.$services.wfService.approveRestController.activate,
                        append: this.rowData.id
                    }).then((data) => {
                        if (data.success) {
                            this.$Message.success(data.msg);
                            this.$refs.tableData.refresh();
                        } else {
                            this.$Message.error(data.msg);
                        }
                    });
                }
                else {
                    this.$Message.info('请先选择需要激活的流程。');
                }
            },
            //终止流程
            terminateHandler() {
                if (this.rowData.id) {
                    this.stopModel = true;
                }
                else {
                    this.$Message.info('请先选择需要终止的流程。');
                }
            },

            moveToHandler() {
                if (this.rowData.id) {
                    this.gotoModel = true;
                    this.$net.send({
                        server: this.$services.wfService.approveRestController.queryNodeList,
                        append: this.rowData.id
                    }).then((data) => {
                        this.nodeList = data;
                    });
                }
                else {
                    this.$Message.info('请先选择需要调整节点的流程。');
                }
            },

            //前加签
            beforeHandler() {
                if (this.rowData.id) {
                    this.model = true;
                    this.title = "前加签";
                    this.action = this.insertTasksBefore;
                    this.$net.send({
                        server: this.$services.wfService.approveRestController.queryTaskList,
                        append: this.rowData.id
                    }).then((data) => {
                        this.taskList = data;
                    });
                } else {
                    this.$Message.info("请先选择需要前加签的数据");
                }
            },
            //后加签
            afterHandler() {
                if (this.rowData.id) {
                    this.model = true;
                    this.title = "后加签";
                    this.action = this.insertTasksAfter;
                    this.$net.send({
                        server: this.$services.wfService.approveRestController.queryTaskList,
                        append: this.rowData.id
                    }).then((data) => {
                        this.taskList = data;
                    });
                } else {
                    this.$Message.info("请先选择需要后加签的数据");
                }
            },

            transferHandler() {
                if (this.rowData.id) {
                    this.model = true;
                    this.title = "转办";
                    this.action = this.transfer;
                    this.$net.send({
                        server: this.$services.wfService.approveRestController.queryTaskList,
                        append: this.rowData.id
                    }).then((data) => {
                        this.taskList = data;
                    });
                } else {
                    this.$Message.info("请先选择需要转办的数据");
                }
            },
            selectStaffList(value, name) {
                this.form.assigneeText = value.staffName;
                this.form.assignee = value.staffCode;
            },

            selectChange(value, name) {
                this.form[name] = value;
                this.gotoForm[name] = value;
            },
            btnSave(name) {
                this.$refs[name].validate((valid) => { // 数据校验
                    if (!valid) {
                        return
                    }
                    this.form.procInstId = this.rowData.id;
                    this.$net.send({
                        server: this.action,
                        data: this.form
                    }).then((data) => {
                        if (data.success) {
                            this.$Message.success(data.msg);
                            this.$refs.tableData.refresh();
                            this.form={};
                        } else {
                            this.$Message.error(data.msg);
                        }
                    });
                });

            },
            stop(name) {
                this.$refs[name].validate((valid) => { // 数据校验
                    if (!valid) {
                        return
                    }
                    this.stopForm.procInstId = this.rowData.id;
                    this.$net.send({
                        server: this.$services.wfService.approveRestController.terminate,
                        data: this.stopForm
                    }).then((data) => {
                        if (data.success) {
                            this.$Message.success(data.msg);
                            this.$refs.tableData.refresh();
                            this.stopForm={};
                        } else {
                            this.$Message.error(data.msg);
                        }
                    });
                });
            },
            goto(name) {
                this.$refs[name].validate((valid) => { // 数据校验
                    if (!valid) {
                        return
                    }
                    this.gotoForm.procInstId = this.rowData.id;
                    this.$net.send({
                        server: this.$services.wfService.approveRestController.moveTo,
                        data: this.gotoForm
                    }).then((data) => {
                        if (data.success) {
                            this.$Message.success(data.msg);
                            this.$refs.tableData.refresh();
                            this.gotoForm={};
                        } else {
                            this.$Message.error(data.msg);
                        }
                    });
                });

            },
            cancel() {

            }
        }
    }
</script>
