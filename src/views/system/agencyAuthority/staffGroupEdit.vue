<template>
    <div class="staffGroupEditCtnr">
        <Card>
            <p slot="title">编辑用户组</p>
            <Row>
                <Col span="12" offset="6">
                <Form ref="editForm" :model="editForm" :rules="editRules" :label-width="180" >
                        <FormItem label="用户组编码" prop="staffGroupCode" required>
                            <Input v-model="editForm.staffGroupCode" :disabled="opt"></Input>
                        </FormItem>
                        <FormItem label="用户组名称" prop="staffGroupName" required>
                            <Input v-model="editForm.staffGroupName"></Input>
                        </FormItem>
                        <FormItem label="用户组描述" prop="staffGroupDesc">
                            <Input v-model="editForm.staffGroupDesc" type="textarea"></Input>
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
        data(){
            return {
                opt: false,
                editForm: {
                    staffGroupCode: '',
                    staffGroupName: '',
                    staffGroupDesc: ''
                },
                editRules: {
                    staffGroupCode: [
                        { required: true, message: '必填项', trigger: 'blur'},
                        { validator: (rule, value, callback) => {
                                if(!this.opt){
                                    this.$net.send({
                                        server: this.$services.sysService.staffGroupRestController.check,
                                        data: {staffGroupCode: value}
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
                    staffGroupName: [
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
                        server: this.$services.sysService.staffGroupRestController.save,
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
            btnBack(){
                this.$router.go(-1);
                this.$store.commit('removeTag', 'staffGroupEdit');
                this.$store.commit('closePage', 'staffGroupEdit');
            }
        }
    }
</script>

<style scoped>

</style>