<template>
    <div class="roleGroupEditCtnr">
        <Card>
            <p slot="title">编辑角色组</p>
            <Row>
                <Form ref="editForm" :model="editForm" :rules="editRules" :label-width="180">
                    <Col span="13" offset="5">
                        <FormItem label="机构层级" prop="hierarchy">
                            <j-select v-model="editForm.hierarchy" url="fixedDict:UnitHierarchy@system"
                                      ref="hierarchy" @on-change="selectChange($event, 'hierarchy')">
                            </j-select>
                        </FormItem>
                    </Col>
                    <Col span="13" offset="5">
                        <FormItem label="角色组编码" prop="roleGroupCode">
                            <Input v-model="editForm.roleGroupCode"></Input>
                        </FormItem>
                    </Col>
                    <Col span="13" offset="5">
                        <FormItem label="角色组名称" prop="roleGroupName">
                            <Input v-model="editForm.roleGroupName"></Input>
                        </FormItem>
                    </Col>
                    <Col span="13" offset="5">
                        <FormItem label="角色组描述" prop="roleGroupDesc">
                            <Input v-model="editForm.roleGroupDesc" type="textarea"></Input>
                        </FormItem>
                    </Col>
                    <Col span="22">
                        <div align="center">
                            <Button @click="btnSave('editForm')" type="primary">保存</Button>
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
        data(){
            return {
                opt: false,
                editForm: {
                    hierarchy: '',
                    roleGroupCode: '',
                    roleGroupName: '',
                    roleGroupDesc: ''
                },
                editRules: {
                    roleGroupCode: [
                        { required: true, message: '必填项', trigger: 'blur'},
                        { type:'string', pattern:/^[\w\s]+$/, message:'请输入正确的编码', trigger:'blur' },
                        { validator: (rule, value, callback) => {
                                if(!this.opt){
                                    this.$net.send({
                                        server: this.$services.sysService.roleGroupRestController.check,
                                        data: {roleGroupCode: value}
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
                            }
                        }
                    ],
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
            selectChange(value, name){
                this.editForm[name] = value;
            },
            /*保存*/
            btnSave(name) {
                this.$refs[name].validate((valid) => { // 数据校验
                    if (!valid) {
                        return
                    }

                    this.$net.send({
                        server: this.$services.sysService.roleGroupRestController.save,
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
            btnBack(){
                this.$router.go(-1);
                this.$store.commit('removeTag', 'roleGroupEdit');
                this.$store.commit('closePage', 'roleGroupEdit');
            }
        }
    }
</script>

<style scoped>

</style>