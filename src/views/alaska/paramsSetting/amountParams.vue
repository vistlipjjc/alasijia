<template>
  <div class="apBox">
    <Form class="apCont" ref="amountParams" :label-width="200" :model="editForm" :rules="editFormRules">
      <FormItem label="房产价值估算系数：" prop="houseValuationRatio"
         :class="{'apItemError': houseValuationRatioTipsShow}">
        <Input class="apItemInput"
          v-model.trim="editForm.houseValuationRatio"
          v-if="showInput"
          @on-change="changeInput('houseValuationRatio')"
          @on-blur="checkInput('houseValuationRatio')">
        </Input>
        <span class="apItemText" v-else>{{ amountParams.houseValuationRatio }}</span>
        <span class="apItemInputTips" v-if="houseValuationRatioTipsShow">请输入正确的数字</span>
      </FormItem>

      <FormItem label="月收入系数：" prop="monthlyIncomeRatio"
         :class="{'apItemError': monthlyIncomeRatioTipsShow}">
        <Input class="apItemInput"
          v-model.trim="editForm.monthlyIncomeRatio"
          v-if="showInput"
          @on-change="changeInput('monthlyIncomeRatio')"
          @on-blur="checkInput('monthlyIncomeRatio')">
        </Input>
        <span class="apItemText" v-else>{{ amountParams.monthlyIncomeRatio }}</span>
        <span class="apItemInputTips" v-if="monthlyIncomeRatioTipsShow">请输入正确的数字</span>
      </FormItem>

      <FormItem label="房屋面积系数：" prop="houseAreaRatio"
        :class="{'apItemError': houseAreaRatioTipsShow}">
        <Input class="apItemInput"
          v-model.trim="editForm.houseAreaRatio"
          v-if="showInput"
          @on-change="changeInput('houseAreaRatio')"
          @on-blur="checkInput('houseAreaRatio')">
        </Input>
        <span class="apItemText" v-else>{{ amountParams.houseAreaRatio }}</span>
        <span class="apItemInputTips" v-if="houseAreaRatioTipsShow">请输入正确的数字</span>
      </FormItem>
    </Form>

    <div class="apBtnBox">
      <template v-if="showInput">
        <Button class="apBtnItem" type="primary" @click="saveParams">保存</Button>
        <Button class="apBtnItem" type="ghost" @click="showInput = false">取消</Button>
      </template>
      <Button class="apBtnItem" type="ghost" @click="updateAmountParams" v-else>修改</Button>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      showInput: true, // 是否显示输入框
      houseValuationRatioTipsShow: false, // 显示房产价值估算系数错误提示
      monthlyIncomeRatioTipsShow: false, // 显示月收入系数错误提示
      houseAreaRatioTipsShow: false, // 显示房屋面积系数错误提示

      // 测算额度参数，用于非输入状态显示
      amountParams: {
        houseValuationRatio: '',
        monthlyIncomeRatio: '',
        houseAreaRatio: ''
      },

      // 测算额度参数，用于输入状态显示、修改
      editForm: {
        houseValuationRatio: '',
        monthlyIncomeRatio: '',
        houseAreaRatio: ''
      },

      // 测算额度参数必填规则
      editFormRules: {
        houseValuationRatio: [
          { required: true, message: '必填项', trigger: 'blur' }
        ],
        monthlyIncomeRatio: [
          { required: true, message: '必填项', trigger: 'blur' }
        ],
        houseAreaRatio: [
          { required: true, message: '必填项', trigger: 'blur' }
        ]
      }
    }
  },

  created () {
    this.init()
  },

  methods: {
    // 初始化，获取设置的配置参数
    init () {
      let vm = this
      vm.$net.send({
        server: vm.$services.backendService.globalParamRestController.getAllParam
      }).then(data => {
        let paramsList = data.data
        paramsList.forEach(item => {
          vm.amountParams[item.paramName] = item.paramValue || ''
        })
        vm.editForm = { ...vm.amountParams }

        // 只要其中一个有值，就不显示输入框，需要点击修改才显示输入框
        if (vm.amountParams.houseValuationRatio || vm.amountParams.monthlyIncomeRatio  || vm.amountParams.houseAreaRatio) {
          vm.showInput = false
        } else {
          vm.showInput = true
        }
      })
    },

    // 修改为输入状态
    updateAmountParams () {
      let vm = this
      vm.editForm = { ...vm.amountParams }
      vm.showInput = true
    },

    // 现在只能输入正负数，且整数位不超过10位，小数位不超过3位
    changeInput (type) {
      let vm = this
      let value = vm.editForm[type]

      value = value.replace(/[^\d|.|-]/g, '') // 先去掉非数字非小数点非负号-的字符串
      value = value.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.') // 只保留第一个. 清除多余的.
      value = value.replace('-', '$#$').replace(/-/g, '').replace('$#$', '-') // 只保留一个- 清除多余的-
      // value = value.replace(/(?<=.)-/g, '') // 清除非开头的- 火狐、Safra、不支持，据说IE也不知道

      // 判断-是否在第一位，不在则清除
      if (value.indexOf('-') > 0) {
        value = value.replace('-', '')
      }

      if (value.indexOf('.') > -1) {
        let valueArray = value.split('.')
        let int = valueArray[0].indexOf('-') > -1 ? valueArray[0].substring(0, 11) : valueArray[0].substring(0, 10)
        let dot = valueArray[1].substring(0, 3)

        value = `${int}.${dot}`
      } else {
        value = value.indexOf('-') > -1 ? value.substring(0, 11) : value.substring(0, 10)
      }

      vm.$nextTick(() => {
        vm.editForm[type] = value
      })
    },

    // 失去焦点时，校验是否输入正确
    checkInput (type) {
      let vm = this
      let value = vm.editForm[type]
      vm[type + 'TipsShow'] = false

      // 主要是正数时小数点在第一位、负数时小数点在第二位的情况
      if (value.indexOf('.') === 0 || value.indexOf('-') === 0 && value.indexOf('.') === 1) {
        vm[type + 'TipsShow'] = true
      }

      return vm[type + 'TipsShow']
    },

    // 保存
    saveParams () {
      let vm = this

      // 数据校验
      vm.$refs.amountParams.validate((valid) => {
        if (!valid) {
          return false
        }

        if (valid) {
          let houseValuationRatioCheck = vm.checkInput('houseValuationRatio')
          let monthlyIncomeRatioCheck = vm.checkInput('monthlyIncomeRatio')
          let houseAreaRatioCheck = vm.checkInput('houseAreaRatio')
          if (houseValuationRatioCheck || monthlyIncomeRatioCheck || houseAreaRatioCheck) {
            return false
          }
        }

        let params = [{
          paramName: 'houseValuationRatio',
          paramValue: vm.editForm.houseValuationRatio
        }, {
          paramName: 'monthlyIncomeRatio',
          paramValue: vm.editForm.monthlyIncomeRatio
        }, {
          paramName: 'houseAreaRatio',
          paramValue: vm.editForm.houseAreaRatio
        }]

        vm.$net.send({
          server: vm.$services.backendService.globalParamRestController.addGlobalParam,
          data: params
        }).then(data => {
          if (data.code === 200) {
            vm.showInput = false
            vm.$Message.success('保存成功')
          } else {
            vm.$Message.error(`${data.code}:${data.message}`)
          }
        }).catch(error => {
          vm.$Message.error(error.reason)
        })
      })
    }
  }
}
</script>

<style scoped>
.apItemInput {
  width: 150px;
  margin-right: 5px;
}
.apItemText {
  display: inline-block;
  width: 150px;
  height: 32px;
  margin-right: 5px;
  padding: 4px 7px;
  font-size: 12px;
  color: #495060;
  line-height: 1.9;
  border-bottom: 1px solid #dddee1;
}
.apItemInputTips {
  position: absolute;
  top: 100%;
  left: 0;
  line-height: 1;
  padding-top: 6px;
  color: #ed3f14;
}

.apBtnBox {
  margin-left: 190px;
  padding: 10px 0 20px;
}
.apBtnItem {
  width: 100px;
  margin: 0 10px;
}
</style>

<style>
.apCont label {
  font-weight: normal;
}
.apItemError .ivu-input {
  border: 1px solid #ed3f14;
}
</style>
