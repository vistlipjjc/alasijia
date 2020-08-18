<template>
    <div class="staffNotifyEditCtnr">
        <Card>
            <Row>
                <Col span="12" offset="6">
                    <Form ref="editForm" :model="editForm" :rules="editRules" :label-width="130">

                        <FormItem label="是否接收短信" prop="isReceiveSms" required>
                            <j-radio v-model="editForm.isReceiveSms" url="fixedDict:NotifyConfigResult@isReceiveSms"
                                     @on-change="selectChange($event,'isReceiveSms')">
                            </j-radio>
                        </FormItem>
                        <FormItem label="短信接收类型" prop="isReceiveEmail" required>
                            <j-radio v-model="editForm.smsReceiveType" url="fixedDict:NotifyConfigType@smsReceiveType"
                                     @on-change="selectChange($event,'smsReceiveType')">
                            </j-radio>
                        </FormItem>
                        <FormItem label="是否接收邮件" prop="isReceiveEmail" required>
                            <j-radio v-model="editForm.isReceiveEmail" url="fixedDict:NotifyConfigResult@isReceiveEmail"
                                     @on-change="selectChange($event,'isReceiveEmail')">
                            </j-radio>
                        </FormItem>
                        <FormItem label="邮件接收类型" prop="isReceiveMsg" required>
                            <j-radio v-model="editForm.emailReceiveType" url="fixedDict:NotifyConfigType@emailReceiveType"
                                     @on-change="selectChange($event,'emailReceiveType')">
                            </j-radio>
                        </FormItem>
                        <FormItem label="黑名单" prop="blacklist">
                            <jStaff :value="editForm.blacklist" multiple
                                    @on-select="selectBlacklist">
                            </jStaff>
                        </FormItem>
                        <FormItem label="是否接收提醒 " prop="isReceiveEmail" required>
                            <j-radio v-model="editForm.isReceiveRemind" url="fixedDict:NotifyConfigResult@isReceiveRemind"
                                     @on-change="selectChange($event,'isReceiveRemind')">
                            </j-radio>
                        </FormItem>
                        <FormItem label="是否接收私信" prop="trashRetentionTime" requiredS>
                            <j-radio v-model="editForm.isReceiveMsg" url="fixedDict:NotifyConfigResult@isReceiveMsg"
                                     @on-change="selectChange($event,'isReceiveMsg')">
                            </j-radio>
                        </FormItem>
                        <FormItem label="收件箱保留时长" prop="inboxRetentionTime" requiredS>
                            <j-radio v-model="editForm.inboxRetentionTime" url="fixedDict:NotifyConfigTime@inboxRetentionTime"
                                     @on-change="selectChange($event,'inboxRetentionTime')">
                            </j-radio>
                        </FormItem>
                        <FormItem label="垃圾箱保留时长" prop="trashRetentionTime" requiredS>
                            <j-radio v-model="editForm.trashRetentionTime" url="fixedDict:NotifyConfigTime@trashRetentionTime"
                                     @on-change="selectChange($event,'trashRetentionTime')">
                            </j-radio>
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
                    isReceiveSms: '',
                    isReceiveEmail: '',
                    smsReceiveType: '',
                    emailReceiveType:'',
                    isReceiveRemind: '',
                    isReceiveMsg:'',
                    blacklist: '',
                    inboxRetentionTime: '',
                    trashRetentionTime: ''
                },
                editRules: {
                    isReceiveSms: [
                        {required: true, message: '必填项', change: 'blur'}
                    ],
                    smsReceiveType: [
                        {required: true, message: '必填项', trigger: 'blur'}
                    ],
                    isReceiveEmail: [
                        {required: true, message: '必填项', trigger: 'blur'}
                    ],
                    emailReceiveType: [
                        {required: true, message: '必填项', trigger: 'blur'}
                    ],
                    isReceiveRemind: [
                        {required: true, message: '必填项', trigger: 'blur'}
                    ],
                    isReceiveMsg: [
                        {required: true, message: '必填项', trigger: 'blur'}
                    ],
                    inboxRetentionTime: [
                        {required: true, message: '必填项', trigger: 'blur'}
                    ],
                    trashRetentionTime: [
                        {required: true, message: '必填项', trigger: 'blur'}
                    ]
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
            //选择黑名单人员
            selectStaffs (){

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
                            this.$Message.success(data.msg);
                            this.btnBack();
                        } else {
                            this.$Message.error(data.msg);
                        }
                    });
                });
            },
            selectChange(value, name){
                this.editForm[name] = value;
            },
            selectBlacklist(value){
                let tmp = [];
                let tmpName = [];
                value.forEach(item => {
                    tmp.push(item.staffCode);
                });
                this.editForm.blacklist = tmp.join(',');
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
