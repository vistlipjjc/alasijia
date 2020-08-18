<template>
    <Card>
        <p slot="title">业务种类表配置</p>
        <Row>
            <Col span="5">
                <j-tree ref="bizTypeTreeRef" editable
                        :formItem="formItem"
                        :query-server="queryServer"
                        :remove-server="removeServer"
                        @on-select-node="selectNode"></j-tree>
            </Col>
            <Col span="12">
                <Card>
                    <Row style="height: 480px;">
                        <Form ref="editForm" :model="editForm" :label-width="130">
                            <FormItem label="父菜单编码" prop="parentId">
                                <Input disabled v-model="editForm.parentId"></Input>
                            </FormItem>
                            <FormItem label="父菜单名称" prop="parentName">
                                <Input disabled v-model="editForm.parentName"></Input>
                            </FormItem>
                            <FormItem label="业务种类编码" prop="bizTypeCode">
                                <Input v-model="editForm.bizTypeCode"></Input>
                            </FormItem>
                            <FormItem label="业务种类名称" prop="bizTypeName">
                                <Input v-model="editForm.bizTypeName"></Input>
                            </FormItem>
                            <FormItem label="状态" prop="status">
                                <j-select v-model="editForm.status" url="fixedDict:RoleStatus@system"
                                         ref="status" @on-change="onChange">
                                </j-select>
                            </FormItem>
                            <FormItem label="备注" prop="remark">
                                <Input v-model="editForm.remark" type="textarea"></Input>
                            </FormItem>
                            <FormItem >
                                <Button @click="btnSave('editForm')" type="primary" style="margin:0 120px;">保存</Button>
                            </FormItem>
                        </Form>
                    </Row>
                </Card>
            </Col>
        </Row>
    </Card>
</template>

<script>
    export default {
        name: "bizTypeTree",
        data () {
            return {
                queryServer: this.$services.sysService.bizTypeRestController.treeNode,
                removeServer: this.$services.sysService.bizTypeRestController.remove,
                treeNode: [],
                formItem: {
                    parentId:'',
                    parentName: '',
                    bizTypeCode: '',
                    bizTypeName: '',
                    status: '',
                    remark: ''
                },
                editForm: {
                    parentId:'',
                    parentName: '',
                    bizTypeCode: '',
                    bizTypeName: '',
                    status: '',
                    remark: ''
                }
            }
        },
        mounted (){
            this.init()
        },
        methods: {
            init(){
                // let _this = this;
                //
                // _this.$net.send({
                //     server: _this.$services.sysService.bizTypeRestController.load
                // }).then(
                //     (data)=>{
                //         _this.treeNode = data;
                //     });
            },
            onChange(val){
                this.editForm.status = val;
            },
            selectNode (treeNode) {
                // console.log(treeNode);
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

                    if (this.editForm.bizTypeCode == this.editForm.parentId) {
                        this.$Message.warning("业务种类编码不能与父编码相同，请重新填写！")
                        return
                    }

                    //保存
                    this.$net.send({
                        server: this.$services.sysService.bizTypeRestController.updateNode,
                        data: this.editForm
                    }).then((data) => {
                        if (data.success) {
                            this.$Message.success(data.msg);
                            this.$refs.bizTypeTreeRef.refresh();
                        } else {
                            this.$Message.error(data.msg);
                        }
                    });
                });
            }
        }
    }
</script>

<style scoped>

</style>