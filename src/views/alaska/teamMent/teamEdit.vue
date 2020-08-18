<template>
    <div class="noticesRegionEdit">
        <Card>
            <p slot="title" class="fontsize18">{{title}}</p>
            <Row>
                <Form ref="editForm" :model="editForm" :rules="editRules" :label-width="180">
                    <Row>
                        <Col span="11">
                        <FormItem label="团队编号：" prop="teamCode">
                            <Input v-model="editForm.teamCode" disabled :maxlength="15"></Input>
                        </FormItem>
                        </Col>
                        <Col span="11">
                        <FormItem label="团队名称：" prop="teamName" required>
                            <Input v-model="editForm.teamName" clearable :maxlength="15"></Input>
                        </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="22">
                        <FormItem label="团队描述：" prop="teamDescribe">
                            <Input v-model="editForm.teamDescribe" clearable :maxlength="100" type="textarea"></Input>
                        </FormItem>
                        </Col>
                    </Row>

                    <Col span="11">
                    <div align="center">
                        <Button @click="btnSave('editForm')" type="primary" style="margin:0 11px; height: 40px; width: 100px;">保存</Button>
                        <Button type="ghost" @click="btnBack" style="margin:0 11px; height: 40px; width: 100px;">返回</Button>
                    </div>
                    </Col>
                </Form>
            </Row>
        </Card>
    </div>
</template>

<script>
  export default {
    data () {
      return {
        opt: false,
        title: this.$route.params.opt === 'edit' ? '修改团队' : '新增团队',
        editForm: {
          teamCode: '',
          teamName: '',
          teamDescribe: ''
        },
        editRules: {
          teamName: [{required: true, message: '请输入团队名称', trigger: 'blur'}],
        },

      }
    },

    created () {
      this.init()
    },

    methods: {
      init () {
        let vm = this
        if (vm.$route.params.opt !== 'add') {
          vm.$net.send({
            server: vm.$services.backendService.managerTeamRestController.viewTeam,
            append: vm.$route.query.teamCode
          }).then(data =>{
            if (data.code === 200) {
              let res =data.data
              vm.editForm = {
                teamCode: res.teamCode,
                teamName: res.teamName,
                teamDescribe: res.teamDescribe
              }
            } else {
              vm.$Message.error({duration: 5, content: data.message})
            }
          })
        }
      },

      // 保存事件
      btnSave (name) {
        let vm = this
        vm.$refs[name].validate((valid) => { // 数据校验
          if (!valid) {
            return
          }
          let server = vm.editForm.teamCode ? vm.$services.backendService.managerTeamRestController.updateTeam : vm.$services.backendService.managerTeamRestController.createTeam
          vm.$net.send({
            server: server,
            data: vm.editForm
          }).then((data) => {
            if (data.code === 200) {
              vm.$Message.success('保存成功')
              vm.btnBack()
            } else {
              vm.$Message.error(data.message)
            }
          })
        })
      },

      beforeBtnBack () {
        this.$Modal.confirm({
          content: '表单的信息将不会保存，确定离开吗？',
          onOk: () => {
            this.btnBack()
          },
          onCancel: () => {
          }
        })
      },

      // 返回
      btnBack () {
        this.$router.go(-1)
        this.$store.commit('closePage', 'teamEdit')
        this.$store.commit('removeTag', 'teamEdit')
      }

    }
  }
</script>