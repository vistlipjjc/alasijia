<template>
    <Card class="nlBox">
    <p slot="title">通知消息查看</p>

    <div class="nlTabBox">
      <Tabs type="card" v-model="selectedTab" @on-click="changeTabs">
        <TabPane name="system" label="系统通知"></TabPane>
        <TabPane name="send" label="已发送通知"></TabPane>
        <TabPane name="draft" label="草稿件"></TabPane>
        <TabPane name="fail" label="发送失败">
        </TabPane>
      </Tabs>

      <div class="nlBtnBox">
        <template v-if="selectedTab === 'draft'">
          <Button class="nlBtnItem" type="primary" icon="android-delete" @click="deleteLotSize">批量删除</Button>
          <Button class="nlBtnItem" type="primary" icon="ios-paperplane" @click="sendLotSize">批量发送</Button>
        </template>
        <template v-if="selectedTab === 'fail'">
          <Button class="nlBtnItem" type="primary" icon="android-delete" @click="deleteLotSizeFail">批量删除</Button>
        </template>
        <Button class="nlBtnItem" type="primary" icon="ios-redo" @click="gotoSendNotices" v-else>发送通知</Button>
      </div>
    </div>

    <!-- 系统通知列表 -->
    <j-table
      ref="systemListTable"
      pagination
      :queryForm="systemQueryForm"
      :server="server.systemQuery"
      :columns-list="systemColumns"
      v-model="tableData"
      @requestSuccess="requestSuccess"
      @on-view="viewDetails"
      v-show="selectedTab === 'system'">
    </j-table>

    <!-- 已发送通知列表 -->
    <j-table
      ref="sendListTable"
      pagination
      :queryForm="sendQueryForm"
      :server="server.manageQuery"
      :columns-list="sendColumns"
      v-model="tableData"
      @requestSuccess="requestSuccess"
      @on-view="viewDetails"
      v-show="selectedTab === 'send'">
    </j-table>

    <!-- 草稿件列表 -->
    <j-table
      ref="draftListTable"
      pagination
      :queryForm="draftQueryForm"
      :server="server.manageQuery"
      :columns-list="draftColumns"
      v-model="tableData"
      @requestSuccess="requestSuccess"
      @on-view="viewDetails"
      @on-edit="editDetails"
      @on-delete="deleteDetais"
      @sendNotices="sendNotices"
      @on-selection-change="selectChange"
      @on-select-all="selectChange"
      v-show="selectedTab === 'draft'">
    </j-table>

    <!-- 失败列表 -->
    <j-table
      ref="failTable"
      pagination
      :queryForm="failQueryForm1"
      :server="server.failQuery"
      :columns-list="failColumns"
      v-model="tableData1"
      @requestSuccess="requestSuccess2"
      @on-view="viewDetails"
      @on-delete="deleteDetais"
      @on-selection-change="selectChange"
      @on-select-all="selectChange"
      v-show="selectedTab === 'fail'&& radioG === '系统通知'">
      <RadioGroup @on-change="RadioGroupChange" v-model="radioG" slot="RadioGroup">
        <Radio label="系统通知" style="font-weight:normal;margin-top:5px;">
        </Radio>
        <Radio label="管理通知" style="font-weight:normal;margin-top:5px;">
        </Radio>
      </RadioGroup>
    </j-table>
    <j-table
      ref="failTable2"
      pagination
      :queryForm="failQueryForm2"
      :server="server.failQuery"
      :columns-list="failColumns2"
      v-model="tableData2"
      @requestSuccess="requestSuccess3"
      @on-view="viewDetails"
      @on-edit="editDetails2"
      @on-delete="deleteDetais"
      @sendNotices="sendNoticesFail"
      @on-selection-change="selectChange"
      @on-select-all="selectChange"
      v-show="selectedTab === 'fail'&& radioG === '管理通知'">
      <RadioGroup @on-change="RadioGroupChange" v-model="radioG" slot="RadioGroup">
        <Radio label="系统通知" style="font-weight:normal;margin-top:5px;">
        </Radio>
        <Radio label="管理通知" style="font-weight:normal;margin-top:5px;">
        </Radio>
      </RadioGroup>
    </j-table>
  </Card>
</template>

<script>
import storage from '@/util/storage'

export default {
  data () {
    return {
      radioG: '系统通知',
      selectedTab: 'system', // 选中的tab
      tableData: [], // 表格数据
      tableData1: [], 
      tableData2: [],
      selectedList: [], // 已选数据
      systemQueryForm: {}, // 系统通知查询条件
      typeMap: {
        '1': '待领取',
        '2': '待受理',
        '3': '新工单',
        '4': '倒计时到期',
        '5': '更新状态'
      },

      // 已发送通知查询条件
      sendQueryForm: {
        __EQS_sendSts: 'Y',
        sortName: 'sendTime',
        sortOrder: 'DESC'
      },
      //失败系统发送查询条件
      failQueryForm1: {
        __NES_noticeType: '0',
        sortName: 'sendTime',
        sortOrder: 'DESC'
      },
      //失败管理发送查询条件
      failQueryForm2: {

        __EQS_noticeType: '0',
        sortName: 'sendTime',
        sortOrder: 'DESC'
      },

      // 草稿件查询条件
      draftQueryForm: {
        __EQS_sendSts: 'N',
        sortName: 'createdTime',
        sortOrder: 'DESC',
        __EQS_sender: storage.getItem('user').staffCode
      },

      server: {
        systemQuery: this.$services.backendService.sysNoticeRestController.selectList, // 系统通知接口
        manageQuery: this.$services.backendService.manageNoticeRestController.query, // 管理员通知接口（已发送、草稿件）
        failQuery: this.$services.backendService.noticeFailRecordRestController.query, // 发送失败接口
        send: this.$services.backendService.manageNoticeRestController.sendManageNotice // 重新发送接口
      },

      // 系统通知表格头
      systemColumns: [
        { title: '序号', type: 'index', align: 'center', width: 60 },
        { title: '通知类型', key: 'noticeType', align: 'center', width: 120 },
        { title: '通知规则名称', key: 'noticeRuleName', align: 'center', ellipsis: true },
        { title: '通知机构', key: 'noticeOrg', align: 'center', ellipsis: true },
        { title: '主题内容', key: 'noticeContent', align: 'center', ellipsis: true, minWidth: 150,
          render: (h, params) => {
            return h('div', [
              h('span', {
                domProps: {
                  innerHTML: params.row.noticeContent
                }
              })
            ])
          }
        },
        { title: '是否推送', key: 'push', align: 'center', width: 100 },
        { title: '发送时间', key: 'sendTime', align: 'center', width: 150 },
        { title: '操作', align: 'center', key: 'action', width: 70, handler: [
          { action: 'view' }
        ]}
      ],

      // 已发送通知表格头
      sendColumns: [
        { title: '序号', type: 'index', align: 'center', width: 60 },
        { title: '主题内容', key: 'noticeContent', align: 'center', minWidth: 150,
          render: (h, params) => {
            return h('div', [
              h('span', {
                domProps: {
                  innerHTML: params.row.noticeContent
                }
              })
            ])
          }
        },
        { title: '是否推送', key: 'push', align: 'center', width: 100 },
        { title: '发送时间', key: 'sendTime', align: 'center', width: 150 },
        { title: '发送人', key: 'senderName', align: 'center', width: 120 },
        { title: '操作', align: 'center', key: 'action', width: 70, handler: [
          { action: 'view' }
        ]}
      ],

      // 草稿件表格头
      draftColumns: [
        { type: 'selection', align: 'center', width: 60 },
        { title: '序号', type: 'index', align: 'center', width: 60 },
        { title: '主题内容', key: 'noticeContent', align: 'center', minWidth: 150,
          render: (h, params) => {
            return h('div', [
              h('span', {
                domProps: {
                  innerHTML: params.row.noticeContent
                }
              })
            ])
          }
        },
        { title: '创建时间', key: 'createdTime', align: 'center', width: 150 },
        { title: '操作', align: 'center', key: 'action', width: 140, handler: [
          { action: 'view' },
          { action: 'edit' },
          { action: 'delete' },
          { action: 'otherskip', icon: 'ios-paperplane', content: '发送', envent:'sendNotices' }
        ]}
      ],

      // 系统失败表格头
      failColumns: [
        { type: 'selection', align: 'center', width: 60 },
        { title: '序号', type: 'index', align: 'center', width: 60 },
        { title: '通知类型', key: 'noticeType', align: 'center', width: 120 },
        { title: '通知规则名称', key: 'noticeRuleName', align: 'center', ellipsis: true },
        { title: '通知机构', key: 'noticeOrg', align: 'center', ellipsis: true },
        { title: '主题内容', key: 'noticeContent', align: 'center', ellipsis: true, minWidth: 150,
          render: (h, params) => {
            return h('div', [
              h('span', {
                domProps: {
                  innerHTML: params.row.noticeContent
                }
              })
            ])
          }
        },
        { title: '发送时间', key: 'sendTime', align: 'center', width: 150 },
        { title: '操作', align: 'center', key: 'action', width: 140, handler: [
          { action: 'view' },
          { action: 'delete' }
        ]}
      ],

      //管理失败表格头
      failColumns2: [
        { type: 'selection', align: 'center', width: 60 },
        { title: '序号', type: 'index', align: 'center', width: 60 },
        { title: '主题内容', key: 'noticeContent', align: 'center', minWidth: 150,
          render: (h, params) => {
            return h('div', [
              h('span', {
                domProps: {
                  innerHTML: params.row.noticeContent
                }
              })
            ])
          }
        },
        { title: '发送时间', key: 'sendTime', align: 'center', width: 150 },
        { title: '发送人', key: 'senderName', align: 'center', width: 120 },
        { title: '操作', align: 'center', key: 'action', width: 140, handler: [
          { action: 'view' },
          { action: 'edit' },
          { action: 'delete' },
          { action: 'otherskip', icon: 'ios-paperplane', content: '发送', envent:'sendNotices' }
        ]}
      ]
    }
  },

  mounted () {
    let vm = this

    // 切换系统的tab进入页面
    if (vm.$route.query.selectedTab) {
      vm.selectedTab = vm.$route.query.selectedTab
      vm.radioG = vm.$route.query.radioG ? vm.$route.query.radioG : '系统通知'
      vm.$nextTick(() => {
        vm.selectedTab === 'system' ? vm.$refs.systemListTable.refresh() : (vm.selectedTab === 'send' ? vm.$refs.sendListTable.refresh() : (vm.selectedTab === 'draft' ? vm.$refs.draftListTable.refresh() : (vm.radioG === '系统通知' ? vm.$refs.failTable.refresh() : vm.$refs.failTable2.refresh())) )
      })
    // 点击菜单进入页面
    } else {
      vm.$refs.systemListTable.refresh()
    }
  },

  methods: {
    requestSuccess (data) {
      let vm = this
      vm.tableData = data.map(item => {
        item.push = item.push === 'Y' ? '是' : item.push === 'N' ? '否' : ''
        item.noticeType = vm.typeMap[item.noticeType] || item.noticeType || ''
        item.noticeContent = item.noticeContent.replace(/\s/g, '&nbsp;')
        return item
      })
    },
    // 请求成功后筛选管理或系统失败
    requestSuccess2 (data) {
      let vm = this
      vm.tableData1 = []
      vm.tableData1 = data.map(item => {
        item.noticeType  = vm.typeMap[item.noticeType] || item.noticeType || ''
        item.noticeContent = item.noticeContent.replace(/\s/g, '&nbsp;')
        return item
      })     
    },
    requestSuccess3 (data) {
      let vm = this
      vm.tableData2 = []
      vm.tableData2 = data.map(item => {
        item.noticeContent = item.noticeContent.replace(/\s/g, '&nbsp;')
        return item
      })
    },

    // 切换tab
    changeTabs (tabName) {
      let vm = this
      let route = { ...this.$router.currentRoute }
      vm.selectedTab = tabName
      route.query = { ...route.query, selectedTab: vm.selectedTab }
      vm.$router.replace(route)
      vm.$nextTick(() => {
        vm.selectedTab === 'system' ? vm.$refs.systemListTable.refresh() : (vm.selectedTab === 'send' ? vm.$refs.sendListTable.refresh() : (vm.selectedTab === 'draft' ? vm.$refs.draftListTable.refresh() : (vm.radioG === '系统通知' ? vm.$refs.failTable.refresh() : vm.$refs.failTable2.refresh())))
      })
    },

    // 选择/取消选择,列表的多选框
    selectChange (selection) {
      this.selectedList = selection
    },

    // 点击发送通知，跳转发送通知页面，失败无
    gotoSendNotices () {
      this.$router.push({
        path: '/alaska/sendNotices'
      })
    },

    // 修改详情
    editDetails (item) {
      this.$router.push({
        path: '/alaska/sendNotices',
        query: {
          id: item.id
        }
      })
    },

    // 修改详情发送失败
    editDetails2 (item) {
      this.$router.push({
        path: '/alaska/sendNotices',
        query: {
          id: item.id,
          fail: 'fail02'
        }
      })
    },

    // 查看详情
    viewDetails (item) {
      this.$router.push({
        path: '/noticesDetails',
        query: {
          id: item.id,
          type: this.selectedTab
        }
      })
    },

    // 单个删除,草稿失败共用
    deleteDetais (item) {
      let vm = this
      let servers = vm.selectedTab === 'draft' ? vm.$services.backendService.manageNoticeRestController.delete : vm.$services.backendService.noticeFailRecordRestController.delete
      vm.$net.send({
        server: servers,
        append: item.id   
      }).then(data => {
        if (data.code === 200) {
          vm.selectedTab ==='draft' ? vm.$refs.draftListTable.refresh() : (vm.radioG === '系统通知' ? vm.$refs.failTable.refresh() : vm.$refs.failTable2.refresh())
          vm.$Message.success('删除成功')
        } else {
          vm.$Message.error(`${data.code}:${data.message}`)
        }
      }).catch(error => {
        vm.$Message.error(error.reason)
      })
    },

    // 批量删除
    deleteLotSize () {
      let vm = this
      if (vm.selectedList.length === 0) {
        vm.$Message.warning('请选择要删除的数据')
        return false
      }
     
      vm.$Modal.confirm({
        title: '批量删除提示',
        content: '您确定要删除已勾选的数据吗?',
        onOk: () => {
          let ids = vm.selectedList.map(item => item.id)
          vm.$net.send({
            server: vm.$services.backendService.manageNoticeRestController.batchDelete,
            data: ids
          }).then(data => {
            if (data.code === 200) {
              vm.selectedList = []
              vm.$refs.draftListTable.refresh()
              vm.$Message.success('删除成功')
            } else {
              vm.$Message.error(`${data.code}:${data.message}`)
            }
          }).catch(error => {
            vm.$Message.error(error.reason)
          })
        }
      })
    },

    //批量删除管理或系统
    deleteLotSizeFail () {
      let vm = this
      if (vm.selectedList.length === 0) {
        vm.$Message.warning('请选择要删除的数据')
        return false
      }
     
      vm.$Modal.confirm({
        title: '批量删除提示',
        content: '您确定要删除已勾选的数据吗?',
        onOk: () => {
         
          let servers = vm.$services.backendService.noticeFailRecordRestController.bathDelete
           let ids = vm.selectedList.map(item => item.id)
          vm.$net.send({
            server: servers,
            data: ids
          }).then(data => {

            if (data.code === 200) {
              vm.selectedList = []
              vm.radioG === '系统通知' ? vm.$refs.failTable.refresh() : vm.$refs.failTable2.refresh()
              vm.$Message.success('删除成功')
            } else {
              vm.$Message.error(`${data.code}:${data.message}`)
            }
          }).catch(error => {
            vm.$Message.error(error.reason)
          })
        }
      })
    },

    // 单个发送
    sendNotices (item) {
      let vm = this
      vm.$Modal.confirm({
        title: '发送提示',
        content: '您确定要发送这条数据吗?',
        onOk: () => {
          let params = {
            sender: storage.getItem('user').staffCode,
            senderName: storage.getItem('user').staffName,
            ids: [item.id]
          }

          vm.$net.send({
            server: vm.$services.backendService.manageNoticeRestController.batchSendManageNotice,
            data: params
          }).then(data => {
            if (data.code === 200) {
              if (data.data.length === 0) {
                vm.$Message.success('已发送！')
              } else {
                let returnData = data.data[0]
                if (returnData.faileNum === 0) {
                  vm.$Message.success('全部发送成功')
                } else if (returnData.succNum === 0) {
                  vm.$Message.error('全部发送失败')
                } else {
                  vm.$Message.info(returnData.succNum + '个发送成功，' + returnData.faileNum + '个发送失败')
                }
                vm.$refs.draftListTable.refresh()
              }
            } else {
              vm.$Message.error(`${data.code}:${data.message}`)
            }
          }).catch(error => {
            vm.$Message.error(error.reason)
          })
        }
      })
    },

    sendNoticesFail (item) {
      let editfor = {
        noticeContent: item.noticeContent,
        addressee: item.acceptFailPhone,
        addresseeName: item.acceptFailName,
        sender: storage.getItem('user').staffCode,
        senderName: storage.getItem('user').staffName,
        sendSts: 'Y',
        id: item.id
      }
      let vm = this
      vm.$Modal.confirm({
        title: '发送提示',
        content: '您确定要发送这条数据吗?',
        onOk: () => {
          vm.$net.send({
            server: vm.server.send,
            data: editfor
          }).then(data => {
            if (data.code === 200) {
              if (data.data.length === 0) {
                vm.$Message.success('已发送！')
              } else {
                let returnData = data.data[0]
                if (returnData.faileNum === 0) {
                  vm.$Message.success('全部发送成功')
                } else if (returnData.succNum === 0) {
                  vm.$Message.error('全部发送失败')
                } else {
                  vm.$Message.info(returnData.succNum + '个发送成功，' + returnData.faileNum + '个发送失败')
                }
                vm.$refs.failTable2.refresh()
              }
            } else {
              vm.$Message.error(`${data.code}:${data.message}`)
            }
          }).catch(error => {
            vm.$Message.error(error.reason)
          })
        }
      })
    },

    // 批量发送
    sendLotSize () {
      let vm = this

      if (vm.selectedList.length === 0) {
        vm.$Message.warning('请选择要发送的数据')
        return false
      }

      let ids = vm.selectedList.map(item => item.id)
      let params = {
        sender: storage.getItem('user').staffCode,
        senderName: storage.getItem('user').staffName,
        ids: ids
      }

      vm.$Modal.confirm({
        title: '批量发送提示',
        content: '您确定要发送已勾选的数据吗?',
        onOk: () => {
          vm.$net.send({
            server: vm.$services.backendService.manageNoticeRestController.batchSendManageNotice,
            data: params
          }).then(data => {
            if (data.code === 200) {
              if (data.data.length === 0) {
                vm.$Message.success('已发送！')
              } else {
                let returnData = data.data[0]
                if (returnData.faileNum === 0) {
                  vm.$Message.success('全部发送成功')
                } else if (returnData.succNum === 0) {
                  vm.$Message.error('全部发送失败')
                } else {
                  vm.$Message.info(returnData.succNum + '个发送成功，' + returnData.faileNum + '个发送失败')
                }
                vm.selectedList = []
                vm.$refs.draftListTable.refresh()
              }
            } else {
              vm.$Message.error(`${data.code}:${data.message}`)
            }
          }).catch(error => {
            vm.$Message.error(error.reason)
          })
        }
      })
    },

    RadioGroupChange (Name){
      let vm = this
      let route = { ...this.$router.currentRoute }
      vm.radioG = Name
      route.query = { ...route.query, radioG: vm.radioG }
      vm.$router.replace(route)
      vm.$nextTick(() => {
        vm.radioG === '系统通知' ? vm.$refs.failTable.refresh() : vm.$refs.failTable2.refresh()
      })
    }
  }
}
</script>



<style scoped>
.nlTabBox {
  position: relative;
}
.nlBtnBox {
  position: absolute;
  top: -5px;
  right: 0;
  text-align: right;
}
.nlBtnItem {
  margin-left: 10px;
}

.nlPageBox {
  margin-top: 10px;
  margin-bottom: 0;
  text-align: right;
}
</style>

<style>
.nlBox .j-table-header,
.nlBox .j-table-toolbar {
  display: none;
}
</style>

