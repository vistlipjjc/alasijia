<template>
    <div class="cust">
        <Card>
            <p slot="title">团队成员管理</p>
            <j-table ref="teamMemberListTable" pagination autoSearch
                     :autoCache="true"
                     :queryForm.sync="queryForm"
                     :defaultParams="defaultParams"
                     :server="server.query"
                     :columns-list="columns"
                     v-model="tableData"
                     @btnReset="resetQueryForm"
                     @requestSuccess="requestSuccess"
                     @on-delete="remove"
                     @on-set="setManger"
                     @on-selection-change="selectChange"
                     @on-select-all="selectChange">
                <template slot="input">
                    <Row>
                        <FormItem label="客户经理编号:">
                            <Input v-model.trim="queryForm.managerNo" clearable placeholder="请输入" :maxlength="15" @on-keyup="letterOrNumChange('managerNo')"></Input>
                        </FormItem>
                        <FormItem label="姓名:">
                            <Input v-model.trim="queryForm.realName" clearable placeholder="请输入" :maxlength="30"></Input>
                        </FormItem>
                        <FormItem label="手机号码:">
                            <Input v-model.trim="queryForm.phone" clearable placeholder="请输入" :maxlength="11" @on-keyup="changeInput('phone')"></Input>
                        </FormItem>
                    </Row>
                    <Row>
                        <FormItem label="所属机构:">
                            <org-select-tree
                                    @casSelected="casSelected"
                                    :organizationJson="organizationJson"
                                    :seleted="seletedOrgId">
                            </org-select-tree>
                        </FormItem>
                        <FormItem label="是否管理员:">
                            <Select clearable v-model="queryForm.administrator">
                                <Option v-for="item in yesOrNo" :key="item.value" :value="item.value">
                                    {{ item.label }}
                                </Option>
                            </Select>
                        </FormItem>
                    </Row>
                </template>
                <template slot="toolbar">
                    <Button style="margin-right: 10px;" type="primary" icon="android-add" @click="showDialog = true">新增成员</Button>
                    <Button type="primary" icon="trash-a" @click="deleteMember">批量删除</Button>
                </template>
            </j-table>

            <Row>
                <div style="text-align: center;">
                    <Button @click="btnBack" type="ghost" style="margin:0 11px; height: 40px; width: 100px;">返回</Button>
                </div>
            </Row>
        </Card>

        <!-- 新增成员弹框 -->
        <add-member v-model="showDialog"
                    :organizationData="organizationData"
                    :organizationObject="organizationObject"
                    @confirmAssign="confirmAssign">
        </add-member>
    </div>
</template>

<script>
  import moment from 'moment'
  import orgSelectTree from '../custManager/orgSelectTree.vue'
  import addMember from './addMember'
  export default {
    components: { orgSelectTree, addMember },
    data() {
      return {
        showDialog: false,
        server: {
          query: this.$services.backendService.managerTeamRestController.getMemberList
        },

        defaultParams: {
          teamCode: this.$route.params.opt
        },
        queryForm: {
          managerNo: '',
          realName: '',
          phone: '',
          agencyId: '',
          administrator: ''
        },
        seletedOrgId: [], // 已选择机构
        organizationData: [], // 用于传递参数
        organizationJson: [],
        organizationObject: {}, // 全部机构的键值对格式
        getOrganizationBack: false, // 已经获取机构
        yesOrNo: [
          { value: 'Y', label: '是' },
          { value: 'N', label: '否' }
        ],

        selectedList: [],
        tableData: [],
        columns: [
          { type: 'selection', align: 'center', width: 60 },
          { type: 'index', title: '序号', align: 'center', width: 60 },
          { title: '客户经理编号', align: 'center', key: 'managerNo', minWidth: 90 },
          { title: '姓名', align: 'center', key: 'realName', minWidth: 90 },
          { title: '手机号码', align: 'center', key: 'phone', minWidth: 90 },
          { title: '所属机构', align: 'center', key: 'agencyName', minWidth: 150 },
          { title: '是否管理员', align: 'center', key: 'administratorName', minWidth: 90 },
          { title: '操作', align: 'center', key: 'action', width: 100, handler: [
            {action: 'otherskip', icon: 'trash-a', content: '删除', envent:'on-delete'},
            {action: 'otherskip', icon: 'ios-person', content: '取消管理员', envent:'on-set'},
            {action: 'otherskip', icon: 'ios-person-outline', content: '设置管理员', envent:'on-set'}
          ]}
        ],
      }
    },

    watch: {
      queryForm (val) {
        let vm = this
        // 如果选择了机构，则处理以显示选择的机构
        if (val.agencyId) {
          vm.showOrgSelected([], val.agencyId)
        }
      }
    },

    created () {
      this.getOrganization()
    },

    methods: {
      // 回显查询条件的已选机构，setTimeout是为了延迟，不然在获取机构返回前，一直调自身会造成死循环
      showOrgSelected (agencyIds, agencyId) {
        let vm = this
        setTimeout(() => {
          if (!vm.getOrganizationBack) {
            vm.showOrgSelected(agencyIds, agencyId)
            return false
          }

          if (vm.organizationObject[agencyId]) {
            agencyIds.unshift(agencyId)
            if (vm.organizationObject[agencyId].parentId) {
              vm.showOrgSelected(agencyIds, vm.organizationObject[agencyId].parentId)
            } else {
              vm.seletedOrgId = agencyIds
            }
          }
        }, 500)
      },

      // 获取所有机构
      getOrganization () {
        let vm = this
        vm.$net.send({
          server: vm.$services.backendService.organizationRestController.getOrganizationTree
        }).then(data => {
          if (data.code === 200) {
            data.data.forEach(item => {
              if (item.orgNo === 'ZJF') {
                vm.organizationData = item.children
              }
            })
            let organizationJson = JSON.stringify(data.data)
            organizationJson = organizationJson.replace(/orgNo/g, 'value').replace(/title/g, 'label')
            organizationJson = JSON.parse(organizationJson)
            vm.changeArrayToObject(organizationJson)
            organizationJson.forEach(item => {
              if (item.value === 'ZJF') {
                vm.organizationJson = item.children
              }
            })
            vm.getOrganizationBack = true
            // console.log('organizationJson', vm.organizationJson)
          } else {
            vm.$Message.error(`${data.code}:${data.message}`)
          }
        }).catch(error => {
          vm.$Message.error(error.reason)
        })
      },

      // 表格数据请求后的处理
      requestSuccess (data) {
        let vm = this
        setTimeout(() => {
          vm.tableData = []
          data.forEach((item, index) => {
            item.administratorName = item.administrator === 'Y' ? '是' : '否'
            item.isShowOtherskipIcon = item.administrator === 'Y' ? 'ios-person-outline' : 'ios-person'
            item.agencyName = ''
            item.selectOrg = []
            vm.tableData.push(item)
            vm.getParentName(item.agencyId, index)
          })
          // console.log('tableData', vm.tableData)
        }, 0)
      },

      // 清除查询条件
      resetQueryForm () {
        this.queryForm = {
          managerNo: '',
          realName: '',
          phone: '',
          agencyId: '',
          administrator: ''
        }
        this.seletedOrgId = []
      },

      // 字母或者数字的的输入控制
      letterOrNumChange (name) {
        this.queryForm[name] = this.queryForm[name].replace(/[\W]/g,'')
      },

      // 数字的的输入控制
      changeInput (name) {
        let vm = this
        vm.$nextTick(() => {
          vm.queryForm[name] = vm.queryForm[name].replace(/[^\d]/g, '')
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
      getParentName (agencyId, index) {
        let vm = this
        if (vm.organizationObject[agencyId] && vm.organizationObject[agencyId].parentId) {
          let newOrgName = vm.organizationObject[agencyId] ? vm.organizationObject[agencyId].label : ''
          let oldOrgName = vm.tableData[index].agencyName
          vm.tableData[index].agencyName = oldOrgName ? `${newOrgName} ${oldOrgName}` : newOrgName
          vm.getParentName(vm.organizationObject[agencyId].parentId, index)
        }
      },

      // 所属机构选择后回调
      casSelected (selectedData) {
        // console.log('selectedData', selectedData)
        let len = selectedData.length
        this.queryForm.agencyId = len ? selectedData[len-1].value : ''
      },

      // 表格单条数据删除
      remove (row) {
        this.$Modal.confirm({
          title: '提示',
          content: '是否删除该客户经理成员？',
          onOk: () => {
            this.$net.send({
              server: this.$services.backendService.managerTeamRestController.deleteMember,
              data: [row.id]
            }).then((data) => {
              if (data.success) {
                this.$Message.success('删除成功！')
                this.$refs.teamMemberListTable.refresh()
              } else {
                this.$Message.error(data.message)
              }
            })
          }
        })
      },

      // 选择/取消选择,列表的多选框
      selectChange (selection) {
        this.selectedList = selection
      },

      // 批量删除
      deleteMember () {
        let vm = this
        if (vm.selectedList.length === 0) {
          vm.$Message.warning('请选择需要删除的客户经理成员')
        } else {
          vm.$Modal.confirm({
            title: '提示',
            content: '是否删除已选中的客户经理成员？',
            onOk: () => {
              let ids = vm.selectedList.map(item => item.id)
              vm.$net.send({
                server: vm.$services.backendService.managerTeamRestController.deleteMember,
                data: ids
              }).then((data) => {
                if (data.success) {
                  vm.$Message.success('删除成功！')
                  vm.$refs.teamMemberListTable.refresh()
                } else {
                  vm.$Message.error(data.message)
                }
              })
            }
          })
        }
      },

      // 设置管理员
      setManger (row) {
        let content = row.administrator === 'Y' ? '是否取消该成员的管理员角色？' : '是否确定设置该客户经理为管理员？'
        let saveData = {
          id: row.id,
          administrator: row.administrator === 'Y' ? 'N' : 'Y'
        }
        this.$Modal.confirm({
          title: '提示',
          content: content,
          onOk: () => {
            this.$net.send({
              server: this.$services.backendService.managerTeamRestController.setAmdmin,
              data: saveData
            }).then((data) => {
              if (data.success) {
                this.$Message.success('设置成功！')
                this.$refs.teamMemberListTable.refresh()
              } else {
                this.$Message.error(data.message)
              }
            })
          }
        })
      },

      // 新增成员弹框的确认
      confirmAssign () {
        this.$refs.teamMemberListTable.refresh()
      },

      // 返回
      btnBack () {
        this.$router.go(-1)
        this.$store.commit('closePage', 'teamMemberList')
        this.$store.commit('removeTag', 'teamMemberList')
      }

    }
  }
</script>