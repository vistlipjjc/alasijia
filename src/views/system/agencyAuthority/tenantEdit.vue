<template>
    <div class="tenantEditCtnr">
        <Card>
            <p slot="title">编辑信息</p>
            <Row>
                <Form ref="editForm" :model="editForm" :rules="editRules" :label-width="180">
                    <Col span="11">
                    <FormItem label="编码" prop="code" required>
                        <Input v-model="editForm.code" :disabled="opt"></Input>
                    </FormItem>
                    </Col>
                    <Col span="11">
                    <FormItem label="名称" prop="name" required>
                        <Input v-model="editForm.name"></Input>
                    </FormItem>
                    </Col>
                    <Col span="11">
                    <FormItem label="管理员编码" prop="staffCode" required>
                        <Input v-model="editForm.staffCode" :disabled="opt"></Input>
                    </FormItem>
                    </Col>
                    <Col span="11">
                    <FormItem label="管理员名称" prop="staffName" required>
                        <Input v-model="editForm.staffName" url="custom:check/check@system"></Input>
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
    </div>
</template>

<script>
    export default {
        data() {
            return {
                businessModal: false,
                dataTrees: [],
                opt: false,
                editForm: {
                    code: '',
                    name: '',
                    staffCode: '',
                    staffName: '',
                    remark: '',
                },
                editRules: {
                    code: [
                        {required: true, message: '必填项', trigger: 'blur'},
                        {type:'string', pattern:/^[a-zA-Z0-9][a-zA-Z0-9_]*$/, message:'只能以英文字母、数字开头，只能包含英文字母、数字、下划线', trigger:'blur'},
                        {validator: (rule, value, callback) => {
                                if(!this.opt){
                                    this.$net.send({
                                        server: this.$services.sysService.tenantRestController.check,
                                        data: {name: 'code', value: value}
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
                            }
                        }
                    ],
                    name: [
                        {required: true, message: '必填项', trigger: 'blur'}
                    ],
                    staffCode: [
                        {required: true, message: '必填项', trigger: 'blur'},
                        {validator: (rule, value, callback) => {
                                if(!this.opt){
                                    this.$net.send({
                                        server: this.$services.sysService.tenantRestController.check,
                                        data: {name: 'staffCode', value: value}
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
                            }
                        }
                    ],
                    staffName: [
                        {required: true, message: '必填项', trigger: 'blur'}
                    ]
                },
                paramData: [],
                column: [
                    {type: 'index', align: 'center', width: 50},
                    {title: '编码', align: 'center', key: 'code'},
                    {title: '名称', align: 'center', key: 'name'},
                    {title: '管理员编码', align: 'center', key: 'staffCode'},
                    {title: '管理员名称', align: 'center', key: 'staffName'},
                    {title: '备注', align: 'center', key: 'remark'},
                ],
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
            },
            /*保存*/
            btnSave(name) {
                this.$refs[name].validate((valid) => { // 数据校验
                    if (!valid) {
                        return
                    }
                    this.$net.send({
                        server: this.$services.sysService.tenantRestController.save,
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
                this.$store.commit('removeTag', 'tenantEdit');
                this.$store.commit('closePage', 'tenantEdit');
            }
        }
    }
</script>