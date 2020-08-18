<template>
    <div class="scoreModelEditCtnr">
        <Card>
            <Row>
                <Form ref="editForm" :model="editForm" :rules="editRules" :label-width="180">
                    <Col span="11">
                        <FormItem label="评分编码" prop="code" required>
                            <Input v-model="editForm.code" :disabled="opt"></Input>
                        </FormItem>
                    </Col>
                    <Col span="11">
                        <FormItem label="评分名称" prop="name" required>
                            <Input v-model="editForm.name"></Input>
                        </FormItem>
                    </Col>
                    <Col span="11">
                        <FormItem label="规则集" prop="dataType">
                            <j-select v-model="editForm.rulPkgId"
                                      ref="type" @on-change="selectChange($event, 'rulPkgId')"
                                      url="custom:packages/queryList@rule">
                            </j-select>
                        </FormItem>
                    </Col>
                    <Col span="11">
                    <FormItem label="评分算法" prop="dataType">
                        <j-select v-model="editForm.algorithm"
                                  ref="type" @on-change="selectChange($event, 'algorithm')"
                                  url="fixedDict:ScoreAlgorithmo@rule">
                        </j-select>
                    </FormItem>
                    </Col>
                    <Col span="11">
                        <FormItem label="自定义算法" prop="inOut">
                            <j-select v-model="editForm.functionId" url="custom:functions/queryList@rule"
                                      ref="functionId" @on-change="selectChange($event, 'functionId')">
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
                    rulPkgId:'',
                    algorithm:'',
                    functionId:'',
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
                        server: this.$services.ruleService.scoreModelRestController.save,
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
                this.$store.commit('removeTag', 'scoreModelEdit');
                this.$store.commit('closePage', 'scoreModelEdit');
            },

            selectChange(value, name){
                this.editForm[name] = value;
            }
        }
    }
</script>
