<template>
    <div >
        <Card>
            <p slot="title">借款消费管理</p>
            <j-table ref="custManagerListTable" pagination autoSearch
                     :autoCache="true"
                     :showImport="true"
                     :showExport="true"
                     :queryForm.sync="queryForm"
                     :server="server.query"
                     :columns-list="columns"
                     v-model="tableData"
                     @on-record="onRecord"
                     @import-btn="upload"
                     @export-btn="downloadRecord"
                     @requestSuccess="requestSuccess"
                     @btnReset="resetQueryForm">
                <template slot="input">
                    <Row>
                        <FormItem label="借款编号:" >
                            <Input v-model.trim="queryForm.lendNo" placeholder="请输入" clearable :maxlength="17" @on-keyup="lendNoChange"></Input>
                        </FormItem>
                        <FormItem label="客户姓名:" >
                            <Input v-model.trim="queryForm.clienteleName" placeholder="请输入" clearable :maxlength="30"></Input>
                        </FormItem>
                        <FormItem label="联系方式:" >
                            <Input v-model.trim="queryForm.clientelePhone" placeholder="请输入" clearable :maxlength="11" @on-keyup="clientelePhoneChange"></Input>
                        </FormItem>
                    </Row>

                    <Row>
                        <FormItem label="受理人:" >
                            <Input v-model.trim="queryForm.realName" placeholder="请输入" clearable :maxlength="30"></Input>
                        </FormItem>
                        <FormItem label="受理状态:" >
                            <j-select ref="acceptFlag"
                                      url="dict:acceptFlag@sys"
                                      :param="selectParam"
                                      v-model="queryForm.acceptFlag"
                                      @on-change="onSelect('acceptFlag','acceptFlag')"
                                      clearable
                                      style="width: 100%"
                                      placeholder="请选择受理状态">
                            </j-select>
                        </FormItem>
                        <FormItem label="更新时间:" >
                            <DatePicker
                              type="date"
                              :options="optionsStart"
                              @on-change="changeStartDate"
                              :value="queryForm.startTime"
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

                    <Row>
                        <FormItem label="所属机构:" >
                            <org-select-tree @casSelected="casSelected"
                                             :seleted="seletedOrgId"
                                             :organizationJson="organizationJson">
                            </org-select-tree>
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

            <!-- 消费记录弹出框 -->
            <consume-records v-model="ifShowRecord" :selectedRow="selectedRow"></consume-records>

            <!-- 导入页面 -->
            <Modal v-model="ifShowUp" :mask-closable="false" title="借款消费导入" width="400" class="cust">
                <div style="margin-bottom: 5px;">
                    <div class="upload-container">
                        <Upload ref="uploadExcel"
                                :show-upload-list="false"
                                :multiple="false"
                                :accept="accept"
                                :format="format"
                                :headers="headers"
                                :on-format-error="handleFormatError"
                                :max-size="10240"
                                :on-exceeded-size="handleMaxSize"
                                :before-upload="handleBeforeUpload"
                                :on-success="onUpdataSuccess"
                                :on-error="handleErrorUpload"
                                :on-remove="handleRemoveUpload"
                                :action="action">
                            <p class="upload-btm" v-if="ifShowUpload">选择文件</p>
                        </Upload>
                        <span v-if="fileName" class="currentFile">
                            <Icon type="stats-bars"></Icon>
                            {{ fileName }}
                            <Icon type="ios-close-outline" style="font-size: 14px; cursor: pointer; vertical-align: middle;" @click="cancleCurrentFile"></Icon>
                        </span>
                    </div>
                    <span class="modal-text" @click="downloanTemplate">模板</span>
                </div>

                <div v-if="ifUpload && !beforeUploadMessage">共导入{{ uploadData.totalNum }}条，成功{{ uploadData.successNum }}条，失败{{ uploadData.faileNum }}条。<span class="fail-text" v-if="uploadData.faileNum != 0" @click="managerImportFail">下载失败记录</span></div>
                <div v-if="beforeUploadMessage" style="color: red;"> {{beforeUploadMessage}} </div>
                <template slot="footer">
                    <div style="text-align: center;">
                        <Button v-if="!ifUpload" type="primary" @click="saveUpload">导入</Button>
                        <Button v-if="!ifUpload" @click="ifShowUp = false">取消</Button>
                        <Button v-if="ifUpload" type="primary" @click="ifShowUp = false">确定</Button>
                    </div>
                </template>
            </Modal>
        </Card>
    </div>
</template>

<script>
  import moment from 'moment'
  import app from "@/config/app"
  import orgSelectTree from '../custManager/orgSelectTree.vue'
  import consumeRecords from './consumeRecords.vue'
  import storage from '@/util/storage'
  import axios from 'axios'
  import store from '@/store'
  export default {
    components: { orgSelectTree, consumeRecords },
    data() {
      return {
        ifShowRecord: false, // 是否显示消费记录
        ifShowUp: false, // 是否显示导入页面
        registerId: '',
        headers: {'x-user-token': store.getters.userToken}, // 导入校验的请求头带上id
        accept: 'application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        format: ['xls','xlsx'], // 固定上传文件类型
        ifShowUpload: true,
        ifUpload: false,
        fileName: '',
        setUpload: '',
        beforeUploadMessage: '',
        uploadData: {
          totalNum: 0,
          successNum: 0,
          faileNum: 0
        }, // 导入成功后的数据提示
        action: app.url.server + this.$services.backendService.consumerDetailsRestController.checkImportData.url, // 导入的路径
        uploadUrl: this.$services.backendService.consumerDetailsRestController.importExcel, // 导入的路径

        getOrganizationBack: false, // 已经获取机构
        selectedRow: {}, // 记录查看当前行的数据
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

        seletedOrgId: [],
        organizationJson: [],
        organizationObject: {}, // 全部机构的键值对格式

        // 状态下拉框的查询条件
        selectParam: {
          excludes: '02,03,0401,0402'
        },

        server: {
          query: this.$services.backendService.consumerDetailsRestController.query
        },
        queryForm: {
          lendNo: '',
          clienteleName: '',
          clientelePhone: '',
          realName: '',
          acceptFlag: '',
          startTime: '',
          endTime: '',
          orgId: '',
          productType: '', // 套餐分类
          packageName: '' // 套餐名称
        },
        tableData: [],
        columns: [
          { type: 'index', title: '序号', align: 'center', width: 60 },
          { title: '借款编号', align: 'center', key: 'lendNo', width: 155 },
          { title: '客户姓名', align: 'center', key: 'clienteleName', width: 90 },
          { title: '联系方式', align: 'center', key: 'clientelePhone', width: 115 },
          { title: '受理状态', align: 'center', key: 'acceptFlag', formatter: 'dict:acceptFlag@sys', width: 90 },
          { title: '更新时间', align: 'center', key: 'lsUpdatedTime', width: 120 },
          { title: '受理人', align: 'center', key: 'realName', width: 80 },
          { title: '所属机构', align: 'center', key: 'agencyName', minWidth: 150 },
          { title: '审批金额（万）', align: 'center', key: 'grantAmt', width: 90 },
          { title: '产品分类', align: 'center', key: 'productType', formatter: 'dict:productType@sys', width: 75 },
          { title: '套餐名称', align: 'center', key: 'packageName', width: 75 },
          { title: '操作', align: 'center', key: 'action', width: 80, handler: [
            {action: 'otherskip', icon: 'clipboard', content: '消费记录', envent:'on-record'}
          ]
          }],
      }
    },

    watch: {
      ifShowUp (val) {
        if (val === true) {
          this.ifShowUpload = true
          this.ifUpload = false
          this.fileName = ''
          clearInterval(this.setUpload)
        }
      },

    queryForm (val) { 
      let vm = this
      // 如果选择了机构，则处理以显示选择的机构
      if (val.orgId) {
        vm.showOrgSelected([], val.orgId)
      }
    }
  },

    created () {
      this.getOrganization()
      this.registerId = storage.getItem('user').staffCode
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
              vm.seletedOrgId = orgIds
            }
          }
        }, 500)
      },

      // 获取所有机构
      getOrganization () {
        let vm = this
        vm.$net.send({
          server: vm.$services.backendService.organizationRestController.getOrganizationTree

        }).then(data => {
          if (data.code === 200) {

            let organizationJson = JSON.stringify(data.data)
            organizationJson = organizationJson.replace(/orgNo/g, 'value').replace(/title/g, 'label')
            organizationJson = JSON.parse(organizationJson)
            vm.changeArrayToObject(organizationJson)
            // console.log('organizationJson', vm.organizationJson)
            organizationJson.forEach(item => {
              if (item.value === 'ZJF') {
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
        if (vm.organizationObject[orgId] && vm.organizationObject[orgId].parentId) {
          let newOrgName = vm.organizationObject[orgId] ? vm.organizationObject[orgId].label : ''
          let oldOrgName = vm.tableData[index].agencyName
          vm.tableData[index].agencyName = oldOrgName ? `${newOrgName} ${oldOrgName}` : newOrgName
          vm.getParentName(vm.organizationObject[orgId].parentId, index)
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
        this.seletedOrgId = []
        this.queryForm = {
          lendNo: '',
          clienteleName: '',
          clientelePhone: '',
          realName: '',
          orgId: '',
          acceptFlag: '',
          startTime: '',
          endTime: '',
          productType: '', // 套餐分类
          packageName: '' // 套餐名称
        }
      },

      // 借款编号控制
      lendNoChange () {
        this.queryForm.lendNo = this.queryForm.lendNo.replace(/[\W]/g,'')
      },

      // 联系方式的控制
      clientelePhoneChange () {
        this.queryForm.clientelePhone = this.queryForm.clientelePhone.replace(/\D/g,'')
      },

      // 接口请求成功
      requestSuccess (data) {
        let vm = this
        setTimeout(() => {
          vm.tableData = []
          data.forEach((item, index) => {
            item.agencyName = ''
            item.lsUpdatedTime = item.lsUpdatedTime ? moment(item.lsUpdatedTime).format('YYYY-MM-DD HH:mm') : ''
            vm.tableData.push(item)
            vm.getParentName(item.orgId, index)
          })
        }, 0)
        // console.log('tableData', this.tableData)
      },

      // 所属机构选择后回调
      casSelected (selectedData) {
        console.log('selectedData', selectedData)
        let len = selectedData.length
        this.queryForm.orgId = len ? selectedData[len-1].value : ''
      },

      // 创建时间选择，时间范围控制及格式转换
      changeStartDate (date) {
        let vm = this
        vm.queryForm.startTime = date ? moment(date).format('YYYY-MM-DD 00:00:00') : ''
        vm.optionsEnd =  {
          disabledDate (date) {
            let newDate = date && date.valueOf() > Date.now() || moment(date).valueOf() < moment(vm.queryForm.startTime).valueOf()
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
      },

      // 下拉框选择
      onSelect(value, name) {
        let obj = this.$refs[value].getSelect();
        this.queryForm[name] = obj.name;
        this.queryForm[value] = obj.value;
      },

      // 弹出消费记录
      onRecord (row) {
        this.selectedRow = row
        this.ifShowRecord = true
      },

      // 导出事件
      downloadRecord () {
        let url = app.url.server +this.$services.backendService.consumerDetailsRestController.exportInfo.url
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
          a.download = '消费记录信息表.xlsx' //命名下载名称
          a.click(); //点击触发下载
          window.URL.revokeObjectURL(dataurl)  //下载完成进行释放
          this.$Message.success('导出成功！')
        })
      },

      // 导入事件
      upload () {
        this.ifShowUp = true
      },

      // 导入保存事件
      saveUpload () {
        if (this.fileName) {
          this.ifUpload = true
        }else {
          this.$Message.info('请先上传文件！')
        }

      },

      // 模板导出事件
      downloanTemplate () {
        let url = app.url.server + this.$services.backendService.consumerDetailsRestController.downloanTemplate.url
        axios.get(
          url,
          {
            headers: {'x-user-token': store.getters.userToken},
            responseType:'blob'
          }
        ).then(data=>{
          let dataurl = window.URL.createObjectURL(data.data) //表示一个指定的file对象或Blob对象
          let a = document.createElement('a')
          document.body.appendChild(a)
          a.href = dataurl
          a.download = '消费记录信息表.xlsx' //命名下载名称
          a.click(); //点击触发下载
          window.URL.revokeObjectURL(dataurl)  //下载完成进行释放
          this.$Message.success('下载模板成功！')
        })
      },

      // 下载导入失败记录
      managerImportFail () {
        let url = app.url.server + this.$services.backendService.consumerDetailsRestController.exportFaileInfo.url
        axios.get(
          url,
          {
            headers: {'x-user-token': store.getters.userToken},
            responseType:'blob'
          }
        ).then(data=>{
          let dataurl = window.URL.createObjectURL(data.data) //表示一个指定的file对象或Blob对象
          let a = document.createElement('a')
          document.body.appendChild(a)
          a.href = dataurl
          a.download = '消费记录信息导入失败表.xlsx' //命名下载名称
          a.click(); //点击触发下载
          window.URL.revokeObjectURL(dataurl)  //下载完成进行释放
          this.$Message.success('下载导入失败记录成功！')
        })
        // window.open(url)
        // this.$Message.success('下载导入失败记录成功！')
      },

      // 判断上传的类型是否是xls 或xlsx
      handleFormatError () {
        // this.ifShowUpload = false
        this.beforeUploadMessage = '文件格式不正确，文件后缀名必须为xls 或xlsx （即Excel格式）！'
        // this.$Message.info('文件格式不正确，文件后缀名必须为xls 或xlsx （即Excel格式）！')
      },

      // 判断文件大小
      handleMaxSize () {
        // this.ifShowUpload = false
        this.$Message.info('文件超过10M，文件大小不得大于10M！')
      },

      // 上传文件之前
      handleBeforeUpload (data) {
        let vm = this
        vm.ifShowUpload = false
        vm.ifUpload = false
        vm.fileName = data.name
        // console.log(data)
        return new Promise((resolve, reject) => {
          vm.setUpload = setInterval(function () {
            if (vm.ifUpload === true) {
              clearInterval(vm.setUpload)
              resolve()
            }
          }, 1000)
        })
      },

      // 上传文件失败后
      handleErrorUpload (response) {
        this.ifShowUpload = false
        // console.log('handleErrorUpload',response)
        // this.uploadData = response
      },

      // 删除文件后
      handleRemoveUpload () {
        this.ifShowUpload = true
      },

      // 取消当前文件，重新上传文件
      cancleCurrentFile () {
        let vm = this
        vm.fileName = false
        vm.ifShowUpload = true
        vm.ifUpload = false
        vm.beforeUploadMessage = ''
        clearInterval(vm.setUpload)
      },

      // 上传文件成功后
      onUpdataSuccess (response) {
        let vm = this
        if (response.success) {
          if (response.data) {
            vm.$Modal.confirm({
              content: '<p>上传的消费记录有重复，是否覆盖？</p>',
              okText: '覆盖',
              cancelText: '不覆盖',
              onOk: () => {
                vm.importExcel(1)
              },
              onCancel: () => {
                vm.importExcel(0)
              }
            })
          } else {
            vm.importExcel(0)
          }

        } else {
          vm.$Message.info(response.message)
        }
      },

      // 真正导入
      importExcel (type) {
        let vm = this
        let params = {
          registerId: vm.registerId,
          overwrite: type
        }
        vm.$net.send({
          server: vm.uploadUrl,
          data: params
        }).then(data => {
          if (data.success) {
            vm.filePath = data.data
            this.ifShowUpload = false
          } else {
            vm.$Message.info(data.message)
          }
          console.log('onUpdataSuccess',data)
          vm.uploadData = data
        })
      }

    }


  }
</script>
<style>
    .cust .ivu-modal-body {
        text-align: center;
    }
    .cust .ivu-upload {
        display: inline-block;
    }
    .upload-btm {
        display: inline-block;
        vertical-align: middle;
        border: 1px solid #dddee1;
        border-radius: 5px;
        padding: 5px;
        cursor: pointer;
    }
    .upload-container {
        display: inline-block;
        vertical-align: middle;
    }
    .modal-text {
        display: inline-block;
        vertical-align: middle;
        margin-left: 10px;
        border-bottom: 1px solid #2d8cf0;
        color: #2d8cf0;
        cursor: pointer;
        font-size: 15px;
        line-height: 1.5;
    }
    .fail-text {
        color: red;
        border-bottom: 1px solid red;
        cursor: pointer;
    }
    .currentFile:hover {
        color: #2d8cf0;
    }
</style>
