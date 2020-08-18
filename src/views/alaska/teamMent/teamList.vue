<template>
    <div class="cust">
        <Card>
            <p slot="title">团队管理</p>
            <j-table ref="teamListTable" pagination autoSearch
                     :autoCache="true"
                     :queryForm.sync="queryForm"
                     :server="server.query"
                     :columns-list="columns"
                     v-model="tableData"
                     @btnReset="resetQueryForm"
                     @requestSuccess="requestSuccess"
                     @on-edit="editDetails"
                     @on-delete="remove"
                     @on-team="teamMent">
                <template slot="input">
                    <Row>
                        <FormItem label="团队编号:">
                            <Input v-model.trim="queryForm.teamCode" clearable placeholder="请输入" :maxlength="8" @on-keyup="letterOrNumChange('teamCode')"></Input>
                        </FormItem>
                        <FormItem label="团队名称:">
                            <Input v-model.trim="queryForm.teamName" clearable placeholder="请输入" :maxlength="15"></Input>
                        </FormItem>
                    </Row>
                </template>
                <template slot="toolbar">
                    <Button class="mOperationBtnItem" type="primary" icon="android-add" @click="$router.push({path: '/teamEdit/add'})">新增团队</Button>
                </template>
            </j-table>
        </Card>
    </div>
</template>

<script>
  import moment from 'moment'
  export default {
    data() {
      return {
        server: {
          query: this.$services.backendService.managerTeamRestController.query
        },

        queryForm: {
          teamCode: '',
          teamName: ''
        },

        tableData: [],
        columns: [
          { type: 'index', title: '序号', align: 'center', width: 60 },
          { title: '团队编号', align: 'center', key: 'teamCode', minWidth: 90 },
          { title: '团队名称', align: 'center', key: 'teamName', minWidth: 90 },
          { title: '团队描述', align: 'center', key: 'teamDescribe', minWidth: 90 },
          { title: '创建时间', align: 'center', key: 'createdTime', minWidth: 90 },
          { title: '操作', align: 'center', key: 'action', width: 120, handler: [
            {action: 'edit'},
            {action: 'otherskip', icon: 'trash-a', content: '删除', envent:'on-delete'},
            {action: 'otherskip', icon: 'ios-people', content: '成员管理', envent:'on-team'}
          ]}
        ],
      }
    },

    methods: {
      // 表格数据请求后的处理
      requestSuccess (data) {
        let resData = data
        resData.forEach(item => {
          item.createdTime = moment(item.createdTime).format('YYYY-MM-DD HH:mm')
        })
      },

      // 清除查询条件
      resetQueryForm () {
        this.queryForm = {
          teamCode: '',
          teamName: ''
        }
      },

      // 数字的的输入控制
      letterOrNumChange (name) {
        this.queryForm[name] = this.queryForm[name].replace(/[\W]/g,'')
      },

      // 跳转编辑页面
      editDetails (row) {
        this.$router.push({
          path: '/teamEdit/edit',
          query: {
            teamCode: row.teamCode
          }
        })
      },

      // 表格单条数据删除
      remove (row) {
        this.$Modal.confirm({
          title: '提示',
          content: '是否删除该团队？',
          onOk: () => {
            this.$net.send({
              server: this.$services.backendService.managerTeamRestController.delete,
              append: row.teamCode
            }).then((data) => {
              if (data.success) {
                this.$Message.success('删除成功！')
                this.$refs.teamListTable.refresh()
              } else {
                this.$Message.error(data.message)
              }
            })
          }
        })
      },

      // 成员管理
      teamMent (row) {
        this.$router.push({
          path: '/teamMemberList/' + row.teamCode
        })
      }

    }
  }
</script>