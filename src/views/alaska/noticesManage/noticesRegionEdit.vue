<template>
    <div class="noticesRegionEdit">
        <Card>
            <p slot="title" class="fontsize18">{{title}}</p>
            <Row>
                <Form ref="editForm" :model="editForm" :rules="editRules" :label-width="180">
                    <Row>
                        <Col span="11">
                        <FormItem label="通知规则名称：" prop="title" required>
                            <Input v-model="editForm.title" clearable :maxlength="15"></Input>
                        </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="11">
                        <FormItem label="状态：" prop="sts" required>
                            <Radio-group v-model="editForm.sts">
                                <Radio v-for="item in stsList"
                                       :key="item.value"
                                       :label="item.value">
                                    {{item.name}}
                                </Radio>
                            </Radio-group>
                        </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="11">
                        <FormItem label="通知机构：" prop="roleStdDesc" required>
                            <Tree ref="organizationTree"
                                  :data="treeData"
                                  v-model="editForm.orgNos"
                                  :multiple='false'
                                  :render="renderContent">
                            </Tree>
                        </FormItem>
                        </Col>
                    </Row>
                        <Col span="22">
                        <FormItem label="已选机构：" prop="orgTitles">
                            <div>{{ editForm.orgTitles }}</div>
                        </FormItem>
                        </Col>
                    <Row>

                    </Row>

                    <Col span="11">
                    <div align="center">
                        <Button @click="btnSave('editForm')" type="primary" style="margin:0 11px; height: 40px; width: 100px;">保存</Button>
                        <Button type="ghost" @click="btnBack" style="margin:0 11px; height: 40px; width: 100px;">返回</Button>
                    </div>
                    </Col>
                </Form>
            </Row>
        </Card>
        <notices-deploy-modal
           v-model="showDialog"
           :deployEditForm="editForm"
           @btnBack="btnBack">
        </notices-deploy-modal>
    </div>
</template>

<script>
  import orgSelectTree from '../custManager/orgSelectTree.vue'
  import noticesDeployModal from './noticesDeployModal.vue'
  export default {
    components: { orgSelectTree, noticesDeployModal },
    data () {
      return {
        opt: false,
        showDialog: false,
        title: this.$route.params.opt === 'edit' ? '修改通知规则' : '新增通知规则',
        ifDoployed: false, // 是否配置了推送配置
        editForm: {
          id: '',
          title: '',
          orgNos: [],
          orgTitles: '',
          sts: 'Y'
        },
        editRules: {
          title: [{required: true, message: '请输入通知规则名称', trigger: 'blur'}],
          orgNos: [{required: true, message: '请选择通知机构', trigger: 'blur'}]
        },

        // 状态下拉查询
        stsList: [
          {value: 'Y', name: '启用'},
          {value: 'N', name: '禁用'}
        ],
        treeData: [], // 机构树
        organizationObject: {}
      }
    },

    created () {
      this.init()
    },

    methods: {
      init () {
        let vm = this
        if (vm.$route.params.opt !== 'add') {
          vm.$net.send({
            server: vm.$services.backendService.regionNoticeRestController.getRegionNoticeById,
            data: {id: vm.$route.query.id || ''}
          }).then(data =>{
            if (data.success) {
              // console.log(data)
              vm.editForm = data.data.regionNotice
              vm.editForm.orgNos = data.data.orgNos
              vm.editForm.globalParams = data.data.globalParams
              vm.ifDoployed = data.data.globalParams.length > 0
              vm.getOrganization()
            } else {
              vm.$Message.error({duration: 5, content: data.message})
            }
          })
        } else {
          vm.getOrganization()
        }
      },

      // 获取下拉树
      getOrganization () {
        let vm = this
        vm.$net.send({
          server: this.$services.backendService.regionNoticeRestController.getOrgTree
        }).then((data) => {
          if (data.success) {
            data.data.forEach(item => {
              if (item.orgNo === 'ZJF') {
                vm.organizationObject[item.orgNo] = item
                vm.treeData = vm.changeAble(item.children)
              }
            })
          } else {
            vm.$Message.error({duration: 5, content: data.msg});
          }
        })
      },

      // 遍历整棵树，将当前已配置的节点恢复可选
      changeAble (array) {
        let vm = this
        array.forEach(item => {
          vm.editForm.orgNos.forEach(orgNosItem => {
            if (item.orgNo === orgNosItem) {
              item.disabled = false
              item.mychecked = true
              // item.checked = true
            }
          })
          item.disableCheckbox = item.disabled
          item.disabled = false
          vm.organizationObject[item.orgNo] = item
          if (item.children && item.children.length > 0) {
            vm.changeAble(item.children)
          }
        })
        return array
      },

      // 根据受理机构编号，查询上级机构
      getParentName (agencyId, oldOrgName) {
        let vm = this
        let oldName = oldOrgName
        if (vm.organizationObject[agencyId] && vm.organizationObject[agencyId].parentId) {
          let newOrgName = vm.organizationObject[agencyId] ? vm.organizationObject[agencyId].title : ''
          oldName = oldName ? `${newOrgName}-${oldName}` : newOrgName
          if (vm.organizationObject[agencyId].title) {
            vm.getParentName(vm.organizationObject[agencyId].parentId, oldName)
          }
        }
        if (vm.organizationObject[agencyId].orgNo === 'ZJF') {
          vm.editForm.orgTitles = vm.editForm.orgTitles ? vm.editForm.orgTitles + '、' + oldName : oldName
        }
      },

      // 树的样式自定义
      renderContent (h, { root, node, data }) {
        return h('span', {
          style: {
            display: 'inline-block',
            width: '100%',
            cursor: 'pointer',
          }
        },[
          h('span', data.title),
          h('span', {
            style: {
              display: 'inline-block',
              float: 'right',
              marginRight: '32px'
            }
          },
          [
            h('Checkbox', {
              props: {
                'disabled': data.disableCheckbox,
                'value': data.mychecked,
              },
              on: {
                'on-change': (val) => {
                  data.mychecked = val
                  let checkedTree = []
                  root.forEach(item => {
                    if (item.node.mychecked) {
                      checkedTree.push(item.node)
                    }
                  })
                  this.checkTree(checkedTree)
                }
              }
            })
          ])
        ])
      },

      // 树复选框选中后数据处理
      checkTree (checkedTree) {
        let vm = this
        let treeRow = checkedTree
        vm.editForm.orgNos = []
        vm.editForm.orgTitles = ''
        treeRow.forEach(item => {
          if (vm.organizationObject[item.orgNo].mychecked) {
            vm.editForm.orgNos.push(item.orgNo)
            vm.getParentName(item.orgNo, '')
          }
        })
      },

      // 下拉框选择
      onSelect(value, name) {
        let obj = this.$refs[value].getSelect()
        this.editForm[name] = obj.value
      },

      // 保存事件
      btnSave (name) {
        let vm = this
        vm.$refs[name].validate((valid) => { // 数据校验
          if (!valid) {
            return
          }
          if (!vm.ifDoployed && vm.editForm.sts === 'Y') {
            vm.showDialog = true
          } else {
            vm.$net.send({
              server: vm.$services.backendService.regionNoticeRestController.save,
              data: vm.editForm
            }).then((data) => {
              if (data.success) {
                vm.$Message.success('保存成功')
                vm.btnBack()
              } else {
                vm.$Message.error(data.message)
              }
            })
          }
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
        this.$store.commit('closePage', 'noticesRegionEdit')
        this.$store.commit('removeTag', 'noticesRegionEdit')
      }

    }
  }
</script>
<style>
    .noticesRegionEdit .ivu-checkbox-disabled.ivu-checkbox-checked .ivu-checkbox-inner:after {
        border-color: #f3f3f3;
    }
</style>