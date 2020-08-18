<template>
    <div class="cust">
        <Card>
            <j-table ref="quotaManagerListTable" pagination autoSearch
                     :autoCache="true"
                     :queryForm.sync="queryForm"
                     :server="server.query"
                     :columns-list="columns"
                     v-model="tableData"
                     @on-selection-change="selectChange"
                     @btnReset="resetQueryForm"
                     @requestSuccess="requestSuccess"
                     @on-edit="editDetails"
                     @on-delete="deleteDetais">
                <template slot="input">
                    <Row>
                        <FormItem label="类别:" :label-width="50">
                            <Select clearable v-model="queryForm.knowledgeTypeId" >
                                <Option v-for="(item,i) in selectedRow" :key="item.id" :value="item.id">
                                    {{ item.knowledgeTypeContent }}
                                </Option>
                            </Select>
                        </FormItem>
                        <FormItem label="创建时间:">
                            <DatePicker
                                    type="date"
                                    format="yyyy-MM-dd"
                                    :options="optionsStart"
                                    @on-change="changeStartDate"
                                    :value="queryForm.startDate"
                                    style="width: 45%"
                                    placeholder="全部">
                            </DatePicker>
                            <span style="display: inline-block; padding: 0 3px;">-</span>
                            <DatePicker
                                    type="date"
                                    format="yyyy-MM-dd"
                                    :options="optionsEnd"
                                    @on-change="changeEndDate"
                                    :value="queryForm.endDate"
                                    style="width: 45%;margin-left: 5px"
                                    placeholder="全部">
                            </DatePicker>
                        </FormItem>
                        <FormItem label="标准问题:">
                            <Input v-model.trim="queryForm.normalQuestion" clearable placeholder="请输入" :maxlength="30" ></Input>
                        </FormItem>
                    </Row>
                    <Row>
                        <FormItem label="答案:" :label-width="50">
                            <Input v-model.trim="queryForm.normalAnswer" clearable placeholder="请输入" :maxlength="30"></Input>
                        </FormItem>
                    </Row>
                </template>
                <template slot="toolbar">
                    <Button class="mOperationBtnItem" type="primary" icon="android-add" @click="editDetails()">新增</Button>
                    <Button class="nlBtnItem" type="primary" icon="ios-paperplane" @click="deleteLotSize">批量删除</Button>
                    <Button class="nlBtnItem" type="primary" icon="ios-cloud-download-outline" @click="download">导出</Button>
                    <Button class="nlBtnItem" type="primary" @click="onRecord">类别管理</Button>
                </template>
            </j-table>

            <Modal  class="cust" :mask-closable="false" :closable="false" v-model="ifShowUp">
                <p slot="header">{{queryForm2.id?'编辑':'新增'}}</p>
                <Form v-if="ifShowUp" ref="queryForm2" :model="queryForm2" class="wpRightItem" :label-width="100" :rules="ruleValidate">
                    <FormItem label="类别:" prop="knowledgeTypeId" required>
                        <Select clearable v-model="queryForm2.knowledgeTypeId" style="width:75%" >
                            <Option v-for="(item,i) in selectedRow" :key="item.id" :value="item.id" >
                                {{ item.knowledgeTypeContent }}
                            </Option>
                        </Select>
                        <Button class="nlBtnItem" type="primary" @click="onRecord">添加类别</Button>
                    </FormItem>
                    <FormItem label="标准问题：" prop="normalQuestion" required>
                        <Input  type="textarea" clearable :maxlength="30" v-model="queryForm2.normalQuestion" @input="descInput('normalQuestion')" style="position:relative;"></Input>
                        <span style="position:absolute;right:15px;bottom:-10px;">{{ remnant1 }}/30</span>
                    </FormItem>
                    <FormItem label="答案："  prop="normalAnswer"  required>
                        <Input  type="textarea" clearable :maxlength="300" v-model="queryForm2.normalAnswer" @input="descInput('normalAnswer')" style="position:relative;"></Input>
                        <span style="position:absolute;right:15px;bottom:-10px;">{{ remnant2 }}/300</span>
                    </FormItem>
                </Form>
                <div slot="footer" style="text-align: center;">
                    <Button class="nlBtnItem" type="primary" @click="btnok('queryForm2')">保存</Button>
                    <Button type="ghost" @click="btncancel">取消</Button>
                </div>
            </Modal>
            
        </Card>

        <!-- 类别的新增 -->
        <typeManagerdemo v-model="ifShowUp2" :selectedRow="selectedRow" :typearray="typearray" :checkTypeContent ="checkTypeContent" @func="init"></typeManagerdemo>
    </div>
</template>

<script>
  import moment from 'moment'
  import app from "@/config/app"
  import axios from 'axios'
  import store from '@/store'
  import typeManagerdemo from './typeManagerdemo'

  export default {
    data() {
      return {
        server: {
          query: this.$services.backendService.knowledgeRestController.query,
          save: this.$services.backendService.knowledgeRestController.save,
          update: this.$services.backendService.knowledgeRestController.update,
          delete: this.$services.backendService.knowledgeRestController.delete,
          batchDelete: this.$services.backendService.knowledgeRestController.batchDelete,
          gettype: this.$services.backendService.knowledgeTypeRestController.gettype
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

        ifShowUp: false,
        ifShowUp2: false,
        questionchecksingle: '',
        selectedRow: [],
        checkTypeContent: [],
        queryForm: {
          id:'',
          knowledgeTypeId:'',
          normalQuestion: '',
          normalAnswer: '',
          startDate: '',
          endDate: ''
        },
        queryForm2: {
          id:'',
          knowledgeTypeId:'',
          normalQuestion: '',
          normalAnswer: ''
        },
        remnant1: 0,
        remnant2: 0,//文本字数
        // 渠道名称
        selectedList: [],//批量选择
        tableData: [],
        typearray: [],//类别校验
        columns: [
          { type: 'selection', align: 'center', width: 60 },
          { type: 'index', title: '序号', align: 'center', width: 60 },
          { title: '类别', align: 'center', key: 'knowledgeTypeContent' },
          { title: '标准问题', align: 'center', key: 'normalQuestion' },
          { title: '答案', align: 'center', key: 'normalAnswer' },
          { title: '创建时间', align: 'center', key: 'createdTime' },
          { title: '操作', align: 'center', key: 'action', width: 140, handler: [
            { action: 'edit' },
            { action: 'delete' }
          ]}
        ],

        ruleValidate: {
          knowledgeTypeId:[
            { required: true, message: '请选择类别', trigger: 'change' }
          ],
          normalQuestion: [
            { required: true, message: '请填写标准问题', trigger: 'blur' }
          ],
          normalAnswer: [
            { required: true, message: '请填写答案', trigger: 'blur' }
          ],
        }
      }
    },

    components: {
      typeManagerdemo
    },

    mounted (){
      this.init()
    },

    methods: {
      init () {
        let vm =this
        vm.$net.send({
            server: vm.server.gettype
        }).then((data) => {
          let res = data
          if (res.length === 0) {
            vm.selectedRow = []
          } else {
            vm.selectedRow = res
          }
        })
      },

      //计算文本框字数
      descInput (name) {
        if (name === 'normalQuestion') {
          this.remnant1 = this.queryForm2.normalQuestion.length
        }
        if (name === 'normalAnswer') {
          this.remnant2 = this.queryForm2.normalAnswer.length
        }
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

        this.queryForm = {
          id:'',
          knowledgeTypeId:'',
          normalQuestion: '',
          normalAnswer: '',
          startDate: '',
          endDate: ''
        }
      },

      requestSuccess (data) {
        let resData = data
        this.checkTypeContent = []
        resData.forEach(item => {
          this.typearray.push(item.normalQuestion)
          this.checkTypeContent.push(item.knowledgeTypeContent)
        })
        //获取列表下类别属性交给类别增删判断        
        this.checkTypeContent = [ ...new Set( this.checkTypeContent ) ].sort()
      },

      // 创建时间选择，时间范围控制及格式转换
      changeStartDate (date) {
        let vm = this
        vm.queryForm.startDate = date ? moment(date).format('YYYY-MM-DD 00:00:00') : ''
        vm.optionsEnd =  {
          disabledDate (date) {
            return date && moment(date).valueOf() < moment(vm.queryForm.startDate).valueOf() || date && moment(date).valueOf() > Date.now()
          }
        }
      },

      changeEndDate (date) {
        let vm = this
        vm.queryForm.endDate = date ? moment(date).format('YYYY-MM-DD 23:59:59') : ''
        vm.optionsStart =  {
          disabledDate (date) {
            return date && moment(date).valueOf() > moment(vm.queryForm.endDate).valueOf()
          }
        }
      },

      // 导出事件
      download () {
        let url = app.url.server +this.$services.backendService.knowledgeRestController.exportKnowledge.url
        let querydownload = this.queryForm
        delete querydownload['id']
        axios.get(
          url,
          {
            headers: {'x-user-token': store.getters.userToken},
            params: querydownload,
            responseType:'blob'
          }
        ).then(data=>{
          let dataurl = window.URL.createObjectURL(data.data) //表示一个指定的file对象或Blob对象
          let a = document.createElement('a')
          document.body.appendChild(a)
          a.href = dataurl
          a.download = '知识库管理信息表.xlsx' //命名下载名称
          a.click(); //点击触发下载
          window.URL.revokeObjectURL(dataurl)  //下载完成进行释放
          this.$Message.success('导出成功！')
        })
      },

      // 修改详情
      editDetails (item) {
        let vm = this
        vm.ifShowUp = true
        vm.remnant1 = 0
        vm.remnant2 = 0
        if (item) {
          vm.questionchecksingle = item.normalQuestion
          vm.queryForm2.id = item.id
          vm.queryForm2.normalQuestion = item.normalQuestion
          vm.queryForm2.normalAnswer = item.normalAnswer
          vm.queryForm2.knowledgeTypeId= item.knowledgeTypeId
          vm.remnant1 = item.normalQuestion.length
          vm.remnant2 = item.normalAnswer.length

        } else {
          vm.editflag =false
          vm.queryForm2 = {
            id:'',
            normalQuestion: '',
            normalAnswer: '',
            knowledgeTypeId:''
          }
        }
      },

      // 选择/取消选择,列表的多选框
      selectChange (selection) {
        this.selectedList = selection
      },

      // 删除
      deleteDetais (item) {
        let vm = this
        vm.$net.send({
          server: vm.server.delete,
          append: item.id
        }).then(data => {
          if (data.code === 200) {
            vm.$refs.quotaManagerListTable.refresh()
            vm.$Message.success('删除成功')
          } else {
            vm.$Message.error(`${data.code}:${data.message}`)
          }
        }).catch(error => {
          vm.$Message.error(error.reason)
        })
      },

      // 批量删除
      deleteLotSize () {
        let vm = this
        if (vm.selectedList.length === 0) {
          vm.$Message.warning('请先选择要删除的知识点')
          return false
        }
        vm.$Modal.confirm({
          title: '批量删除提示',
          content: '是否确定要删除已选择的知识点?',
          onOk: () => {
            let ids = vm.selectedList.map(item => item.id)
            vm.$net.send({
              server: vm.server.batchDelete,
              data: ids
            }).then(data => {
              if (data.code === 200) {
                vm.selectedList = []
                vm.$refs.quotaManagerListTable.refresh()
                vm.$Message.success('批量删除成功')
              } else {
                vm.$Message.error(data.message)
              }
            }).catch(error => {
              vm.$Message.error(error.reason)
            })
          }
        })
      },

      btnok (name){
        this.$refs[name].validate((valid) => {
          if (valid) {
            let vm = this
            if (this.queryForm2.id) {
              vm.$net.send({
                server: vm.server.update,
                data: vm.queryForm2
              }).then(data => {
                if (data.code === 200) {
                  vm.ifShowUp = false
                  vm.$refs.quotaManagerListTable.refresh()
                  vm.$Message.success('修改成功')
                  vm.$refs.queryForm2.refresh()
                } else {
                  vm.$Message.error(data.message)
                }
              }).catch(error => {
                vm.$Message.error(error.reason)
              })
            } else {
              delete vm.queryForm2['id']
              vm.$net.send({
                server: vm.server.save,
                data: vm.queryForm2
              }).then(data => {
                if (data.code === 200) {
                  vm.ifShowUp = false
                  vm.selectedList = []
                  vm.$refs.quotaManagerListTable.refresh()
                  vm.$Message.success('新增成功')
                  vm.$refs.queryForm2.refresh()
                } else {
                  vm.$Message.error(data.message)
                }
              }).catch(error => {
                vm.$Message.error(error.reason)
              })
            }
          } else {
            return null
          }
        })
      },

      btncancel (){
        let vm = this
        vm.ifShowUp = false
        vm.$refs['queryForm2'].resetFields()
      },

      onRecord () {
        this.ifShowUp2 = true
      }
    }
  }
</script>

