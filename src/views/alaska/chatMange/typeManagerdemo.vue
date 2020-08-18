<template>
  <Modal v-model="ifShowUp2" title="类别管理"  class="cust" :mask-closable="false" :closable="false">
      <div class="amCont">
        <Table border :columns="columns" :data="tableDataBefore"></Table>
        <Page class="amPageBox"
          show-sizer
          show-total
          placement="top"
          :total="total"
          :current="currentPage"
          :page-size="pageSize"
          @on-page-size-change="pageSizeChange" @on-change="changePage">
        </Page>
      </div>
      <template slot="footer">  
          <div style="text-align: center;">
              <Button type="primary" @click="saveRecord">保存</Button>
              <Button type="ghost" @click="ifShowUp2 = false">取消</Button>
          </div>
      </template>          
  </Modal>  

</template>

<script>
import $ from 'jquery';
export default {

  props: {
      value: Boolean,
      checkTypeContent: Array // 有知识库的类别集合

    },


  data () {
    return {
      server: {
        query: this.$services.backendService.knowledgeTypeRestController.query,
        batchInsert: this.$services.backendService.knowledgeTypeRestController.batchInsert,
      },
 
      ifShowUp2: this.value, // 显示弹框
      total: 0, // 总条数
      currentPage: 1, // 当前页码
      pageSize: 10, // 每页条数
      tableData : [], // 类别列表
      tableDataBefore : [], //前端渲染类别列表
      typeReply: [], // 重复名字的
      ifCheck: false,
      columns: [
          { title: '序号', align: 'center', key: 'consumerNo', width: 60 },
          { title: '类别', align: 'center', key: 'knowledgeTypeContent' ,width: 305,
            render: (h, params) => {
              return h('Input', {
                props: {
                  value: params.row.knowledgeTypeContent,
                  elementId: 'rwmc'+ params.column.key + params.row.consumerNo,
                  maxlength: 10
                },
                on: {
                  'on-focus': () => {
                    // 数据渲染后，再让光标聚焦到当前文本框
                    this.$nextTick(()=>{
                      document.getElementById('rwmc'+ params.column.key + params.row.consumerNo).focus()
                    })
                  },
                  'on-blur': (input) => {
                    let vm = this
                    vm.tableDataBefore[params.index].knowledgeTypeContent = input.target.value
                    let i = params.row.consumerNo * 1 - 1
                    vm.tableData[i].knowledgeTypeContent = vm.tableDataBefore[params.index].knowledgeTypeContent
                  },

                }
              })
            }
          },
          {title: '操作', key: 'action', align: 'center', width: 120,
            render: (h, params) => {
                if (params.row.consumerNo * 1 === this.tableData.length)  {
                  
                  return h('div', [
                    h('Button', {
                      style: {
                        color:'blue',
                        borderColor:'blue',
                        marginRight:'5px'
                      },
                      props: {type: 'ghost', icon: 'android-add', shape: 'circle'},
                      on: {
                        click: () => {this.addTableRow() }
                      }
                    }),
                    h('Button', {
                      style: {
                        color:'red',
                        borderColor:'red'

                      },
                      props: { type: 'ghost', icon: 'android-close', shape: 'circle'},
                      on: {
                        click: () => { this.removeTableRowbefore(params) }
                      }
                    })

                  ])
                } else {
                  return h('div', [
                    h('Button', {
                      style: {
                        color:'red',
                        borderColor:'red'
                      },
                      props: { type: 'ghost', icon: 'android-close', shape: 'circle'},
                      on: {
                        click: () => { this.removeTableRowbefore(params) }
                      }
                    })

                  ])
                }
            }
          }
        ],
    }
  },

  methods: {
    init () {
      let vm = this
      vm.ifCheck = false
      vm.$net.send({
        server: vm.server.query
      }).then((data) => {
        let res = data.rows
        if (res.length === 0) {
          vm.tableDataBefore = [{consumerNo: 1, id: null, knowledgeTypeContent: '', saveTime: null} ]
          vm.tableData = [{consumerNo: 1, id: null, knowledgeTypeContent: '', saveTime: null} ]
        } else {
          res.forEach((item, index) => {
            let i = index + 1
            item.consumerNo = i
          })
          vm.tableData = res
          vm.total = vm.tableData.length
          vm.dealArray()
        }
      })
    },

    // 改变页码
    changePage (page) {
      let vm = this
      vm.currentPage = page
      vm.dealArray()
    },

    // 改变每页条数
    pageSizeChange (size) {
      let vm = this
      vm.pageSize = size
      vm.dealArray()
    },

    // 删除表格的某行
    removeTableRowbefore (params) {
      let vm = this
      vm.tableData.splice(params.row.consumerNo * 1 - 1, 1)
      vm.total = this.total - 1
      vm.ifCheck = false
      vm.tableData.forEach((item, index) => {
        let i = index + 1
        item.consumerNo = i
      })
      this.dealArray('remove')
    },

    // 表格新增一行
    addTableRow () {
      let len = this.tableData.length + 1
      let currentRowData = {id: null, knowledgeTypeContent: '', saveTime: null,consumerNo: len,}
      this.ifCheck = false
      this.tableData.push(currentRowData)
      this.total = this.total + 1
      this.dealArray('add')
    },

    // 选取数组展示
    dealArray (type) {
      let vm = this
      vm.tableDataBefore = []
      let len = vm.tableData.length
      if (type && type === 'add') {
        let pageNum = Math.ceil(len / vm.pageSize)
        if (pageNum > vm.currentPage) {
          vm.currentPage = vm.currentPage + 1
        }
      } else if (type && type === 'remove') {
        let pageNum = Math.ceil(len / vm.pageSize)
        if (pageNum < vm.currentPage && pageNum>0) {
          vm.currentPage = vm.currentPage - 1
        }
      }
      let subscript = (vm.currentPage - 1) * vm.pageSize
      vm.total = len
      for (let i = 0; i < vm.pageSize && subscript < len; i ++) {
        vm.tableDataBefore.push(vm.tableData[subscript])
        subscript ++
      }

      // 判断是否有不符合规则的输入项
      vm.$nextTick(()=>{
        if (vm.ifCheck) {
          vm.beforeCheckForm('page')
        }
      })
    },
    
    // 保存事件
    saveRecord () {
      let vm = this
      let flag = vm.beforeCheckForm()
      vm.ifCheck = true
      if (flag) {
        let saveData = JSON.parse(JSON.stringify(this.tableData))
        saveData.forEach( item => {
          delete item['consumerNo']
        })
        //console.log('saveData', saveData)
        vm.$net.send({
          server: this.server.batchInsert,
          data: saveData
        }).then((data) => {
          if (data.success) {
            vm.$Message.success('保存成功！')
            vm.ifShowUp2 = false
            vm.$emit('func')
          } else {
            vm.$Message.error(data.message)
          }
        })
      }
    },

    // 校验是否填写
    beforeCheckForm (name) {
      let vm = this
      let flag = true
      let typeArr = []
      let msg = ''

      // 判断是否为空
      vm.tableData.forEach(item => {
        typeArr.push(item.knowledgeTypeContent)
        if (item.knowledgeTypeContent === '') {
          msg = '请填写相关类别名称!'
          flag = false
        }
      })

      // 判断是否有重复项
      vm.typeReply = []
      let sortTypeArr = typeArr.sort()
      for(let i = 0; i < sortTypeArr.length - 1; i++) {
        if(sortTypeArr[i] === sortTypeArr[i + 1]) {
          vm.typeReply.push(sortTypeArr[i])
          flag = false
          if (!msg) {
            msg = '不能存在相同的类别名称！'
          }
        }
      }

      // 边框加红
      $("[id^='rwmc']").each(function (index, item) {
        if (item.value === '') {
          $("#" + item.id).addClass('redBorder')
        } else {
          vm.typeReply.forEach(typeItem => {
            if (item.value === typeItem) {
              $("#" + item.id).addClass('redBorder')
            }
          })
        }
      })

      if (msg && !name) {
        this.$Message.error(msg)
      }
      return flag
    }
  },

  watch: {
    value (val) {
      this.ifShowUp2 = val
    },

    ifShowUp2 (val) {
      if (val) {
        this.pageSize = 10 // 每页条数
        this.currentPage = 1 // 页码
        this.typeReply = []
        this.init()
      } else {
        this.$emit('input', val)
      }
    },
  }
}
</script>
<style>
.amPageBox {
  margin-top: 10px;
  margin-bottom: 0;
  text-align: right;
}
.redBorder {
  border-color: #ed3f14 !important;
  box-shadow: 0 0 0 2px rgba(237,63,20,.2) !important;
}    
</style>

