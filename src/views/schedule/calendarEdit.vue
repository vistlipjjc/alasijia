<template>
    <div class="calendarEditCtnr">
        <Card>
            <Row>
                <Form ref="editForm" :model="editForm" :rules="editRules" :label-width="180">
                    <Col span="11">
                        <FormItem label="日历编码" prop="code" required>
                            <Input v-model="editForm.code" :disabled="opt"></Input>
                        </FormItem>
                    </Col>
                    <Col span="11">
                        <FormItem label="日历名称" prop="name" required>
                            <Input v-model="editForm.name"></Input>
                        </FormItem>
                    </Col>
                    <Col span="22">
                        <FormItem label="备注" prop="remark">
                            <Input type="textarea" v-model="editForm.remark"></Input>
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
            opt: false,
            editForm: {
                code: '',
                name: '',
                remark: ''
            },
            editRules: {
                code: [
                    { required: true, message: '必填项', trigger: 'blur'},
                    { validator: (rule, value, callback) => {
                        if(!this.opt){
                            this.$net.send({
                                server: this.$services.schService.calendarRestController.check,
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
        },

        /*保存*/
        btnSave(name) {
            this.$refs[name].validate((valid) => { // 数据校验
                if (!valid) return;

                this.$net.send({
                    server: this.$services.schService.calendarRestController.save,
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
            this.$store.commit('removeTag', 'calendarEdit');
            this.$store.commit('closePage', 'calendarEdit');
        }
    }
}
</script>
