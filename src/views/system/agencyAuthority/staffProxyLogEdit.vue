<template>
    <div class="staffViewCtnr">
        <Card>
            <Row class="preview">
                <Modal
                        v-model="businessModal"
                        title="选择借调部门"
                >
                    <Sider style="background-color: #fff">
                        <Tree :data="dataTrees" @on-select-change="clickNode"></Tree>
                    </Sider>
                </Modal>
                <Col span="8">
                    <j-label name="用户账号" value="staffCode"></j-label>
                </Col>
                <Col span="8">
                    <j-label name="用户名称" value="staffName"></j-label>
                </Col>
                <Col span="8">
                    <j-label name="性别" value="fixedDict:Gender.gender@system"></j-label>
                </Col>
            </Row>
            <Row class="preview">
                <Col span="8">
                    <j-label name="所属部门" value="deptCode"></j-label>
                </Col>
                <Col span="8">
                    <j-label name="出生日期" value="birthdayString"></j-label>
                </Col>
                <Col span="8">
                <j-label name="所在用户组" value="staffGroupName"></j-label>
                </Col>
            </Row>
            <Row class="preview">

                <Col span="8">
                    <j-label name="邮件" value="email"></j-label>
                </Col>
                <Col span="8">
                    <j-label name="关联的角色" value="roleName"></j-label>
                </Col>
                <Col span="8">
                    <j-label name="移动电话" value="mobile"></j-label>
                </Col>
            </Row>
            <Row class="preview">
                <Col span="8">
                    <j-label name="关联的角色组" value="roleGroupCode"></j-label>
                </Col>
                <Col span="8">
                    <j-label name="状态" value="fixedDict:StaffStatus.status@system"></j-label>
                </Col>
                <Col span="8">
                    <j-label name="借调" value="fixedDict:YesNo.isProxy@system"></j-label>
                </Col>
            </Row>
            <Row class="preview">
                <Form ref="editForm" :model="editForm"  :label-width="180">
                    <Col span="10" @click.native="businessModal = true" style="display: inline-block">
                    <FormItem label="借往部门" prop="deptName" required>
                        <Input v-model="editForm.deptName" @on-change="selectChange($event, 'deptCode')">
                        <Button slot="append" icon="ios-search"></Button>
                        </Input>
                    </FormItem>
                    </Col>
                    <Col span="10">
                    <FormItem label="预计借调结束时间" prop="preEndDate" required>
                        <Date-picker :value="editForm.preEndDate" type="date" placement="bottom-end" placeholder="选择日期" style="width: 200px"></Date-picker>
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
                businessModal: false,
                dataTrees: [],
                editForm: {
                    staffName: '',
                    staffCode: '',
                    status: '',
                    gender: '',
                    deptCode: '',
                    deptName: '',
                    birthday: '',
                    birthdayString: '',
                    roleCode: '',
                    roleName: '',
                    roleGroupCode: '',
                    staffType: '',
                    mobile: '',
                    staffGroup: '',
                    preEndDate:''
                }
            }

        },
        name: "staffView",
        methods: {
            init(){
                this.editForm=this.$route.query.row;
                this.$net.send({
                    server:this.$services.sysService.unitRestController.load
                }).then(
                    (data)=>{
                        this.dataTrees = data
                    });
            },
            btnBack(){
                this.$router.go(-1);
                this.$store.commit('removeTag', 'staffView');
                this.$store.commit('closePage', 'staffView');
            },
            clickNode(data){
                this.dept = data[0];
                this.editForm.deptName=this.dept.title;
                this.editForm.deptCode=this.dept.id;
            },
            /*保存*/
            btnSave(name) {
                this.$refs[name].validate((valid) => { // 数据校验
                    if (!valid) {
                        return
                    }
                    this.$net.send({
                        server: this.$services.sysService.staffProxyLogRestController.save,
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
            selectChange(value, name){
                this.editForm[name] = value;
            }
        },
        mounted() {
            this.init();
        }

    }
</script>