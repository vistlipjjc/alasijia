<template>
  <Card class="lilBox">
    <p slot="title">借款意向管理</p>
    <j-table ref="loanIntentionListTable"
      pagination
      autoSearch
      :autoCache="true"
      :showExport="true"
      :queryForm.sync="queryForm"
      :server="server.query"
      :columns-list="columns"
      v-model="tableData"
      @btnReset="resetQueryForm"
      @requestSuccess="requestSuccess"
      @on-view="viewDetails"
      @export-btn="exportData"
      @updateStatus="updateStatus"
      @assignManager="assignManager">
      <template slot="input">
        <Row>
          <FormItem label="借款编号:">
            <Input
              placeholder="请输入借款编号"
              :maxlength="17"
              v-model.trim="queryForm.lendNo"
              @on-change="changeNo('lendNo')">
            </Input>
          </FormItem>
          <FormItem label="联系方式:">
            <Input
              placeholder="请输入手机号码"
              :maxlength="11"
              v-model.trim="queryForm.clientelePhone"
              @on-change="changePhone">
            </Input>
          </FormItem>
          <FormItem label="申请时间:">
            <div class="lilTimeBox">
              <div class="lilTimeItem">
                <DatePicker type="date"
                  v-model="queryForm.applyStartTime"
                  :options="startOptions"
                  @on-change="changeStartTime">
                </DatePicker>
              </div>
              <div class="lilTimeLine">-</div>
              <div class="lilTimeItem">
                <DatePicker type="date"
                  v-model="queryForm.applyEndTime"
                  :options="endOptions"
                  @on-change="changeEndTime">
                </DatePicker>
              </div>
            </div>
          </FormItem>
          <FormItem label="渠道名称:">
            <Select clearable v-model="queryForm.channelName">
              <Option v-for="item in channelList" :key="item.value" :value="item.value">
                {{ item.label }}
              </Option>
            </Select>
          </FormItem>
          <FormItem label="房屋所在地:">
            <Cascader
              change-on-select
              :data="areaJson"
              v-model="areaValue"
              @on-change="changeRegion">
            </Cascader>
          </FormItem>
          <FormItem label="受理状态:">
            <Select clearable v-model="queryForm.acceptFlag">
              <Option v-for="item in acceptFlagList" :key="item.value" :value="item.value">
                {{ item.label }}
              </Option>
            </Select>
          </FormItem>
          <FormItem label="受理人:">
            <Input placeholder="请输入受理人" :maxlength="30" v-model.trim="queryForm.realName"></Input>
          </FormItem>
          <FormItem label="所属机构:">
            <Cascader
              change-on-select
              :data="organizationJson"
              v-model="organizationValue"
              @on-change="changeOrganization">
            </Cascader>
          </FormItem>
          <FormItem label="产品分类:">
            <j-select ref="productType"
                      url="dict:productType@sys"
                      v-model="queryForm.productType"
                      @on-change="onSelect('productType','packageName')"
                      clearable
                      style="width: 100%"
                      placeholder="请选择产品分类">
            </j-select>
          </FormItem>
        </Row>
      </template>
    </j-table>

    <!-- 修改状态弹框 -->
    <updateStatus
      v-model="showUpdateDialog"
      :currentItem="operateObj"
      :list="acceptFlagListTwo"
      @confirmStatus="confirmStatus">
    </updateStatus>

    <!-- 指派客户经理 -->
    <assignManager
      v-model="showAssignDialog"
      :currentItem="operateObj"
      :organizationObject="organizationObject"
      @confirmAssign="confirmAssign">
    </assignManager>
  </Card>
</template>

<script>
import moment from 'moment'
import app from "@/config/app"
import updateStatus from './updateStatus'
import assignManager from './assignManager'
import axios from 'axios'
import store from '@/store'
const areaJson = require('@/util/area.json')

export default {
  data () {
    return {
      showUpdateDialog: false, // 显示修改状态弹框
      showAssignDialog: false, // 显示指派客户经理的弹框
      tableData: [], // 表格数据
      areaValue: [], // 省市区已选数据
      areaJson: areaJson, // 省市区级联数据
      organizationJson: [], // 受理机构
      organizationValue: [], // 已选受理机构
      operateObj: {}, // 操作的对象
      organizationObject: {}, // 全部机构的键值对格式

      queryForm: {
        lendNo: '', // 借款编号
        clientelePhone: '', // 联系方式
        applyStartTime: '', // 申请开始时间
        applyEndTime: '', // 申请结束时间
        channelName: '', // 渠道名称
        houseCity: '', // 房屋所在地
        acceptFlag: '', // 受理状态
        realName: '', // 受理人
        orgId: '', // 所属机构
        productType: '', // 套餐分类
        packageName: '' // 套餐名称
      },

      server: {
        query: this.$services.backendService.consumerDetailsRestController.findDebitByPage
      },

      // 开始时间额外配置
      startOptions: {
        disabledDate (date) {
          return date && date.valueOf() > Date.now()
        }
      },

       // 结束时间额外配置
      endOptions: {
        disabledDate (date) {
          return date && date.valueOf() > Date.now()
        }
      },

      // 渠道名称
      channelList: [
        { value: '', label: '全部' },
        { value: '阿拉私家', label: '阿拉私家' }
      ],

      // 受理状态
      acceptFlagList: [],
      acceptFlagListTwo: [],
      acceptFlagMap: {},

      columns: [
        { type: 'index', title: '序号', align: 'center', width: 60 },
        { title: '借款编号', align: 'center', key: 'lendNo', width: 90 },
        { title: '客户姓名', align: 'center', key: 'clienteleName', width: 75 },
        { title: '联系方式', align: 'center', key: 'clientelePhone', width: 95 },
        { title: '房屋所在地', align: 'center', key: 'houseCity', minWidth: 90 },
        { title: '渠道名称', align: 'center', key: 'channelName', width: 75 },
        { title: '申请时间', align: 'center', key: 'applyDate', width: 90 },
        { title: '受理状态', align: 'center', key: 'acceptFlagName', width: 75 },
        { title: '受理人', align: 'center', key: 'realName', width: 75 },
        { title: '所属机构', align: 'center', key: 'orgName', minWidth: 150 },
        { title: '服务费率', align: 'center', key: 'serviceRate', width: 75 },
        { title: '预计服务费', align: 'center', key: 'advancePayment', width: 75 },
        { title: '应收服务费', align: 'center', key: 'actualPayment', width: 75 },
        { title: '产品分类', align: 'center', key: 'productType', formatter: 'dict:productType@sys', width: 75 },
        { title: '套餐名称', align: 'center', key: 'packageName', width: 75 },
        { title: '工单进度', align: 'center', key: 'step', width: 75 ,
          render: (h, params) => {
            return h('Progress', {
              props: {
                percent: params.row.stepValue,
                status: params.row.stepType,
                'hide-info': 'hide-info'
              }
            })
          }
        },
        { title: '操作', align: 'center', key: 'action', width: 100, handler: [
          { action: 'view' },
          { action: 'otherskip', icon: 'settings', content: '修改状态', envent:'updateStatus' },
          { action: 'otherskip', icon: 'person-add', content: '指派客户经理', envent: 'assignManager' }
        ]}
      ]
    }
  },

  components: {
    updateStatus,
    assignManager
  },

  created () {
    this.getAcceptFlag()
    this.getOrganization()
  },

  methods: {
    // 获取渠道方、受理机构
    getOrganization () {
      let vm = this
      vm.$net.send({
        server: vm.$services.backendService.organizationRestController.getOrganizationTree
      }).then(data => {
        if (data.code === 200) {
          let organizationJson = JSON.stringify(data.data)
          organizationJson = organizationJson.replace(/orgNo/g, 'value').replace(/title/g, 'label')
          organizationJson = JSON.parse(organizationJson)

          organizationJson.forEach(item => {
            if (item.value === 'ZJF') {
              vm.organizationJson = item.children
            }
          })

          vm.changeArrayToObject(organizationJson)
        } else {
          vm.$Message.error(`${data.code}:${data.message}`)
        }
      }).catch(error => {
        vm.$Message.error(error.reason)
      })
    },

    // 获取受理状态
    getAcceptFlag () {
      let vm = this
      vm.$net.send({
        server: vm.$services.sysService.dictItemRestController.getDictItems,
        append: 'acceptFlag'
      }).then(data => {
        let acceptFlagList = []
        let excludeListValue = ['02', '03', '04']

        data.forEach(item => {
          let newItem = {
            value: item.value,
            label: item.name
          }

          vm.acceptFlagMap[item.value] = item.name

          if (!excludeListValue.includes(item.value)) {
            acceptFlagList.push(newItem)
          }
        })

        vm.acceptFlagList = [ ...acceptFlagList ]
        vm.acceptFlagListTwo = [ ...acceptFlagList ]
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
    getParentName (orgId, index) {
      let vm = this
      if (vm.organizationObject[orgId]) {
        if (vm.organizationObject[orgId].parentId) {
          let newOrgName = vm.organizationObject[orgId].label || ''
          let oldOrgName = vm.tableData[index].orgName
          vm.tableData[index].orgName = oldOrgName ? `${newOrgName} ${oldOrgName}` : newOrgName
          vm.getParentName(vm.organizationObject[orgId].parentId, index)
        }
      }
    },

    // 请求成功后，数据处理
    requestSuccess (data) {
      let vm = this
      setTimeout(() => {
        vm.tableData = []
        data.forEach((item, index) => {
          item.applyDate = item.applyDate ? moment(item.applyDate).format('YYYY-MM-DD HH:mm') : ''
          item.advancePayment = item.advancePayment ? item.advancePayment + '元' : ''
          item.actualPayment = item.actualPayment ? item.actualPayment + '元' : ''
          // item.fundDemandRate = item.fundDemand ? item.serviceRate * item.fundDemand + '元' : ''
          // item.grantAmtRate = item.grantAmt ? item.serviceRate * item.grantAmt + '元' : ''
          item.serviceRate = item.serviceRate * 100 + '%'
          item.acceptFlagName = vm.acceptFlagMap[item.acceptFlag] || item.acceptFlag || ''
          item.stepValue = vm.getStatusToStep(item.acceptFlag).value
          item.stepType = vm.getStatusToStep(item.acceptFlag).type
          vm.tableData.push(item)
          vm.getParentName(item.orgId, index)
        })
      }, 0)
    },

    // 匹配当前状态的进度
    getStatusToStep (acceptFlag) {
      let currentStep = ''
      let flag = acceptFlag.substring(0, 2)
      if (acceptFlag === '0X' || flag === '04' || acceptFlag === '00') {
        currentStep = {value: 0, type: 'normal'} // 待领取（待分配、退单、待领取）
      } else if (acceptFlag === '01' || acceptFlag === '0204') {
        currentStep = {value: 20, type: 'normal'} // 已领取（待受理、暂无人接听）
      } else if (acceptFlag === '0203') {
        currentStep = {value: 40, type: 'normal'} // 已确认意向（待收集资料）
      } else if (acceptFlag === '0201') {
        currentStep = {value: 60, type: 'normal'} // 已收集资料（待审核）
      } else if (acceptFlag === '0202') {
        currentStep = {value: 80, type: 'normal'} // 已审核（待放款）
      } else if (acceptFlag === '0301') {
        currentStep = {value: 100, type: 'normal'} // 已放款（已放款）
      } else {
        currentStep = {value: 99.99, type: 'wrong'}
      }
      return currentStep
    },

    // 下拉框选择
    onSelect(value, name) {
      let obj = this.$refs[value].getSelect();
      this.queryForm[value] = obj.value;
      this.queryForm[name] = obj.name;
    },

    // 重置
    resetQueryForm () {
      let vm = this
      vm.areaValue = []
      vm.organizationValue = []
      vm.queryForm.lendNo = ''
      vm.queryForm.clientelePhone = ''
      vm.queryForm.applyStartTime = ''
      vm.queryForm.applyEndTime = ''
      vm.queryForm.channelName = ''
      vm.queryForm.houseCity = ''
      vm.queryForm.acceptFlag = ''
      vm.queryForm.realName = ''
      vm.queryForm.orgId = ''
      vm.queryForm.productType = ''
      vm.queryForm.packageName = ''
      vm.startOptions = { // 开始时间额外配置
        disabledDate (date) {
          return date && date.valueOf() > Date.now()
        }
      }
      vm.endOptions = { // 开始时间额外配置
        disabledDate (date) {
          return date && date.valueOf() > Date.now()
        }
      }
    },

    // 选择省市区
    changeRegion (value, selectedData) {
      let vm = this
      vm.queryForm.houseCity = ''
      if (selectedData.length > 0) {
        selectedData.forEach(item => {
          vm.queryForm.houseCity = vm.queryForm.houseCity ? `${vm.queryForm.houseCity} ${item.label}` : item.label
        })
      }
    },

     // 选择受理机构
    changeOrganization (value, selectedData) {
      this.queryForm.orgId = value.length > 0 ? value[value.length - 1] : ''
    },

    // 查看详情
    viewDetails (item) {
      this.$router.push({
        path: '/loanIntentionView',
        query: {
          lendNo: item.lendNo,
          region: item.region,
          showBtn: true
        }
      })
    },

    // 导出
    exportData () {
      let vm = this
      let url = app.url.server + vm.$services.backendService.consumerDetailsRestController.exportOrderInfo.url
      let params = { ...vm.queryForm }
      params.applyStartTime = params.applyStartTime ? moment(params.applyStartTime).format('YYYY-MM-DD 00:00:00') : ''
      params.applyEndTime = params.applyEndTime ? moment(params.applyEndTime).format('YYYY-MM-DD 23:59:59') : ''

      axios.get(
        url,
        {
          headers: {'x-user-token': store.getters.userToken},
          params: params,
          responseType:'blob'
        }
      ).then(data=>{
        let dataurl = window.URL.createObjectURL(data.data) //表示一个指定的file对象或Blob对象
        let a = document.createElement('a')
        document.body.appendChild(a)
        a.href = dataurl
        a.download = '借款意向信息表.xlsx' //命名下载名称
        a.click(); //点击触发下载
        window.URL.revokeObjectURL(dataurl)  //下载完成进行释放
        this.$Message.success('导出成功！')
      })
    },

    // 修改状态
    updateStatus (item) {
      let vm = this
      vm.operateObj = item
      vm.showUpdateDialog = true
    },

    // 修改状态弹框的确认
    confirmStatus (acceptFlag) {
      let vm = this
      vm.tableData = vm.tableData.map(item => {
        if (item.lendNo === vm.operateObj.lendNo) {
          item.acceptFlag = acceptFlag
          item.acceptFlagName = vm.acceptFlagMap[acceptFlag]
        }
        return item
      })
    },

    // 指派客户经理
    assignManager (item) {
      let vm = this
      vm.operateObj = item
      vm.showAssignDialog = true
    },

    // 指派客户经理弹框的确认
    confirmAssign () {
      this.$refs.loanIntentionListTable.refresh()
    },


    // 修改开始时间
    changeStartTime (date, dateType) {
      let vm = this
      vm.queryForm.applyStartTime = date ? moment(date).format('YYYY-MM-DD 00:00:00') : ''
      vm.endOptions = {
        disabledDate (date) {
          return date && moment(date).valueOf() < moment(vm.queryForm.applyStartTime).valueOf() || date.valueOf() > Date.now()
        }
      }
    },

    // 修改结束时间
    changeEndTime (date, dateType) {
      let vm = this
      vm.queryForm.applyEndTime = date ? moment(date).format('YYYY-MM-DD 23:59:59') : ''
      vm.startOptions = {
        disabledDate (date) {
          return date && moment(date).valueOf() > moment(vm.queryForm.applyEndTime).valueOf()
        }
      }
    },

    // 借款编号只能输入字母和数字
    changeNo (type) {
      let vm = this
      let value = vm.queryForm[type]
      value = value.replace(/[^\w]/g, '')
      vm.$nextTick(() => {
        vm.queryForm[type] = value
      })
    },

    // 现在手机号只能输数字
    changePhone () {
      let vm = this
      let value = vm.queryForm.clientelePhone
      value = value.replace(/\D/g, '')
      vm.$nextTick(() => {
        vm.queryForm.clientelePhone = value
      })
    }
  }
}
</script>

<style scoped>
.lilTimeBox {
  display: flex;
  align-items: center;
}
.lilTimeItem {
  flex-grow: 1;
}
.lilTimeLine {
  width: 20px;
  text-align: center;
}
</style>
<style>
    .lilBox .ivu-progress-inner {
        border: 1px solid #999999;
    }
</style>