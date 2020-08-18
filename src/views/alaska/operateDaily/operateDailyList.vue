<template>
    <Card class="aplBox">
        <p slot="title">操作日志</p>
        <j-table ref="operateDailyListTable"
                 pagination
                 autoSearch
                 :autoCache="true"
                 :queryForm.sync="queryForm"
                 :server="server.query"
                 :columns-list="columns"
                 v-model="tableData"
                 @btnReset="resetQueryForm"
                 @requestSuccess="requestSuccess">
            <template slot="input">
                <Row>
                    <FormItem label="操作模块:">
                        <Select clearable :label-in-value="true" v-model="selectMenu" @on-change="changeMenu">
                            <Option v-for="item in menuList" :key="item.value" :value="item.value">
                                {{ item.label }}
                            </Option>
                        </Select>
                    </FormItem>

                    <FormItem label="操作子模块:">
                        <Select clearable :label-in-value="true" v-model="selectMenuChild" @on-change="changeMenuChild">
                            <Option v-for="item in menuChildList" :key="item.value" :value="item.value">
                                {{ item.label }}
                            </Option>
                        </Select>
                    </FormItem>

                    <FormItem label="操作类型:">
                        <Select clearable v-model="queryForm.operateType">
                            <Option v-for="item in operateType" :key="item.value" :value="item.value">
                                {{ item.label }}
                            </Option>
                        </Select>
                    </FormItem>

                    <FormItem label="更新时间:" >
                        <DatePicker
                                type="date"
                                :options="optionsStart"
                                @on-change="changeStartDate"
                                :value="queryForm.beginTime"
                                style="width: 45%"
                                placeholder="全部">
                        </DatePicker>
                        <span style="display: inline-block; padding: 0 3px;">-</span>
                        <DatePicker
                                type="date"
                                :options="optionsEnd"
                                @on-change="changeEndDate"
                                :value="queryForm.endTime"
                                style="width: 45%;margin-left: 5px"
                                placeholder="全部">
                        </DatePicker>
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
        tableData: [], // 表格数据
        queryForm: {
          module: '', // 一级菜单
          childModule: '', // 二级菜单
          operateType: '', // 操作类型
          beginTime: '', // 开始时间
          endTime: '', // 结束时间
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

        server: {
          query: this.$services.backendService.syslogRestController.getList,
          menuServer: this.$services.sysService.menuRestController.load,
        },

        menuList: [], // 父级菜单
        menuChildList: [], // 第二层级菜单
        selectMenu: '',
        selectMenuChild: '',
        operateType: [
          {value: '6', label: '新增'},
          {value: '2', label: '修改'},
          {value: '1', label: '删除'},
          /* {value: '3', label: '查询'}, */
          {value: '8', label: '导入'},
          {value: '4', label: '导出'},
          {value: '5', label: '登录'},
          {value: '7', label: '重置密码'},
        ],

        columns: [
          { type: 'index', title: '序号', align: 'center', width: 50 },
          { title: '用户账号', align: 'center', key: 'userName', width: 80},
          { title: '操作模块', align: 'center', key: 'module', width: 110},
          { title: '操作子模块', align: 'center', key: 'childModule', width: 110},
          { title: '操作类型', align: 'center', key: 'operateType', width: 80},
          { title: '详细', align: 'center', key: 'updateAfter' },
          { title: '操作状态', align: 'center', key: 'operateSts', width: 80},
          { title: '登陆IP', align: 'center', key: 'loginIp', width: 120},
          { title: '设备名称', align: 'center', key: 'equipmentName'},
          { title: '操作时间', align: 'center', key: 'createdTime'}
        ]
      }
    },

    mounted () {
      this.getMenuList()
    },

    methods: {
      // 表格数据改变时触发
      requestSuccess (data) {
        let vm = this
        let operateType = {
          '6': '新增',
          '2': '修改',
          '1': '删除',
          '3': '查询',
          '4': '导出',
          '5': '登录',
          '7': '重置密码',
          '8': '导入'
        }
        let myData = JSON.parse(JSON.stringify(data))
        myData.forEach(item => {
          item.operateType = operateType[item.operateType]
          item.operateSts = item.operateSts === '1' ? '正常' : '异常'
        })
        vm.tableData = myData
        // console.log(vm.tableData)
      },

      // 获取菜单的接口
      getMenuList (type) {
        let vm = this
        if (type && type === '登录') {
          vm.menuChildList = []
          vm.menuChildList.push({value: '登录',label: '登录'})
        } else if (type && type === '个人中心') {
          vm.menuChildList = []
          vm.menuChildList.push({value: '修改密码',label: '修改密码'})
        } else {
          vm.$net.send({
            server: this.server.menuServer,
            data: {parentId: type, __LIKES_visibled: 'Y'}
          }).then( (data)=> {
            if (type) {
              vm.menuChildList = []
              data.forEach(item => {
                let menuItem = {
                  value: item.id,
                  label: item.menuName
                }
                vm.menuChildList.push(menuItem)
              })
            } else {
              vm.menuList = []
              data.forEach(item => {
                let menuItem = {
                  value: item.id,
                  label: item.menuName
                }
                vm.menuList.push(menuItem)
              })
              vm.menuList.push({value: '登录',label: '登录'})
              vm.menuList.push({value: '个人中心',label: '个人中心'})
            }
          })
        }
      },

      // 一级菜单选中时
      changeMenu (val) {
        let vm = this
        vm.queryForm.childModule = ''
        vm.selectMenuChild = ''
        vm.menuChildList = []
        if (val) {
          vm.queryForm.module = val.label.trim()
          vm.getMenuList(val.value)
        } else {
          vm.queryForm.module = ''
        }
      },

      // 二级菜单选中时
      changeMenuChild (val) {
        if (val) {
          this.queryForm.childModule = val.label.trim()
        } else {
          this.queryForm.childModule = ''
        }

      },

      // 重置
      resetQueryForm () {
        let vm = this
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
        vm.selectMenu = ''
        vm.selectMenuChild = ''
        vm.queryForm = {
          module: '', // 一级菜单
          childModule: '', // 二级菜单
          operateType: '', // 操作类型
          beginTime: '', // 开始时间
          endTime: '', // 结束时间
        }
      },

      // 创建时间选择，时间范围控制及格式转换
      changeStartDate (date) {
        let vm = this
        vm.queryForm.beginTime = date ? moment(date).format('YYYY-MM-DD 00:00:00') : ''
        vm.optionsEnd =  {
          disabledDate (date) {
            let newDate = date && date.valueOf() > Date.now() || moment(date).valueOf() < moment(vm.queryForm.beginTime).valueOf()
            return newDate
          }
        }
      },

      changeEndDate (date) {
        let vm = this
        vm.queryForm.endTime = date ? moment(date).format('YYYY-MM-DD 23:59:59') : ''
        vm.optionsStart =  {
          disabledDate (date) {
            return date && moment(date).valueOf() > moment(vm.queryForm.endTime).valueOf()
          }
        }
      }

    }
  }
</script>

<style scoped>
</style>
