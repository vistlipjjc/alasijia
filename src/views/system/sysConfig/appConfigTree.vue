<template>
    <Card>
        <p slot="title">应用级别配置</p>
        <Row style="height: 300px;">
            <Col span="4">
                <j-tree ref="appConfigRef" :data="treeNode" editable
                        :formItem="formItem"
                        :query-server="queryServer"
                        :remove-server="removeServer"
                        @on-select-node="getNode"></j-tree>
            </Col>
            <Col span="19">
                <Card>
                    <Row>
                        <Form ref="editForm" :model="editForm" :rules="editRules" :label-width="180">
                            <Col span="11">
                                <FormItem label="所属分类" prop="parentName">
                                    <Input v-model="editForm.parentName" readonly></Input>
                                </FormItem>
                            </Col>
                            <Col span="11">
                                <FormItem label="配置名称" prop="configName" required>
                                    <Input v-model="editForm.configName"></Input>
                                </FormItem>
                            </Col>
                            <Col span="11">
                                <FormItem label="配置键" prop="configCode">
                                    <Input v-model="editForm.configCode"></Input>
                                </FormItem>
                            </Col>
                            <Col span="11">
                                <FormItem label="配置值" prop="configValue" required>
                                    <Input v-model="editForm.configValue"></Input>
                                </FormItem>
                            </Col>
                            <Col span="22">
                                <FormItem label="描述" prop="configDesc">
                                    <Input v-model="editForm.configDesc" type="textarea"></Input>
                                </FormItem>
                            </Col>
                            <Col>
                            </Col>
                            <Col span="22">
                                <div align="center">
                                    <Button @click="btnSave('editForm')" type="primary" style="margin:0 11px;">保存</Button>
                                </div>
                            </Col>
                        </Form>
                    </Row>
                </Card>
            </Col>
        </Row>
    </Card>

</template>
<script>
    export default {
        name: 'appConfigRef',
        data () {
            return {
                queryServer: this.$services.sysService.appConfigRestController.load,
                removeServer: this.$services.sysService.appConfigRestController.removeNode,
                treeNode: [],
                formItem: {
                    parentName: '',
                    configName: '',
                    configCode: '',
                    configValue: '',
                    configDesc: ''
                },
                editForm: {},
                editRules: {
                    configName: [
                        {required: true, message: '必填项', trigger: 'blur'}
                    ],
                    configCode: [
                        {required: true, message: '必填项', trigger: 'blur'},
                        {required: true, pattern:/^[a-zA-Z_]{1}[a-zA-Z\d_]*/, message:'请输入正确的配置键', trigger:'blur'}
                    ],
                    configValue: [
                        {required: true, message: '必填项', trigger: 'blur'},
                        { pattern:/^[^\s]+$/, message:'输入长度大于1,且不能为空格', trigger:'blur'}
                    ],
                }
            }
        },
        mounted () {
            this.init();
        },
        methods: {
            init(){
                // let _this = this;
                // _this.$net.send({
                //     server: _this.$services.sysService.appConfigRestController.load
                // }).then(
                //     (data)=>{
                //         _this.treeNode = data;
                //     });
            },
            getNode(treeNode){
                if (treeNode.length == 0)  //取消选择节点，将表单设为默认值
                {
                    this.editForm = this.formItem;
                }
                else  //选择某一个节点时，将节点数据加载到表单
                {
                    this.editForm = treeNode[0];
                }
            },
            /*保存*/
            btnSave(name) {
                this.$refs[name].validate((valid) => { // 数据校验
                    if (!valid) {
                        return
                    }

                    //保存
                    this.$net.send({
                        server: this.$services.sysService.appConfigRestController.updateNode,
                        data: this.editForm
                    }).then((data) => {
                        if (data.success) {
                            this.$Message.success(data.msg);
                            this.$refs.appConfigRef.refresh();
                        } else {
                            this.$Message.error(data.msg);
                        }
                    });

                });
            }
        }
    }
</script>
