<template>
    <div class="notifyTodoOperRestEditCtnr">
        <Card>
            <p slot="title">待办任务通知配置</p>
            <Row>
                <Col span="12" offset="6">
                    <Form ref="editForm" :model="editForm" :rules="editRules" :label-width="130">
                        <FormItem label="目标类型" prop="targetType">
                            <Input v-model="editForm.targetType"/>
                        </FormItem>
                        <FormItem label="动作" prop="action">
                            <Input v-model="editForm.action"/>
                        </FormItem>
                        <FormItem label="URL地址" prop="url">
                            <Input v-model="editForm.url"/>
                        </FormItem>
                        <FormItem label="具体操作" prop="operate">
                            <Input v-model="editForm.operate"/>
                        </FormItem>
                        <FormItem label="操作文本" prop="text">
                            <Input v-model="editForm.text"/>
                        </FormItem>
                        <FormItem >
                            <Button @click="btnSave('editForm')" type="primary" style="margin:0 170px;">保存</Button>
                        </FormItem>
                    </Form>
                </Col>
            </Row>
        </Card>
    </div>
</template>

<script>
    export default {
        name: "notifyTodoOperRestEdit",
        data () {
            return {
                server: {
                    query: this.$services.sysService.notifyTodoOperRestController.query
                },
                editForm: {
                    targetType: '',
                    action: '',
                    url: '',
                    operate: '',
                    text: ''
                },
                editRules: {
                    targetType: [
                        {required: true, message: '必填项', change: 'blur'},
                        { type: 'string', max: 64, message: '长度不能超过64个字符', trigger: 'blur' }
                    ],
                    action: [
                        {required: true, message: '必填项', trigger: 'blur'},
                        { type: 'string', max: 64, message: '长度不能超过64个字符', trigger: 'blur' }

                    ],
                    url: [
                        {required: true, message: '必填项', trigger: 'blur'},
                        { type: 'string', max: 256, message: '长度不能超过256个字符', trigger: 'blur' }

                    ],
                    operate: [
                        {required: true, message: '必填项', trigger: 'blur'},
                        { type: 'string', max: 64, message: '长度不能超过64个字符', trigger: 'blur' }

                    ],
                    text: [
                        {required: true, message: '必填项', trigger: 'blur'},
                        { type: 'string', max: 128, message: '长度不能超过128个字符', trigger: 'blur' }

                    ]
                }
            }
        },
        mounted(){
            this.init();
        },
        methods:{
            init(){
                this.$net.send({
                    server: this.server.query,
                }).then((data) => {
                    this.editForm = data;
                });
            },
            //save data
            btnSave(name){
                this.$refs[name].validate((valid) => { // 数据校验
                    if (!valid) {
                        return
                    }
                    this.$net.send({
                        server: this.$services.sysService.notifyTodoOperRestController.save,
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
            }
        }
    }
</script>
