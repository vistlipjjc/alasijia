<template>
    <div class="rulesEditCtnr">
        <Card>
            <Row justify="space-between">
                <Form ref="editForm" :model="editForm" :rules="editRules" :label-width="200">
                    <Col span="10">
                    <FormItem label="规则编码" prop="code" required>
                        <Input v-model="editForm.code" :disabled="opt"></Input>
                    </FormItem>
                    </Col>
                    <Col span="10">
                    <FormItem label="规则名称" prop="name" required>
                        <Input v-model="editForm.name"></Input>
                    </FormItem>
                    </Col>
                    <Col span="20">
                    <FormItem label="规则优先级" prop="priority" style="width: 100%">
                        <InputNumber :max="999" :min="1" v-model="editForm.priority"></InputNumber>
                    </FormItem>
                    </Col>
                    <Col span="20">
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
                opt: false,

                editForm: {
                    name: '',
                    code: '',
                    priority: 0,
                    remark: ''
                },
                editRules: {
                    code: [
                        { required: true, message: '必填项', trigger: 'blur'}
                    ],
                    name: [
                        { required: true, message: '必填项', trigger: 'blur'}
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
                        server: this.$services.ruleService.rulesRestController.save,
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
                this.$store.commit('removeTag', 'rulesEdit');
                this.$store.commit('closePage', 'rulesEdit');
            }
        }
    }
</script>
