<template>
    <Layout class="layout">
        <Sider>
            <j-tree ref="bizModuleTree" :data="bizModuleData" editable
                    :formItem="formItem"
                    :query-server="queryServer"
                    :remove-server="removeServer"
                    @on-select-node="selectNode">
            </j-tree>
        </Sider>
        <Content>
            <Card style="margin-left: 5%">
                <Row>
                    <Form ref="editForm" :model="editForm"  :rules="editRules"  :label-width="180">
                        <Col span="11">
                            <FormItem label="父编码" prop="parentId">
                                <Input v-model="editForm.parentId" disabled/>
                            </FormItem>
                        </Col>
                        <Col span="11">
                            <FormItem label="父名称" prop="parentName">
                                <Input v-model="editForm.parentName" disabled/>
                            </FormItem>
                        </Col>
                        <Col span="11">
                            <FormItem label="编码" prop="code" required>
                                <Input v-model="editForm.code" ref="code"></Input>
                            </FormItem>
                        </Col>
                        <Col span="11">
                            <FormItem label="名称" prop="name" required>
                                <Input v-model="editForm.name"></Input>
                            </FormItem>
                        </Col>
                        <Col span="11">
                            <FormItem label="备注" prop="remark">
                                <Input v-model="editForm.remark" type="textarea"></Input>
                            </FormItem>
                        </Col>
                        <Col span="22">
                        <div align="center">
                            <Button @click="btnSave('editForm')" type="primary">保存</Button>
                        </div>
                        </Col>
                    </Form>
                </Row>
            </Card>
        </Content>
    </Layout>
</template>

<script>
    export default {
        name: "bizModuleTree",
        data () {
            return {
                queryServer: this.$services.wfService.bizModuleRestController.treeNode,
                removeServer: this.$services.wfService.bizModuleRestController.removeNode,
                bizModuleData: [],
                formItem: {
                    parentId: '',
                    parentName: '',
                    code: '',
                    name: '',
                    remark: '',
                },
                editForm: {
                },
                editRules: {
                    code: [
                        { required: true, message: '必填项', trigger: 'blur'},
                        { type: 'string', max: 64, message: '长度不能超过64个字符', trigger: 'blur' },
                        { validator: (rule, value, callback) => {
                            if(this.editForm.id == -1){
                                this.$net.send({
                                    server: this.$services.wfService.bizModuleRestController.check,
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
                        {required: true, message: '必填项', trigger: 'blur'},
                        { type: 'string', max: 64, message: '长度不能超过64个字符', trigger: 'blur' }
                    ],
                }
            }
        },
        mounted (){
            this.init()
        },
        methods:{
            init(){

            },
            selectNode (treeNode) {
               // this.editForm = {};
                if (treeNode.length == 0)  //取消选择节点，将表单设为默认值
                {
                    this.editForm = this.formItem;
                }
                else  //选择某一个节点时，将节点数据加载到表单
                {
                    this.editForm = treeNode[0]
                }
                this.editForm.id = treeNode[0].id
                this.$refs.code.disabled = treeNode[0].id != -1;

            },
            /*保存*/
            btnSave(name){
                this.$refs[name].validate((valid) => { // 数据校验
                    if (!valid) {
                        return
                    }
                    this.$net.send({
                        server: this.$services.wfService.bizModuleRestController.updateNode,
                        data: this.editForm
                    }).then((data) => {
                        if (data.success) {
                            this.$Message.success({duration: 5, content: data.msg});
                            this.$refs.bizModuleTree.refresh();
                        } else {
                            this.$Message.error({duration: 5, content: data.msg});
                        }
                    });
                });
            }
        }
    }
</script>

<style scoped>
    .layout{
        background-color: #fff;
        padding: 10px;
    }
    .ivu-layout-sider{
        background-color: #fff;
    }
    .help-text{
        top: 100%;
        left: 0;
        line-height: 1;
        padding-top: 6px;
        color: #f30;
    }
</style>

