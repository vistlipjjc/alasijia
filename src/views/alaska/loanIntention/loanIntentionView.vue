<template>
  <Card class="livBox">
    <p slot="title">借款意向管理-详情</p>
    <div class="livMain">
      <div class="livCont">
          <div class="my-steps">
              <Steps :current="currentStep" :status="currentStatus">
                  <Step v-for="(item, index) in stepsList"
                        :title="item"
                        :icon="(currentStep === index && currentStatus !== 'error' ? 'ios-checkmark-outline' : '')"
                        :key="index">
                  </Step>
              </Steps>
          </div>

        <div class="livItem">
          <div class="livTitle">借款信息详情</div>
          <div class="livItemCont">
            <div class="livItemMsg">借款编号：{{ details.lendNo }}</div>
            <div class="livItemMsg">借款类型：{{ details.lendType }}</div>
            <div class="livItemMsg" v-if="details.productType === '01'">资金需求：{{ details.fundDemand }}</div>
            <div class="livItemMsg" v-else>套餐金额：{{ details.fundDemand }}</div>
            <div class="livItemMsg">申请时间：{{ details.applyDate }}</div>
            <div class="livItemMsg">渠道名称：{{ details.channelName }}</div>
            <div class="livItemMsg">渠道编号：{{ details.channelNo }}</div>
            <div class="livItemMsg">服务费率：{{ details.serviceRate }}</div>
            <div class="livItemMsg">预计服务费：{{ details.advancePayment }}</div>
            <div class="livItemMsg">应收服务费：{{ details.actualPayment }}</div>
            <div class="livItemMsg" v-if="details.productType !== '01'">商家名称：{{ details.merchantName }}</div>
            <div class="livItemMsg" v-if="details.productType !== '01'">商家地址：{{ details.merchantAddr }}</div>
            <div class="livItemMsg" v-if="details.productType !== '01'">合同编号：{{ details.contractNo }}</div>
            <div class="livItemMsg">产品分类：{{ details.productTypeName }}</div>
            <div class="livItemMsg">套餐名称：{{ details.packageName }}</div>
            <div class="livItemMsg" v-if="details.productType !== '01'">分期期数：{{ details.stages }}</div>
          </div>
        </div>

        <div class="livItem">
          <div class="livTitle">申请人基本信息</div>
          <div class="livItemCont">
            <div class="livItemMsg">客户号：{{ details.clienteleNo }}</div>
            <div class="livItemMsg">客户姓名：{{ details.clienteleName }}</div>
            <div class="livItemMsg">性别：{{ details.clienteleSex }}</div>
            <div class="livItemMsg">所在城市：{{ details.clienteleCity }}</div>
            <div class="livItemMsg">年收入：{{ details.clienteleIncome ? details.clienteleIncome + '万' : '' }}</div>
            <div class="livItemMsg">房屋所在地：{{ details.houseCity }}</div>
            <div class="livItemMsg">房屋大小：{{ details.houseSize ? details.houseSize + '㎡' : '' }}</div>
            <div class="livItemMsg">房屋户型：{{ details.houseType }}</div>
            <div class="livItemMsg">联系方式：{{ details.clientelePhone }}</div>
            <div class="livItemMsg">测算额度：{{ details.estimateAmt ? details.estimateAmt + '万' : '' }}</div>
            <div class="livItemMsg">房产价值估算：{{ details.houseValue ? details.houseValue + '万' : '' }}</div>
            <div class="livItemMsg">
              是否有公积金或社保：{{ details.clientFlag === 1 ? '是' : (details.clientFlag === 0 ? '否' : '')}}
            </div>
            <div class="livItemMsg">证件类型：{{ details.certificateType }}</div>
            <div class="livItemMsg">证件号码：{{ details.certificateNo }}</div>
            <div class="livItemMsg">详细地址：{{ details.houseDetail }}</div>
          </div>
        </div>

        <div class="livItem">
          <div class="livTitle">第三方客户信息</div>
          <div class="livItemCont">
            <div class="livItemMsg">第三方客户号：{{ details.thirdCustomerNo }}</div>
            <div class="livItemMsg">第三方客户姓名：{{ details.thirdCustomerName }}</div>
            <div class="livItemMsg">第三方联系方式：{{ details.thirdCustomerPhone }}</div>
            <div class="livItemMsg">第三方客户昵称：{{ details.thirdCustomerNickname }}</div>
            <div class="livItemMsg">渠道订单编号：{{ details.channelOrderCode }}</div>
          </div>
        </div>

        <div class="livItem">
          <div class="livTitle">受理信息</div>
          <div class="livItemCont">
            <div class="livItemMsg">受理状态：{{ details.acceptFlagName }}</div>
            <div class="livItemMsg">受理人：{{ details.realName }}</div>
            <div class="livItemMsg">所属机构：{{ details.agencyName }}</div>
            <div class="livItemMsg">审批金额(万)：{{ details.grantAmt }}</div>
            <div class="livItemMsg">审核不通过/其他原因：{{ details.unpassReason }}</div>
            <div class="livItemMsg">状态更新时间：{{ details.lsUpdatedTime }}</div>
            <div class="livItemMsg">工单来源：{{ details.orderType }}</div>
            <div class="livItemMsg">备注：{{ details.comment }}</div>
            <div class="livItemMsg">客户评价：{{ details.evaluation }}</div>
          </div>
        </div>
      </div>

      <div class="livTableBox">
        <div class="livTableTile">工单状态变更记录：</div>
        <div>
            <Table ref="recordTable" border :columns="columns" :data="tableData"></Table>
        </div>
        <div style="margin-top: 10px;">
          <div style="text-align: right;">
            <Page :total="total"
                  :current="queryForm.pageNumber"
                  :page-size="queryForm.pageSize"
                  placement="top"
                  @on-page-size-change="pageSizeChange"
                  @on-change="changePage"
                  show-sizer
                  show-total>
            </Page>
          </div>
        </div>
      </div>

      <div class="livBtnBox">
        <Button class="livBtn" type="ghost" icon="ios-undo" @click="turnBack" style="margin:0 11px; height: 40px; width: 100px;">返回</Button>
          <Button v-if="$route.query.showBtn" @click="modifyStatus" type="primary" style="margin:0 11px; height: 40px; width: 100px;">修改状态</Button>
          <Button v-if="$route.query.showBtn" @click="modifyManager" type="primary" style="margin:0 11px; height: 40px; width: 100px;">指派客户经理</Button>
      </div>
    </div>

      <!-- 修改状态弹框 -->
      <updateStatus
              v-model="showUpdateDialog"
              :currentItem="currentItem"
              :list="acceptFlagListTwo"
              @confirmStatus="confirmStatus">
      </updateStatus>

      <!-- 指派客户经理 -->
      <assignManager
              v-model="showAssignDialog"
              :currentItem="currentItem"
              :organizationObject="organizationObject"
              @confirmAssign="confirmAssign">
      </assignManager>

  </Card>
</template>

<script>
import moment from 'moment'
import updateStatus from './updateStatus'
import assignManager from './assignManager'
export default {
  components: {
    updateStatus,
    assignManager
  },

  data () {
    return {
      showUpdateDialog: false, // 显示修改状态弹框
      showAssignDialog: false, // 显示指派客户经理的弹框
      acceptFlagListTwo: [], // 状态下拉数据
      currentItem: {}, // 当前借款意向详情

      currentStep: 1, // 当前进度
      currentStatus: 'process', // 当前进度状态
      stepsList: [], // 状态进度条
      stepsUnnormalList: [], // 异常完结的状态

      queryForm: { // 变更记录的查询条件
        lendNo: '',
        pageSize: 10,
        pageNumber: 1
      },
      total: 0, // 变更记录的总条数
      tableData: [], // 变更记录

      details: {}, // 详情
      acceptFlagMap: {}, // 受理状态键值对对象
      organizationObject: {},
      organizationJson: [], // 机构树
      columns: [
        { type: 'index', title: '序号', align: 'center', width: 60 },
        { title: '变更后状态', align: 'center', key: 'changedTypeName' },
        { title: '变更后受理人', align: 'center', key: 'changedName' },
        { title: '所属机构', align: 'center', key: 'orgName' },
        { title: '变更时间', align: 'center', key: 'createdTime' },
        { title: '变更操作人', align: 'center', key: 'oparateName' },
      ]
    }
  },

  created () {
    this.getAcceptFlag()
  },

  methods: {
    // 获取受理状态
    getAcceptFlag () {
      let vm = this
      vm.$net.send({
        server: vm.$services.sysService.dictItemRestController.getDictItems,
        append: 'acceptFlag'
      }).then(data => {
        vm.acceptFlagListTwo = []
        let excludeListValue = ['02', '03', '04']
        data.forEach(item => {
          vm.acceptFlagMap[item.value] = item.name
          let newItem = {
            value: item.value,
            label: item.name
          }
          if (!excludeListValue.includes(item.value)) {
            vm.acceptFlagListTwo.push(newItem)
          }
        })
        vm.getOrganization()
      })
    },

    // 获取下拉树
    getOrganization () {
      let vm = this
      vm.$net.send({
        server: vm.$services.backendService.organizationRestController.getOrganizationTree,
      }).then((data) => {
        if (data.success) {
          let organizationJson = JSON.stringify(data.data)
          organizationJson = organizationJson.replace(/orgNo/g, 'value').replace(/title/g, 'label')
          organizationJson = JSON.parse(organizationJson)
          vm.organizationJson = organizationJson
          vm.changeArrayToObject(organizationJson)
          vm.getDetailsData()
        } else {
          vm.$Message.error({duration: 5, content: data.msg})
        }
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

    // 根据受理机构编号，查询该借款意向详情的上级机构
    getParentName (agencyId) {
      let vm = this
      if (vm.organizationObject[agencyId] && vm.organizationObject[agencyId].parentId) {
        let newOrgName = vm.organizationObject[agencyId] ? vm.organizationObject[agencyId].label : ''
        let oldOrgName = vm.details.agencyName
        vm.details.agencyName = oldOrgName ? `${newOrgName} ${oldOrgName}` : newOrgName
        vm.getParentName(vm.organizationObject[agencyId].parentId)
      }
    },

    // 根据受理机构编号，查询上级机构
    getRecordParentName (agencyId, index) {
      let vm = this
      if (vm.organizationObject[agencyId] && vm.organizationObject[agencyId].parentId) {
        let newOrgName = vm.organizationObject[agencyId] ? vm.organizationObject[agencyId].label : ''
        let oldOrgName = vm.tableData[index].orgName
        vm.tableData[index].orgName = oldOrgName ? `${newOrgName} ${oldOrgName}` : newOrgName
        vm.getRecordParentName(vm.organizationObject[agencyId].parentId, index)
      }
    },


    // 获取详情数据
    getDetailsData () {
      let vm = this
      let lendNo = vm.$route.query.lendNo
      vm.$net.send({
        server: vm.$services.backendService.consumerDetailsRestController.getOrderDetailInfo,
        data: {
          lendNo: lendNo
        }
      }).then(data => {
        let details = data.data
        details.orgId = details.agencyId
        details.region = vm.$route.query.region
        vm.currentItem = JSON.parse(JSON.stringify(details))

        let sexMap = {
          '0': '女',
          '1': '男'
        }

        let orderTypeMap = {
          '00': '系统派单',
          '01': '自主领单',
          '02': '指派工单',
          '03': '转让工单'
        }

        let evaluationMap = {
          '01': '非常满意',
          '02': '满意',
          '03': '较差',
          '04': '一般',
          '05': '没有联系'
        }

        let typeListMap = {
          '1010': '居民身份证',
          '1040': '户口薄',
          '1051': '中国护照',
          '1052': '外国护照'
        }

        let productTypeListMap = {
          '01': '借款意向',
          '02': '套餐分期'
        }

        details.lendType = details.lendType === '01' ? '家装' : ''
        details.clienteleSex = sexMap[details.clienteleSex]
        details.orderType = orderTypeMap[details.orderType]
        details.evaluation = evaluationMap[details.evaluation]
        details.certificateType = typeListMap[details.certificateType]
        details.productTypeName = productTypeListMap[details.productType]
        details.acceptFlagName = vm.acceptFlagMap[details.acceptFlag] || details.acceptFlag || ''
        details.advancePayment = details.advancePayment ? details.advancePayment + '元' : ''
        details.actualPayment = details.actualPayment ? details.actualPayment + '元' : ''
        details.grantAmtRate = details.grantAmt ? details.grantAmt + '元' : ''
        details.serviceRate = details.serviceRate * 100 + '%'
        details.fundDemand = details.fundDemand ? details.fundDemand + '万' : ''
        details.grantAmt = details.grantAmt ? details.grantAmt : ''
        details.applyDate = details.applyDate ? moment(details.applyDate).format('YYYY-MM-DD HH:mm') : ''
        details.lsUpdatedTime = details.lsUpdatedTime ? moment(details.lsUpdatedTime).format('YYYY-MM-DD HH:mm') : ''
        details.agencyName = ''
        details.stages = details.stages ? details.stages + '期' : ''

        vm.details = details
        console.log('details', vm.details)
        // 获取机构名称
        vm.getParentName(details.agencyId)
        vm.getOrderProc()
      })
    },

    // 匹配当前状态的进度
    getStatusToStep (acceptFlag) {
      let currentStep = ''
      let flag = acceptFlag.substring(0, 2)
      if (acceptFlag === '0X' || flag === '04' || acceptFlag === '00') {
        currentStep = {value: 0, name: '待领取'} // 待领取（待分配、退单、待领取）
      } else if (acceptFlag === '01' || acceptFlag === '0204') {
        currentStep = {value: 1, name: '已领取'} // 已领取（待受理、暂无人接听）
      } else if (acceptFlag === '0203') {
        currentStep = {value: 2, name: '已确认意向'} // 已确认意向（待收集资料）
      } else if (acceptFlag === '0201') {
        currentStep = {value: 3, name: '已收集资料'} // 已收集资料（待审核）
      } else if (acceptFlag === '0202') {
        currentStep = {value: 4, name: '已审核'} // 已审核（待放款）
      } else if (acceptFlag === '0301') {
        currentStep = {value: 5, name: '已放款'} // 已放款（已放款）
      }
      return currentStep
    },

    // 获取进度调数据
    getStep () {
      let vm = this
      vm.stepsList = ['待领取', '已领取', '已确认意向', '已收集资料', '已审核', '已放款']
      vm.currentStatus = 'process'
      let acceptFlag = vm.details.acceptFlag
      let flag = acceptFlag.substring(0, 2)
      if (flag !== '03' || acceptFlag === '0301') {
        vm.currentStep = vm.getStatusToStep(acceptFlag).value
      } else {
        let previousStep = ''
        let len = vm.stepsUnnormalList.length
        if (len > 1) {
          for (let i = 0; i < len; i ++) {
            let previousNum = i + 1
            if (vm.stepsUnnormalList[previousNum] || vm.stepsUnnormalList[i] !== vm.stepsUnnormalList[previousNum]) {
              if (vm.stepsUnnormalList[previousNum] === '0301' ) {
                previousStep = '0301'
                break
              } else if (vm.stepsUnnormalList[previousNum].substring(0, 2) !== '03') {
                previousStep = vm.stepsUnnormalList[previousNum]
                break
              }
            }
          }
          vm.stepsList = vm.stepsList.slice(0, vm.getStatusToStep(previousStep).value + 1)
          console.log(vm.stepsList)
        } else {
          vm.stepsList = []
        }
        vm.stepsList.push(vm.details.acceptFlagName)
        vm.currentStep = vm.stepsList.length - 1
        vm.currentStatus = 'error'
      }
    },

    // 改变每页条数时触发
    pageSizeChange (val) {
      let vm = this
      vm.queryForm.pageSize = val
      vm.getOrderProc()
    },

    // 改变页码时触发
    changePage (val) {
      let vm = this
      vm.queryForm.pageNumber = val
      vm.getOrderProc()
    },

    // 获取工单流水
    getOrderProc () {
      let vm = this
      vm.queryForm.lendNo = vm.$route.query.lendNo
      vm.$net.send({
        server: vm.$services.backendService.consumerDetailsRestController.getOrderProc,
        data: vm.queryForm
      }).then(data => {
        vm.total = data.data.total
        let tableData = data.data.rows
        vm.tableData = []
        tableData.forEach((item, index) => {
          vm.stepsUnnormalList.push(item.changedType)
          item.changedTypeName = vm.acceptFlagMap[item.changedType]
          item.createdTime = item.createdTime ? moment(item.createdTime).format('YYYY-MM-DD HH:mm') : ''
          item.orgName = ''
          vm.tableData.push(item)
          vm.getRecordParentName(item.orgNo, index)
        })
        vm.getStep()
      })
    },

    // 返回
    turnBack () {
      let vm = this
      vm.$router.go(-1)
      vm.$store.commit('removeTag', 'loanIntentionView');
      vm.$store.commit('closePage', 'loanIntentionView');
    },

    // 修改状态
    modifyStatus () {
      this.showUpdateDialog = true
    },

    // 修改状态弹框的确认
    confirmStatus (acceptFlag) {
      this.getDetailsData()
    },

    // 指派客户经理
    modifyManager () {
      this.showAssignDialog = true
    },

    // 指派客户经理弹框的确认
    confirmAssign () {
      this.getDetailsData()
    },
  }
}
</script>

<style scoped>
.livItem {
  margin-bottom: 30px;
}
.livTitle {
  padding: 10px 5px;
  font-size: 16px;
  color: #06f;
  border-bottom: 1px solid #ccc;
}
.livItemCont {
  display: flex;
  flex-wrap: wrap;
  padding-top: 5px;
}
.livItemMsg {
  width: 33.3%;
  margin-top: 10px;
  padding: 0 5px;
}
.livTableBox {
  position: relative;
  margin-top: -10px;
  padding-left: 5px;
}
.livTableTile {
    padding: 5px 0;
}
.livBtnBox {
  margin: 30px auto 20px;
  text-align: center;
}
</style>

<style>
.livTableCont .ivu-table th {
    background: none;
}
.my-steps {
    width: 80%;
    margin: 0 auto;
}
.my-steps .ivu-steps .ivu-steps-main {
    display: block;
}
.my-steps .ivu-steps .ivu-steps-title {
    margin-left: -8px;
}
.my-steps .ivu-steps .ivu-steps-custom .ivu-steps-title {
    margin-top: -2px;
}
.my-steps .ivu-steps-item.ivu-steps-custom.ivu-steps-status-process .ivu-steps-head-inner>.ivu-steps-icon {
    font-size: 31px;
    margin-top: -4px;
}
.my-steps .ivu-steps-item.ivu-steps-status-wait .ivu-steps-head-inner span {
    color: #ffffff;
}
</style>
