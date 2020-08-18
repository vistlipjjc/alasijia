<template>
    <div class="cust">
        <Card>
            <p slot="title">客户经理管理</p>
            <j-table ref="custManagerListTable" pagination autoSearch
                     :showAdd="true"
                     :showImport="true"
                     :showExport="true"
                     :autoCache="true"
                     :queryForm.sync="queryForm"
                     :server="server.query"
                     :columns-list="columns"
                     v-model="tableData"
                     @btnReset="resetQueryForm"
                     @on-delete="remove"
                     @on-reset="resetPassword"
                     @on-relieve="relievePerson"
                     @requestSuccess="requestSuccess"
                     @add-btn="$router.push({path: '/custManagerEdit/add'})"
                     @import-btn="upload"
                     @export-btn="download"
                     @on-view="viewDetails"
                     @on-edit="editDetails">
                <template slot="input">
                    <Row>
                        <FormItem label="编号:">
                            <Input v-model.trim="queryForm.managerNo" placeholder="请输入" clearable :maxlength="15" @on-keyup="managerNoChange"></Input>
                        </FormItem>
                        <FormItem label="手机号码:">
                            <Input v-model.trim="queryForm.phone" placeholder="请输入" clearable :maxlength="11" @on-keyup="phoneChange"></Input>
                        </FormItem>
                        <FormItem label="姓名:">
                            <Input v-model.trim="queryForm.realName" placeholder="请输入" clearable :maxlength="30"></Input>
                        </FormItem>
                    </Row>

                    <Row>
                        <FormItem label="所属机构:">
                            <org-select-tree
                                    @casSelected="casSelected"
                                    :organizationJson="organizationJson"
                                    :seleted="seletedOrgId">
                            </org-select-tree>
                        </FormItem>
                        <FormItem label="状态:">
                            <j-select ref="userStatus"
                                      url="dict:userStatus@sys"
                                      v-model="queryForm.sts"
                                      @on-change="onSelect('userStatus','sts')"
                                      clearable
                                      style="width: 100%"
                                      placeholder="请选择状态">
                            </j-select>
                        </FormItem>
                        <FormItem label="是否黑名单:">
                            <j-select ref="isBlack"
                                      :optionList="isBlackList"
                                      v-model="queryForm.isBlack"
                                      @on-change="onSelect('isBlack','isBlack')"
                                      clearable
                                      style="width: 100%"
                                      placeholder="请选择">
                            </j-select>
                        </FormItem>
                    </Row>
                </template>

            </j-table>
            <!-- 导入页面 -->
            <Modal v-model="ifShow" :mask-closable="false" title="客户经理导入" width="400" class="cust">
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
                        <Button v-if="!ifUpload" @click="ifShow = false">取消</Button>
                        <Button v-if="ifUpload" type="primary" @click="ifShow = false">确定</Button>
                    </div>
                </template>
            </Modal>
        </Card>
    </div>
</template>

<script>
  import app from "@/config/app"
  import orgSelectTree from './orgSelectTree.vue'
  import axios from 'axios'
  import store from '@/store'
  export default {
    components: { orgSelectTree },
    data() {
      return {
        ifShow: false, // 是否显示导入页面
        headers: {'x-user-token': store.getters.userToken}, // 导入的请求头带上id
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
        action: app.url.server + this.$services.backendService.custManagerRestController.importExcel.url, // 导入的路径

        seletedOrgId: [], // 已选择机构
        organizationJson: [],
        organizationObject: {}, // 全部机构的键值对格式
        getOrganizationBack: false, // 已经获取机构

        // 是否黑名单
        isBlackList: [
          {value: 'Y', name: '是'},
          {value: 'N', name: '否'}
        ],

        server: {
          query: this.$services.backendService.custManagerRestController.query
        },

        managerNo: '',
        queryForm: {
          managerNo: '',
          phone: '',
          realName:'',
          agencyId:'',
          sts:'',
          isBlack: ''
        },
        tableData: [],
        columns: [
          { type: 'index', title: '序号', align: 'center', width: 60 },
          { title: '编号', align: 'center', key: 'managerNo', width: 140 },
          { title: '姓名', align: 'center', key: 'realName', width: 80 },
          { title: '手机号码', align: 'center', key: 'phone', width: 115 },
          { title: '性别', align: 'center', key: 'gender', formatter: 'dict:sex@sys', width: 70 },
          { title: '所属机构', align: 'center', key: 'agencyName', minWidth: 150 },
          { title: '状态', align: 'center', key: 'sts' , formatter: 'dict:userStatus@sys', width: 70},
          { title: '操作', align: 'center', key: 'action', width: 160, handler: [
            {action: 'view'},
            {action: 'edit'},
            {action: 'otherskip', icon: 'trash-a', content: '删除', envent:'on-delete'},
            {action: 'otherskip', icon: 'ios-unlocked', content: '重置密码', envent:'on-reset'},
            {action: 'otherskip', icon: 'person', content: '解除黑名单', envent:'on-relieve'}
          ]
          }],
      }
    },

    watch: {
      ifShow (val) {
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
        if (val.agencyId) {
          vm.showOrgSelected([], val.agencyId)
        }
      }
    },

    created () {
      this.getOrganization()
    },

    methods: {
      // 回显查询条件的已选机构，setTimeout是为了延迟，不然在获取机构返回前，一直调自身会造成死循环
      showOrgSelected (agencyIds, agencyId) {
        let vm = this
        setTimeout(() => {
          if (!vm.getOrganizationBack) {
            vm.showOrgSelected(agencyIds, agencyId)
            return false
          }

          if (vm.organizationObject[agencyId]) {
            agencyIds.unshift(agencyId)
            if (vm.organizationObject[agencyId].parentId) {
              vm.showOrgSelected(agencyIds, vm.organizationObject[agencyId].parentId)
            } else {
              vm.seletedOrgId = agencyIds
            }
          }
        }, 500)
      },

      // 清除查询条件
      resetQueryForm () {
        this.queryForm.managerNo = ''
        this.queryForm.phone = ''
        this.queryForm.realName = ''
        this.queryForm.agencyId = ''
        this.queryForm.sts = ''
        this.queryForm.isBlack = ''
        this.seletedOrgId = []
      },

      // 客户编号的控制
      managerNoChange () {
        this.queryForm.managerNo = this.queryForm.managerNo.replace(/[\W]/g,'')
      },

      // 手机号码的控制
      phoneChange () {
        this.queryForm.phone = this.queryForm.phone.replace(/\D/g,'')
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
            organizationJson.forEach(item => {
              if (item.value === 'ZJF') {
                vm.organizationJson = item.children
              }
            })
            vm.getOrganizationBack = true
            // console.log('organizationJson', vm.organizationJson)
          } else {
            vm.$Message.error(`${data.code}:${data.message}`)
          }
        }).catch(error => {
          vm.$Message.error(error.reason)
        })
      },

      requestSuccess (data) {
        let vm = this
        setTimeout(() => {
          vm.tableData = []
          data.forEach((item, index) => {
            item.isShowOtherskipIcon = item.isBlack === 'Y' ? '' : 'person'
            item.agencyName = ''
            item.selectOrg = []
            vm.tableData.push(item)
            vm.getParentName(item.agencyId, index)
          })
          // console.log('tableData', vm.tableData)
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
      getParentName (agencyId, index) {
        let vm = this
        if (vm.organizationObject[agencyId] && vm.organizationObject[agencyId].parentId) {
          let newOrgName = vm.organizationObject[agencyId] ? vm.organizationObject[agencyId].label : ''
          let oldOrgName = vm.tableData[index].agencyName
          vm.tableData[index].agencyName = oldOrgName ? `${newOrgName} ${oldOrgName}` : newOrgName
          vm.getParentName(vm.organizationObject[agencyId].parentId, index)
        }
      },

      // 所属机构选择后回调
      casSelected (selectedData) {
        // console.log('selectedData', selectedData)
        let len = selectedData.length
        this.queryForm.agencyId = len ? selectedData[len-1].value : ''
      },

      viewDetails (row) {
        this.$router.push({
          path: '/custManagerView',
          query: {
            id: row.id
          }
        })
      },

      editDetails (row) {
        this.$router.push({
          path: '/custManagerEdit/edit',
          query: {
            id: row.id
          }
        })
      },

      //表格单条数据删除
      remove (data) {
        this.$Modal.confirm({
          title: '提示',
          content: '是否确定删除该客户经理？',
          onOk: () => {
            this.$net.send({
              server: this.$services.backendService.custManagerRestController.remove,
              append: data.id
            }).then((data) => {
              if (data.success) {
                this.$Message.success('删除成功！')
                this.$refs.custManagerListTable.refresh()
              } else {
                this.$Message.error(data.message)
              }
            })
          }
        })
      },

      // 重置密码
      resetPassword (data) {
        this.$Modal.confirm({
          title: '提示',
          content: '是否确定执行重置密码操作？',
          onOk: () => {
            this.$net.send({
              server: this.$services.backendService.custManagerRestController.reset,
              data: {userId: data.id}
            }).then((data) => {
              if (data.success) {
                this.$Message.success('重置密码成功')
                this.$refs.custManagerListTable.refresh()
              } else {
                this.$Message.error(data.message)
              }
            })
          }
        });

      },

      // 解除黑名单
      relievePerson (row) {
        this.$Modal.confirm({
          title: '提示',
          content: '是否确定解除该客户经理的黑名单限制？',
          onOk: () => {
            this.$net.send({
              server: this.$services.backendService.custManagerRestController.releaseBlack,
              data: {id: row.id}
            }).then((data) => {
              if (data.success) {
                this.$Message.success('解除黑名单成功')
                this.$refs.custManagerListTable.refresh()
              } else {
                this.$Message.error(data.message)
              }
            })
          }
        });
      },

      // 下拉框选择
      onSelect(value, name) {
        let obj = this.$refs[value].getSelect()
        this.queryForm[name] = obj.value
      },

      // 导入事件
      upload () {
        this.ifShow = true
      },

      // 导入保存事件
      saveUpload () {
        if (this.fileName) {
          this.ifUpload = true
        }else {
          this.$Message.info('请先上传文件！')
        }

      },

      // 导出事件
      download () {
        let url = app.url.server + this.$services.backendService.custManagerRestController.exportInfo.url
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
          a.download = '客户经理信息表.xlsx' //命名下载名称
          a.click(); //点击触发下载
          window.URL.revokeObjectURL(dataurl)  //下载完成进行释放
          this.$Message.success('导出成功！')
        })
      },

      // 模板导出事件
      downloanTemplate () {
        let url = app.url.server + this.$services.backendService.custManagerRestController.downloanTemplate.url
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
          a.download = '客户经理信息表.xlsx' //命名下载名称
          a.click(); //点击触发下载
          window.URL.revokeObjectURL(dataurl)  //下载完成进行释放
          this.$Message.success('下载成功！')
        })
      },

      // 下载导入失败记录
      managerImportFail () {
        let url = app.url.server + this.$services.backendService.custManagerRestController.managerImportFail.url
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
          a.download = '客户经理信息导入失败记录表.xlsx' //命名下载名称
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
        this.ifShowUpload = false
        if (response.success) {
          vm.filePath = response.data
        } else {
          vm.$Message.info(response.message)
        }
        vm.uploadData = response
        this.$refs.custManagerListTable.refresh()
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
