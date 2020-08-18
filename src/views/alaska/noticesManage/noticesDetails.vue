<template>
  <Card class="ndBox">
    <p slot="title">{{ title }}</p>

    <Form :model="detailsForm" :label-width="120">
      <!-- 模板 -->
      <template v-if="type === 'template'">
        <FormItem label="通知渠道: ">
          <div class="ndInfo">{{ detailsForm.noticeChannel }}</div>
        </FormItem>
        <FormItem label="通知类型: ">
          <div class="ndInfo">{{ detailsForm.noticeType }}</div>
        </FormItem>
        <FormItem label="模板内容: ">
          <div class="ndInfo" v-html="detailsForm.noticeContent"></div>
        </FormItem>
        <FormItem label="创建时间: ">
          <div class="ndInfo">{{ detailsForm.createdTime }}</div>
        </FormItem>
      </template>
      <template v-if="type === 'fail'">
        <FormItem label="通知类型: ">
          <div class="ndInfo">{{ detailsForm.noticeType }}</div>
        </FormItem>
        <FormItem label="主题内容: ">
          <div class="ndInfo" v-html="detailsForm.noticeContent"></div>
        </FormItem>
        <FormItem label="失败收件人: ">
          <div class="ndInfo">{{ detailsForm.acceptFailName }}</div>
        </FormItem>
        <FormItem label="成功收件人: ">
          <div class="ndInfo">{{ detailsForm.acceptSuccessName }}</div>
        </FormItem>
        <FormItem label="发送时间: " >
          <div class="ndInfo">{{ detailsForm.sendTime }}</div>
        </FormItem>
        <FormItem label="失败原因: ">
          <div class="ndInfo">{{ detailsForm.failCause }} </div>
        </FormItem>
      </template>
      <template v-else>
        <FormItem label="通知类型: ">
          <div class="ndInfo">{{ detailsForm.noticeType }}</div>
        </FormItem>
        <FormItem label="主题内容: ">
          <div class="ndInfo" v-html="detailsForm.noticeContent"></div>
        </FormItem>
        <FormItem label="是否推送: ">
          <div class="ndInfo">{{ detailsForm.push }}</div>
        </FormItem>
        <FormItem label="收件人: ">
          <div class="ndInfo">{{ detailsForm.addresseeName }}</div>
        </FormItem>
        <FormItem label="创建时间: " v-if="type === 'draft'">
          <div class="ndInfo">{{ detailsForm.createdTime }}</div>
        </FormItem>
        <FormItem label="发送时间: " v-else>
          <div class="ndInfo">{{ detailsForm.sendTime }}</div>
        </FormItem>
        <FormItem label="发送人: " v-if="type === 'send'">
          <div class="ndInfo">{{ detailsForm.senderName }}</div>
        </FormItem>
      </template>
    </Form>

    <div class="ndBtnBox">
      <Button class="ndBtn" type="ghost" icon="ios-undo" @click="turnBack">返回</Button>
    </div>
  </Card>
</template>

<script>
export default {
  data () {
    return {
      failsys:false,//回退列表flag
      empty:'',
      type: '', // 详情类型
      title: '', // 标题
      detailsForm: {} // 详情内容
    }
  },

  created () {
    this.init()
  },

  methods: {
    init () {
      let vm = this
      vm.id = vm.$route.query.id
      vm.type = vm.$route.query.type
      vm.title = vm.type === 'template' ? '模板详情' : '通知消息详情'
      vm.getDetails()
      if(vm.$route.query.fail&&vm.$route.query.fail ==='fail02'){
        //当是管理通知查询触发flag
        vm.failsys =true
      }
    },

    getDetails () {
      let vm = this
      let backendService = vm.$services.backendService
      let serverMap = {
        template: backendService.noticeTemplateRestController.details,
        system: backendService.sysNoticeRestController.details,
        send: backendService.manageNoticeRestController.details,
        draft: backendService.manageNoticeRestController.details,
        fail: backendService.noticeFailRecordRestController.details
      }

      vm.$net.send({
        server: serverMap[vm.type],
        append: vm.id
      }).then(data => {
        if (data.code === 200) {
          let detailsForm = data.data


          let channelMap = {
            longxin: '龙信端应用/公众号',
            web: 'web端',
            applets: '小程序',
            SMS: '短信'
          }

          let typeMap = {
            '0': '管理通知',
            '1': '待领取',
            '2': '待受理',
            '3': '新工单',
            '4': '倒计时到期',
            '5': '更新状态'
          }

          detailsForm.noticeChannel = channelMap[detailsForm.noticeChannel] || detailsForm.noticeChannel || ''
          detailsForm.noticeType = typeMap[detailsForm.noticeType] || detailsForm.noticeType || ''
          detailsForm.push = detailsForm.push === 'Y' ? '是' : (detailsForm.push === 'N' ? '否' : '')
          detailsForm.acceptFailName = detailsForm.acceptFailName === null ? '' : detailsForm.acceptFailName
          detailsForm.acceptSuccessName = detailsForm.acceptSuccessName === null ? '' : detailsForm.acceptSuccessName
          detailsForm.noticeContent = detailsForm.noticeContent.replace(/\s/g, '&nbsp;')
          vm.detailsForm = detailsForm
        } else {
          vm.$Message.error(`${data.code}:${data.message}`)
        }
      }).catch(error => {
        vm.$Message.error(error.reason)
      })
    },

    turnBack () {
      let vm = this
      vm.$router.go(-1)
      vm.$store.commit('removeTag', 'noticesDetails');
      vm.$store.commit('closePage', 'noticesDetails');
    }
  }
}
</script>

<style>
.ndInfo,
.ndBox .ivu-form-item-label {
  font-size: 14px;
}
.ndBox .ivu-form-item {
  margin-bottom: 0;
}

.ndBtnBox {
  margin-top: 10px;
  margin-left: 120px;
}
</style>
