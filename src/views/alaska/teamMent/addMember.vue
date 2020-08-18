<template>
  <Modal
    title="新增团队成员"
    :width="900"
    :loading="loading"
    v-model="showDialog">
      <Layout class="layout">
          <Sider hide-trigger style="padding-right: 10px;">
              <Form class="amSearchBox" :model="queryForm" :label-width="65">
                  <Row>
                      <FormItem label="姓名: ">
                          <Input placeholder="请输入" clearable v-model.trim="queryForm.realName" :maxlength="30"></Input>
                      </FormItem>
                  </Row>
                  <Row>
                      <FormItem label="手机号码: ">
                          <Input placeholder="请输入" clearable v-model.trim="queryForm.phone" :maxlength="11" @on-change="changeInput"></Input>
                      </FormItem>
                  </Row>
                  <Row>
                      <div style="text-align: center;">
                          <Button type="primary" icon="search" @click="doSearch">搜索</Button>
                      </div>
                  </Row>
              </Form>

              <div class="amOrgCont">
                  <Tree ref="organizationTree"
                        :data="organizationData"
                        @on-select-change="selectNode">
                  </Tree>
              </div>
          </Sider>
          <Content>
              <Card style="padding-left: 10px;" class="amCont">
                  <div class="amTitle">请选择客户经理:</div>
                  <Table border
                         :columns="columns"
                         :data="tableData"
                         :loading="tableLoading"
                         @on-selection-change="selectedChange"
                         :height="300"></Table>
                  <Page class="amPageBox"
                        show-sizer
                        show-total
                        placement="top"
                        :total="total"
                        :current="queryForm.pageNumber"
                        :page-size="queryForm.pageSize"
                        @on-change="changePage"
                        @on-page-size-change="pageSizeChange">
                  </Page>
                  <div>已选择客户经理：{{ selectedName }}</div>
              </Card>
          </Content>
      </Layout>
      <template slot="footer">
          <div style="text-align: center;">
              <Button type="primary" @click="confirmAssign">提交</Button>
              <Button type="ghost" @click="showDialog = false">取消</Button>
          </div>
      </template>
  </Modal>
</template>

<script>
export default {
  props: {
    value: Boolean, // 是否显示弹框

    // 机构树数据
    organizationData: {
      type: Array,
      default () {
        return []
      }
    },

    // 机构对象化数据
    organizationObject: {
      type: Object,
      default () {
        return {}
      }
    }
  },

  data () {
    return {
      showDialog: this.value, // 显示弹框
      loading: true, // 用于手动关闭弹框
      total: 0, // 总条数
      pageNumber: 1, // 当前页码
      pageSize: 10, // 每页条数
      teamCode: this.$route.params.opt,
      tableLoading: true,
      tableData: [], // 客户经理列表
      selectedName: '',
      saveData: [], // 用于保存的数据
      ysSelected: [],
      queryForm: {
        orgNo: '',
        realName: '',
        phone: '',
        pageNumber: 1,
        pageSize:10
      },

      columns: [
        { type: 'selection', align: 'center', width: 60 },
        { type: 'index', title: '序号', align: 'center', width: 70 },
        { title: '编号', key: 'managerNo', align: 'center' },
        { title: '姓名', key: 'realName', align: 'center' },
        { title: '手机号码', key: 'phone', align: 'center' },
        { title: '所属机构', align: 'center', key: 'agencyName', minWidth: 150 }
      ]
    }
  },

  watch: {
    value (val) {
      let vm = this
      vm.showDialog = val
      if (val) {
        vm.queryForm = {
          orgNo: '',
          realName: '',
          phone: '',
          pageNumber: 1,
          pageSize:10
        }
        vm.saveData = []
        vm.getAllMember()
      }
    },

    showDialog (val) {
      this.$emit('input', val)
    }
  },

  methods: {
    // 获取当前团队的所有成员
    getAllMember () {
      let vm = this
      this.$net.send({
        server: vm.$services.backendService.managerTeamRestController.getExistMember,
        data: {teamCode: vm.teamCode}
      }).then((data) => {
        if (data.code === 200) {
          vm.selectedName = ''
          vm.ysSelected = []
          if (data.data) {
            data.data.forEach(item => {
              vm.selectedName = vm.selectedName ? vm.selectedName + '、' + item.realName : item.realName
              vm.ysSelected.push(item.managerNo)
            })
          }
          vm.getManagerList()
        } else {
          vm.$Message.error(`${data.code}:${data.message}`)
        }
      })
    },

    // 点击树结构
    selectNode (row) {
      let vm = this
      vm.queryForm.orgNo = row.length ? row[0].orgNo : ''
      vm.getManagerList()
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

    // 获取客户经理的表格数据
    getManagerList () {
      let vm = this
      vm.tableLoading = true
      this.$net.send({
        server: vm.$services.backendService.custManagerRestController.getCustList,
        data: vm.queryForm
      }).then((data) => {
        // vm.tableData = data.rows
        setTimeout(() => {
          vm.tableData = []
          data.rows.forEach((item, index) => {
            item.agencyName = ''
            vm.ysSelected.forEach(selectedItem => {
              if (selectedItem === item.managerNo) {
                item._checked = true
                item._disabled = true
              }
            })
            vm.saveData.forEach(saveDataItem => {
              if (saveDataItem.managerId === item.id) {
                item._checked = true
              }
            })
            vm.tableData.push(item)
            vm.getParentName(item.agencyId, index)
          })
        }, 0)
        vm.total = data.total
        vm.tableLoading = false
      })
    },

    // 点击搜索
    doSearch () {
      let vm = this
      vm.pageNumber = 1
      vm.getManagerList()
    },

    // 点击重置
    doReset () {
      let vm = this
      vm.queryForm.realName = ''
      vm.queryForm.phone = ''
      vm.queryForm.pageSize = 10
      vm.queryForm.pageNumber = 1
      vm.doSearch()
    },

    // 选择成员后触发
    selectedChange (selection) {
      let vm = this
      // 取消当前页之前选中的数据
      vm.tableData.forEach(item => {
        for (let i = 0, flag = true, len = vm.saveData.length; i < len ; flag ? i++ : i) {
          if (vm.saveData[i].managerId === item.id) {
            vm.saveData.splice(i, 1)
            if (vm.selectedName.indexOf('、') > -1) {
              vm.selectedName =  i + 1 === len ? vm.selectedName.replace('、' + item.realName, '') : vm.selectedName.replace(item.realName + '、', '')
            } else {
              vm.selectedName = ''
            }
            len = len -1
            flag = false
          } else {
            flag = true
          }
        }
      })
      selection.forEach(item => {
        if (!item._disabled) {
          vm.selectedName = vm.selectedName ? vm.selectedName + '、' + item.realName : item.realName
          let saveItem = {
            teamCode: vm.teamCode,
            managerId: item.id
          }
          vm.saveData.push(saveItem)
        }
      })
      // console.log('saveData', vm.saveData)
    },

    // 点击确认弹框
    confirmAssign () {
      let vm = this
      if (vm.saveData.length === 0) {
        vm.$Message.info('请先选择客户经理！')
        return false
      }
      vm.$net.send({
        server: vm.$services.backendService.managerTeamRestController.createMember,
        data: vm.saveData
      }).then((data) => {
        if (data.success) {
          vm.$Message.success('新增成功！')
          vm.showDialog = false
          vm.$emit('confirmAssign')
        } else {
          vm.$Message.error(data.message)
        }
      })
        .catch(error => {
          console.log('error', error)
        })


    },

    // 输入框输入限制
    changeInput () {
      let vm = this
      vm.$nextTick(() => {
        vm.queryForm.phone = vm.queryForm.phone.replace(/[^\d]/g, '')
      })
    },

    // 改变页码
    changePage (page) {
      let vm = this
      vm.queryForm.pageNumber = page
      console.log('page', page)
      vm.getManagerList()
    },

    // 改变每页条数
    pageSizeChange (size) {
      let vm = this
      vm.queryForm.pageSize = size
      vm.getManagerList()
    }
  }
}
</script>

<style>
.amSearchBox .ivu-form-item {
  margin-bottom: 5px;
}
.layout.ivu-layout{
    background: #fff;
    padding: 10px;
}
</style>
<style scoped>
    .amPageBox {
        margin-top: 10px;
        margin-bottom: 5px;
        text-align: right;
    }
    .amOrgCont {
        margin-top: 10px;
        border-top: 1px solid #cccccc;
    }
</style>
