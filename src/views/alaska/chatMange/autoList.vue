<template>
    <div class="cust">
        <Card>
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
                       <FormItem label="提问时间:" :label-width="70">
                            <DatePicker
                              type="date"
                              format="yyyy-MM-dd"
                              :options="optionsStart"
                              @on-change="changeStartDate"
                              :value="queryForm.counselStartTime"
                              style="width: 45%"
                              placeholder="全部">
                            </DatePicker>
                            <span style="display: inline-block; padding: 0 3px;">-</span>
                            <DatePicker
                              type="date"
                              format="yyyy-MM-dd"
                              :options="optionsEnd"
                              @on-change="changeEndDate"
                              :value="queryForm.counselEndTime"
                              style="width: 45%;margin-left: 5px"
                              placeholder="全部">
                            </DatePicker>
                        </FormItem>
                        <FormItem label="答案类型:">
                            <Select clearable v-model="queryForm.answerType">
                                <Option v-for="item in channelList" :key="item.value" :value="item.value">
                                    {{ item.label }}
                                </Option>
                            </Select>
                        </FormItem>
                        <FormItem label="用户名:">
                            <Input v-model.trim="queryForm.realName" clearable placeholder="请输入" :maxlength="30"></Input>
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
  export default {
    data() {
      return {
        server: {
          query: this.$services.backendService.questionDetailsRestController.query
        },
// 
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
          realName: '',
          answerType:'',
          counselStartTime: '',
          counselEndTime: '',
        },
        // 渠道名称
        channelList: [
          { value: '00', label: '标准答案' },
          { value: '01', label: '建议答案' },
          { value: '02', label: '通用回复' },

        ],

        areaObject: {}, // 省市区的键值对格式

        tableData: [],
        columns: [
          { type: 'index', title: '序号', align: 'center', width: 60 },
          { title: '用户名', align: 'center', key: 'realName' },
          { title: '手机号码', align: 'center', key: 'phone' },
          { title: '用户问题', align: 'center', key: 'question' },
          { title: '答案', align: 'center', key: 'answer' },
          { title: '答案类型', align: 'center', key: 'answerType' },  
          { title: '提问时间', align: 'center', key: 'counselTime' },
        ],
      }
    },
    created () {
      let vm = this

    },

    methods: {
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
        this.queryForm = {
          realName: '',
          answerType:'',
          counselStartTime: '',
          counselEndTime: '',
        }
      },


      requestSuccess (data) {
        let TypeMap = {
          '00': '标准答案',
          '01': '建议答案',
          '02': '通用回复'
        }
        let resData = data
        resData.forEach(item => {
          item.answerType = TypeMap[item.answerType]
        })
      },

      // 创建时间选择，时间范围控制及格式转换
      changeStartDate (date) {
        let vm = this
        vm.queryForm.counselStartTime = date ? moment(date).format('YYYY-MM-DD 00:00:00') : ''
        vm.optionsEnd =  {
          disabledDate (date) {
            return date && moment(date).valueOf() < moment(vm.queryForm.counselStartTime).valueOf() || date && moment(date).valueOf() > Date.now()
          }
        }
      },

      changeEndDate (date) {
        let vm = this
        vm.queryForm.counselEndTime = date ? moment(date).format('YYYY-MM-DD 23:59:59') : ''
        vm.optionsStart =  {
          disabledDate (date) {
            return date && moment(date).valueOf() > moment(vm.queryForm.counselEndTime).valueOf()
          }
        }
      },
      // 导出事件
      download () {
        let url = app.url.server +this.$services.backendService.questionDetailsRestController.exportQuestion.url
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
          a.download = '自动问答明细列表.xlsx' //命名下载名称
          a.click(); //点击触发下载
          window.URL.revokeObjectURL(dataurl)  //下载完成进行释放
          this.$Message.success('导出成功！')
        })
      },
    }
  }
</script>