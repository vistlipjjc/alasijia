<template>
  <div class="cpBox">
    <Form class="cpCont" ref="commonParams" :label-width="200" :model="editForm" :rules="editFormRules">
      <FormItem label="工单等待领取时长：" prop="receiveTime">
        <Input class="cpItemInput"
          v-model.trim="editForm.receiveTime"
          v-if="showInput"
          @on-change="changeInput('receiveTime')">
        </Input>
        <span class="cpItemText" v-else>{{ commonParams.receiveTime }}</span>
        <span class="cpItemTips">小时</span>
      </FormItem>

      <FormItem label="待受理工单等待时长：" prop="acceptTime">
        <Input class="cpItemInput"
          v-model.trim="editForm.acceptTime"
          v-if="showInput"
          @on-change="changeInput('acceptTime')">
        </Input>
        <span class="cpItemText" v-else>{{ commonParams.acceptTime }}</span>
        <span class="cpItemTips">小时</span>
      </FormItem>

      <FormItem label="客户经理最大待受理数：" prop="aceeptMax">
        <Input class="cpItemInput"
          v-model.trim="editForm.aceeptMax"
          v-if="showInput"
          @on-change="changeInput('aceeptMax')">
        </Input>
        <span class="cpItemText" v-else>{{ commonParams.aceeptMax }}</span>
        <span class="cpItemTips">单（机构最大待受理数=客户经理最大待受理数 * 该机构的客户经理人数）</span>
      </FormItem>

      <div class="cpItemCont">
        <FormItem label="客户经理最大退单数：" prop="refuseCycle">
          <Input class="cpItemInput"
            v-model.trim="editForm.refuseCycle"
            v-if="showInput"
            @on-change="changeInput('refuseCycle')">
          </Input>
          <span class="cpItemText" v-else>{{ commonParams.refuseCycle }}</span>
          <span class="cpItemTips">自然月内</span>
        </FormItem>

        <FormItem class="cpFormItem1" label="" prop="refuseMax">
          <Input class="cpItemInput"
            v-model.trim="editForm.refuseMax"
            v-if="showInput"
            @on-change="changeInput('refuseMax')">
          </Input>
          <span class="cpItemText" v-else>{{ commonParams.refuseMax }}</span>
          <span class="cpItemTips">单</span>
        </FormItem>
      </div>

      <div class="cpItemCont">
        <FormItem label="客户经理黑名单规则：" prop="blacklistCycle">
          <Input class="cpItemInput"
            v-model.trim="editForm.blacklistCycle"
            v-if="showInput"
            @on-change="changeInput('blacklistCycle')">
          </Input>
          <span class="cpItemText" v-else>{{ commonParams.blacklistCycle }}</span>
          <span class="cpItemTips">自然月内</span>
        </FormItem>

        <FormItem class="cpFormItem1" label="" prop="blacklistNum">
          <Input class="cpItemInput"
            v-model.trim="editForm.blacklistNum"
            v-if="showInput"
            @on-change="changeInput('blacklistNum')">
          </Input>
          <span class="cpItemText" v-else>{{ commonParams.blacklistNum }}</span>
          <span class="cpItemTips">次</span>
        </FormItem>

        <FormItem class="cpFormItem2" label="黑名单生效时长：" prop="blacklistEffective">
          <Input class="cpItemInput"
            v-model.trim="editForm.blacklistEffective"
            v-if="showInput"
            @on-change="changeInput('blacklistEffective')">
          </Input>
          <span class="cpItemText" v-else>{{ commonParams.blacklistEffective }}</span>
          <span class="cpItemTips">月</span>
        </FormItem>
      </div>

      <FormItem label="系统派单跑批间隔：" prop="runBatchTime">
        <Input class="cpItemInput"
          v-model.trim="editForm.runBatchTime"
          v-if="showInput"
          @on-change="changeInput('runBatchTime')">
        </Input>
        <span class="cpItemText" v-else>{{ commonParams.runBatchTime }}</span>
        <span class="cpItemTips">小时（系统定时跑批给客户经理派单）</span>
      </FormItem>

      <FormItem label="异常兜底跑批间隔：" prop="exRunBatchTime">
        <Input class="cpItemInput"
          v-model.trim="editForm.exRunBatchTime"
          v-if="showInput"
          @on-change="changeInput('exRunBatchTime')">
        </Input>
        <span class="cpItemText" v-else>{{ commonParams.exRunBatchTime }}</span>
        <span class="cpItemTips">小时（所有机构或所有客户经理的待受理单数均达到最大数时，定时跑批派单）</span>
      </FormItem>
    </Form>

    <div class="cpBtnBox">
      <template v-if="showInput">
        <Button class="cpBtnItem" type="primary" @click="saveParams">保存</Button>
        <Button class="cpBtnItem" type="ghost" @click="showInput = false">取消</Button>
      </template>
      <Button class="cpBtnItem" type="ghost" @click="updateCommonParams" v-else>修改</Button>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      showInput: false, // 显示输入框
      id: '',
      server: this.$services.backendService.sysParamRestController,

      // 用于非输入框状态显示
      commonParams: {
        receiveTime: '', // 等待领取时间（个/小时）
        acceptTime: '', // 待受理等待时间（个/小时）
        aceeptMax: '', // 客户经理最大接单数
        refuseMax: '', // 客户经理最大退单数
        refuseCycle: '', // 退单周期
        blacklistNum: '', // 黑名单次数
        blacklistCycle: '', // 黑名单周期
        blacklistEffective: '', // 黑名单生效时期(/月)
        runBatchTime: '', // 系统派单跑批间隔
        exRunBatchTime: '' // 异常兜底跑批间隔
      },

      // 用于输入状态显示修改
      editForm: {
        receiveTime: '', // 等待领取时间（个/小时）
        acceptTime: '', // 待受理等待时间（个/小时）
        aceeptMax: '', // 客户经理最大接单数
        refuseMax: '', // 客户经理最大退单数
        refuseCycle: '', // 退单周期
        blacklistNum: '', // 黑名单次数
        blacklistCycle: '', // 黑名单周期
        blacklistEffective: '', // 黑名单生效时期(/月)
        runBatchTime: '', // 系统派单跑批间隔
        exRunBatchTime: '' // 异常兜底跑批间隔
      },

      editFormRules: {
        receiveTime: [
          { required: true, message: '必填项', trigger: 'blur' }
        ],
        acceptTime: [
          { required: true, message: '必填项', trigger: 'blur' }
        ],
        aceeptMax: [
          { required: true, message: '必填项', trigger: 'blur' }
        ],
        refuseMax: [
          { required: true, message: '必填项', trigger: 'blur' }
        ],
        refuseCycle: [
          { required: true, message: '必填项', trigger: 'blur' }
        ],
        blacklistNum: [
          { required: true, message: '必填项', trigger: 'blur' }
        ],
        blacklistCycle: [
          { required: true, message: '必填项', trigger: 'blur' }
        ],
        blacklistEffective: [
          { required: true, message: '必填项', trigger: 'blur' }
        ],
        runBatchTime: [
          { required: true, message: '必填项', trigger: 'blur' }
        ],
        exRunBatchTime: [
          { required: true, message: '必填项', trigger: 'blur' }
        ]
      }
    }
  },

  created () {
    this.init()
  },

  methods: {
    init () {
      let vm = this
      vm.$net.send({
        server: vm.server.query
      }).then((data) => {
        let rows = data.rows
        if (rows.length > 0) {
          vm.id = rows[0].id
          vm.commonParams = {
            receiveTime: rows[0].receiveTime + '', // 等待领取时间（个/小时）
            acceptTime: rows[0].acceptTime + '', // 待受理等待时间（个/小时）
            aceeptMax: rows[0].aceeptMax + '', // 客户经理最大接单数
            refuseMax: rows[0].refuseMax + '', // 客户经理最大退单数
            refuseCycle: rows[0].refuseCycle + '', // 退单周期
            blacklistNum: rows[0].blacklistNum + '', // 黑名单次数
            blacklistCycle: rows[0].blacklistCycle + '', // 黑名单周期
            blacklistEffective: rows[0].blacklistEffective + '', // 黑名单生效时期(/月)
            runBatchTime: rows[0].runBatchTime + '', // 系统派单跑批间隔
            exRunBatchTime: rows[0].exRunBatchTime + '' // 异常兜底跑批间隔
          }
          vm.editForm = { ...vm.commonParams }
        } else {
          vm.showInput = true
        }
      }).catch(error => {
        vm.$Message.error(error.reason)
      })
    },

    // 修改为输入状态
    updateCommonParams () {
      let vm = this
      vm.editForm = { ...vm.commonParams }
      vm.showInput = true
    },

    // 输入框只能输入数字
    changeInput (type) {
      let vm = this
      // let hasDotType = ['receiveTime', 'acceptTime', 'runBatchTime', 'exRunBatchTime']
      let reg = new RegExp('^[0-9]*$')
      let value = vm.editForm[type]

      if (!reg.test(value)) {
        value = value.replace(/\D/g, '')
        // 保留两位小数
        /* if (hasDotType.includes(type)) {
          value = value.replace(/[^\d|.]/g, '') // 先去掉非数字非小数点的字符串
          let valueArray = value.split('.')

          // 去除后面输入的小数点，只留最前面的小数点
          if (valueArray.length > 2) {
            let lastIndex = value.lastIndexOf('.')
            value = value.substring(0, lastIndex)
          }

          // 保留两位小数
          if (valueArray.length === 2 && valueArray[1].length > 2) {
            value = `${valueArray[0]}.${valueArray[1].substring(0, 2)}`
          }

        // 整数
        } else {
          value = value.replace(/\D/g, '')
        } */

        vm.$nextTick(() => {
          vm.editForm[type] = value
        })
      }
    },

    // 保存
    saveParams () {
      let vm = this

      // 数据校验
      vm.$refs.commonParams.validate((valid) => {
        if (!valid) {
          return false
        }

        let server = vm.server.addParam
        let params = { ...vm.editForm }

        if (vm.id) {
          params.id = vm.id
          server = vm.server.updateParam
        }

        vm.$net.send({
          server: server,
          data: params
        }).then((data) => {
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
    },

    // 表单必填校验
    checkForm () {
      let vm = this
      let paramsMap = {
        receiveTime: '请填写工单等待领取时长', // 等待领取时间（个/小时）
        acceptTime: '请填写待受理工单等待时长', // 待受理等待时间（个/小时）
        aceeptMax: '请填写客户经理最大待受理数', // 客户经理最大接单数
        refuseMax: '请填写客户经理最大退单数', // 客户经理最大退单数
        refuseCycle: '请填写客户经理退单周期', // 退单周期
        blacklistNum: '请填写客户经理黑名单次数', // 黑名单次数
        blacklistCycle: '请填写客户经理黑名单周期', // 黑名单周期
        blacklistEffective: '请填写黑名单生效时长', // 黑名单生效时期(/月)
        runBatchTime: '请填写系统派单跑批间隔', // 系统派单跑批间隔
        exRunBatchTime: '请填写异常兜底跑批间隔' // 异常兜底跑批间隔
      }

      let tips = ''
      let paramsKey = Object.keys(paramsMap)

      for(let item of paramsKey) {
        if (!vm.editForm[item]) {
          tips = paramsMap[item]
          break
        }
      }

      if (tips) {
        vm.$Message.warning(tips)
        return false
      }

      return true
    }
  }
}
</script>

<style scoped>
.cpItemCont {
  display: flex;
  align-items: center;
  margin-right: 10px;
}
.cpItemInput {
  width: 150px;
  margin-right: 5px;
}
.cpItemText {
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

.cpBtnBox {
  margin-left: 190px;
  padding: 10px 0 20px;
}
.cpBtnItem {
  width: 100px;
  margin: 0 10px;
}
</style>

<style>
.cpCont label {
  font-weight: normal;
}
.cpFormItem1 .ivu-form-item-content {
  margin-left: 10px !important;
}
</style>
