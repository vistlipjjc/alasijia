<template>
  <div class="rcBox">
    <div class="rcItemConditionBox">
      <div class="rcItemConditionItem">
        <div class="rcItemConditionTitle">渠道:</div>
        <div class="rcItemConditionCont">
          <Cascader class="wpRightItemSelect"
            change-on-select
            :data="channelsideJson"
            v-model="channelsideValue"
            @on-change="changeChannel">
          </Cascader>
        </div>
      </div>

      <div class="rcItemConditionItem">
        <div class="rcItemConditionTitle">受理机构:</div>
        <div class="rcItemConditionCont">
          <Cascader class="wpRightItemSelect"
            change-on-select
            :data="organizationJson"
            v-model="organizationValue"
            @on-change="changeOrganization">
          </Cascader>
        </div>
      </div>

      <div class="rcItemConditionItem">
        <div class="rcItemConditionTitle">查看类型:</div>
        <div class="rcItemConditionCont">
          <Select class="rcItemConditionSelect">
            <Option value="value1">按月份</Option>
            <Option value="value2">按季度</Option>
            <Option value="value3">按年度</Option>
          </Select>
        </div>
      </div>

      <div class="rcItemConditionItem">
        <div class="rcItemConditionTitle">时间:</div>
        <div class="rcItemConditionCont">
          <div class="rcItemConditionTime">
            <DatePicker type="date"
              v-model="queryForm.beginApplyDate"
              :options="startOptions"
              @on-change="changeStartTime">
            </DatePicker>
          </div>
          <div class="rcItemConditionTimeLine">-</div>
          <div class="rcItemConditionTime">
            <DatePicker type="date"
              v-model="queryForm.endApplyDate"
              :options="endOptions"
              @on-change="changeEndTime">
            </DatePicker>
          </div>
        </div>
      </div>

      <div class="rcItemConditionItem">
        <div class="rcItemConditionBtnBox">
          <Button class="rcItemConditionBtnItem" type="primary" icon="search">搜索</Button>
          <Button class="rcItemConditionBtnItem" type="ghost" icon="reply">重置</Button>
        </div>
      </div>
    </div>

    <div :id="domId" class="rcChartBox"></div>
  </div>
</template>

<script>
import moment from 'moment'
const echarts = require('echarts')

export default {
  props: {
    domId: String,
    yName: {
      type: String,
      default: '数量'
    },
    xName: {
      type: String,
      default: '月份'
    },
    showKey: {
      type: Array,
      defalut () {
        return []
      }
    }
  },

  data () {
    return {
      channelSideJson: [], // 渠道方源数据
      organizationJson: [], // 受理机构源数据
      channelsideValue: [], // 已选渠道方
      organizationValue: [], // 已选受理机构
      legendData: [], // 需要展示的字段

      queryForm: {
        channelName: '', // 渠道方
        orgId: '', // 受理机构
        beginApplyDate: '', // 开始时间
        endApplyDate: '', // 结束时间
        pageSize: 1000, // 每页条数
        pageNumber: 1 // 当前页数
      },

      startOptions: {}, // 开始时间额外配置
      endOptions: {}, // 开始时间额外配置

      organizationServer: this.$services.backendService.organizationRestController, // 机构服务地址
      chartServer: this.$services.backendService.ChartRestController // 报表接口
    }
  },

  watch: {
    showKey: {
      immediate: true,
      handler (val) {
        let vm = this
        if (val.includes('countAll') && val.includes('countAmt')) {
          vm.legendData = ['总申请单数', '已放款数']
        }

        if (val.includes('sumGrantAmt') && val.includes('sumCostAmt')) {
          vm.legendData = ['批付总金额', '消费总金额']
        }
      }
    }
  },

  mounted () {
    this.init()
  },

  methods: {
    init () {
      this.initChart()
      this.getChartData()
      this.getChanleSideAndOrganization()
    },

    // 获取统计报表数据
    getChartData () {
      let vm = this
      vm.$net.send({
        server: vm.chartServer.getList,
        data: vm.queryForm
      }).then(data => {
        data.forEach(item => {
        })
      }).catch(error => {
        vm.$Message.error(error.reason)
      })
    },

    // 获取渠道方、受理机构
    getChanleSideAndOrganization () {
      let vm = this
      vm.$net.send({
        server: vm.organizationServer.getOrganizationTree
      }).then(data => {
        if (data.code === 200) {
          let organizationJson = JSON.stringify(data.data)
          organizationJson = organizationJson.replace(/orgNo/g, 'value').replace(/title/g, 'label')
          organizationJson = JSON.parse(organizationJson)

          organizationJson.forEach(item => {
            if (item.value === 'QDF') {
              vm.channelsideJson = item.children
            }

            if (item.value === 'JXJK') {
              vm.organizationJson = item.children
            }
          })
        } else {
          vm.$Message.error(`${data.code}:${data.message}`)
        }
      }).catch(error => {
        vm.$Message.error(error.reason)
      })
    },

    initChart () {
      let vm = this
      const myChart = echarts.init(document.getElementById(vm.domId))

      myChart.setOption({
        title: {
          text: ''
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: vm.legendData
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          name: vm.xName,
          type: 'category',
          boundaryGap: false,
          data: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']
        },
        yAxis: {
          name: vm.yName,
          type: 'value'
        },
        series: [
          {
            name:'邮件营销',
            type:'line',
            data:[120, 132, 101, 134, 90, 230, 210]
          }, {
            name:'联盟广告',
            type:'line',
            data:[220, 182, 191, 234, 290, 330, 310]
          }
        ]
      })
    },

    // 重置
    resetQueryForm () {
    },

    // 选择渠道方
    changeChannel (value, selectedData) {
      this.queryForm.channelName = value[value.length - 1]
    },

    // 选择受理机构
    changeOrganization (value, selectedData) {
      this.queryForm.orgId = value[value.length - 1]
    },

    // 修改开始时间
    changeStartTime () {
      let vm = this
      vm.endOptions = {
        disabledDate (date) {
          return date && moment(date).valueOf() < moment(vm.queryForm.beginApplyDate).valueOf()
        }
      }
    },

    // 修改结束时间
    changeEndTime () {
      let vm = this
      vm.startOptions = {
        disabledDate (date) {
          return date && moment(date).valueOf() > moment(vm.queryForm.endApplyDate).valueOf()
        }
      }
    }
  }
}
</script>

<style scoped>
.rcItemConditionBox {
  display: flex;
  flex-wrap: wrap;
}
.rcItemConditionItem {
  display: flex;
  align-items: center;
  width: 32%;
  margin-right: 2%;
  margin-top: 15px;
}
.rcItemConditionItem:nth-child(3n + 0) {
  margin-right: 0;
}
.rcItemConditionTitle {
  flex-shrink: 0;
  width: 100px;
  padding-right: 10px;
  text-align: right;
  font-weight: 500;
}
.rciCont {
  padding-top: 5px;
}
.rcItemConditionSelect {
  width: 100%;
}
.rcItemConditionCont {
  display: flex;
  flex-grow: 1;
}
.rcItemConditionTime {
  width: 46%;
}
.rcItemConditionTimeLine {
  flex-grow: 1;
  line-height: 30px;
  text-align: center;
}
.rcItemConditionBtnBox {
  margin: 0 auto;
}
.rcItemConditionBtnItem {
  margin: 0 10px;
}
.rcChartBox {
  height: 400px;
  margin-top: 50px;
}
</style>
