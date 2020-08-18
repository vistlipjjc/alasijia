<template>
    <Layout class="layout">
        <Sider>
            <j-tree ref="menuTreeRef" :data="menuData" editable
                    :formItem="formItem"
                    :query-server="queryServer"
                    :remove-server="removeServer"
                    @on-select-node="selectNode">
            </j-tree>
        </Sider>
        <Content>
            <Card style="margin-left: 5%">
                <Row>
                    <Form ref="editForm" :model="editForm" :rules="editRules" :label-width="180">
                        <Col span="11">
                            <FormItem label="父菜单名称" prop="parentName">
                                <Input v-model="editForm.parentName" disabled/>
                            </FormItem>
                        </Col>
                        <Col span="11">
                            <FormItem label="父菜单编码" prop="parentId">
                                <Input v-model="editForm.parentId" disabled/>
                            </FormItem>
                        </Col>
                        <Col span="11">
                            <FormItem label="菜单名称" prop="menuName" required>
                                <Input v-model="editForm.menuName"></Input>
                            </FormItem>
                        </Col>
                        <Col span="11">
                            <FormItem label="菜单编码" prop="moduleCode" required>
                                <Input  v-model="editForm.moduleCode" :readonly="isDisabled"></Input>
                            </FormItem>
                        </Col>

                        <Col span="11">
                            <FormItem label="菜单级别" prop="menuLevel">
                                <j-select v-model="editForm.menuLevel" url="fixedDict:MenuLevel@system" @on-change="selectChange($event, 'menuLevel')"></j-select>
                            </FormItem>
                        </Col>
                        <Col span="11">
                            <FormItem label="菜单图标" prop="menuImage">
                                <Input v-model="editForm.menuImage" :icon="editForm.menuImage"></Input>
                            </FormItem>
                        </Col>

                        <Col span="11">
                            <FormItem label="是否可见" prop="visibled">
                                <Checkbox v-model="editForm.visibled" true-value="Y" false-value="N"></Checkbox>
                            </FormItem>
                        </Col>
                        <Col span="11">
                            <FormItem label="显示序号" prop="displayOrder">
                                <InputNumber v-model="editForm.displayOrder" :min="1" :max="9999" style="width: 100%;"></InputNumber>
                            </FormItem>
                        </Col>
                        <Col span="11">
                            <FormItem label="是否有效" prop="enabled">
                                <Checkbox v-model="editForm.enabled" true-value="Y" false-value="N"></Checkbox>
                            </FormItem>
                        </Col>
                        <Col span="11">
                            <FormItem label="公共模块" prop="publicMenu">
                                <Checkbox v-model="editForm.publicMenu" true-value="Y" false-value="N"></Checkbox>
                            </FormItem>
                        </Col>
                        <Col span="22">
                            <FormItem label="菜单页面路径" prop="menuTarget" required>
                                <Input v-model="editForm.menuTarget"></Input>
                                <div class="help-text">注意：一级菜单：‘Main’；二级菜单：‘middleware/routerTransfer’。</div>
                            </FormItem>
                        </Col>
                        <Col span="22">
                            <FormItem label="备注" prop="tips">
                                <Input v-model="editForm.tips" type="textarea"></Input>
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
        name: "menuTree",
        data () {
            return {
                queryServer: this.$services.sysService.menuRestController.load,
                removeServer: this.$services.sysService.menuRestController.remove,
                menuData: [],
                isDisabled:true,
                formItem: {
                    parentId: '',
                    parentName: '',
                    moduleCode: '',
                    menuName: '',
                    menuLevel: 'ADM',
                    menuImage: 'ionic',
                    displayOrder: 10,
                    publicMenu: 'Y',
                    enabled: 'Y',
                    visibled: 'Y',
                    menuTarget: '',
                    tips: '',
                    staff: ''
                },
                editForm: {},
                editRules: {
                    moduleCode: [
                        { required: true, message: '必填项', trigger: 'blur'},
                        { validator: (rule, value, callback) => {
                                if(!this.opt){
                                    this.$net.send({
                                        server: this.$services.sysService.roleStdRestController.check,
                                        data: {roleStdCode: value}
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
                    menuName: [
                        {required: true, message: '必填项', trigger: 'blur'}
                    ],
                    menuTarget: [
                        {required: true, message: '必填项', trigger: 'blur'}
                    ]
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
                this.editForm={};
                this.isDisabled=true;
                if (treeNode.length == 0)  //取消选择节点，将表单设为默认值
                {
                    this.editForm = this.formItem;
                }
                else  //选择某一个节点时，将节点数据加载到表单
                {
                    this.editForm = treeNode[0];
                    if(this.editForm.moduleCode.length==0){
                        this.isDisabled=false;
                    }else {
                        this.isDisabled=true;
                    }
                }
            },
            /*改变下拉框选中值*/
            selectChange(value, name){
                this.editForm[name] = value;
            },
            /*保存*/
            btnSave(name){
                this.$refs[name].validate((valid) => { // 数据校验
                    if (!valid) {
                        return
                    }
                    this.$net.send({
                        server: this.$services.sysService.menuRestController.save,
                        data: this.editForm
                    }).then((data) => {
                        if (data.success) {
                            this.$Message.success({duration: 5, content: data.msg});
                            this.editForm. moduleCode='';
                            this.editForm. menuName='';
                            this.editForm. tips='';
                            this.editForm. menuTarget='';
                            this.$refs.menuTreeRef.refresh();
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

