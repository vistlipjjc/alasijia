<template>
  <Modal
    title="状态修改"
    :width="300"
    :loading="loading"
    v-model="showDialog"
    @on-ok="confirmStatus">
    <div class="usDialogItem">
      <div class="usDialogTitle">受理状态：</div>
      <div class="usDialogInfo">
        <Select v-model="acceptFlag">
          <Option v-for="item in acceptFlagList" :disabled="item.disabled" :key="item.value" :value="item.value">
            {{ item.label }}
          </Option>
        </Select>
      </div>
    </div>
  </Modal>
</template>

<script>
import storage from '@/util/storage'

export default {
  props: {
    value: Boolean, // 是否显示弹框

    // 状态列表
    list: {
      type: Array,
      defalut () {
        return []
      }
    },

    // 当前操作对象
    currentItem: {
      type: Object,
      default () {
        return {}
      }
    }
  },

  data () {
    return {
      loading: true, // 用于手动关闭弹框
      showDialog: this.value, // 显示弹框
      acceptFlagRecord: '', // 修改状态时的状态
      acceptFlag: '', // 修改状态时的状态
      acceptFlagList: [], // 状态列表
    }
  },

  watch: {
    value (val) {
      let vm = this
      vm.showDialog = val

      if (val) {
        let acceptFlag = vm.currentItem.acceptFlag
        let acceptFlagList = vm.list.map(item => {
          item.disabled = false

          // 其他状态不能修改为‘待分配’状态，所以‘待分配’状态不可选
          // 其他状态不能修改为‘系统退单’状态，所以‘系统退单’状态不可选
          // 其他状态不能修改为‘客户经理退单’状态，所以‘客户经理退单’状态不可选
          if (acceptFlag !== '0X'  && item.value === '0X' || acceptFlag !== '0401'  && item.value === '0401' || acceptFlag !== '0402'  && item.value === '0402') {
            item.disabled = true
          }

          // 如果当前状态为‘待分配’或者‘待领取’，只能修改为‘无效工单’，
          if (acceptFlag === '0X' && item.value !== '0305' && item.value !== '0X' || acceptFlag === '00' && item.value !== '0305' && item.value !== '00') {
            item.disabled = true
          }

          // 退单的只能修改为’待领取‘和无效工单
          if ((acceptFlag === '0401' || acceptFlag === '0402') && item.value !== '00' && item.value !== '0305') {
            item.disabled = true
          }

          // 当前状态不可选
          if (acceptFlag === item.value) {
            item.disabled = true
          }

          return item
        })
        vm.acceptFlagList = [ ...acceptFlagList ]
        vm.$nextTick(()=>{
          vm.acceptFlagRecord = acceptFlag || ''
          vm.acceptFlag = acceptFlag || ''
        })
      } else {
        vm.acceptFlagList = []
      }
    },

    showDialog (val) {
      this.$emit('input', val)
    }
  },

  methods: {
    // 确认修改状态
    confirmStatus () {
      let vm = this
      // let shouldSelectAcceptFlags = ['0X', '00', '01', '0201', '0202', '0203', '0204', '0301', '0302', '0303', '0304', '0305', '0306', '0307']
        // !shouldSelectAcceptFlags.includes(vm.acceptFlag)
      if (!vm.acceptFlag) {
        vm.$Message.warning('请选择受理状态')
        return false
      }

      if (vm.acceptFlag === vm.acceptFlagRecord) {
        vm.showDialog = false
        return false
      }

      vm.$net.send({
        server: this.$services.backendService.extraRestController.updateLendReportFlag,
        data: {
          lendNo: vm.currentItem.lendNo,
          acceptFlag: vm.acceptFlag,
          acceptPerson: storage.getItem('user').staffName
        }
      }).then(data => {
        if (data.code === 200) {
          vm.$emit('confirmStatus', vm.acceptFlag)
          vm.showDialog = false
          vm.$Message.success('修改成功')
        } else {
          vm.showDialog = false
          vm.$Message.error(data.message)
        }
      })
    },
  }
}
</script>

<style scoped>
.usDialogItem {
  display: flex;
  align-items: center;
}
.usDialogTitle {
  width: 70px;
}
.usDialogInfo {
  flex-grow: 1;
}
</style>
