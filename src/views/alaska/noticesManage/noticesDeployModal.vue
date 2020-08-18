<template>
    <Modal :width="800"
           v-model="showDialog">
        <div class="noticeDeployContainer">
            <div>
                <p class="title">推送配置</p>
                <Form ref="editForm" :model="editForm" :label-width="160">
                    <Row>
                        <FormItem prop="toReceive" label="“待领取”借款申请通知:">
                            <span style="margin-left: 15px;">龙信端应用/公众号推送通知</span>
                            <i-switch v-model="editForm.ridios.toReceive"></i-switch>
                        </FormItem>
                    </Row>
                    <Row>
                        <FormItem prop="newOrder" label="“新工单”借款申请通知:">
                            <span style="margin-left: 15px;">龙信端应用/公众号推送通知</span>
                            <i-switch v-model="editForm.ridios.newOrder"></i-switch>
                        </FormItem>
                    </Row>
                    <Row>
                        <FormItem prop="toAccept" label="“待受理”借款申请通知:">
                            <span style="margin-left: 15px;">龙信端应用/公众号推送通知</span>
                            <i-switch v-model="editForm.ridios.toAccept"></i-switch>
                        </FormItem>
                    </Row>
                    <Row>
                        <FormItem prop="updateSts" label="“更新状态”借款申请通知:">
                            <span style="margin-left: 15px;">龙信端应用/公众号推送通知</span>
                            <i-switch v-model="editForm.ridios.updateSts"></i-switch>
                        </FormItem>
                    </Row>
                    <Row>
                        <FormItem prop="timeDown" label="“待受理”倒计时到期通知:">
                            <span style="margin-left: 15px;">龙信端应用/公众号推送通知</span>
                            <i-switch v-model="editForm.ridios.timeDown"></i-switch>
                        </FormItem>
                    </Row>
                </Form>
            </div>

            <div>
                <p class="title">发送间隔配置</p>

                <div class="itemForm">
                    <span>每天</span>
                    <span v-for="(item, index) in editForm.timeObj.toReceiveUnderOrg" :key="index">
                    <TimePicker class="itemInput" v-model="editForm.timeObj.toReceiveUnderOrg[index]" format="HH:mm"></TimePicker>
                    <span class="blueClass" v-if="editForm.timeObj.toReceiveUnderOrg.length > 1" @click="minuNum('toReceiveUnderOrg', index)">-</span>
                </span>
                    <span class="blueClass" @click="addNum('toReceiveUnderOrg')">+</span>
                    <span>点，机构下若有待领取新工单时，系统推送新工单通知。</span>
                </div>

                <div class="itemForm">
                    <span>每天</span>
                    <span v-for="(item, index) in editForm.timeObj.newOrderToCust" :key="index">
                    <TimePicker class="itemInput" v-model="editForm.timeObj.newOrderToCust[index]" format="HH:mm"></TimePicker>
                    <span class="blueClass" v-if="editForm.timeObj.newOrderToCust.length > 1" @click="minuNum('newOrderToCust', index)">-</span>
                </span>
                    <span class="blueClass" @click="addNum('newOrderToCust')">+</span>
                    <span>点，若客户经理名下有借款意向申请未受理时，系统推送受理通知。</span>
                </div>

                <div class="itemForm">
                    <span>每天</span>
                    <span v-for="(item, index) in editForm.timeObj.notAcceptTimeDown" :key="index">
                    <TimePicker class="itemInput" v-model="editForm.timeObj.notAcceptTimeDown[index]" format="HH:mm"></TimePicker>
                    <span class="blueClass" v-if="editForm.timeObj.notAcceptTimeDown.length > 1" @click="minuNum('notAcceptTimeDown', index)">-</span>
                </span>
                    <span class="blueClass" @click="addNum('notAcceptTimeDown')">+</span>
                    <span>点，若客户经理名下借款意向申请工单在未受理倒计时前</span>
                    <Input class="itemInput" v-model.trim="editForm.notAcceptTimeDownSpace" @on-keyup="checkInput('notAcceptTimeDownSpace')" />
                    <span>小时，系统推送受理通知。</span>
                </div>

                <div class="itemForm">
                    <span>每天</span>
                    <span v-for="(item, index) in editForm.timeObj.notUpdateSts" :key="index">
                    <TimePicker class="itemInput" v-model="editForm.timeObj.notUpdateSts[index]" format="HH:mm"></TimePicker>
                    <span class="blueClass" v-if="editForm.timeObj.notUpdateSts.length > 1" @click="minuNum('notUpdateSts', index)">-</span>
                </span>
                    <span class="blueClass" @click="addNum('notUpdateSts')">+</span>
                    <span>点，若客户经理名下借款意向申请工单在</span>
                    <Input class="itemInput" v-model.trim="editForm.notUpdateStsSpace" @on-keyup="checkInput('notUpdateStsSpace')" />
                    <span>小时未更改过状态时，系统推送更新状态通知。</span>
                </div>
            </div>
        </div>

        <div style="text-align: center;" slot="footer">
            <Button  @click="btnSave('editForm')" type="primary" style="margin:0 11px; height: 40px; width: 100px;">保存</Button>
            <Button @click="showDialog = false" type="ghost" style="margin:0 11px; height: 40px; width: 100px;">返回</Button>
        </div>
    </Modal>
</template>

<script>
  export default {
    props: {
      value: Boolean, // 是否显示弹框
      deployEditForm: Object
    },
    data () {
      return {
        showDialog: this.value, // 显示弹框
        editForm: {
          ids: {},
          ridios: {
            toReceive: false,
            newOrder: false,
            toAccept: false,
            updateSts: false,
            timeDown: false
          },
          timeObj: {
            toReceiveUnderOrg: [''], // 机构下有待领取新工单时，系统推送新工单通知
            newOrderToCust: [''], // 若客户经理名下有借款意向申请未受理时，系统推送受理通知。
            notAcceptTimeDown: [''], // 若客户经理名下借款意向申请工单在未受理倒计时前n小时，系统推送受理通知
            notUpdateSts: [''], // 若客户经理名下借款意向申请工单未更改过状态时，系统推送更新状态通知
          },
          notAcceptTimeDownSpace: '',
          notUpdateStsSpace: ''
        },

        saveEditForm: this.deployEditForm

      }
    },

    watch: {
      value (val) {
        let vm = this
        vm.showDialog = val
      },

      showDialog (val) {
        this.$emit('input', val)
      },

      deployEditForm (val) {
        this.saveEditForm = val
      }
    },

    methods: {
      // 减少时间控件事件
      minuNum (name, index) {
        this.editForm.timeObj[name].splice(index, 1)
      },

      // 添加时间控件事件
      addNum (name) {
        this.editForm.timeObj[name].push('')
      },

      // 输入框校验
      checkInput (name) {
        let vm = this
        vm.editForm[name] = vm.editForm[name].replace(/[^\d.]/g, '');  // 清除“数字”和“.”以外的字符
        let valueArray = vm.editForm[name].split('.')
        vm.editForm[name] = valueArray.length > 1 ? valueArray[0].substring(0, 2) + '.' + valueArray[1].substring(0, 1) : valueArray[0].substring(0, 2)
        // this.notAcceptTimeDownSpace = value
      },

      // 处理保存的数据
      handleData () {
        let vm = this
        let saveData = []
        let returnFlag = false

        // 单选按钮的数据数据处理
        for (let item in vm.editForm.ridios) {
          let dataItem = {}
          dataItem.paramName = item
          dataItem.id = vm.editForm.ids[item] ? vm.editForm.ids[item] : ''
          dataItem.paramValue = vm.editForm.ridios[item] === true ? 'Y' : 'N'
          // console.log(dataItem)
          saveData.push(dataItem)
        }

        // 时间点的数据
        for (let item in vm.editForm.timeObj) {
          let dataItem = {}
          let dataString = ''
          let flag = false
          // console.log('dataString', vm.editForm.timeObj[item])
          for (let i = 0, len = vm.editForm.timeObj[item].length; i < len; i ++) {
            if (vm.editForm.timeObj[item][i]) {
              dataString = dataString ? dataString + ',' + vm.editForm.timeObj[item][i] : vm.editForm.timeObj[item][i]
            } else {
              flag = true
              break
            }
          }

          // 判断时间点是否为空
          if (!dataString || flag) {
            returnFlag = true
            vm.$Message.info('请选择时间点！')
            break
          }

          if (item === 'notAcceptTimeDown') {
            if (vm.editForm.notAcceptTimeDownSpace) {
              dataString = dataString + '/' + vm.editForm.notAcceptTimeDownSpace
            } else {
              returnFlag = true
              vm.$Message.info('请输入时间间隔！')
              break
            }
          } else if (item === 'notUpdateSts') {
            if (vm.editForm.notUpdateStsSpace) {
              dataString = dataString + '/' + vm.editForm.notUpdateStsSpace
            } else {
              returnFlag = true
              vm.$Message.info('请输入时间间隔！')
              break
            }
          }
          dataItem.paramName = item
          dataItem.paramValue = dataString
          dataItem.id = vm.editForm.ids[item] ? vm.editForm.ids[item] : ''
          // console.log(dataItem)
          saveData.push(dataItem)
        }

        // return false
        if (returnFlag) {
          return false
        } else {
          return saveData
        }

      },

      // 保存事件
      btnSave () {
        let vm = this
        let saveData = vm.handleData()
        vm.saveEditForm.globalParams = saveData
        if (!saveData) {
          return
        }
        vm.$net.send({
          server: vm.$services.backendService.regionNoticeRestController.save,
          data: vm.saveEditForm
        }).then(data => {
            if (data.code === 200) {
              vm.$Message.success('保存成功！')
              vm.$emit('btnBack') // 保存成功关闭页面
            } else {
              vm.$Message.error(data.message)
            }
        }).catch(error => {
          console.log('error', error)
          vm.$Message.error(error.reason)
        })
      },
    }
  }
</script>
<style>
    .noticeDeployContainer .ivu-form-item {
        margin-bottom: 15px;
    }
    .itemInput {
        width: 100px;
        margin: 0 5px;
    }
    .itemForm {
        margin-bottom: 10px;
    }
    .blueClass {
        color: blue;
        cursor: pointer;
    }
    .noticeDeployContainer .title {
        padding-bottom: 10px;
        border-bottom: 1px solid #e9eaec;
        font-weight: bold;
    }
</style>