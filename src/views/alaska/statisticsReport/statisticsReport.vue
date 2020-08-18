<template>
  <Card class="srBox" :class="{'srBoxTwo': tableData.length === 0}">
    <p slot="title">借款意向统计报表</p>
    <j-table ref="statisticsReportTable"
      pagination
      autoSearch
      :autoCache="true"
      :showExport="true"
      :queryForm.sync="queryForm"
      :server="server.query"
      :columns-list="columns"
      v-model="tableData"
      @btnReset="resetQueryForm"
      @export-btn="exportOrderChart"
      @requestSuccess="requestSuccess"
      @on-sort-change="sortChange">
      <template slot="input">
        <Row>
          <FormItem label="渠道名称:">
            <Select class="wpRightItemSelect" clearable v-model="queryForm.channelNo">
              <Option v-for="item in channelJson" :key="item.value" :value="item.value">
                {{ item.label }}
              </Option>
            </Select>
          </FormItem>
          <FormItem label="受理机构:">
            <Cascader class="wpRightItemSelect"
              change-on-select
              :data="organizationJson"
              v-model="organizationValue"
              @on-change="changeOrganization">
            </Cascader>
          </FormItem>
          <FormItem label="申请时间:">
            <div class="srTimeBox">
              <div class="srTime">
                <DatePicker type="date"
                  :value="queryForm.beginApplyDate"
                  :options="startOptions"
                  @on-change="changeStartTime">
                </DatePicker>
              </div>
              <div class="srTimeLine">-</div>
              <div class="srTime">
                <DatePicker type="date"
                  :value="queryForm.endApplyDate"
                  :options="endOptions"
                  @on-change="changeEndTime">
                </DatePicker>
              </div>
            </div>
          </FormItem>
        </Row>
      </template>
    </j-table>

    <div class="srTotalBox" :class="{'srTotalBoxTwo': tableData.length === 0}">
      <div class="srTotalTItle">总计:</div>
      <div class="srTotalCont">
        <span class="srTotalItem">总申请单数: {{ totalCount.applyAll }}</span>
        <span class="srTotalItem">已放款数: {{ totalCount.countAmtAll }}</span>
        <span class="srTotalItem">受理成功率: {{ totalCount.countRateAll }}%</span>
        <span class="srTotalItem">总资金需求(万): {{ totalCount.sumDemandAll }}</span>
        <span class="srTotalItem">总审批金额(万): {{ totalCount.sumGrantAmtAll }}</span>
        <span class="srTotalItem">资金满足率: {{ totalCount.sumRateAll }}%</span>
        <span class="srTotalItem">总消费金额(万): {{ totalCount.sumCostAmtAll }}</span>
      </div>
    </div>
  </Card>
</template>

<script>
import moment from 'moment'
import app from "@/config/app"
import axios from 'axios'
import store from '@/store'

export default {
  data () {
    return {
      getOrganizationBack: false, // 已经获取机构
      tableData: [], // 表格数据
      organizationJson: [], // 受理机构
      organizationValue: [], // 已选受理机构

      queryForm: {
        channelNo: '', // 渠道方
        orgId: '', // 受理机构
        beginApplyDate: '', // 开始时间
        endApplyDate: '', // 结束时间
        sortParam: '' // 排序字段
      },

      server: {
        query: this.$services.backendService.chartRestController.getList
      },

      totalCount: {}, // 统计总数
      startOptions: { // 开始时间额外配置
        disabledDate (date) {
          return date && date.valueOf() > Date.now()
        }
      },
      endOptions: { // 开始时间额外配置
        disabledDate (date) {
          return date && date.valueOf() > Date.now()
        }
      },
      organizationObject: {}, // 全部机构的键值对格式

      // 去到名称下拉框数据
      channelJson: [
        { value: '', label: '全部' },
        { value: 'QD2019052001', label: '阿拉私家' }
      ],

      // fixed: 'left'
      columns: [
        { type: 'index', title: '序号', align: 'center', fixed: 'left', width: 60 },
        { title: '渠道名称', align: 'center', key: 'channelName', fixed: 'left', width: 100 },
        { title: '受理机构', align: 'center', key: 'orgName', fixed: 'left', width: 150 },
        { title: '总申请单数', align: 'center', key: 'countAll', sortable: 'custom', width: 120 },
        { title: '已放款数', align: 'center', key: 'countAmt', sortable: 'custom', width: 120 },
        { title: '受理成功率', align: 'center', key: 'countRate', sortable: 'custom', width: 120 },
        { title: '总需求金额(万)', align: 'center', key: 'sumDemand', sortable: 'custom', width: 140 },
        { title: '总审批金额(万)', align: 'center', key: 'sumGrantAmt' , sortable: 'custom', width: 140},
        { title: '资金满足率', align: 'center', key: 'sumRate', sortable: 'custom', width: 120 },
        { title: '总消费金额(万)', align: 'center', key: 'sumCostAmt', sortable: 'custom', width: 140 },
        { title: '开始时间', align: 'center', key: 'minTime', width: 100 },
        { title: '结束时间', align: 'center', key: 'maxTime', width: 100 }
      ]
    }
  },

  watch: {
    queryForm (val) { 
      let vm = this
      // 如果选择了机构，则处理以显示选择的机构
      if (val.orgId) {
        vm.showOrgSelected([], val.orgId)
      }
    }
  },

  created () {
    this.getChanleSideAndOrganization()
  },

  methods: {
    // 回显查询条件的已选机构，setTimeout是为了延迟，不然在获取机构返回前，一直调自身会造成死循环
    showOrgSelected (orgIds, orgId) {
      let vm = this
      setTimeout(() => {
        if (!vm.getOrganizationBack) {
          vm.showOrgSelected(orgIds, orgId)
          return false
        }

        if (vm.organizationObject[orgId]) {
          orgIds.unshift(orgId)
          if (vm.organizationObject[orgId].parentId) {
            vm.showOrgSelected(orgIds, vm.organizationObject[orgId].parentId)
          } else {
            vm.organizationValue = orgIds
          }
        }
      }, 500)
    },

    // 获取渠道方、受理机构
    getChanleSideAndOrganization () {
      let vm = this
      vm.$net.send({
        server: vm.$services.backendService.organizationRestController.getOrganizationTree
      }).then(data => {
        if (data.code === 200) {
          let organizationJson = JSON.stringify(data.data)
          organizationJson = organizationJson.replace(/orgNo/g, 'value').replace(/title/g, 'label')
          organizationJson = JSON.parse(organizationJson)
          vm.changeArrayToObject(organizationJson)

          organizationJson.forEach(item => {
            if (item.value === 'ZJF') {
              // vm.organizationJson = item.children
              vm.organizationJson = item.children
            }
          })
          vm.getOrganizationBack = true
        } else {
          vm.$Message.error(`${data.code}:${data.message}`)
        }
      }).catch(error => {
        vm.$Message.error(error.reason)
      })
    },

    // 获取总数
    getAllCount () {
      let vm = this
      let params = {
        pageNumber: 1,
        pageSize: 1000,
        ...vm.queryForm
      }

      vm.$net.send({
        server: vm.$services.backendService.chartRestController.getAllCount,
        data: params
      }).then(data => {
        if (data.code === 200) {
          vm.totalCount = data.data
          vm.totalCount.countRateAll = vm.totalCount.applyAll ? Math.round(vm.totalCount.countAmtAll / vm.totalCount.applyAll * 10000) / 100 : 0
          vm.totalCount.sumRateAll = vm.totalCount.sumDemandAll ? Math.round(vm.totalCount.sumGrantAmtAll / vm.totalCount.sumDemandAll * 10000) / 100 : 0
        } else {
          vm.$Message.error(`${data.code}:${data.message}`)
        }
      }).catch(error => {
        vm.$Message.error(error.reason)
      })
    },

    // 排序
    sortChange (column) {
      let vm = this
      let sortKey = column.order === 'normal' ? '' : `${column.key}${column.order.toUpperCase()}`
      vm.queryForm.sortParam = sortKey
      vm.$refs.statisticsReportTable.handleQuery()
    },

    // 获取数据成功返回后，对数据进行处理
    requestSuccess (data) {
      let vm = this
      vm.getAllCount()

      setTimeout(() => {
        vm.tableData = []
        data.forEach((item, index) => {
          item.orgName = ''
          item.countRate = Math.round(item.countAmt / item.countAll * 10000 ) / 100 + '%'
          item.sumRate = !item.sumGrantAmt && item.sumGrantAmt !== 0 ? '' : Math.round(item.sumGrantAmt / item.sumDemand * 10000 ) / 100 + '%'
          item.minTime = item.minTime.split(' ')[0]
          item.maxTime = item.maxTime.split(' ')[0]
          vm.tableData.push(item)
          vm.getParentName(item.orgId, index)
        })
      }, 0)
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

    // 重置
    resetQueryForm () {
      let vm = this
      vm.organizationValue = []
      vm.queryForm.channelNo = ''
      vm.queryForm.orgId = ''
      vm.queryForm.beginApplyDate = ''
      vm.queryForm.endApplyDate = ''
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

    // 选择受理机构
    changeOrganization (value, selectedData) {
      this.queryForm.orgId = value[value.length - 1]
    },

    // 修改开始时间
    changeStartTime (date, dateType) {
      let vm = this
      vm.queryForm.beginApplyDate = date || ''
      vm.endOptions = {
        disabledDate (date) {
          return date && moment(date).valueOf() < moment(vm.queryForm.beginApplyDate).valueOf() || date.valueOf() > Date.now()
        }
      }
    },

    // 修改结束时间
    changeEndTime (date, dateType) {
      let vm = this
      vm.queryForm.endApplyDate = date || ''
      vm.startOptions = {
        disabledDate (date) {
          return date && moment(date).valueOf() > moment(vm.queryForm.endApplyDate).valueOf()
        }
      }
    },

    // 导出
    exportOrderChart () {
      let vm = this
      let paramsString = ''
      let url = app.url.server + vm.$services.backendService.chartRestController.exportOrderChart.url
      let params = { ...vm.queryForm }
      params.beginApplyDate = params.beginApplyDate ? moment(params.beginApplyDate).valueOf() : ''
      params.endApplyDate = params.endApplyDate ? moment(params.endApplyDate).valueOf() : ''

      for (let item in params) {
        paramsString += `&${item}=${params[item]}`
      }

      paramsString = paramsString.replace('&', '?')
      // window.open(`${url}${paramsString}`)
      axios.get(
        `${url}${paramsString}`,
        {
          headers: {'x-user-token': store.getters.userToken},
          responseType:'blob'
        }
      ).then(data=>{
        let dataurl = window.URL.createObjectURL(data.data) //表示一个指定的file对象或Blob对象
        let a = document.createElement('a')
        document.body.appendChild(a)
        a.href = dataurl
        a.download = '借款意向统计报表.xlsx' //命名下载名称
        a.click(); //点击触发下载
        window.URL.revokeObjectURL(dataurl)  //下载完成进行释放
        this.$Message.success('导出成功！')
      })
    }
  }
}
</script>

<style scoped>
.srBox {
  position: relative;
}
.srBoxTwo {
  padding-bottom: 50px;
}
.srTimeBox {
  display: flex;
  align-items: center;
}
.srTime {
  flex-grow: 1;
}
.srTimeLine {
  width: 20px;
  text-align: center;
}
.srBtnItem {
  margin-left: 10px;
}

.srTotalBox {
  position: absolute;
  bottom: 82px;
  line-height: 22px;
  font-weight: 500;
}
.srTotalBoxTwo {
  bottom: 20px;
}
.srTotalItem {
  margin-right: 15px;
}
.srTotalItem:last-child {
  margin-right: 0;
}
</style>

<style>
.srBox  .j-table-footer {
  margin-top: 70px;
}
</style>
