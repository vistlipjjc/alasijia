<template>
    <Modal v-model="show" :mask-closable="false" title="消费记录" width="800">
        <div class="record">
            <Table :columns="columnList" :data="tableData" border></Table>
        </div>
        <div style="overflow: hidden; margin-top: 10px;">
            <div style="font-weight: bold; float: left;">
                合计：{{ count }} 元
            </div>
            <div style="float: right;">
                <Page :total="total" :current="currentPage" :page-size="pageSize" placement="top" @on-page-size-change="pageSizeChange" @on-change="changePage" show-sizer show-total></Page>
            </div>
        </div>

        <template slot="footer">
            <div style="text-align: center;">
                <Button type="primary" @click="saveRecord">保存</Button>
                <Button @click="show = false">返回</Button>
            </div>
        </template>
    </Modal>
</template>

<script>
  import $ from 'jquery';
  import moment from 'moment'
  import storage from '@/util/storage'
  export default {
    props: {
      value: Boolean,
      selectedRow: Object // 当前行的数据
    },

    data () {
      return {
        show: this.value,
        rowData: this.selectedRow,
        nowDate: '',
        ifPressSave: false, // 是否有执行过保存
        total: 0, // 分页总数
        pageSize: 10, // 每页条数
        currentPage: 1, // 页码
        realTableData: [], // 消费记录数据
        tableData: [], // 展示表格数据
        columnList: [
          { title: '序号', key: 'consumerNo', align: 'center', width: 90 },
          { title: '消费金额（元）', key: 'costAmt' ,  align: 'center',
            render: (h, params) => {
              return h('Input', {
                props: {
                  value: params.row.costAmt,
                  elementId: 'rwmc' + params.column.key + params.index
                },
                on: {
                  'on-keyup': (input) => {
                    let money = input.target.value
                    money = money.replace(/[^\d.]/g, '');  // 清除“数字”和“.”以外的字符
                    money = money.replace(/\.{2,}/g, '.'); // 只保留第一个. 清除多余的
                    money = money.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.')
                    money = money.replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3'); // 只能输入两个小数
                    let moneyNumLength = money.replace('.', '').length
                    if (moneyNumLength > 14) {
                      input.target.value = money.substring(0, money.length - 1)
                      this.tableData[params.index].costAmt = money.substring(0, money.length -1)
                    } else if (moneyNumLength === 14 && money.substring(money.length -1, money.length) === '.') {
                      input.target.value = money.substring(0, money.length -1)
                      this.tableData[params.index].costAmt = money.substring(0, money.length -1)
                    } else {
                      input.target.value = money
                      this.tableData[params.index].costAmt = money
                    }
                    let i = params.row.consumerNo * 1 - 1
                    this.realTableData[i].costAmt = this.tableData[params.index].costAmt

                    // 数据渲染后，再让光标聚焦到当前文本框
                    this.$nextTick(()=>{
                      document.getElementById('rwmc' + params.column.key + params.index).focus()
                      if (this.ifPressSave) {
                        this.beforeCheckForm()
                      }
                    })
                  }

                }
              })
            }
          },
          { title: '消费日期', key: 'costTime' ,  align: 'center',
            render: (h, params) => {
              return h('DatePicker', {
                props: {
                  value: params.row.costTime,
                  type: 'date',
                  elementId: 'rwmc1' + params.column.key + params.index,
                  options: {
                    disabledDate (date) {
                      return date && new Date < date
                    }
                  }
                },
                on: {
                  'on-change': (value) => {
                    this.tableData[params.index].costTime = value
                    let i = params.row.consumerNo * 1 - 1
                    this.realTableData[i].costTime = value
                    this.$nextTick(()=>{
                      if (this.ifPressSave) {
                        this.beforeCheckForm()
                      }
                    })
                  }
                }
              })
            }
          },
          { title: '登记人', key: 'userName' ,  align: 'center' },
          { title: '登记时间', key: 'registerTime' ,  align: 'center' },
          {title: '操作', key: 'action', align: 'center', width: 100,
            render: (h, params) => {
                if (params.row.consumerNo * 1 === this.realTableData.length) {
                  return h('div', [
                    h('Button', {
                      props: {type: 'ghost', icon: 'android-add', shape: 'circle'},
                      on: {
                        click: () => { this.addTableRow(params) }
                      }
                    }),

                    h('Button', {
                      props: { type: 'ghost', icon: 'android-close', shape: 'circle'},
                      on: {
                        click: () => { this.removeTableRow(params) }
                      }
                    })

                  ])
                } else {
                  return h('Button', {
                    props: { type: 'ghost', icon: 'android-close', shape: 'circle'},
                    on: {
                      click: () => { this.removeTableRow(params) }
                    }
                  })
                }
            }
          }
        ]
      }
    },

    computed: {
      count () {
        let sum = 0
        this.tableData.forEach(item => {
          sum = sum + item.costAmt * 1
        })
        return sum
      }
    },

    methods: {
      init () {
        let vm = this
        vm.tableData = []
        vm.userName = storage.getItem('user').staffName
        vm.userId = storage.getItem('user').staffCode
        vm.nowDate = moment(new Date()).format('YYYY-MM-DD')
        // console.log('rowData', vm.rowData)
        let lendNo = {lendNo: vm.rowData.lendNo}
        vm.$net.send({
          server: this.$services.backendService.consumerDetailsRestController.findConsumerList,
          data: lendNo
        }).then((data) => {
          // console.log(data)
          let res = data.rows
          if (res.length === 0) {
            vm.tableData = [
              {id: '', managerId: vm.rowData.managerId, registerId: vm.userId, consumerNo: '01', costAmt: '', costTime: '', lendNo: vm.rowData.lendNo, userName: vm.userName, registerTime: vm.nowDate},
              {id: '', managerId: vm.rowData.managerId, registerId: vm.userId, consumerNo: '02', costAmt: '', costTime: '', lendNo: vm.rowData.lendNo, userName: vm.userName, registerTime: vm.nowDate},
              {id: '', managerId: vm.rowData.managerId, registerId: vm.userId, consumerNo: '03', costAmt: '', costTime: '', lendNo: vm.rowData.lendNo, userName: vm.userName, registerTime: vm.nowDate},
            ]
            vm.realTableData = JSON.parse(JSON.stringify(vm.tableData))
          } else {
            res.forEach((item, index) => {
              let i = index + 1
              if (i < 10) {
                item.consumerNo = '0' + i
              } else {
                item.consumerNo = i
              }
              item.registerTime = moment(item.registerTime).format('YYYY-MM-DD')
              delete eval(item).createdTime
            })
            // console.log('res', res)
            vm.realTableData = res
            vm.total = vm.realTableData.length
            vm.dealArray()
          }
        });
      },

      // 选取数组展示
      dealArray (type) {
        let vm = this
        vm.tableData = []
        let len = vm.realTableData.length
        if (type && type === 'add') {
          let pageNum = Math.ceil(len / vm.pageSize)
          if (pageNum > vm.currentPage) {
            vm.currentPage = vm.currentPage + 1
          }
        } else if (type && type === 'remove') {
          let pageNum = Math.ceil(len / vm.pageSize)
          if (pageNum < vm.currentPage) {
            vm.currentPage = vm.currentPage - 1
          }
        }
        let subscript = (vm.currentPage - 1) * vm.pageSize
        vm.total = len
        for (let i = 0; i < vm.pageSize && subscript < len; i ++) {
          vm.tableData.push(vm.realTableData[subscript])
          subscript ++
        }
      },


      // 改变每页条数时触发
      pageSizeChange (val) {
        let vm = this
        vm.pageSize = val
        vm.dealArray()
      },

      // 改变页码时触发
      changePage (val) {
        let vm = this
        vm.currentPage = val
        vm.dealArray()
      },

      // 保存事件
      saveRecord () {
        let vm = this
        // console.log(vm.tableData)
        // vm.beforeCheckForm()
        vm.ifPressSave = true
        if (vm.beforeCheckForm()) {
          let saveData = JSON.parse(JSON.stringify(vm.realTableData))
          saveData.forEach(item => {
            item.costTime = moment(item.costTime).format('YYYY-MM-DD HH:mm:ss')
            item.registerTime = moment(item.registerTime).format('YYYY-MM-DD HH:mm:ss')
          })
          vm.$net.send({
            server: this.$services.backendService.consumerDetailsRestController.batchInsert,
            data: saveData
          }).then((data) => {
            if (data.success) {
              vm.$Message.success('保存成功！')
              vm.show = false
            } else {
              vm.$Message.error(data.message)
            }
          })
        }
      },

      // 校验是否填写
      beforeCheckForm () {
        let flag = true
        // 边框加红
        $("[id^='rwmc']").each(function (index, item) {
          if (item.value === '') {
            $("#" + item.id).addClass('redBorder')
            flag = false
          }
        })

        // 判断是否有空
        this.realTableData.forEach(item => {
          if (item.costAmt === '' || item.costTime === '') {
            flag = false
          }
        })
        return flag
      },

      // 删除表格的某行
      removeTableRow (params) {
        if (this.realTableData.length > 1) {
          this.realTableData.splice(params.row.consumerNo * 1 - 1, 1)
          this.total = this.total - 1
          this.realTableData.forEach((item, index) => {
            let i = index + 1
            if (i < 10) {
              item.consumerNo = '0' + i
            } else {
              item.consumerNo = i
            }
          })
        }
        this.dealArray('remove')
      },

      // 表格新增一行
      addTableRow () {
        let len = this.realTableData.length + 1
        if (len < 10) {
          len = '0' + len
        }
        let currentRowData = {id: '', managerId: this.rowData.managerId, registerId: this.userId, consumerNo: len, costAmt: '', costTime: '', lendNo: this.rowData.lendNo, userName: this.userName, registerTime: this.nowDate}
        this.realTableData.push(currentRowData)
        this.total = this.total + 1
        this.dealArray('add')
      }

    },

    watch: {
      value (val) {
        this.show = val
      },

      selectedRow (val) {
        this.rowData = val
      },

      show (val) {
        if (val) {
          this.pageSize = 10 // 每页条数
          this.currentPage = 1 // 页码
          this.init()
        } else {
          this.$emit('input', val)
        }
      }
    }
  }
</script>

<style>
    .record .ivu-btn-circle-outline.ivu-btn-icon-only, .ivu-btn-circle.ivu-btn-icon-only{
        height: 25px;
        width: 25px;
    }
    .record .ivu-btn-ghost {
        margin-right: 5px;
    }
    .record .ivu-btn-ghost {
        color: #2d8cf0;
        border-color: #2d8cf0;
    }
    .record .ivu-table-cell .ivu-btn-ghost:last-child {
        color: red;
        border-color: red;
    }
    /*.record .ivu-btn-ghost {
        color: #2d8cf0;
        border-color: #2d8cf0;
    }*/
    .redBorder {
        border: 1px solid #ed3f14;
    }
</style>
