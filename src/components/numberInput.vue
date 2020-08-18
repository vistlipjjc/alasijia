<template>
  <div class="niInputBox" :class="{'niInputBoxError': showTips}" v-bind="$attrs">
    <Input class="niInput"
      :maxlength="myMaxlength"
      v-model.trim="inputValue"
      @on-change="changeInput"
      @on-blur="checkInput">
    </Input>
    <span class="niTips" v-if="showTips">{{ tipsText }}</span>
  </div>
</template>

<script>
export default {
  props: {
    value: [String, Number], // 输入框的值
    required: Boolean, // 是否必填
    fixedInteger: Boolean, // 是否固定整数长度

    // 输入框输入长度
    maxlength: { 
      type: Number,
      default: 14
    },

    // 小数长度，小数点的长度小于0时，为只能输入整数
    decimalLength: {
      type: Number,
      default: 2
    },

    // 是否可以是负数
    canBeNegativeNumber: {
      type: Boolean,
      default: true
    }
  },

  data () {
    return {
      showTips: false, // 是否显示错误提示语
      addLenByNegative: false, // 是否因为输入-长度+1
      addLenByDot: false, // 是否因为输入.长度+1
      tipsText: '', // 错误提示语
      inputValue: this.value, // 输入框的值
      myMaxlength: this.maxlength // 输入框输入长度
    }
  },

  watch: {
    value (val) {
      this.inputValue = val
    },

    inputValue (val) {
      this.$emit('input', val)
    },

    maxlength (val) {
      this.myMaxlength = val
    }
  },

  methods: {
    changeInput () {
      let vm = this
      let value = vm.inputValue

      // 先去掉非数字非小数点非负号-的字符串
      value = value.replace(/[^\d|.|-]/g, '')
      value = value.replace('-', '$#$').replace(/-/g, '').replace('$#$', '-') // 只保留一个- 清除多余的-

      // 如果小数位数为0，则表示只能输入整数，清除小数点，否则只保留第一个小数点
      value = vm.decimalLength > 0 ? value.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.') : value.replace(/\./g, '')

      // 只能输入正数则清除-，否则清除非开头的-
      if (vm.canBeNegativeNumber) {
        if (value.indexOf('-') > 0) {
          value = value.replace(/-/, '')
        }
      } else {
        value = value.replace(/-/, '')
      }

      // 如果有小数点，如果是固定整数长度为true，则整数长度为：总长度vm.maxlength - 小数长度vm.decimalLength
      // 如果固定整数长度为false，则整数长度为：总长度vm.maxlength - 实际输入小数的长度
      if (value.indexOf('.') > -1) {
        let valueArray = value.split('.')
        let dot = valueArray[1] ? valueArray[1].substring(0, vm.decimalLength) : ''
        let integerLength = vm.fixedInteger ? vm.maxlength - vm.decimalLength : vm.maxlength - dot.length
        let int = valueArray[0].indexOf('-') > -1 ? valueArray[0].substring(0, integerLength + 1) : valueArray[0].substring(0, integerLength)
        value = `${int}.${dot}`
      } else {
        value = value.indexOf('-') > -1 ? value.substring(0, vm.maxlength + 1) : value.substring(0, vm.maxlength)
      }

      // 如果输入-，且长度还没+1，则长度+1
      if (value.indexOf('-') > -1 && !vm.addLenByNegative) {
        vm.addLenByNegative = true
        vm.myMaxlength = vm.myMaxlength + 1
      }

      // 如果删除-，且长度由于之前输入- +1，则长度-1
      if (value.indexOf('-') === -1 && vm.addLenByNegative) {
        vm.addLenByNegative = false
        vm.myMaxlength = vm.myMaxlength - 1
      }

      // 如果输入.，且长度还没+1，则长度+1
      if (value.indexOf('.') > -1 && !vm.addLenByDot) {
        vm.addLenByDot = true
        vm.myMaxlength = vm.myMaxlength + 1
      }

      // 如果删除.，且长度由于之前输入. +1，则长度-1
      if (value.indexOf('.') === -1 && vm.addLenByDot) {
        vm.addLenByDot = false
        vm.myMaxlength = vm.myMaxlength - 1
      }

      vm.$nextTick(() => {
        vm.inputValue = value
        vm.$emit('on-change')
      })
    },

    checkInput () {
      let vm = this
      vm.tipsText = ''
      vm.showTips = false

      // 必填校验
      if (vm.required && !vm.inputValue) {
        vm.tipsText = '必填项'
        vm.showTips = true
      }

      // 主要是正数时小数点在第一位、负数时小数点在第二位的情况
      if (vm.inputValue.indexOf('.') === 0 || vm.inputValue.indexOf('-') === 0 && vm.inputValue.indexOf('.') === 1) {
        vm.tipsText = '请输入正确的数字'
        vm.showTips = true
      }

      vm.$emit('on-blur')
      return vm.showTips
    }
  }
}
</script>

<style scoped>
.niInputBox {
  position: relative;
  width: 150px;
}
.niTips {
  position: absolute;
  top: 100%;
  left: 0;
  line-height: 1;
  padding-top: 6px;
  color: #ed3f14;
}
</style>

<style>
.niInputBoxError .ivu-input {
  border: 1px solid #ed3f14;
}
.niInputBoxError .ivu-input:focus {
  box-shadow: 0 0 0 2px rgba(237, 63, 20, .2);
}
</style>
