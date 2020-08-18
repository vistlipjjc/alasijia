<template>
    <div class="bizDeptReportCtnr">
        <Card>
            <Row>
                <Col span="16" offset="4" @click.native="businessModal">
                <Modal
                        v-model="businessModal"
                        title="选择上报部门"
                        @on-ok="ok"
                        @on-cancel="cancel">
                    <Sider style="background-color: #fff">
                        <Tree :data="dataTrees" @on-select-change="clickNode"></Tree>
                    </Sider>
                </Modal>
                <Modal
                        v-model="businessModal1"
                        title="选择管理部门"
                        @on-ok="ok1"
                        @on-cancel="cancel">
                    <Sider style="background-color: #fff">
                        <Tree :data="dataTrees1" @on-select-change="clickNode1"></Tree>
                    </Sider>
                </Modal>
                <Form ref="editForm" :model="editForm" :rules="editRules" :label-width="180">
                    <FormItem label="上报部门" prop="deptName" required>
                        <Col span="16" @click.native="businessModal = true" style="display: inline-block">
                        <Input v-model="editForm.deptName">
                        <Button slot="append" icon="ios-search"></Button>
                        </Input>
                        </Col>
                    </FormItem>
                    <FormItem label="业务种类" prop="bizCode" required>
                        <Col span="16" style="display: inline-block">
                        <Select v-model="editForm.bizCode"
                                transfer placeholder="请选择······"
                                clearable
                                labelInValue
                                @on-change="selectBiz">
                            <Option v-for="item in list" :value="item.value" :key="item.name">{{ item.name }}</Option>
                        </Select>
                        </Col>
                    </FormItem>
                    <FormItem label="管理部门" prop="managerDeptName" required>
                        <Col span="16" @click.native="businessModal1 = true" style="display: inline-block">
                        <Input v-model="editForm.managerDeptName">
                        <Button slot="append" icon="ios-search"></Button>
                        </Input>
                        </Col>
                    </FormItem>
                    <FormItem label="备注" prop="remark">
                        <Col span="16" style="display: inline-block">
                        <Input v-model="editForm.remark" type="textarea"></Input>
                        </Col>
                    </FormItem>
                    <div align="center">
                        <Button @click="btnSave('editForm')" type="primary" style="margin:0 11px;">保存</Button>
                        <Button type="ghost" @click="btnBack">返回</Button>
                    </div>
                </Form>
                </Col>
            </Row>
        </Card>
    </div>
</template>

<script>
    export default {
        data () {
            return {
                businessModal: false,
                businessModal1: false,
                dataTrees: [],
                dataTrees1: [],
                opt: false,
                list: [],
                editForm: {
                    deptCode:'',
                    deptName: '',
                    tempDeptCode: '',
                    tempDeptName: '',
                    bizCode: '',
                    bizName: '',
                    managerDeptCode: '',
                    managerDeptName: '',
                    tempManagerDeptCode: '',
                    tempManagerDeptName: '',
                    remark: ''
                },
                editRules: {
                    deptName: [
                        {required: true, message: '必填项', trigger: 'blur'}
                    ],
                    bizName: [
                        {required: true, message: '必填项', trigger: 'blur'}
                    ],
                    managerDeptName: [
                        {required: true, message: '必填项', trigger: 'blur'}
                    ]
                }
            };
        },
        mounted () {
            this.init();
        },
        methods: {
            init () {
                if (this.$route.params.opt == 'edit') {
                    this.opt = true;
                    this.editForm = this.$route.query.row;
                    this.$net.send({
                        server: this.$services.sysService.bizDeptReportRestController.queryBizType,
                        data: {deptCode: this.editForm.deptCode}
                    }).then((data) => {
                        this.list = data;
                    });
                }

                this.$net.send({
                    server: this.$services.sysService.unitRestController.load
                }).then(
                    (data) => {
                        this.dataTrees = data;
                        this.dataTrees1 = data;
                    });

                this.$net.send({
                    server: this.$services.sysService.unitRestController.load
                }).then(
                    (data) => {
                        this.dataTrees = data;
                        this.dataTrees1 = data;
                    });
            },
            /*保存*/
            btnSave (name) {
                this.$refs[name].validate((valid) => { // 数据校验
                    if (!valid) {
                        return;
                    }
                    if (this.editForm.deptCode == this.editForm.managerDeptCode){
                        this.$Message.warning({duration: 5, content: "上报部门和管理部门不能是同一个部门！"});
                        return
                    }

                    this.$net.send({
                        server: this.$services.sysService.bizDeptReportRestController.checkRepeat,
                        data: {deptCode: this.editForm.deptCode, bizCode: this.editForm.bizCode}
                    }).then((data) => {
                        if (!data.valid) {
                            this.$Message.warning({duration: 5, content: "上报部门【"+this.editForm.deptName+"】的业务【"+this.editForm.bizName+"】已设定了管理部门，不能再次设定。"});
                            return
                        } else {
                            this.$net.send({
                                server: this.$services.sysService.bizDeptReportRestController.save,
                                data: this.editForm
                            }).then((data) => {
                                if (data.success) {
                                    this.$Message.success(data.msg);
                                    this.btnBack();
                                } else {
                                    this.$Message.error(data.msg);
                                }
                            });
                        }
                    });
                });
            },

            /*返回*/
            btnBack () {
                this.$router.go(-1);
                this.$store.commit('removeTag', 'bizDeptReportEdit');
                this.$store.commit('closePage', 'bizDeptReportEdit');
            },
            ok () {
                this.editForm.deptCode = this.editForm.tempDeptCode;
                this.editForm.deptName = this.editForm.tempDeptName;
                this.$refs.editForm.validateField('deptName', (errMsg) => {
                    if (errMsg) return '必填项';
                });

                this.$net.send({
                    server: this.$services.sysService.bizDeptReportRestController.queryBizType,
                    data: {deptCode: this.editForm.deptCode}
                }).then((data) => {
                    this.list = data;
                });
                this.$Message.info({content: '选择成功！'});
            },
            ok1 () {
                this.editForm.managerDeptCode = this.editForm.tempManagerDeptCode;
                this.editForm.managerDeptName = this.editForm.tempManagerDeptName;

                this.$refs.editForm.validateField('managerDeptName  ', (errMsg) => {
                    if (errMsg) return '必填项';
                });

                this.$Message.info({content: '选择成功！'});
            },
            cancel () {
                this.$Message.info({content: '取消选择'});
            },

            clickNode (data) {
                this.editForm.tempDeptName = data[0].title;
                this.editForm.tempDeptCode = data[0].id;
            },
            clickNode1 (data) {
                this.editForm.tempManagerDeptName = data[0].title;
                this.editForm.tempManagerDeptCode = data[0].id;
            },
            selectBiz (data) {
                this.editForm.bizName = data.label;
            }
        }
    };
</script>

<style scoped>

</style>
