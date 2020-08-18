<template>
    <div class="procDefEditCtnr">

        <Card>
            <Row>
                <Form ref="editForm" :model="editForm" :rules="editRules" :label-width="180">
                    <Col span="11">
                    <FormItem label="流程编码" prop="code" required>
                        <Input v-model="editForm.code" :disabled="opt"></Input>
                    </FormItem>
                    </Col>
                    <Col span="11">
                    <FormItem label="流程名称" prop="name" required>
                        <Input v-model="editForm.name"></Input>
                    </FormItem>
                    </Col>
                    <Col span="11">
                        <FormItem label="模板名称" prop="procTemplateCode">
                            <j-select v-model="editForm.procTemplateCode" :value="editForm.procTemplateCode" url="custom:procTemplate/selectAll@wf" labelInValue
                                      ref="procTemplateCode" @on-change="selectChange($event, 'procTemplateCode', 'procTemplateName')" >
                            </j-select>
                        </FormItem>
                    </Col>
                    <Col span="11">
                        <FormItem label="表单名称" prop="formCode" >
                            <j-select v-model="editForm.formCode" :value="editForm.formCode" url="custom:formDef/selectAll@wf" labelInValue
                                      ref="formCode" @on-change="selectChange($event, 'formCode', 'formName')" >
                            </j-select>
                        </FormItem>
                    </Col>
                    <Col span="11">
                        <FormItem label="模块名称" prop="moduleCode" @click.native="businessModal = true" >
                            <Input v-model="editForm.moduleName" >
                                <Button slot="append" icon="ios-search" ></Button>
                            </Input>
                        </FormItem>
                    </Col>
                    <Col span="11">
                        <FormItem label="是否跳过同一审批人" prop="skipSameApprover">
                            <!-- <j-select v-model="editForm.skipSameApprover" :value="editForm.skipSameApprover" url="fixedDict:YesNo"
                                      ref="formCode" @on-change="selectValueChange($event, 'skipSameApprover')" >
                            </j-select> -->
                            <j-radio v-model="editForm.skipSameApprover" url="fixedDict:YesNo@system" @on-change="selectValueChange($event, 'skipSameApprover')"></j-radio>
                        </FormItem>
                    </Col>
                    <Col span="11">
                        <FormItem label="服务名称" prop="clientUrl">
                            <Input v-model="editForm.clientUrl"></Input>
                        </FormItem>
                    </Col>
                    <Col span="22">
                        <FormItem label="备注" prop="remark">
                            <Input v-model="editForm.remark" type="textarea"></Input>
                        </FormItem>
                    </Col>
                    <Col span="22">
                        <div align="center">
                            <Button @click="btnSave('editForm')" type="primary" style="margin:0 11px;">保存</Button>
                            <Button type="ghost" @click="btnBack">返回</Button>
                        </div>
                    </Col>
                </Form>
            </Row>
        </Card>
        <Modal
                v-model="businessModal"
                title="选择所属模块"
                @on-ok="ok"
        >
            <Sider style="background-color: #fff">
                <Tree :data="dataTrees" @on-select-change="clickNode"></Tree>
            </Sider>
        </Modal>
    </div>
</template>

<script>
    import {editButton} from "../../../components/jTable/jTable";

    export default {
        data() {
            return {
                businessModal: false,
                dataTrees: [],
                opt: false,
                editForm: {
                    code: '',
                    name: '',
                    moduleCode: '',
                    moduleName: '',
                    procTemplateCode: '',
                    procTemplateName: '',
                    processDefId: '',
                    processDefKey: '',
                    processDefName: '',
                    formCode: '',
                    formName: '',
                    formType: '',
                    procVersion: '',
                    procVersionStatus: '',
                    skipSameApprover: 'N',
                    clientUrl: '',
                    clientPort: '',
                    clientContext: '',
                    status: '',
                    remark: ''
                },
                editRules: {
                    code: [
                        { required: true, message: '必填项', trigger: 'blur'},
                        { validator: (rule, value, callback) => {
                                if(!this.opt){
                                    this.$net.send({
                                        server: this.$services.wfService.procDefRestController.check,
                                        data: {code: value}
                                    }).then((data) => {
                                        if (!data.valid) {
                                            callback(new Error('编码已存在，请重新输入。'));
                                        }else{
                                            callback();
                                        }
                                    });
                                }else{
                                    callback();
                                }
                            }}
                    ],
                    name: [
                        {required: true, message: '必填项', trigger: 'blur'}
                    ]
                }
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
                }

                this.$net.send({
                    server:this.$services.wfService.procDefRestController.loadBizModule
                }).then(
                    (data)=>{
                        this.dataTrees = data
                    });
            },
            getStaff(val) {
                if (val)
                {
                    this.editForm.staffCode = val.staffCode;
                    this.editForm.staffName = val.staffName;
                }
                else
                {
                    this.editForm.staffCode = '';
                    this.editForm.staffName = '';
                }
            },
            /*保存*/
            btnSave(name) {
                this.$refs[name].validate((valid) => { // 数据校验
                    if (!valid) {
                        return
                    }
                    // delete this.editForm['_checked'];
                    // delete this.editForm['_disabled'];
                    // delete this.editForm['_highlight'];
                    this.$net.send({
                        server: this.$services.wfService.procDefRestController.save,
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
            selectChange(data, code,name) {
                this.editForm[code] =data.value;
                this.editForm[name] =data.label;
            },
            selectValueChange(value, code){
                this.editForm[code] = value;
            },
            /*返回*/
            btnBack() {
                this.$router.go(-1);
                this.$store.commit('removeTag', 'procDefEdit');
                this.$store.commit('closePage', 'procDefEdit');
            },
            clickNode(data){
                this.dept = data[0];
                this.editForm.moduleName=this.dept.title;
                this.editForm.moduleCode=this.dept.id;
            },
            ok(){
                // this.$net.send({
                //     server: this.$services.sysService.unitRestController.isOrg,
                //     append: this.editForm.deptCode
                // }).then(
                //     (data) => {
                //         if(data.valid){
                //             this.$Message.error('请选择具体的部门');
                //             this.editForm.deptName = "";
                //         }
                //     });
            }
        }
    }
</script>
