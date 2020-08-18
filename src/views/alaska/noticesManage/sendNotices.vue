<template>
    <div class="container">
        <div class="clearFix">
            <div style="width: 20%; float: left;">
                <div style="margin: 10px;">
                    <Row>
                        <p>选择收件人：</p>
                    </Row>
                    <div>
                        <Tree ref="organizationTree"
                              :data="treeData"
                              @on-select-change="selectNode">
                        </Tree>
                    </div>
                </div>
            </div>
            <div style="width: 70%; float: left;">
                <Card style="margin-left: 10px;">
                    <div style="overflow: hidden;">
                        <span>请选择客户经理：</span>
                        <Button @click="showDeploy" type="primary" style="float: right;">发送通知配置</Button>
                    </div>
                    <j-table ref="custManagerListTable" autoSearch
                             :Pagination="false"
                             :showReset="false"
                             :showQuery="false"
                             :autoCache="true"
                             :height="200"
                             :defaultParams="defaultParams"
                             :queryForm="queryForm"
                             :server="server.query"
                             :columns-list="columns"
                             v-model="tableData"
                             @on-selection-change="getSelections"
                             @requestSuccess="requestSuccess">
                    </j-table>
                    <div>已选收件人：{{ addresseeName }}</div>
                </Card>
            </div>
        </div>

        <!-- 消息填写模块 -->
        <div class="clearFix" style="width: 90%;">
            <Form ref="editForm" :model="editForm" :label-width="30">
                <Col span="24">
                <FormItem prop="noticeContent" required>
                    <label><span class="spanColor">*</span>主题内容</label>
                    <Input :rows="5" :maxlength="200" v-model="editForm.noticeContent" @input="descInput"  placeholder="请输入主题内容" type="textarea" />
                    <span class="inputTip">已输入{{ remnant }}/200字以内</span>
                </FormItem>
                </Col>
            </Form>

            <div style="text-align: center;">
                <Button @click="btnSave('editForm', 'Y')" type="primary" style="margin:0 11px; height: 40px; width: 100px;">发送</Button>
                <Button @click="btnSave('editForm', 'N')" type="primary" style="margin:0 11px; height: 40px; width: 100px;">保存</Button>
                <Button v-if="!id" @click="btnCancle" type="ghost" style="margin:0 11px; height: 40px; width: 100px;">重置</Button>
                <Button v-if="id" @click="btnReturn" type="ghost" style="margin:0 11px; height: 40px; width: 100px;">取消</Button>
            </div>
        </div>

        <!-- 发送配置 -->
        <Modal v-model="show" :mask-closable="false" width="300">
            <div>
                <p>通知消息是否推送到龙信端应用/公众号：</p>
                <RadioGroup v-model="globalParamForm.paramValue">
                    <Radio label="Y">是</Radio>
                    <Radio label="N">否</Radio>
                </RadioGroup>
            </div>
            <template slot="footer">
                <div style="text-align: center;">
                    <Button type="primary" @click="saveNoticeDeploy">确定</Button>
                    <Button @click="show = false">取消</Button>
                </div>
            </template>
        </Modal>
    </div>
</template>

<script>
  import storage from '@/util/storage'
  export default {
    data () {
      return {
        failflag:false,
        id: this.$route.query.id,
        treeData: [], // 机构树的数据
        tableData: [], // 用户表格数据
        server: {
          query: this.$services.backendService.custManagerRestController.getCustList,
          send: this.$services.backendService.manageNoticeRestController.sendManageNotice,
          save: this.$services.backendService.manageNoticeRestController.saveManageNotice,
          update: this.$services.backendService.manageNoticeRestController.updateManageNotice,
        },
        defaultParams: {
          realName: '',
          phone: '',
          pageNumber: 1,
          pageSize: 999999999
        },
        queryForm: {
          orgNo: '',
        },
        columns: [
          { type: "selection", align: "center", width: 60 },
          { type: 'index', title: '序号', align: 'center', width: 60 },
          { title: '用户账号', align: 'center', key: 'phone'},
          { title: '用户名称', align: 'center', key: 'realName'}
        ],

        show: false, // 是否显示发送配置弹框
        globalParamForm: {
          paramValue: ''
        },
        // 消息编辑内容
        editForm: {
          noticeContent: '',
          addressee: '',
          addresseeName: '',
          sender: '',
          senderName: ''
        },

        // addressee: '',
        // addresseeName: '',
        addresseeArr: [], //
        addresseeNameArr: [],
        remnant: 0
      }
    },

    computed: {
      addresseeName () {
        this.editForm.addressee = this.addresseeArr.join(',')
        this.editForm.addresseeName = this.addresseeNameArr.join(',')
        return this.editForm.addresseeName
      }
    },

    created () {
      this.init()
    },

    methods:{
      init () {
        let vm = this
        vm.editForm.senderName = storage.getItem('user').staffName
        vm.editForm.sender = storage.getItem('user').staffCode

        // 获取机构数
        vm.$net.send({
          server: this.$services.backendService.organizationRestController.getOrganizationTree,
          data: {orgNo: 'ZJF'}
        }).then((data) => {
          if (data.success) {
            data.data.forEach(item => {
              if (item.orgNo === 'ZJF') {
                item.selected = true
                vm.treeData = item.children
              }
            })
          } else {
            vm.$Message.error({duration: 5, content: data.msg});
          }
        })

        // 是否从草稿编辑中进来
        if (this.id) {
          this.$route.query.fail ? this.getDetails2() : this.getDetails()
        }

      },

      // 获取信息详情
      getDetails () {
        let vm = this
        vm.$net.send({
          server: vm.$services.backendService.manageNoticeRestController.details,
          append: vm.id
        }).then((data) => {
          if (data.success) {
            let res =data.data
            vm.editForm.noticeContent = res.noticeContent
            vm.editForm.addressee = res.addressee
            vm.editForm.addresseeName = res.addresseeName
            vm.editForm.id = res.id
            vm.addresseeArr = res.addressee.split(',')
            vm.addresseeNameArr = res.addresseeName.split(',')
            vm.descInput()
          } else {
            vm.$Message.error({duration: 5, content: data.msg});
          }
        })
      },

      // 获取失败详情信息
      getDetails2 () {
        let vm = this

        vm.$net.send({
          server: vm.$services.backendService.noticeFailRecordRestController.details,
          append: vm.id
        }).then((data) => {
          if (data.success) {
            let res =data.data
            vm.editForm.noticeType= '0'
            vm.editForm.noticeContent = res.noticeContent
            vm.editForm.addressee = res.acceptFailPhone
            vm.editForm.addresseeName = res.acceptFailName
            vm.editForm.id = res.id
            vm.addresseeArr = res.acceptFailPhone.split(',')
            vm.addresseeNameArr = res.acceptFailName.split(',')
            vm.descInput()
          } else {
            vm.$Message.error({duration: 5, content: data.msg});
          }
        })
      },

      // 点击当前节点事件
      selectNode (row) {
        let vm = this
        vm.queryForm.orgNo = row[0].orgNo
        this.$refs.custManagerListTable.handleQuery()
      },

      // 表格数据加载后回调
      requestSuccess (data) {
        let vm = this
        let tableData = vm.$refs.custManagerListTable.getTableData()
        tableData.forEach(item => {
          vm.addresseeArr.forEach(addresseeArrItem => {
            if (addresseeArrItem === item.phone) {
              item._checked = true
            }
          })
        })
      },

      // 表格选中数据发生改变时触发
      // 点击列表勾选框触发，给data设置_check的属性。 _checked属性会影响checkbox的选中状态。但是checkbox的选中状态不会影响_check 属性
      getSelections (selection) {
        let vm = this
        let tableData = vm.$refs.custManagerListTable.getTableData()

        tableData.forEach(item => {
          // 先去掉勾选框
          item._checked = false
          // 先去掉已选择收件人
          for (let i = 0, bz = true,len = vm.addresseeArr.length; i < len; bz ? i++ : i) {
            if (vm.addresseeArr[i] === item.phone) {
              vm.addresseeArr.splice(i, 1)
              vm.addresseeNameArr.splice(i, 1)
              len = len - 1
              bz = false
            } else {
              bz = true
            }
          }

          selection.forEach(seletedItem => {
            if (seletedItem.id === item.id) {
              item._checked = true
              let flag = true
              vm.addresseeArr.forEach(addresseeArrItem => {
                if (addresseeArrItem === seletedItem.phone) {
                  flag = false
                }
              })

              if (flag) {
                vm.addresseeArr.push(seletedItem.phone)
                vm.addresseeNameArr.push(seletedItem.realName)
              }

            }
          })
        })
      },

      //计算文本框字数
      descInput () {
        this.remnant = this.editForm.noticeContent.length
      },

      checkForm () {
        let vm = this
        let flag = false
        if (!vm.editForm.addressee) {
          vm.$Message.info('请选择收件人！')
          flag = true
        } else if (!vm.editForm.noticeContent) {
          vm.$Message.info('请填写主题内容！')
          flag = true
        }
        return flag
      },

      // 保存接口
      btnSave (name, type) {
        let vm = this

        if (vm.checkForm()) {
          return false
        }
        vm.editForm.sendSts = type
        let server = type === 'Y' ? vm.server.send : (vm.editForm.id ? vm.server.update : vm.server.save)
        vm.$net.send({
          server: server,
          data: vm.editForm
        }).then((data) => {
          if (data.code = 200) {
            if (type === 'Y') {
              if (data.data.length === 0) {
                vm.$Message.success('已发送！')
              } else {
                let returnData = data.data[0]
                if (returnData.faileNum === 0) {
                  vm.$Message.success('全部发送成功！')
                } else if (returnData.succNum === 0) {
                  vm.$Message.error('全部发送失败！')
                } else {
                  vm.$Message.info(returnData.succNum + '个发送成功，' + returnData.faileNum + '个发送失败！')
                }
              }
            } else {
              vm.$Message.success('保存成功！')
            }
            vm.btnCancle()
          } else {
            vm.$Message.error({duration: 5, content: data.message})
          }
        })
      },

      // 点击发送配置按钮
      showDeploy () {
        let vm = this
        vm.show = true
        // 配置信息
        vm.$net.send({
          server: this.$services.backendService.globalParamRestController.getGlobalParamByNameAndType,
          data: {paramName: 'manageNotice', paramType: 'T02'}
        }).then((data) => {
          if (data.success) {
            vm.globalParamForm = data.data
          } else {
            vm.$Message.error({duration: 5, content: data.msg});
          }
        })
      },

      // 龙信端应用/公众号推送通知的保存
      saveNoticeDeploy () {
        let vm = this
        vm.$net.send({
          server: this.$services.backendService.globalParamRestController.updateGlobalParamById,
          data: vm.globalParamForm
        }).then((data) => {
          if (data.success) {
            vm.show = false
            vm.$Message.success('更新成功')
          } else {
            vm.$Message.error({duration: 5, content: data.msg})
          }
        })
      },

      // 重置按钮
      btnCancle () {
        let vm = this
        vm.addresseeArr = [],
        vm.addresseeNameArr = []
        vm.editForm.noticeContent = ''
        vm.editForm.addressee = ''
        vm.editForm.addresseeName = ''
        let tableData = vm.$refs.custManagerListTable.getTableData()
        tableData.forEach(item => {
          item._checked = false
        })
      },

      // 取消按钮
      btnReturn () {
        let vm = this
        vm.$router.go(-1)
        vm.$store.commit('closePage', 'sendNotices')
        vm.$store.commit('removeTag', 'sendNotices')

      }

    }
  }
</script>

<style>
    .container {
        background-color: #ffffff;
        padding: 10px;
    }
    .clearFix {
        overflow: hidden;
    }
    .spanColor {
        color: red;
    }
    .inputTip{
        position: absolute;
        display: inline-block;
        right: 5px;
        bottom: 0;
        color: #bbbcc1;
    }
</style>
