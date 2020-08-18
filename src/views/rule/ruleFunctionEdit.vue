<template>
    <div class="ruleObejctEditCtnr">
        <Card>
            <Row>
                <Form ref="editForm" :model="editForm" :rules="editRules" :label-width="180">
                    <Col span="11">
                        <FormItem label="编码" prop="code" required>
                            <Input v-model="editForm.code" :disabled="opt"></Input>
                        </FormItem>
                    </Col>
                    <Col span="11">
                        <FormItem label="名称" prop="name" required>
                            <Input v-model="editForm.name"></Input>
                        </FormItem>
                    </Col>
                    <Col span="22">
                        <FormItem label="描述" prop="remark">
                            <Input v-model="editForm.remark" type="textarea"></Input>
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
                    name: '',
                    code: '',
                    remark: ''
                },
                editRules: {
                    code: [
                        { required: true, message: '必填项', trigger: 'blur'},
                        { validator: (rule, value, callback) => {
                                if(!this.opt){
                                    this.$net.send({
                                        server: this.$services.ruleService.functionsRestController.check,
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
                },
                paramData: [],
                column: [
                    { type: 'index', align: 'center', width: 50 },
                    { title: '编码', align: 'center', key: 'code' },
                    { title: '名称', align: 'center', key: 'name' },
                    { title: '描述', align: 'center', key: 'remark' },
                    { title: '操作', align: 'center', key: 'handler', width: 120, handler: ['delete']},
                ],
                selectionParam: []
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
                    if(this.editForm.param){
                        this.paramData = JSON.parse(this.editForm.param);
                    }
                }
            },
            /*保存*/
            btnSave(name) {
                this.$refs[name].validate((valid) => { // 数据校验
                    if (!valid) {
                        return
                    }

                    this.$net.send({
                        server: this.$services.ruleService.functionsRestController.save,
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
                this.$store.commit('removeTag', 'ruleFunctionEdit');
                this.$store.commit('closePage', 'ruleFunctionEdit');
            }
        }
    }
</script>