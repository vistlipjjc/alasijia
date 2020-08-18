<template>
    <div class="suppliersEditCtnr">
        <Card>
            <Row>
                <Form ref="editForm" :model="editForm" :rules="editRules" :label-width="180">
                    <Col span="11">
                        <FormItem label="资产名称" prop="name" required>
                            <Input v-model="editForm.name"></Input>
                        </FormItem>
                    </Col>
                    <Col span="11">
                        <FormItem label="资产编码" prop="code" required>
                            <Input v-model="editForm.code" :disabled="opt"></Input>
                        </FormItem>
                    </Col>
                    <Col span="11">
                        <FormItem label="购入日期" prop="purchaseDt">
                            <DatePicker v-model="editForm.purchaseDt" type="date" style="width: 100%"></DatePicker>
                        </FormItem>
                    </Col>
                    <Col span="11">
                        <FormItem label="单价" prop="price" >
                            <InputNumber  v-model="editForm.price":max="9999999" :min="1" :step="100.99" style="width: 100%"></InputNumber>
                        </FormItem>
                    </Col>
                    <Col span="11">
                        <FormItem label="使用者名称" prop="staffName">
                            <j-staff v-model="editForm.staffName" @on-select="getStaff"></j-staff>
                        </FormItem>
                    </Col>
                    <Col span="22">
                        <FormItem label="备注" prop="remark">
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
                    purchaseDt: '',
                    price: 0.00,
                    staffCode: '',
                    staffName: '',
                    remark: ''
                },
                editRules: {
                    code: [
                        { required: true, message: '必填项', trigger: 'blur'},
                        { validator: (rule, value, callback) => {
                                if(!this.opt){
                                    this.$net.send({
                                        server: this.$services.demoService.suppliersRestController.check,
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
            getStaff(val) {
                if (val)
                {
                    this.editForm.staffCode = val.staffCode;
                    this.editForm.staffName = val.staffName;
                }
                else
                {
                    this.editForm.staffCode = '';
                    this.editForm.staffName = '';
                }
            },
            /*保存*/
            btnSave(name) {
                this.$refs[name].validate((valid) => { // 数据校验
                    if (!valid) {
                        return
                    }

                    this.$net.send({
                        server: this.$services.demoService.suppliersRestController.save,
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
                this.$store.commit('removeTag', 'suppliersEdit');
                this.$store.commit('closePage', 'suppliersEdit');
            }
        }
    }
</script>
