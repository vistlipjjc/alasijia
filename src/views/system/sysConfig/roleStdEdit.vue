<template>
    <div class="roleStdEditCtnr">
        <Card>
            <p slot="title">编辑角色类型</p>
            <Row>
                <Form ref="editForm" :model="editForm" :rules="editRules" :label-width="180">
                    <Col span="11">
                        <FormItem label="角色名称" prop="roleStdName" required>
                            <Input v-model="editForm.roleStdName"></Input>
                        </FormItem>
                    </Col>
                    <Col span="11">
                        <FormItem label="角色编码" prop="roleStdCode" required>
                            <Input v-model="editForm.roleStdCode" :disabled="opt"></Input>
                        </FormItem>
                    </Col>
                    <Col span="22">
                        <FormItem label="角色描述" prop="roleStdDesc">
                            <Input v-model="editForm.roleStdDesc" type="textarea"></Input>
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
                    roleStdName: '',
                    roleStdCode: '',
                    roleStdDesc: ''
                },
                editRules: {
                    roleStdCode: [
                        { required: true, message: '必填项', trigger: 'blur'},
                        { validator: (rule, value, callback) => {
                                if(!this.opt){
                                    this.$net.send({
                                        server: this.$services.sysService.roleStdRestController.check,
                                        data: {roleStdCode: value}
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
                    roleStdName: [
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
                        server: this.$services.sysService.roleStdRestController.save,
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
                this.$store.commit('removeTag', 'roleStdEdit');
                this.$store.commit('closePage', 'roleStdEdit');
            }
        }
    }
</script>
