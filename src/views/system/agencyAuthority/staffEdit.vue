<template>
    <div class="staffEditCtnr">
        <Card>
            <Row>
                <Form ref="editForm" :model="editForm" :rules="editRules" :label-width="180">
                    <Col span="11">
                        <FormItem label="用户账号" prop="staffCode" required>
                            <Input v-model="editForm.staffCode"  :disabled="opt"></Input>
                        </FormItem>
                    </Col>
                    <Col span="11">
                        <FormItem label="用户名称" prop="staffName" required>
                            <Input v-model="editForm.staffName"></Input>
                        </FormItem>
                    </Col>
                    <Col span="11">
                        <FormItem label="性别" prop="gender" required>
                            <j-radio v-model="editForm.gender" url="fixedDict:Gender@system"
                                     @on-change="selectChange($event,'gender')">
                            </j-radio>
                        </FormItem>
                    </Col>
                    <Col span="11">
                        <FormItem label="出生日期" prop="birthday" >
                            <Date-picker v-model="editForm.birthdayString" type="date" placement="bottom-end" placeholder="选择日期" style="width: 200px"></Date-picker>
                        </FormItem>
                    </Col>

                    <!--<Col span="11">
                    <FormItem label="身份证号码" prop="idCard" required>
                        <Input v-model="editForm.idCard"></Input>
                    </FormItem>
                    </Col>-->

                    <Col span="11">
                        <FormItem label="所在用户组" prop="staffGroupCode" style="display: none">
                            <j-select v-model="editForm.staffGroupCode" :value="editForm.staffGroupCode" url="custom:staffGroup/queryAll@system" multiple
                                      ref="staffGroupCode" @on-change="selectChange($event, 'staffGroupCode')" >
                            </j-select>
                        </FormItem>
                    </Col>
                    <Col span="11">
                    <FormItem label="设定角色组" prop="roleGroupCode"  style="display: none">
                        <j-select v-model="editForm.roleGroupCode"
                                  url="custom:roleGroup/queryAll@system"
                                  multiple
                                  ref="roleGroupCode" @on-change="selectChange($event, 'roleGroupCode')">
                        </j-select>
                    </FormItem>
                    </Col>
                    <Col span="11">
                    <FormItem label="设定角色" prop="roleCode" required>
                        <j-select v-model="editForm.roleCode"
                                  :optionList="optionRole"
                                  multiple
                                  ref="roleCode"
                                  @on-change="selectChange($event, 'roleCode')">
                        </j-select>
                    </FormItem>
                    </Col>
                    <Col span="11">
                        <FormItem label="移动电话" prop="mobile">
                            <Input v-model="editForm.mobile" ></Input>
                        </FormItem>
                    </Col>
                    <Col span="11">
                    <FormItem label="邮件" prop="email">
                        <Input v-model="editForm.email" ></Input>
                    </FormItem>
                    </Col>
                    <Col span="11">
                        <FormItem label="状态" prop="status">
                            <j-radio v-model="editForm.status"
                                     url="fixedDict:StaffStatus@system"
                                     @on-change="selectChange($event,'status')">
                            </j-radio>
                        </FormItem>
                    </Col>
                    <Col span="11">
                    <!-- <FormItem label="用户类型" prop="staffType">
                        <j-radio v-model="editForm.staffType" url="fixedDict:StaffType1@system"
                                 @on-change="selectChange($event,'staffType')">
                        </j-radio>
                    </FormItem> -->
                    </Col>
                    <Col span="22">
                    <FormItem label="地址" prop="address">
                        <Input v-model="editForm.address" type="textarea"></Input>
                    </FormItem>
                    </Col>
                    <Col span="22">
                        <div align="center">
                            <Button @click="btnSave('editForm')" type="primary" style="margin:0 11px; height: 40px; width: 100px;">保存</Button>
                            <Button type="ghost" @click="btnBack" style="margin:0 11px; height: 40px; width: 100px;">返回</Button>
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
        dataTrees: [],
        opt: false,
        optionRole:[],  // 角色下拉选择数据
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
          roleGroupName: '',
          staffType: '',
          mobile: '',
          staffGroup: '',
          staffGroupName:'',
          unitCode: '',
          unitName: ''/*,
                    idCard: ''*/
        },
        editRules: {
          staffCode: [
            { required: true, message: '必填项', trigger: 'blur'},
            { validator: (rule, value, callback) => {
              if(!this.opt){
                this.$net.send({
                  server: this.$services.sysService.staffRestController.check,
                  data: {staffCode: value}
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
            }},
            { type: 'string', max: 64, message: '长度不能超过64个字符', trigger: 'blur' }
          ],
          staffName: [
            {required: true, message: '必填项', trigger: 'blur'},
            { type: 'string', max: 128, message: '长度不能超过128个字符', trigger: 'blur' }

          ],
          deptName: [
            {required: true, message: '必填项', trigger: 'blur'},
            { type: 'string', max: 128, message: '长度不能超过128个字符', trigger: 'blur' }

          ],
          email: [
            { type: 'string', max: 128, message: '长度不能超过128个字符', trigger: 'blur' },
            { type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
          ],
          roleCode: [
            { required: true, message: '必填项', trigger: 'blur' }
          ],
          mobile: [
            { type: 'string', max: 64, message: '长度不能超过64个字符', trigger: 'blur' },
            { type: 'number', message: '请输入数字格式', trigger: 'blur', transform: function (value) {
              return Number(value);
            }}
          ],
          address: [
            { type: 'string', max: 256, message: '长度不能超过256个字符', trigger: 'blur' }
          ],
          idCard: [
            {required: true, message: '请输入18位的身份证号码', trigger: 'blur'},
            { validator:
              (rule, value, callback) => {
                let idCardRegx = /^[a-zA-Z0-9]{18}$/
                if (value && !idCardRegx.test(value)) {
                  callback(new Error('请输入18位的身份证号码'))
                } else {
                  callback()
                }
              }
            }
          ],

        },
        paramData: [],
        column: [
          { type: 'index', align: 'center', width: 50 },
          { title: '用户账号', align: 'center', key: 'staffCode' },
          { title: '用户名称', align: 'center', key: 'staffName' },
          { title: '关联的角色', align: 'center', key: 'roleName' },
          { title: '所在用户组', align: 'center', key: 'staffGroupName' },
          { title: '移动电话', align: 'center', key: 'mobile' },
          { title: '状态', align: 'center', key: 'status' },
          { title: '借调', align: 'center', key: 'isProxy' },
          { title: '操作', align: 'center', key: 'handler', width: 120, handler: ['delete']},
        ],
        selectionParam: []
      }
    },

    mounted() {
      this.init();
    },

    methods: {
      init() {
        let vm = this
        // 角色的下拉选择
        vm.$net.send({
          server: vm.$services.sysService.roleRestController.queryAll,
          data: {status: 'ENABLE', hierarchy: '30'}
        }).then(
          (data)=>{
            vm.optionRole = data
            // console.log('optionRole', data)
          })

        if (vm.$route.params.opt === 'edit') {
          vm.opt = true;
          vm.$net.send({
            server: vm.$services.sysService.staffRestController.getStaffDetail,
            data: {staffCode: this.$route.query.staffCode}
          }).then(
            (data)=>{
              if (data.success) {
                vm.editForm = data.data.staff
                vm.editForm.roleCode = data.data.JS.join(',')
              }
              // console.log(data)
            });
        }else{
          this.editForm.deptName=this.$route.query.unitName;
          this.editForm.deptCode=this.$route.query.unitCode;
          this.editForm.unitName=this.$route.query.unitName;
          this.editForm.unitCode=this.$route.query.unitCode;
        }

        /*this.$net.send({
          server:this.$services.sysService.unitRestController.load
        }).then(
          (data)=>{
            this.dataTrees = data
          });*/
      },

      /*保存*/
      btnSave(staffName) {
        this.$refs[staffName].validate((valid) => { // 数据校验
          if (!valid) {
            return
          }
          console.log(this.editForm);
          this.$net.send({
            server: this.$services.sysService.staffRestController.save,
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
        this.$store.commit('removeTag', 'staffEdit');
        this.$store.commit('closePage', 'staffEdit');
      },
      selectChange(value, name){
        let arrValue;
        if(value instanceof Array){
          arrValue=value.join(',');
          this.editForm[name] = arrValue;

        }else{
          this.editForm[name] = value;
        }
      },
      clickNode(data){
        this.dept = data[0];
        this.editForm.deptName=this.dept.title;
        this.editForm.deptCode=this.dept.id;
      },
      ok(){
        this.$net.send({
          server: this.$services.sysService.unitRestController.isOrg,
          append: this.editForm.deptCode
        }).then(
          (data) => {
            if(data.valid){
              this.$Message.error('请选择具体的部门');
              this.editForm.deptName = "";
            }
          });
      }
    }
  }
</script>