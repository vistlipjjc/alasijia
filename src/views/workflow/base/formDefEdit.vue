<template>
    <div>
        <Card>
            <Row>
                <Form ref="editForm" :model="editForm" :rules="editRules" :label-width="180">
                    <Col span="11">
                        <FormItem label="表单编码" prop="code" required>
                            <Input v-model="editForm.code"></Input>
                        </FormItem>
                    </Col>
                    <Col span="11">
                        <FormItem label="表单名称" prop="name" required>
                            <Input v-model="editForm.name"></Input>
                        </FormItem>
                    </Col>
                    <Col span="11">
                        <FormItem label="表单类型" prop="formType" required>
                            <j-select v-model="editForm.formType" url="fixedDict:PropFormType@wf"
                                     @on-change="selectChange($event,'formType')">
                            </j-select>
                        </FormItem>
                    </Col>
                    <Col span="22">
                        <FormItem label="备注" prop="remark">
                            <Input v-model="editForm.remark" type="textarea" ></Input>
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
                    code :'',
                    name :'',
                    formType :'',
                    remark :''
                },
                editRules: {

                },
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
                    this.editForm.procInstId = '';
                }
            },
            /*保存*/
            btnSave(name) {
                this.$refs[name].validate((valid) => { // 数据校验
                    if (!valid) {
                        return
                    }
                    delete this.editForm['_checked'];
                    delete this.editForm['_disabled'];
                    delete this.editForm['_highlight'];
                    this.$net.send({
                        server: this.$services.wfService.formDefRestController.save,
                        data: JSON.stringify(this.editForm)
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
                this.$store.commit('removeTag', 'staffEdit');
                this.$store.commit('closePage', 'staffEdit');
            },
            selectChange(value, name){
                this.editForm[name] = value;
            }
        }
    }
</script>