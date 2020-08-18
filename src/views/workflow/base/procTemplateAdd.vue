<template>
    <div class="dashWidgetEditCtnr">
        <Card>
            <Row justify="center">
                <Form ref="editForm" :model="editForm" :rules="editRules" :label-width="180">
                    <Col span="10">
                    <FormItem label="模板编码" prop="code" required>
                        <Input v-model="editForm.code"></Input>
                    </FormItem>
                    </Col>
                    <Col span="10">
                    <FormItem label="模板名称" prop="name" required>
                        <Input v-model="editForm.name"></Input>
                    </FormItem>
                    </Col>
                    <Col span="10">
                    <FormItem label="备注" prop="remark">
                        <Input v-model="editForm.remark" type="textarea"></Input>
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
                editForm: {
                    name: '',
                    code: '',
                    remark: ''
                },
                editRules: {
                    code: [
                        {required: true, message: '必填项', trigger: 'blur'},
                        {
                            validator: (rule, value, callback) => {

                                this.$net.send({
                                    server: this.$services.wfService.procTemplateRestController.check,
                                    append: value
                                }).then((data) => {
                                    if (!data.valid) {
                                        callback(new Error('编码已存在，请重新输入。'));
                                    } else {
                                        callback();
                                    }
                                });

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
                        server: this.$services.wfService.procTemplateRestController.save,
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
                this.$store.commit('removeTag', 'procTemplateAdd');
                this.$store.commit('closePage', 'procTemplateAdd');
            }
        }
    }
</script>