<template>
    <Card class="tmBox">
        <p slot="title">通知规则管理</p>
        <j-table
                ref="noticesRegionDeployTable"
                autoSearch
                :server="server.query"
                :queryForm.sync="queryForm"
                :columns-list="columns"
                :showAdd="true"
                @add-btn="$router.push({path: '/noticesRegionEdit/add'})"
                v-model="tableData"
                @btnReset="resetQueryForm"
                @requestSuccess="requestSuccess"
                @on-edit="editDetails"
                @on-delete="deleteDetails"
                @on-send-ment="sendMent"
                @on-content-ment="contentMent">
            <template slot="input">
                <Row>
                    <FormItem label="通知规则名称:">
                        <Input v-model.trim="queryForm.title" placeholder="请输入" clearable :maxlength="15"></Input>
                    </FormItem>
                    <FormItem label="通知机构:">
                        <Input v-model.trim="queryForm.orgTitles" placeholder="请输入" clearable :maxlength="30"></Input>
                    </FormItem>
                    <FormItem label="状态:">
                        <j-select ref="sts"
                                  v-model="queryForm.sts"
                                  :optionList="stsList"
                                  @on-change="onSelect('sts','sts')"
                                  clearable
                                  style="width: 100%"
                                  placeholder="请选择状态">
                        </j-select>
                    </FormItem>
                </Row>
            </template>
        </j-table>

    </Card>
</template>

<script>
  import moment from 'moment'
  export default {
    data () {
      return {
        server: {
          query: this.$services.backendService.regionNoticeRestController.getRegionNoticeByPage
        },

        queryForm: {
          orgTitles: '', // 机构名称
          title: '', // 规则名字
          sts:'' // 状态
        },

        // 状态下拉查询
        stsList: [
          {value: 'Y', name: '启用'},
          {value: 'N', name: '禁用'}
        ],

        tableData: [],
        columns: [
          { title: '序号', type: 'index', align: 'center', width: 60 },
          { title: '通知规则名称', key: 'title', align: 'center', minWidth: 120 },
          { title: '通知机构', key: 'orgTitles', align: 'center', ellipsis: true, minWidth: 150 },
          { title: '创建时间', key: 'createdTime', align: 'center', width: 120 },
          { title: '状态', key: 'sts', align: 'center', width: 80 },
          { title: '操作', align: 'center', key: 'action', width: 180, handler: [
            { action: 'edit' },
            {action: 'otherskip', icon: 'trash-a', content: '删除', envent:'on-delete'},
            {action: 'otherskip', icon: 'ios-paperplane', content: '推送配置', envent:'on-send-ment'},
            {action: 'otherskip', icon: 'ios-paper-outline', content: '内容配置', envent:'on-content-ment'},
          ]}
        ]
      }
    },

    methods: {
      // 表格请求后数据处理
      requestSuccess (data) {
        let tableData = data
        tableData.forEach((item, index) => {
          item.sts = item.sts === 'Y' ? '启用' : '禁用'
          item.createdTime = item.createdTime ? moment(item.createdTime).format('YYYY-MM-DD HH:mm') : ''
          if (item.type === 0) {
            item.ifHiddenEdit = true
            item.isShowOtherskipIcon = 'trash-a'
            item.createdTime = ''
          }
        })
        this.tableData = tableData
      },

      // 清除查询条件
      resetQueryForm () {
        this.queryForm = {
          orgTitles: '', // 机构名称
            title: '', // 规则名字
            sts:'' // 状态
        }
      },

      // 编辑
      editDetails (row) {
        this.$router.push({
          path: '/noticesRegionEdit/edit',
          query: {
            id: row.id
          }
        })
      },

      // 删除
      deleteDetails (row) {
        let vm = this
        vm.$Modal.confirm({
          title: '提示',
          content: '是否确定删除该通知规则？',
          onOk: () => {
            console.log('row', row)
            vm.$net.send({
              server: vm.$services.backendService.regionNoticeRestController.delete,
              append: '?id=' + row.id
            }).then((data) => {
              if (data.success) {
                vm.$Message.success('删除成功！')
                vm.$refs.noticesRegionDeployTable.refresh()
              } else {
                vm.$Message.error(data.message)
              }
            });
          }
        })
      },

      // 推送配置
      sendMent (row) {
        this.$router.push({
          path: '/noticesDeploy',
          query: {
            id: row.id,
            title: row.title
          }
        })
      },

      // 内容配置
      contentMent (row) {
        this.$router.push({
          path: '/templateManage',
          query: {
            id: row.id,
            title: row.title,
            type: row.type
          }
        })
      },

      // 下拉框选择
      onSelect(value, name) {
        let obj = this.$refs[value].getSelect()
        this.queryForm[name] = obj.value
      },
    }
  }
</script>

<style>

</style>
