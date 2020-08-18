<template>
    <div class="announceEditCtnr">
        <Card>
            <Row>
                <Col span="12" offset="6">
                    <Form ref="editForm" :model="editForm" :rules="editRules" :label-width="130">

                        <FormItem label="短信重发次数" prop="smsRetryTimes" required>
                            <Input v-model="editForm.smsRetryTimes"></Input>
                        </FormItem>
                        <FormItem label="邮件重发次数" prop="emailRetryTimes" required>
                            <Input v-model="editForm.emailRetryTimes"></Input>
                        </FormItem>
                        <FormItem label="收件箱保留时长" prop="inboxRetentionTime" required>
                            <RadioGroup v-model="editForm.inboxRetentionTime">
                                <Radio label="15">15天</Radio>
                                <Radio label="30">30天</Radio>
                                <Radio label="60">60天</Radio>
                            </RadioGroup>
                        </FormItem>
                        <FormItem label="垃圾箱保留时长" prop="trashRetentionTime" requiredS>
                            <RadioGroup v-model="editForm.trashRetentionTime">
                                <Radio label="15">15天</Radio>
                                <Radio label="30">30天</Radio>
                                <Radio label="60">60天</Radio>
                            </RadioGroup>
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
        name: "announceEdit",
        data () {
            return {
                server: {
                    select: this.$services.sysService.notifyConfigRestController.getNotifyConfigId
                },
                editForm: {
                    smsRetryTimes: '',
                    emailRetryTimes: '',
                    inboxRetentionTime: '',
                    trashRetentionTime: ''
                },
                editRules: {
                    smsRetryTimes: [
                        {required: true, message: '必填项', change: 'blur'},
                        { type: 'number', message: '请输入数字格式', trigger: 'blur', transform: function (value) {
                                return Number(value);
                            }}
                    ],
                    emailRetryTimes: [
                        {required: true, message: '必填项', trigger: 'blur'},
                        { type: 'number', message: '请输入数字格式', trigger: 'blur', transform: function (value) {
                                return Number(value);
                            }}
                    ],
                    inboxRetentionTime: [
                        {required: true, message: '必填项', trigger: 'blur'}
                    ],
                    trashRetentionTime: [
                        {required: true, message: '必填项', trigger: 'blur'}
                    ],
                }
            }
        },
        mounted(){
            this.init();
        },
        methods:{
            init(){
                let user = JSON.parse(localStorage.getItem("user"));
                if(user) {
                    this.$net.send({
                        server: this.server.select,
                        data: {staffCode: user.staffCode}
                    }).then((data) => {
                        this.editForm = data;
                    });
                }

            },
            //save data
            btnSave(name){
                this.$refs[name].validate((valid) => { // 数据校验
                    if (!valid) {
                        return
                    }

                    this.$net.send({
                        server: this.$services.sysService.notifyConfigRestController.save,
                        data: this.editForm
                    }).then((data) => {
                        if (data.success) {
                            this.$Notice.success({duration: 5, title: data.msg});
                            this.btnBack();
                        } else {
                            this.$Notice.error({duration: 5, title: data.msg});
                        }
                    });
                });
            },
            /*返回*/
            btnBack() {
                this.$router.go(-1);
                this.$store.commit('removeTag', 'announceEdit');
                this.$store.commit('closePage', 'announceEdit');
            }
        }
    }
</script>
