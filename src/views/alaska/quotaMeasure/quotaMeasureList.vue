<template>
    <div class="cust">
        <Card>
            <p slot="title">额度测算管理</p>
            <j-table ref="quotaManagerListTable" pagination autoSearch
                     :autoCache="true"
                     :queryForm.sync="queryForm"
                     :server="server.query"
                     :columns-list="columns"
                     v-model="tableData"
                     @btnReset="resetQueryForm"
                     @requestSuccess="requestSuccess">
                <template slot="input">
                    <Row>
                        <FormItem label="申请人编号:">
                            <Input v-model.trim="queryForm.clienteleNo" clearable placeholder="请输入" :maxlength="12" @on-keyup="numChange('clienteleNo')"></Input>
                        </FormItem>
                        <FormItem label="联系号码:">
                            <Input v-model.trim="queryForm.clientelePhone" clearable placeholder="请输入" :maxlength="11" @on-keyup="numChange('clientelePhone')"></Input>
                        </FormItem>
                        <FormItem label="测算时间:">
                            <DatePicker
                              type="datetime"
                              format="yyyy-MM-dd HH:mm"
                              :options="optionsStart"
                              @on-change="changeStartDate"
                              :value="queryForm.startTime"
                              style="width: 45%"
                              placeholder="全部">
                            </DatePicker>
                            <span style="display: inline-block; padding: 0 3px;">-</span>
                            <DatePicker
                              type="datetime"
                              format="yyyy-MM-dd HH:mm"
                              :options="optionsEnd"
                              @on-change="changeEndDate"
                              :value="queryForm.endTime"
                              style="width: 45%;margin-left: 5px"
                              placeholder="全部">
                            </DatePicker>
                        </FormItem>
                    </Row>

                    <Row>
                        <FormItem label="是否有公积金/社保:">
                            <Select clearable v-model="queryForm.clientFlag">
                                <Option v-for="item in yesOrNo" :key="item.value" :value="item.value">
                                    {{ item.label }}
                                </Option>
                            </Select>
                        </FormItem>
                        <FormItem label="是否已申请借款意向:">
                            <Select clearable v-model="queryForm.isLend">
                                <Option v-for="item in yesOrNo" :key="item.value" :value="item.value">
                                    {{ item.label }}
                                </Option>
                            </Select>
                        </FormItem>
                        <FormItem label="渠道名称:">
                            <Select clearable v-model="queryForm.channelName">
                                <Option v-for="item in channelList" :key="item.value" :value="item.value">
                                    {{ item.label }}
                                </Option>
                            </Select>
                        </FormItem>
                    </Row>

                    <Row>
                        <FormItem label="房屋所在地:">
                            <Cascader
                                    change-on-select
                                    :data="areaJson"
                                    v-model="areaValue"
                                    @on-change="changeRegion">
                            </Cascader>
                        </FormItem>
                    </Row>
                </template>

                <template slot="toolbar">
                    <Button @click="download" type="primary" icon="ios-cloud-download-outline">导出</Button>
                </template>

            </j-table>

        </Card>
    </div>
</template>

<script>
  import moment from 'moment'
  import app from "@/config/app"
  import axios from 'axios'
  import store from '@/store'
  const areaJson = require('@/util/area.json')
  export default {
    data() {
      return {
        server: {
          query: this.$services.backendService.estimateRestController.query
        },

        optionsStart: {
          disabledDate (date) {
            return date && date.valueOf() > Date.now()
          }
        },
        optionsEnd: {
          disabledDate (date) {
            return date && date.valueOf() > Date.now()
          }
        },
        queryForm: {
          clienteleNo: '',
          clientelePhone: '',
          clientFlag:'',
          isLend:'',
          channelName:'',
          houseCity:'',
          houseCityIds: '',
          startTime: '',
          endTime: '',
        },
        // 是与否的下拉选择
        yesOrNo: [
          { value: '1', label: '是' },
          { value: '0', label: '否' }
        ],
        // 渠道名称
        channelList: [
          { value: '阿拉私家', label: '阿拉私家' }
        ],
        areaValue: [], // 省市区已选数据
        areaJson: areaJson, // 省市区级联数据
        areaObject: {}, // 省市区的键值对格式

        tableData: [],
        columns: [
          { type: 'index', title: '序号', align: 'center', width: 60 },
          { title: '申请人编号', align: 'center', key: 'clienteleNo', minWidth: 90 },
          { title: '姓名', align: 'center', key: 'clienteleName', minWidth: 90 },
          { title: '联系号码', align: 'center', key: 'clientelePhone', minWidth: 90 },
          { title: '渠道名称', align: 'center', key: 'channelName', minWidth: 90 },
          { title: '房屋所在地', align: 'center', key: 'houseCity', minWidth: 120 },
          { title: '房屋面积（m2）', type: 'html', align: 'center', key: 'houseSize', minWidth: 90,
            renderHeader:(h, params)=>{
              return h('div', {style: {
                display: 'table',
                height: '23px'
              }},[
                h('span',
                  {style: {
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    lineHeight: '23px',
                    display: 'auto'
                  }
                  }, '房屋面积(m'),
                h('sup',{style:{
                  top: 8
                }},'2'),
                h('span',
                  {style:{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    lineHeight: '23px',
                    display: 'auto'
                  }},')')
              ]);
            }
          },
          { title: '房产价值估算(万)', align: 'center', key: 'houseValue', minWidth: 90 },
          { title: '是否有公积金/社保', align: 'center', key: 'clientFlag', minWidth: 90 },
          { title: '月收入(元)', align: 'center', key: 'monthIncome', minWidth: 90 },
          { title: '测算额度(万)', align: 'center', key: 'estimateAmt', minWidth: 90 },
          { title: '测算时间', align: 'center', key: 'createdTime', minWidth: 90 },
          { title: '是否已申请借款意向', align: 'center', key: 'isLend', minWidth: 90 },
        ],
      }
    },

    watch: {
      queryForm (val) {
        let vm = this
        // 如果选择了房屋所在地，则处理以显示选择的房屋所在地
        if (val.houseCityIds) {
          let areaValue = []
          let houseCityIds = val.houseCityIds.split(' ')
          houseCityIds.forEach((item, index) => {
            vm.showAreaSelected(areaValue, item, index)
          })
          vm.areaValue = areaValue
        }
        console.log(this.queryForm)
      }
    },

    created () {
      let vm = this
      vm.changeArrayToObject(vm.areaObject, areaJson)
    },

    methods: {
      // 回显查询条件的已选房屋所在地
    showAreaSelected (array, id, index) {
      let vm = this
        for (let item in vm.areaObject) {
          if (id * 1 === item * 1) {
            array[index] = id
          }
        }
      },

      // 遍历把数组改成key、value的对象
      changeArrayToObject (object, array) {
        let vm = this
        array.forEach(item => {
          object[item.value] = item
          if (item.children && item.children.length > 0) {
            vm.changeArrayToObject(object, item.children)
          }
        })
      },

      // 清除查询条件
      resetQueryForm () {
        this.optionsStart = {
          disabledDate (date) {
            return date && date.valueOf() > Date.now()
          }
        }
        this.optionsEnd = {
          disabledDate (date) {
            return date && date.valueOf() > Date.now()
          }
        }
        this.areaValue = []
        this.queryForm = {
          clienteleNo: '',
          clientelePhone: '',
          clientFlag:'',
          isLend:'',
          channelName:'',
          houseCity:'',
          houseCityIds: '',
          startTime: '',
          endTime: ''
        }
        console.log(this.queryForm)
      },

      // 数字的的输入控制
      numChange (name) {
        this.queryForm[name] = this.queryForm[name].replace(/\D/g,'')
      },

      // 选择省市区
      changeRegion (value, selectedData) {
        let vm = this
        vm.queryForm.houseCity = ''
        vm.queryForm.houseCityIds = ''
        if (selectedData.length > 0) {
          selectedData.forEach(item => {
            vm.queryForm.houseCity = vm.queryForm.houseCity ? `${vm.queryForm.houseCity} ${item.label}` : item.label
            vm.queryForm.houseCityIds = vm.queryForm.houseCityIds ? `${vm.queryForm.houseCityIds} ${item.value}` : item.value
          })
        }
      },

      requestSuccess (data) {
        let resData = data
        resData.forEach(item => {
          item.createdTime = moment(item.createdTime).format('YYYY-MM-DD HH:mm')
          item.isLend = item.isLend === 1 ? '是' : '否'
          item.clientFlag = item.clientFlag === 1 ? '是' : '否'
        })
      },

      // 创建时间选择，时间范围控制及格式转换
      changeStartDate (date) {
        let vm = this
        vm.queryForm.startTime = date ? moment(date).format('YYYY-MM-DD HH:mm') : ''
        vm.optionsEnd =  {
          disabledDate (date) {
            return date && moment(date).valueOf() < moment(vm.queryForm.startTime).valueOf() || date.valueOf() > Date.now()
          }
        }
      },

      changeEndDate (date) {
        let vm = this
        vm.queryForm.endTime = date ? moment(date).format('YYYY-MM-DD HH:mm') : ''
        vm.optionsStart =  {
          disabledDate (date) {
            return date && moment(date).valueOf() > moment(vm.queryForm.endTime).valueOf()
          }
        }
      },

      // 下拉框选择
      onSelect(value, name) {
        let obj = this.$refs[value].getSelect()
        this.queryForm[name] = obj.value
      },

      // 导出事件
      download () {
        let url = app.url.server +this.$services.backendService.estimateRestController.exportInfo.url
        axios.get(
          url,
          {
            headers: {'x-user-token': store.getters.userToken},
            params: this.queryForm,
            responseType:'blob'
          }
        ).then(data=>{
          let dataurl = window.URL.createObjectURL(data.data) //表示一个指定的file对象或Blob对象
          let a = document.createElement('a')
          document.body.appendChild(a)
          a.href = dataurl
          a.download = '额度测算信息表.xlsx' //命名下载名称
          a.click(); //点击触发下载
          window.URL.revokeObjectURL(dataurl)  //下载完成进行释放
          this.$Message.success('导出成功！')
        })
      },
    }
  }
</script>