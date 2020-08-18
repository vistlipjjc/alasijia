<template>
    <div class="dashWidgetEditCtnr">
        <Card>
            <Row  justify="center" >
                <Form ref="editForm" :model="editForm" :rules="editRules" :label-width="180">
                    <Col span="10">
                        <FormItem label="组件编码" prop="code" required >
                            <Input v-model="editForm.code" :disabled="opt"></Input>
                        </FormItem>
                    </Col>
                    <Col span="10">
                        <FormItem label="组件名称" prop="name" required>
                            <Input v-model="editForm.name"></Input>
                        </FormItem>
                    </Col>
                    <Col span="20">
                        <FormItem label="组件类型" prop="type" >
                         <j-select v-model="editForm.type" url="fixedDict:DashWidgetType@system"
                                 @on-change="selectChange($event, 'type')">
                          </j-select>
                        </FormItem>
                    </Col>
                    <Col span="20" v-show="flag">
                        <FormItem label="组件实现类" prop="implClass" >
                           <Input v-model="editForm.implClass" ></Input>
                        </FormItem>
                    </Col>
                    <Col span="20">
                        <FormItem label="组件描述" prop="desc">
                            <Input v-model="editForm.desc" type="textarea"></Input>
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
                flag: false,
                editForm: {
                    name: '',
                    code: '',
                    type: '',
                    implClass: '',
                    remark: '',
                    desc: ''
                },
                editRules: {
                    code: [
                        { required: true, message: '必填项', trigger: 'blur'},
                        { validator: (rule, value, callback) => {
                                if(!this.opt){
                                    this.$net.send({
                                        server: this.$services.sysService.dashWidgetRestController.check,
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
            selectChange(val, name){
                this.editForm[name] = val;
                if(val == "CUSTOM"){
                   this.flag = true;
                }
            },
            /*保存*/
            btnSave(name) {
                this.$refs[name].validate((valid) => { // 数据校验
                    if (!valid) {
                        return
                    }

                    this.$net.send({
                        server: this.$services.sysService.dashWidgetRestController.save,
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
                this.$store.commit('removeTag', 'dashWidgetEdit');
                this.$store.commit('closePage', 'dashWidgetEdit');
            }
        }
    }
</script>