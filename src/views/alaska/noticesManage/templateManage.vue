<template>
  <Card class="tmBox">
    <p slot="title">{{ '内容配置（' + title + '）'}}</p>

    <div class="tmOperationBtnBox" v-if="type === 1">
      <Button class="mOperationBtnItem" type="primary" icon="trash-a" @click="deleteLotSize">批量删除</Button>
      <Button class="mOperationBtnItem" type="primary" icon="android-add" @click="addNewTemplate">新增</Button>
    </div>

    <j-table
      ref="templateManageTable"
      autoSearch
      :queryForm.sync="queryForm"
      :server="server.query"
      :columns-list="columns"
      :hiddenForm="true"
      :showQuery="false"
      v-model="tableData"
      @requestSuccess="requestSuccess"
      @on-view="viewDetails"
      @on-edit="editDetails"
      @on-delete="deleteDetails"
      @on-selection-change="selectChange"
      @on-select-all="selectChange">
    </j-table>

    <div align="center">
      <Button type="ghost" @click="btnBack" style="margin:0 11px; height: 40px; width: 100px;">返回</Button>
    </div>

    <editTemplateDialog
      v-model="showEditTemplate"
      :operateObj="operateObj"
      @saveTemplate="$refs.templateManageTable.refresh()">
    </editTemplateDialog>
  </Card>
</template>

<script>
import editTemplateDialog from './editTemplateDialog'
export default {
  data () {
    return {
      title: this.$route.query.title,
      type: this.$route.query.type,
      showEditTemplate: false, // 显示模板编辑弹框
      tableData: [],
      selectedList: [], // 选择的数据
      operateObj: {}, // 当前操作的对象
      server: {
        query: this.$services.backendService.noticeTemplateRestController.query
      },
      queryForm: {
        __EQS_rnId: this.$route.query.id
      },

      columns: [
        { type: 'selection', align: 'center', width: 60 },
        { title: '序号', type: 'index', align: 'center', width: 60 },
        { title: '通知渠道', key: 'noticeChannelNmame', align: 'center', width: 180 },
        { title: '通知类型', key: 'noticeTypeNmame', align: 'center', width: 120 },
        { title: '模板内容', key: 'noticeContent', align: 'center' },
        { title: '创建日期', key: 'createdTime', align: 'center', width: 120 },
        { title: '操作', align: 'center', key: 'action', width: 90, handler: [
          // { action: 'view' },
          { action: 'edit' },
          { action: 'delete' },
        ]}
      ]
    }
  },

  components: {
    editTemplateDialog
  },

  methods: {
    requestSuccess (data) {
      let vm = this
      let channelMap = {
        longxin: '龙信端应用/公众号',
        web: 'web端',
        applets: '小程序',
        SMS: '短信'
      }

      let typeMap = {
        '1': '待领取',
        '2': '待受理',
        '3': '新工单',
        '4': '倒计时到期',
        '5': '更新状态'
      }
      vm.type = vm.$route.query.type
      vm.tableData = data.map(item => {
        item.noticeChannelNmame = channelMap[item.noticeChannel] || item.noticeChannel || ''
        item.noticeTypeNmame = typeMap[item.noticeType] || item.noticeType || ''
        item.createdTime = item.createdTime ? item.createdTime.split(' ')[0] : ''
        item.ifHiddenDelete = vm.type === 0
        return item
      })
    },

    // 新增
    addNewTemplate () {
      this.operateObj = {}
      this.showEditTemplate = true
    },

    // 修改
    editDetails (item) {
      this.operateObj = item
      this.showEditTemplate = true
    },

    // 查看详情
    viewDetails (item) {
      this.$router.push({
        path: '/noticesDetails',
        query: {
          id: item.id,
          type: 'template'
        }
      })
    },

    // 删除
    deleteDetails (item) {
      let vm = this
      vm.$net.send({
        server: vm.$services.backendService.noticeTemplateRestController.delete,
        append: item.id
      }).then(data => {
        if (data.code === 200) {
          vm.$refs.templateManageTable.refresh()
          vm.$Message.success('删除成功')
        } else {
          vm.$Message.error(`${data.code}:${data.message}`)
        }
      }).catch(error => {
        vm.$Message.error(error.reason)
      })
    },

    // 选择/取消选择,列表的多选框
    selectChange (selection) {
      this.selectedList = selection
    },

    deleteLotSize () {
      let vm = this
      if (vm.selectedList.length === 0) {
        vm.$Message.warning('请选择需要删除的数据')
      } else {
        vm.$Modal.confirm({
          title: '批量删除提示',
          content: '您确定要删除已勾选的数据吗?',
          onOk: () => {
            let ids = vm.selectedList.map(item => item.id)
            vm.$net.send({
              server: vm.$services.backendService.noticeTemplateRestController.batchDelete,
              data: ids
            }).then(data => {
              if (data.code === 200) {
                vm.selectedList = []
                vm.$refs.templateManageTable.refresh()
                vm.$Message.success('删除成功')
              } else {
                vm.$Message.error(`${data.code}:${data.message}`)
              }
            }).catch(error => {
              vm.$Message.error(error.reason)
            })
          }
        })
      }
    },

    // 返回按钮
    btnBack () {
      this.$router.go(-1)
      this.$store.commit('closePage', 'templateManage')
      this.$store.commit('removeTag', 'templateManage')
    }
  }
}
</script>

<style scoped>
.tmOperationBtnBox {
  text-align: right;
  margin-bottom: 0;
}
.mOperationBtnItem {
  margin-left: 10px;
}
</style>
