<template>
  <Card class="aplBox">
    <p slot="title">申请人信息管理</p>
    <j-table ref="applyPeopleListTable" pagination autoSearch
      :queryForm.sync="queryForm"
      :server="server.query"
      :columns-list="columns"
      v-model="tableData"
      @btnReset="resetQueryForm"
      @requestSuccess="requestSuccess">
      <template slot="input">
        <Row>
          <FormItem label="申请人编号:">
            <Input
              placeholder="请输入申请人编号"
              :maxlength="12"
              v-model.trim="queryForm.__LIKES_clienteleNo"
              @on-change="changeNumber('__LIKES_clienteleNo')">
            </Input>
          </FormItem>
          <FormItem label="手机号码:">
            <Input
              placeholder="请输入手机号码"
              :maxlength="11"
              v-model.trim="queryForm.__LIKES_thirdCustomerPhone"
              @on-change="changeNumber('__LIKES_thirdCustomerPhone')">
            </Input>
          </FormItem>
          <FormItem label="渠道编号:">
            <Input
              placeholder="请输入渠道编号"
              :maxlength="12"
              v-model.trim="queryForm.__LIKES_channelNo"
              @on-change="changeChannelNo">
            </Input>
          </FormItem>
          <FormItem label="渠道名称:">
            <Select clearable v-model="queryForm.__EQS_channelName">
              <Option v-for="item in channelJson" :key="item.value" :value="item.value">
                {{ item.label }}
              </Option>
            </Select>
          </FormItem>
          <FormItem label="第三方客户号:">
            <Input v-model.trim="queryForm.__LIKES_thirdCustomerNo" :maxlength="40" placeholder="请输入第三方客户号"></Input>
          </FormItem>
        </Row>
      </template>
    </j-table>
  </Card>
</template>

<script>
export default {
  data () {
    return {
      tableData: [], // 表格数据

      queryForm: {
        __LIKES_clienteleNo: '', // 申请人编号
        __LIKES_thirdCustomerPhone: '', // 手机号码
        __LIKES_channelNo: '', // 渠道编号
        __EQS_channelName: '', // 渠道名称
        __LIKES_thirdCustomerNo: '', // 第三方客户号
        sortName: 'clienteleNo',
        sortOrder: 'DESC'
      },

      server: {
        query: this.$services.backendService.extraRestController.list
      },

      // 去到名称下拉框数据
      channelJson: [
        { value: '', label: '全部' },
        { value: '阿拉私家', label: '阿拉私家' }
        // { value: 'QD2019052001', label: '阿拉私家' }
      ],

      columns: [
        { type: 'index', title: '序号', align: 'center', width: 60 },
        { title: '申请人编号', align: 'center', key: 'clienteleNo' },
        { title: '手机号码', align: 'center', key: 'thirdCustomerPhone' },
        { title: '渠道编号', align: 'center', key: 'channelNo' },
        { title: '渠道名称', align: 'center', key: 'channelName' },
        { title: '第三方客户号', align: 'center', key: 'thirdCustomerNo' }
      ]
    }
  },

  methods: {
    requestSuccess (data) {
    },

    // 重置
    resetQueryForm () {
      let vm = this
      vm.queryForm.__LIKES_clienteleNo = ''
      vm.queryForm.__LIKES_thirdCustomerPhone = ''
      vm.queryForm.__LIKES_channelno = ''
      vm.queryForm.__EQS_channelName = ''
      vm.queryForm.__LIKES_thirdCustomerNo = ''
    },

    // 现在手机号只能输数字
    changeNumber (type) {
      let vm = this
      let value = vm.queryForm[type]
      value = value.replace(/\D/g, '')
      vm.$nextTick(() => {
        vm.queryForm[type] = value
      })
    },

    // 限制渠道编号只能输数字、字母
    changeChannelNo () {
      let vm = this
      let value = vm.queryForm.__LIKES_channelNo
      value = value.replace(/[^\w]/g, '')
      vm.$nextTick(() => {
        vm.queryForm.__LIKES_channelNo = value
      })
    }
  }
}
</script>

<style scoped>
</style>
