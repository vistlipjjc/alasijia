<template>
    <div class="rulePackagesEditCtnr">
        <Card>
            <Row>
                <Form ref="editForm" :model="editForm" :rules="editRules" :label-width="180">
                    <Col span="11">
                        <FormItem label="英文名称" prop="code" required>
                            <Input v-model="editForm.code" :disabled="opt"></Input>
                        </FormItem>
                    </Col>
                    <Col span="11">
                        <FormItem label="中文名称" prop="name" required>
                            <Input v-model="editForm.name"></Input>
                        </FormItem>
                    </Col>
                    <Col span="11">
                        <FormItem label="是否评分" prop="dataType">
                            <j-select v-model="editForm.type" url="fixedDict:YesNo@system"
                                      ref="type" @on-change="selectChange($event, 'type')">
                            </j-select>
                        </FormItem>
                    </Col>
                    <Col span="11">
                        <FormItem label="评分模型" prop="inOut">
                            <j-select v-model="editForm.scoreModel" url="custom:scoreModel/queryAll@system"
                                      ref="scoreModel" @on-change="selectChange($event, 'scoreModel')">
                            </j-select>
                        </FormItem>
                    </Col>
                    <Col span="11">
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
                    remark: '',
                    scoreModel:'',
                    type:''
                },
                editRules: {
                    code: [
                        { required: true, message: '必填项', trigger: 'blur'}
                    ],
                    name: [
                        {required: true, message: '必填项', trigger: 'blur'}
                    ]
                },
                paramData: [],
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
                        server: this.$services.ruleService.packagesRestController.save,
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
                this.$store.commit('removeTag', 'packagesEdit');
                this.$store.commit('closePage', 'packagesEdit');
            },

            selectChange(value, name){
                this.editForm[name] = value;
            }
        }
    }
</script>
