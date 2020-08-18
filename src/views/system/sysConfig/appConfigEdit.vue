<template>
    <div class="appConfigEditCtnr">
        <Card>
            <p slot="title">系统级别配置</p>
            <Row>
                <Col span="12" offset="6">
                    <Form ref="editForm" :model="editForm" :rules="editRules" :label-width="130">
                        <FormItem label="是否允许本地登录" prop="ALLOW_LOCAL_LOGIN" required>
                            <RadioGroup v-model="editForm.ALLOW_LOCAL_LOGIN">
                                <Radio label="Y">是</Radio>
                                <Radio label="N">否</Radio>
                            </RadioGroup>
                        </FormItem>
                        <FormItem label="禁止上传附件类型" prop="UPLOADEXCTYPES" required>
                            <Input v-model="editForm.UPLOADEXCTYPES" placeholder="请输入有效的后缀名，如：csv,txt…… 或-1"></Input>
                        </FormItem>
                        <FormItem label="允许上传附件类型" prop="UPLOADINCTYPES" required>
                            <Input v-model="editForm.UPLOADINCTYPES" placeholder="请输入有效的后缀名，如：csv,txt…… 或-1"></Input>
                        </FormItem>
                        <FormItem label="附件上传路径" prop="UPLOADPATH" required>
                            <Input v-model="editForm.UPLOADPATH" placeholder="请输入有效的路径，如：D:/upload"></Input>
                        </FormItem>
                            <FormItem label="单个附件大小" prop="UPLOADSIZE" required>
                                <Input v-model="editForm.UPLOADSIZE" placeholder="允许上传的最大值，如：50" >
                                    <span slot="append">M</span>
                                </Input>
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
        name: "appConfigEdit",
        data () {
            return {
                server: {
                    sysList: this.$services.sysService.appConfigRestController.sysList
                },
                nameArr: ['ALLOW_LOCAL_LOGIN','UPLOADEXCTYPES','UPLOADINCTYPES','UPLOADPATH','UPLOADSIZE'],
                editForm: {
                    ALLOW_LOCAL_LOGIN: '',
                    UPLOADEXCTYPES: '',
                    UPLOADINCTYPES: '',
                    UPLOADPATH: '',
                    UPLOADSIZE: ''
                },
                editRules: {
                    ALLOW_LOCAL_LOGIN: [
                        {required: true, message: '必填项', change: 'blur'}
                    ],
                    UPLOADEXCTYPES: [
                        {required: true, message: '必填项', trigger: 'blur'},
                        {type:'string', pattern:/^(([a-zA-Z]*|[a-zA-Z]*[,][a-zA-Z])*|-1)$/, message:'请输入有效的后缀名，如：csv,txt…… 或-1', trigger:'blur'}
                    ],
                    UPLOADINCTYPES: [
                        {required: true, message: '必填项', trigger: 'blur'},
                        {type:'string', pattern:/^(([a-zA-Z]*|[a-zA-Z]*[,][a-zA-Z])*|-1)$/, message:'请输入有效的后缀名，如：csv,txt…… 或-1', trigger:'blur'}
                    ],
                    UPLOADPATH: [
                        {required: true, message: '必填项', trigger: 'blur'},
                        {type:'string', pattern:/^(([A-Za-z]{1}:\/[\w\/]*)?\w|(\/[\w\/]*)?\w)$/, message:'请输入有效的路径，如：D:/upload', trigger:'blur'}
                    ],
                    UPLOADSIZE: [
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
                this.$net.send({
                    server: this.server.sysList,
                    data: {__EQS_configLevel: 'SYS'}
                }).then((data) => {
                    this.editForm = data;
                });
            },
            btnSave(name){
                let json = [];
                for(let i=0; i< this.nameArr.length; i++){
                    let name = this.nameArr[i];
                    let obj = {
                        name: name,
                        value: this.editForm[name]
                    };
                    json.push(obj);
                }
                let data = JSON.stringify(json);

                //save data
                this.$refs[name].validate((valid) => { // 数据校验
                    if (!valid) {
                        return
                    }
                    this.$net.send({
                        server: this.$services.sysService.appConfigRestController.save,
                        data: data
                    }).then((data) => {
                        if (data.success) {
                            this.$Message.success(data.msg);
                        } else {
                            this.$Message.error(data.msg);
                        }
                    });
                });
            }
        }
    }
</script>
