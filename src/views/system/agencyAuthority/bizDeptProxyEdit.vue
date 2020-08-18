<template>
    <div class="bizDeptProxyEditCtnr">
        <Card>
            <Row>
                <Col span="16" offset="2" @click.native="businessModal">
                <Modal
                        v-model="businessModal"
                        title="部门名称"
                        @on-ok="ok"
                        @on-cancel="cancel">
                    <Sider style="background-color: #fff">
                        <Tree :data="dataTrees" @on-select-change="clickNode"></Tree>
                    </Sider>
                </Modal>

                <Modal
                        v-model="proxyBusinessModal"
                        title="部门名称"
                        @on-ok="ok"
                        @on-cancel="cancel">
                    <Sider style="background-color: #fff">
                        <Tree :data="dataTrees" @on-select-change="clickNodeProxy"></Tree>
                    </Sider>
                </Modal>
                <Form ref="editForm" :model="editForm" :rules="editRules" :label-width="120">
                    <Col span="12">
                    <FormItem label="部门名称" prop="deptName" required>
                        <Col span="16" @click.native="businessModal = true" style="display: inline-block">
                        <Input v-model="editForm.deptName">
                        <Button slot="append" icon="ios-search"></Button>
                        </Input>
                        </Col>
                    </FormItem>
                    </Col>
                    <Col span="10">
                    <FormItem label="标准角色" prop="stdRoleName" required>
                        <j-select v-model="editForm.stdRoleCode" url="custom:roleStd/queryAll@system" labelInValue
                                  @on-change="selectChange($event, 'stdRoleCode','stdRoleName')">
                        </j-select>
                    </FormItem>
                    </Col>
                    <Col span="12">
                    <FormItem label="代管部门名称" prop="proxyDeptName">
                        <Col span="16" @click.native="proxyBusinessModal = true" style="display: inline-block">
                        <Input v-model="editForm.proxyDeptName">
                        <Button slot="append" icon="ios-search"></Button>
                        </Input>
                        </Col>
                    </FormItem>
                    </Col>
                    <Col span="10">
                    <FormItem label="代管标准角色编码" prop="proxyStdRoleName">
                        <j-select v-model="editForm.proxyStdRoleCode" url="custom:roleStd/queryAll@system" labelInValue
                                  @on-change="selectChange($event, 'proxyStdRoleCode','proxyStdRoleName')">
                        </j-select>
                    </FormItem>
                    </Col>
                    <Col span="20">
                    <FormItem label="备注" prop="remark">
                        <Input v-model="editForm.remark" type="textarea"></Input>
                    </FormItem>
                    </Col>
                    <Col span="11">
                    <div align="center">
                        <Button @click="btnSave('editForm')" type="primary" style="margin:0 11px;">保存</Button>
                        <Button type="ghost" @click="btnBack">返回</Button>
                    </div>
                    </Col>
                </Form>
                </Col>
            </Row>
        </Card>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                businessModal: false,
                proxyBusinessModal: false,
                dataTrees: [],
                opt: false,
                editForm: {
                    deptName: '',
                    stdRoleCode: '',
                    stdRoleName: '',
                    proxyDeptName: '',
                    proxyStdRoleName: '',
                    proxyStdRoleCode: '',
                    remark: ''
                },
                editRules: {
                    deptName: [
                        {required: true, message: '必填项', trigger: 'blur'},
                        {
                            validator: (rule, value, callback) => {
                                if (!this.opt) {
                                    this.$net.send({
                                        server: this.$services.sysService.bizDeptProxyRestController.check,
                                        data: {code: value}
                                    }).then((data) => {
                                        if (!data.valid) {
                                            callback(new Error('编码已存在，请重新输入。'));
                                        } else {
                                            callback();
                                        }
                                    });
                                } else {
                                    callback();
                                }
                            }
                        }
                    ],
                    stdRoleName: [
                        {required: true, message: '必填项', trigger: 'blur'}
                    ]
                },
                paramData: [],
                column: [
                    {type: 'index', align: 'center', width: 50},
                    {title: '部门', align: 'center', key: 'deptName'},
                    {title: '标准角色', align: 'center', key: 'stdRoleName'},
                    {title: '代管部门', align: 'center', key: 'proxyDeptName'},
                    {title: '代管标准角色', align: 'center', key: 'proxyStdRoleName'},
                    {title: '备注', align: 'center', key: 'remark'},
                    {title: '操作', align: 'center', key: 'handler', width: 120, handler: ['delete']},
                ],
                selectionParam: []
            }
        },
        mounted() {
            this.init();
        },
        methods: {
            init() {
                if (this.$route.params.opt == 'edit') {
                    this.opt = true;
                    this.editForm = this.$route.query.row;
                    console.log(this.$route.query.row)
                    if (this.editForm.param) {
                        this.paramData = JSON.parse(this.editForm.param);
                    }
                }
                this.$net.send({
                    server: this.$services.sysService.unitRestController.load
                }).then(
                    (data) => {
                        this.dataTrees = data
                    });
            },
            /*保存*/
            btnSave(name) {
                this.$refs[name].validate((valid) => { // 数据校验
                    if (!valid) {
                        return
                    }

                    this.$net.send({
                        server: this.$services.sysService.bizDeptProxyRestController.save,
                        data: this.editForm
                    }).then((data) => {
                        if (data.success) {
                            this.$Message.success(data.msg);
                            this.btnBack();
                        } else {
                            this.$Message.error(data.msg);
                        }
                    });

                });
            },

            /*返回*/
            btnBack() {
                this.$router.go(-1);
                this.$store.commit('removeTag', 'bizDeptProxyEdit');
                this.$store.commit('closePage', 'bizDeptProxyEdit');
            },

            selectChange(data, code,name) {
                this.editForm[code] =data.value;
                this.editForm[name] =data.label;
            },

            clickNode(data) {
                this.dept = data[0];
                this.editForm.deptName = this.dept.title;
                this.editForm.deptCode = this.dept.id;
            } ,
            clickNodeProxy(data) {
                this.dept = data[0];
                this.editForm.proxyDeptName = this.dept.title;
                this.editForm.proxyDeptCode = this.dept.id;
            }
        }
    }
</script>