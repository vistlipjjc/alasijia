<template>
    <Card>
        <p slot="title">字典类别配置</p>
        <Row style="height: 390px;">
            <Col span="4">
                <j-tree ref="dictCateRef" :data="treeNode" editable
                        :formItem="formItem"
                        :query-server="queryServer"
                        :remove-server="removeServer"
                        @on-select-node="getNode">
                </j-tree>
            </Col>
            <Col span="12">
                <Row>
                    <Form ref="editForm" :model="editForm" :rules="editRules" :label-width="130">
                        <FormItem label="父菜单编码" prop="parentId">
                            <Input v-model="editForm.parentId" readonly></Input>
                        </FormItem>
                        <FormItem label="父菜单名称" prop="parentName">
                            <Input v-model="editForm.parentName" readonly></Input>
                        </FormItem>
                        <FormItem label="类别编码" prop="dictCateCode" required>
                            <Input v-model="editForm.dictCateCode"></Input>
                        </FormItem>
                        <FormItem label="类别名称" prop="dictCateName" required>
                            <Input v-model="editForm.dictCateName"></Input>
                        </FormItem>
                        <FormItem label="类别描述" prop="dictCateDesc">
                            <Input v-model="editForm.dictCateDesc" type="textarea"></Input>
                        </FormItem>
                        <FormItem >
                            <Button @click="btnSave('editForm')" type="primary" style="margin:0 170px;">保存</Button>
                        </FormItem>
                    </Form>
                </Row>
            </Col>
        </Row>
    </Card>
</template>

<script>
    export default {
        name: 'dictCateTree',
        data () {
            return {
                queryServer: this.$services.sysService.dictCateRestController.treeNode,
                removeServer: this.$services.sysService.dictCateRestController.remove,
                treeNode: [],
                formItem:{
                    parentId:'',
                    parentName: '',
                    dictCateCode: '',
                    dictCateName: '',
                    dictCateDesc: ''
                },
                editForm: {},
                editRules: {
                    dictCateCode: [
                        {required: true, message: '必填项', trigger: 'blur'},
                        {type:'string', pattern:/^[a-zA-Z_]{1}[a-zA-Z\d_]*/, message:'请输入正确的编码', trigger:'blur'}
                    ],
                    dictCateName: [
                        {required: true, message: '必填项', trigger: 'blur'}
                    ],
                }
            }
        },
        methods: {
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
                        server: this.$services.sysService.dictCateRestController.updateNode,
                        data: this.editForm
                    }).then((data) => {
                        if (data.success) {
                            this.$Message.success(data.msg);
                            this.$refs.dictCateRef.refresh();
                        } else {
                            this.$Message.error(data.msg);
                        }
                    });
                });
            }
        }
    };
</script>
