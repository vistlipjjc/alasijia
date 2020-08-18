<template>
    <div class="roleEditCtnr">
        <Card>
            <p slot="title">{{ title }}</p>
            <Row>
                <Form ref="editForm" :model="editForm" :rules="editRules" :label-width="180">
                    <!-- <Col span="13" offset="5">
                        <FormItem label="机构层级" prop="hierarchy">
                            <j-select v-model="editForm.hierarchy" url="fixedDict:UnitHierarchy@system"
                                      ref="hierarchy" @on-change="selectChange($event, 'hierarchy')">
                            </j-select>
                        </FormItem>
                    </Col>
                    <Col span="13" offset="5">
                        <FormItem label="角色类型" prop="roleStdCode">
                            <j-select v-model="editForm.roleStdCode" url="custom:roleStd/queryAll@system"
                                      ref="roleStdCode" @on-change="selectChange($event, 'roleStdCode')">
                            </j-select>
                        </FormItem>
                    </Col>
                    <Col span="13" offset="5">
                        <FormItem label="角色组" prop="roleGroupCode">
                            <j-select v-model="editForm.roleGroupCode" url="custom:roleGroup/queryAll@system" multiple
                                      ref="roleGroupCode" @on-change="selectChange($event, 'roleGroupCode')">
                            </j-select>
                        </FormItem>
                    </Col> -->
                    <Col span="13" offset="5">
                        <FormItem label="角色编码" prop="roleCode">
                            <Input v-model="editForm.roleCode" :disabled="true"></Input>
                        </FormItem>
                    </Col>
                    <Col span="13" offset="5">
                        <FormItem label="角色名称" prop="roleName" required>
                            <Input v-model="editForm.roleName" clearable :maxlength="30" :disabled="opt"></Input>
                        </FormItem>
                    </Col>
                    <Col span="13" offset="5">
                        <FormItem label="角色描述" prop="roleDesc">
                            <Input v-model="editForm.roleDesc" type="textarea" clearable :maxlength="100" :rows="3" :disabled="opt"></Input>
                        </FormItem>
                    </Col>
                    <Col span="13" offset="5">
                    <FormItem label="状态" prop="status">
                        <j-radio v-model="editForm.status"
                                 url="fixedDict:RoleStatus@system"
                                 ref="status"
                                 :disabled="opt"
                                 @on-change="radioChange">
                        </j-radio>
                    </FormItem>
                    </Col>
                    <Col span="22">
                        <div align="center">
                            <Button v-if="!opt" @click="btnSave('editForm')" type="primary" style="margin:0 11px; height: 40px; width: 100px;">保存</Button>
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
    data(){
      return {
        opt: false,
        title: this.$route.params.opt === 'add' ? '新增角色' : '修改角色信息',
        editForm: {
          hierarchy: '30',
          roleStdCode: '',
          roleGroupCode: '',
          roleName: '',
          roleCode: '',
          status:'',
          roleDesc:''
        },
        editRules: {
          /* roleCode: [
              {validator: (rule, value, callback) => {
                      if(!this.opt){
                          this.$net.send({
                              server: this.$services.sysService.roleRestController.check,
                              data: {roleCode: value}
                          }).then((data) => {
                              if (!data.valid) {
                                  callback(new Error('该编码已被占用'));
                              }else{
                                  callback();
                              }
                          });
                      }else{
                          callback();
                      }
                  }
              }
          ], */
          roleName: [
            {required: true, message: '必填项', trigger: 'blur'}
          ]
        },
        roleCodeFirst: '30',
        roleCodeSecond: '',
        roleNameFirst: '总行',
        roleNameSecond: '',
      }
    },

    mounted() {
      this.init();
    },

    methods: {
      init() {
        let vm = this
        if (this.$route.params.opt !== 'add') {
          vm.$net.send({
            server: vm.$services.sysService.roleRestController.getRole,
            data: {roleCode: vm.$route.query.roleCode}
          }).then(data =>{
            if (data.success) {
              vm.editForm = data.data
            }
            console.log(data)
            // vm.editForm = data.data
          })
        }
      },

      selectChange(value, name){
        this.editForm[name] = value;

        /* if(name == 'hierarchy')
        {
            let obj = this.$refs[name].getSelect();
            console.log(obj);
            this.roleCodeFirst = value;
            this.roleNameFirst = obj.name;
            this.editForm.roleCode = this.roleCodeFirst + this.roleCodeSecond;
            this.editForm.roleName = this.roleNameFirst + this.roleNameSecond;
        }
        else */ if(name == 'roleStdCode')
        {
          let obj = this.$refs[name].getSelect();
          this.roleCodeSecond = value;
          this.roleNameSecond = obj.name;
          this.editForm.roleCode = '30' + this.roleCodeSecond;
          this.editForm.roleName = this.roleNameSecond;
        }
      },

      radioChange(value){
        this.editForm.status = value;
      },

      /*保存*/
      btnSave(name) {
        this.$refs[name].validate((valid) => { // 数据校验
          if (!valid) {
            return
          }

          this.$net.send({
            server: this.$services.sysService.roleRestController.save,
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
        this.$store.commit('removeTag', 'roleEdit');
        this.$store.commit('closePage', 'roleEdit');
      }
    }
  }
</script>