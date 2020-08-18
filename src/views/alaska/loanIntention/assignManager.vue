<template>
  <Modal
    title="指派客户经理"
    :width="700"
    :loading="loading"
    v-model="showDialog">
    <div class="amBox">
      <Form class="amSearchBox" :model="queryForm" :label-width="90">
        <FormItem class="amSearchItem" label="姓名: ">
          <Input placeholder="请输入" clearable v-model.trim="queryForm.realName" :maxlength="30"></Input>
        </FormItem>
        <FormItem class="amSearchItem" label="手机号码: ">
          <Input placeholder="请输入" clearable v-model.trim="queryForm.phone" :maxlength="11" @on-change="changeInput"></Input>
        </FormItem>
        <FormItem class="amSearchItem amSearchBtnBox">
          <Button class="amSearchBtn" type="primary" icon="search" @click="doSearch">搜索</Button>
          <Button class="amSearchBtn" type="ghost" icon="reply" @click="doReset">重置</Button>
        </FormItem>
      </Form>

      <div class="amCont">
        <div class="amTitle">指派机构:</div>
        <div class="amOrgCont">
          <div class="amOrgItem"
            :class="{'amOrgItemSelected': selectedOrg === item.orgNo}"
            v-for="(item, index) in orgList"
            @click="changeSelectedOrg(item.orgNo)">
            {{ item.orgName }}
          </div>
        </div>
      </div>

      <div class="amCont">
        <div class="amTitle">指派客户经理:</div>
        <Table border :columns="columns" :data="tableData"></Table>
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
      </div>
    </div>
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

    // 当前操作对象
    currentItem: {
      type: Object,
      default () {
        return {}
      }
    },

    // 机构对象化数据
    organizationObject: {
      type: Object,
      default () {
        return {}
      }
    },
  },

  data () {
    return {
      server: {
        getDispatchParams: this.$services.backendService.sysRegionRestController.getDispatchParams,
        query: this.$services.backendService.custManagerRestController.getCustList,
        assignOrders: this.$services.backendService.ordersRestController.assignOrders
      },
      showDialog: this.value, // 显示弹框
      loading: true, // 用于手动关闭弹框
      total: 0, // 总条数
      pageNumber: 1, // 当前页码
      pageSize: 10, // 每页条数
      selectedOrg: this.currentItem.orgId, // 当前选择的机构
      newOrgName: '',
      orgList: [], // 机构列表
      tableData: [], // 客户经理列表
      queryForm: {
        orgNo: '',
        realName: '',
        phone: '',
        pageNumber: 1,
        pageSize:10
      },

      editForm: {
        lendNo: '',
        managerId: ''
      },

      columns: [
        { title: '请选择', width: 70, align: 'center',
          render: (h, params) => {
            let vm = this
            let defaultS = false
            if (vm.editForm.managerId === params.row.id) {
              defaultS = true
            } else {
              defaultS = false
            }
            return h('div', [
              h('Radio', {
                props: {
                  value: defaultS  //判断单选框状态
                },
                on: {
                  'on-change': () => {
                    vm.editForm.managerId = params.row.id; //赋值单选框id。对比id判断状态
                  }
                }
              })
            ])
          }
        },
        { type: 'index', title: '序号', align: 'center', width: 70 },
        { title: '编号', key: 'managerNo', align: 'center' },
        { title: '姓名', key: 'realName', align: 'center' },
        { title: '手机号码', key: 'phone', align: 'center' }
      ]
    }
  },

  watch: {
    value (val) {
      let vm = this
      vm.showDialog = val
      if (val) {
        vm.selectedOrg = vm.currentItem.orgId
        vm.queryForm.orgNo = vm.currentItem.orgId
        vm.editForm = {
          lendNo: vm.currentItem.lendNo,
          managerId: vm.currentItem.managerId
        }
        console.log('currentItem', vm.currentItem)
        vm.queryForm.pageSize = 10
        vm.queryForm.pageNumber = 1
        this.getOrgList()
      }
    },

    showDialog (val) {
      this.$emit('input', val)
    }
  },

  methods: {
    // 获取当前区域的机构树
    getOrgList () {
      let vm = this
      vm.$net.send({
        server: vm.server.getDispatchParams,
        data: {
          regionNo: vm.currentItem.region
        }
      }).then(data => {
        if (data.code === 200) {
          let dispatchData = data.data
          let ifHaveCurrt = false
          vm.orgList = []
          dispatchData.forEach(item => {
            if (item.orgNo === vm.currentItem.orgId) {
              ifHaveCurrt = true
            }
            vm.newOrgName = ''
            vm.getParentName(item.orgNo)
            let orgItem = {
              orgNo: item.orgNo,
              orgName: vm.newOrgName
            }
            vm.orgList.push(orgItem)
          })
          // 判断是否有选取机构
          let orgNo = ifHaveCurrt ? vm.currentItem.orgId : (dispatchData.length ? dispatchData[0].orgNo : '')
          vm.selectedOrg = orgNo
          vm.queryForm.orgNo = orgNo
          vm.getManagerList()
        } else {
          vm.$Message.error(`${data.code}:${data.message}`)
        }
      }).catch(error => {
        console.log('error', error)
      })
    },

    // 根据受理机构编号，查询上级机构
    getParentName (orgId) {
      let vm = this
      if (vm.organizationObject[orgId]) {
        vm.newOrgName = vm.newOrgName ? vm.organizationObject[orgId].label + '/' + vm.newOrgName : vm.organizationObject[orgId].label
        if (vm.organizationObject[orgId].parentId) {
          vm.getParentName(vm.organizationObject[orgId].parentId)
        }
      }
    },

    // 获取客户经理的表格数据
    getManagerList () {
      let vm = this
      this.$net.send({
        server: vm.server.query,
        data: vm.queryForm
      }).then((data) => {
        vm.tableData = data.rows
        vm.total = data.total
      })
    },

    // 点击机构
    changeSelectedOrg (orgNo) {
      let vm = this
      if (vm.selectedOrg !== orgNo) {
        vm.selectedOrg = orgNo
        vm.queryForm.orgNo = orgNo
        vm.getManagerList()
      }
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

    // 点击确认弹框
    confirmAssign () {
      let vm = this
      if (!vm.editForm.managerId) {
        vm.$Message.info('请先选择要指派的客户经理！')
        return false
      }
      vm.$net.send({
        server: vm.server.assignOrders,
        data: vm.editForm
      }).then((data) => {
        if (data.success) {
          vm.$Message.success('指派成功！')
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

<style scoped>
.amSearchBox {
  display: flex;
}
.amSearchItem {
  width: 33.3%;
}
.amSearchBtnBox {
  text-align: center;
}
.amSearchBtn {
  margin: 0 5px;
}

.amTitle {
  margin-top: 15px;
  margin-bottom: 5px;
  font-weight: bold;
}
.amOrgCont {
  border: 1px solid #e9eaec;
}
.amOrgItem {
  padding: 5px 10px;
  border-top: 1px solid #e9eaec;
  cursor: pointer;
}
.amOrgItem:first-child {
  border-top: 0;
}
.amOrgItemSelected {
  color: #2d8cf0;
}
</style>

<style>
.amSearchBox .ivu-form-item {
  margin-bottom: 0;
}
.amSearchBtnBox .ivu-form-item-content {
  margin-left: 0 !important
}
.amPageBox {
  margin-top: 10px;
  margin-bottom: 0;
  text-align: right;
}
</style>
