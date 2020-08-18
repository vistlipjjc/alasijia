<template>
    <div class="dashLayoutEditCtnr">
        <Card>
            <Row justify="center">
                <Form ref="editForm" :model="editForm" :rules="editRules" :label-width="180">
                    <Col span="10">
                    <FormItem label="布局编码" prop="code" required>
                        <Input v-model="editForm.code" :disabled="opt"></Input>
                    </FormItem>
                    </Col>
                    <Col span="10">
                    <FormItem label="布局名称" prop="name" required>
                        <Input v-model="editForm.name"></Input>
                    </FormItem>
                    </Col>
                    <Col span="20">
                    <FormItem label="优先级" prop="priority" style="width: 100%">
                        <InputNumber :max="999" :min="1" v-model="editForm.priority"></InputNumber>
                    </FormItem>
                    </Col>
                    <Col span="20">
                    <FormItem label="布局设计模式" prop="designType">
                        <j-radio v-model="editForm.designType" url="fixedDict:DashLayoutDesignType@system"
                                 @on-change="change($event, 'designType')"></j-radio>
                    </FormItem>
                    </Col>
                    <Col span="20">
                    <FormItem label="布局描述" prop="desc">
                        <Input v-model="editForm.desc" type="textarea"></Input>
                    </FormItem>
                    </Col>
                    <Col span="20">
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
                opt: false,

                editForm: {
                    name: '',
                    code: '',
                    priority: '',
                    designType: '',
                    remark: '',
                    desc: ''
                },
                editRules: {
                    code: [
                        {required: true, message: '必填项', trigger: 'blur'},
                        {
                            validator: (rule, value, callback) => {
                                if (!this.opt) {
                                    this.$net.send({
                                        server: this.$services.sysService.dashLayoutRestController.check,
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
            },
            /*保存*/
            btnSave(name) {
                this.$refs[name].validate((valid) => { // 数据校验
                    if (!valid) {
                        return
                    }

                    this.$net.send({
                        server: this.$services.sysService.dashLayoutRestController.save,
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
            change(val, name) {
                this.editForm[name] = val;
            },

            /*返回*/
            btnBack() {
                this.$router.go(-1);
                this.$store.commit('removeTag', 'dashLayoutEdit');
                this.$store.commit('closePage', 'dashLayoutEdit');
            }
        }
    }
</script>