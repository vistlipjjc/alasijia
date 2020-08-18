<template>
  <Modal
    title="通知模板编辑"
    :width="500"
    :loading="loading"
    v-model="showDialog">
    <Form ref="templateForm" :label-width="80" :model="editForm" :rules="editFormRules">
      <FormItem label="通知渠道: " prop="noticeChannel">
        <Select v-model="editForm.noticeChannel" multiple>
          <Option v-for="item in channelList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </FormItem>
      <FormItem label="通知类型: " prop="noticeType">
        <Select v-model="editForm.noticeType" :disabled="Object.keys(operateObj).length > 0">
          <Option v-for="item in typeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </FormItem>
      <FormItem label="通知模板: " prop="noticeContent">
        <Input v-model="editForm.noticeContent" :autosize="false" :maxlength="200" type="textarea"></Input>
      </FormItem>
    </Form>

    <div slot="footer">
      <Button type="primary" :loading="loading" @click="saveTemplate">保存</Button>
      <Button type="ghost" @click="showDialog = false">取消</Button>
    </div>
  </Modal>
</template>

<script>
export default {
  props: {
    value: Boolean, // 是否显示弹框

    // 当前操作的对象
    operateObj: {
      type: Object,
      default () {
        return {}
      }
    }
  },

  data () {
    return {
      showDialog: this.value, // 显示弹框
      loading: false, // 用于手动关闭弹框
      editForm: {
        noticeChannel: [], // 通知渠道
        noticeType: '', // 通知类型
        noticeContent: '', // 通知模板
      },

      channelList: [{
        value: 'longxin',
        label: '龙信端应用/公众号'
      }],

      typeList: [{
        value: '1',
        label: '待领取'
      }, {
        value: '2',
        label: '待受理'
      }, {
        value: '3',
        label: '新工单'
      }, {
        value: '4',
        label: '倒计时到期'
      }, {
        value: '5',
        label: '更新状态'
      }],

      editFormRules: {
        noticeChannel: [
          { required: true, type: 'array', min: 1, message: '必填项', trigger: 'change' }
        ],
        noticeType: [
          { required: true, message: '必填项', trigger: 'change' }
        ],
        noticeContent: [
          { required: true, message: '必填项', trigger: 'blur' }
        ]
      }
    }
  },

  watch: {
    value (val) {
      let vm = this
      vm.showDialog = val

      if (val) {
        vm.loading = false
        vm.$refs.templateForm.resetFields() // 移除校验
        vm.editForm = {
          noticeChannel: [], // 通知渠道
          noticeType: '', // 通知类型
          noticeContent: '' // 通知模板
        }

        if (Object.keys(vm.operateObj).length > 0) {
          vm.editForm.id = vm.operateObj.id
          vm.editForm.noticeChannel = vm.operateObj.noticeChannel ? vm.operateObj.noticeChannel.split(',') : []
          vm.editForm.noticeType = vm.operateObj.noticeType
          vm.editForm.noticeContent = vm.operateObj.noticeContent
        }
      }
    },

    showDialog (val) {
      this.$emit('input', val)
    }
  },

  methods: {
    // 保存
    saveTemplate () {
      let vm = this
      vm.$refs.templateForm.validate(valid => {
        if (valid) {
          vm.loading = true

          let server = vm.$services.backendService.noticeTemplateRestController.save
          let notice = { ...vm.editForm }
          let params = {
            cover: '',
            rnId: this.$route.query.id,
            notice: notice
          }
          notice.noticeChannel = notice.noticeChannel.join(',')

          /*if (vm.editForm.id) {
            server = vm.$services.backendService.noticeTemplateRestController.update
            params = { ...params.notice }
          }*/

          vm.$net.send({
            server: vm.$services.backendService.noticeTemplateRestController.save,
            data: params
          }).then(data => {
            if (data.code === 1002) {
              vm.$Modal.confirm({
                title: '操作提示',
                content: '您新增的通知模板已存在，是否需要覆盖?',
                okText: '覆盖',
                onOk: () => {
                  params.cover = 'Y'
                  vm.$net.send({
                    server: server,
                    data: params
                  }).then(data => {
                    if (data.code === 200) {
                      vm.$emit('saveTemplate')
                      vm.showDialog = false
                      vm.$Message.success('保存成功')
                    } else {
                      vm.$Message.error(`${data.code}:${data.message}`)
                    }
                  }).catch(error => {
                    vm.$Message.error(error.reason)
                  })
                },
                onCancel: () => {
                  vm.loading = false
                }
              })
            } else if (data.code === 200) {
              vm.$emit('saveTemplate')
              vm.showDialog = false
              vm.$Message.success('保存成功')
            } else {
              vm.$Message.error(`${data.code}:${data.message}`)
            }
          }).catch(error => {
            vm.$Message.error(error.reason)
          })
        }
      })
    }
  }
}
</script>

<style>
</style>
