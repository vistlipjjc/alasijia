<template>
    <div>
        <Card>
            <p slot="title" class="fontsize18">{{title}}</p>
            <Form ref="editForm" :model="editForm" :rules="editRules" :label-width="120">
                <Row>
                    <Col span="8">
                        <FormItem prop="managerNo" label="编号:">
                            <Input v-model.trim="editForm.managerNo" :disabled="true"></Input>
                        </FormItem>
                    </Col>
                    <Col span="8">

                        <FormItem prop="realName" label="姓名:" required>
                            <Input v-model.trim="editForm.realName" clearable :maxlength="30"></Input>
                        </FormItem>
                    </Col>
                    <Col span="8">
                        <FormItem prop="phone" label="手机号码:" required>
                            <Input v-model.trim="editForm.phone" clearable :maxlength="11"></Input>
                        </FormItem>
                    </Col>
                </Row>

                <Row>
                    <Col span="8">
                        <FormItem prop="gender" label="性别:" required>
                            <j-select ref="sex"
                                      url="dict:sex@sys"
                                      v-model="editForm.gender"
                                      @on-change="onSelect('sex','gender')"
                                      clearable
                                      style="width: 100%"
                                      placeholder="请选择性别">
                            </j-select>
                        </FormItem>
                    </Col>
                    <Col span="8">
                    <FormItem prop="agencyId" label="所属机构:" required>
                        <org-select-tree @casSelected="casSelected"
                                         :organizationJson="organizationJson"
                                         :seleted="editForm.selectOrg"
                                         :opt="opt">
                        </org-select-tree>
                    </FormItem>
                    </Col>
                    <Col span="8">
                    <FormItem prop="sts" label="状态:" required>
                        <j-select ref="userStatus"
                                  url="dict:userStatus@sys"
                                  v-model="editForm.sts"
                                  @on-change="onSelect('userStatus','sts')"
                                  clearable
                                  style="width: 100%"
                                  placeholder="请选择状态">
                        </j-select>
                    </FormItem>
                    </Col>

                </Row>

                <Row>
                    <Col span="8">
                    <FormItem prop="certificateType" label="证件类型:">
                        <j-select ref="certificateType"
                                  url="dict:certificateType@sys"
                                  v-model="editForm.certificateType"
                                  @on-change="onSelect('certificateType','certificateType')"
                                  clearable
                                  style="width: 100%;"
                                  placeholder="请选择证件类型">
                        </j-select>
                    </FormItem>
                    </Col>
                    <Col span="8">
                    <FormItem prop="certificateNo" label="证件号码:">
                        <Input v-model.trim="editForm.certificateNo" clearable :maxlength="20" @on-keyup="certificateNoChange"></Input>
                    </FormItem>
                    </Col>
                    <Col span="8">
                    <FormItem prop="bankNo" label="行内编号:">
                        <Input v-model.trim="editForm.bankNo" clearable :maxlength="8" @on-keyup="certificateNoChange"></Input>
                    </FormItem>
                    </Col>
                </Row>

                <Row>
                    <div style="text-align: center;">
                        <Button @click="btnSave('editForm', 0)" v-if="!opt && this.$route.params.opt === 'add'"  type="primary" style="margin:0 11px; height: 40px; width: 100px;">保存</Button>
                        <Button @click="btnSave('editForm', 1)" v-if="!opt && this.$route.params.opt !== 'add'"  type="primary" style="margin:0 11px; height: 40px; width: 100px;">保存</Button>
                        <Button @click="beforeBtnBack" type="ghost" style="margin:0 11px; height: 40px; width: 100px;">返回</Button>
                    </div>
                </Row>

            </Form>
        </Card>
    </div>
</template>

<script>
  import orgSelectTree from './orgSelectTree.vue'
  export default {
    components: { orgSelectTree },
    data () {
      return {
        opt: false,
        title: this.$route.params.opt === 'edit' ? '修改客户经理信息' : '新增客户经理',
        editForm: {
          managerNo: '',
          realName: '',
          phone: '',
          gender: '',
          sts: '',
          agencyId: '',
          agencyName: '',
          certificateType: '',
          certificateNo: '',
          bankNo: '',
          selectOrg: []
        },
        editRules: {
          realName: [{required: true, message: '请输入姓名', trigger: 'blur'}],
          phone: [
            {required: true, message: '请输入手机号码', trigger: 'blur'},
            { validator:
              (rule, value, callback) => {
                let phoneRegx = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[1235678]|18[0-9]|19[189])\d{8}$/
                if (!phoneRegx.test(value)) {
                  callback(new Error('手机号码格式不对，请重新输入'))
                } else {
                  callback()
                }
              }
            }
          ],
          gender: [{required: true, message: '请选择性别', trigger: 'blur'}],
          sts: [{required: true, message: '请选择状态', trigger: 'blur'}],
          agencyId: [{required: true, message: '请选择所属机构', trigger: 'blur'}],
          bankNo: [
            {message: '请输入 8 位数字的行内编号', trigger: 'blur'},
            { validator:
              (rule, value, callback) => {
                let bankNoRegx = /^\d{8}$/
                if (value && !bankNoRegx.test(value)) {
                  callback(new Error('请输入 8 位数字的行内编号'))
                } else {
                  callback()
                }
              }
            }
          ],
          certificateType: [
            {message: '请选择证件类型', trigger: 'blur'},
            { validator:
              (rule, value, callback) => {
                if (this.editForm.certificateNo && !value) {
                  callback(new Error('请选择证件类型'))
                } else {
                  callback()
                }
              }
            }
          ],
          certificateNo: [
            {message: '请输入证件号码', trigger: 'blur'},
            { validator:
              (rule, value, callback) => {
                if (this.editForm.certificateType && !value) {
                  callback(new Error('请输入证件号码'))
                } else {
                  callback()
                }
              }
            }
          ],
        },
        resData: {},

        organizationObject: {},
        organizationJson: [] // 机构树
      }
    },

    created () {
      this.getOrganization()
    },

    methods: {
      init () {
        let vm = this

        // 修改页面或查看页面的数据处理
        if (vm.$route.params.opt !== 'add') {
          vm.$net.send({
            server: vm.$services.backendService.custManagerRestController.editView,
            append: vm.$route.query.id || ''
          }).then(data =>{
            // console.log(data)
            vm.resData = data.data
            vm.resData.selectOrg = []
            vm.getParentName(vm.resData.agencyId)
            vm.editForm = vm.resData
          })
        }

      },

      // 获取下拉树
      getOrganization () {
        let vm = this
        vm.$net.send({
          server: vm.$services.backendService.organizationRestController.getOrganizationTree,
        }).then((data) => {
          if (data.success) {
            let organizationJson = JSON.stringify(data.data)
            organizationJson = organizationJson.replace(/orgNo/g, 'value').replace(/title/g, 'label')
            organizationJson = JSON.parse(organizationJson)
            vm.changeArrayToObject(organizationJson)
            organizationJson.forEach(item => {
              if (item.value === 'ZJF') {
                vm.organizationJson = item.children
              }
            })
            vm.init()
          } else {
            vm.$Message.error({duration: 5, content: data.msg})
          }
        })
      },

      // 遍历把数组改成key、value的对象
      changeArrayToObject (array) {
        let vm = this
        array.forEach(item => {
          vm.organizationObject[item.value] = item
          if (item.children && item.children.length > 0) {
            vm.changeArrayToObject(item.children)
          }
        })
      },

      // 根据受理机构编号，查询上级机构
      getParentName (agencyId) {
        let vm = this
        if (vm.organizationObject[agencyId] && vm.organizationObject[agencyId].parentId) {
          let newOrgNo = vm.organizationObject[agencyId] ? vm.organizationObject[agencyId].value : ''
          vm.resData.selectOrg.unshift(newOrgNo)
          vm.getParentName(vm.organizationObject[agencyId].parentId)
        }
      },

      // 下拉框选择
      onSelect(value, name) {
        let obj = this.$refs[value].getSelect();
        this.editForm[name] = obj.value;
      },

      // 客户编号的控制
      certificateNoChange () {
        this.editForm.certificateNo = this.editForm.certificateNo.replace(/[\W]/g,'')
      },

      // 所属机构选择后回调
      casSelected (selectedData) {
        // console.log('selectedData', selectedData)
        let len = selectedData.length
        let agencyName = ''
        selectedData.forEach(item => {
          agencyName += item.label
        })
        this.editForm.agencyId = len ? selectedData[len - 1].value : ''
        this.editForm.agencyName = len ? agencyName : ''
      },

      // 保存事件
      btnSave (name, type) {
        let vm = this
        vm.$refs[name].validate((valid) => { // 数据校验
          if (!valid) {
            return
          }
          if (vm.editForm.certificateType === '' && vm.editForm.certificateNo === '' && vm.editForm.bankNo === '') {
            vm.$Message.info('请至少输入“证件类型+证件号码”或“行内编号”其中一个。')
            return
          } else {
            if (vm.editForm.bankNo === '') {
              if (vm.editForm.certificateType === '' || vm.editForm.certificateNo === '') {
                vm.$Message.info('请至少输入“证件类型+证件号码”或“行内编号”其中一个。')
                return
              }
            }
          }
          let server = type === 0 ? vm.$services.backendService.custManagerRestController.save : vm.$services.backendService.custManagerRestController.update
          console.log('btnSave', vm.editForm)
          vm.$net.send({
            server: server,
            data: vm.editForm
          }).then((data) => {
            if (data.success) {
              vm.$Message.success('保存成功')
              vm.btnBack()
            } else {
              vm.$Message.error(data.message)
            }
          })
        })
      },

      beforeBtnBack () {
        this.$Modal.confirm({
          content: '表单的信息将不会保存，确定离开吗？',
          onOk: () => {
            this.btnBack()
          },
          onCancel: () => {
          }
        })
      },


      // 返回
      btnBack () {
        this.$router.go(-1)
        this.$store.commit('closePage', 'custManagerEdit')
        this.$store.commit('removeTag', 'custManagerEdit')
      },

    }
  }
</script>
