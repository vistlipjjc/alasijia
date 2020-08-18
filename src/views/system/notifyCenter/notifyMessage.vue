<template>
    <div class="appConfigEditCtnr">
        <Card>
            <Row>
                <Col span="18">
                  <h3>私信编辑</h3>
                </Col>
                <Col span="6">
                    <ButtonGroup>
                        <Button ref="primary" type="ghost" icon="pencil" @click="sendMsg('editForm')">发送</Button>
                        <Button ref="markAsReadButton" type="ghost"  @click="preview">预览</Button>
                        <Button ref="markAsReadButton" type="ghost"  @click="saveDraft">存草稿</Button>
                        <Button ref="markAsReadButton" type="ghost"  @click="btnBack">取消</Button>
                    </ButtonGroup>
                </Col>

            </Row>
        </Card>
        <Card>
            <Row>
                <Col span="12" offset="6">
                    <Form ref="editForm" :model="editForm" :rules="editRules" :label-width="130">
                        <FormItem label="收件人" prop="receiverName" required>
                            <jStaff :value="editForm.receiverName" multiple
                                    @on-select="selectChange" v-model="editForm.receiverName">
                            </jStaff>
                        </FormItem>
                        <FormItem label="主题" prop="subject" required>
                            <Input v-model="editForm.subject" ></Input>
                        </FormItem>
                        <FormItem label="" prop="content" >
                            <Input v-model="editForm.content" ></Input>
                        </FormItem>
                    </Form>
                </Col>
            </Row>
        </Card>
    </div>


</template>

<script>
    export default {
        name: "notifyMessage",
        data () {
            return {
                editForm: {
                    receiverName: '',
                    receiver: '',
                    subject: '',
                    staffName:'',
                    content: '',
                    id: ''
                },
                editRules: {
                   /* receiverName: [
                        { required: true, message: '必填项', trigger: 'blur' }
                    ],*/
                    subject: [
                        { required: true, message: '必填项', trigger: 'blur' },
                        { type: 'string', max: 256, message: '长度不能超过256个字符', trigger: 'blur' }

                    ]
                },
                notifyModel: false

            }
        },
        methods :{
            init(){
                this.$net.send({
                    server: this.$services.sysService.notifyRestController.view,
                    append: this.$route.query.notifyId
                }).then((data) => {

                    this.editForm = data;
                    if(this.$route.query.opt == 'forward'){
                        this.editForm.receiver = '';
                        this.editForm.receiverName = '';
                    }
                });
            },
            //发送消息
            sendMsg(name){
                // 验证表单
                this.$refs[name].validate((valid) => { // 数据校验
                        if (!valid) {
                            return;
                        }
                    this.$net.send({
                        server: this.$services.sysService.notifyRestController.saveMessage,
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
            //预览
            preview(){
                let row = this.editForm;
                row.senderName = this.$route.query.senderName;
                this.$router.push({
                    path: '/notifyPreview',
                    query:{
                        row:row
                    }
                });
            },
            //保存私信草稿
            saveDraft(){
                console.log('save', this.editForm)
                this.$net.send({
                    server: this.$services.sysService.notifyRestController.saveMessageDraft,
                    data: this.editForm
                }).then((data) => {
                    if (data.success) {
                        this.$Message.success(data.msg);
                        this.btnBack();
                    } else {
                        this.$Message.error(data.msg);
                    }
                });
            },
            selectChange(value){
                if(value)
                console.log(value,'val')
                /*let tmp = [];
                let tmpName = [];
                value.forEach(item => {
                    tmp.push(item.staffCode);
                    tmpName.push(item.staffName);
                });
                this.editForm.receiverName = tmpName.join(',');
                this.editForm.receiver = tmp.join(',');*/
                this.editForm.receiverName = value.staffName
                this.editForm.receiver = value.staffCode
            },
            /*返回*/
            btnBack() {
                this.$router.go(-1);
                this.$store.commit('removeTag', 'notifyMessage');
                this.$store.commit('closePage', 'notifyMessage');
            }
        },
        mounted() {
            if(this.$route.query.notifyId){
                this.init();
            }
        },
    }
</script>
