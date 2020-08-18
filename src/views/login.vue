<style lang="less">
    @import './login.less';
</style>

<template>
    <div style="height: 100%; width: 100%;">
        <div class="login" @keydown.enter="handleSubmit">
            <div class="login-container">
                <div class="login-con">
                    <div class="logo-header">
                        <!-- <img class="logo-img" src="../images/login_logo_icon.png"/> -->
                    </div>
                    <div class="title">
                        信息服务平台
                    </div>
                    <div class="form-con">
                        <Form ref="loginForm" :model="form" :rules="rules" style="width: 78%;">
                            <FormItem prop="username">
                                <Input v-model="form.username" clearable placeholder="请输入用户名">
                                <span slot="prepend">
                                    <Icon :size="16" type="person" color="#CCCCCC"></Icon>
                                </span>
                                </Input>
                            </FormItem>
                            <FormItem prop="password">
                                <Input type="password" clearable v-model="form.password" placeholder="请输入密码">
                                <span slot="prepend">
                                    <Icon :size="14" type="locked" color="#CCCCCC"></Icon>
                                </span>
                                </Input>
                                <div class="ivu-form-item-error-tip" v-show="isError">{{errorMsg}}</div>
                            </FormItem>
                            <FormItem style="margin-top: 74px">
                                <Button @click="checkFirstLogin" type="primary" long>登录</Button>
                            </FormItem>
                        </Form>
                    </div>
                </div>
                <img class="login-img" src="../images/login.png"/>
            </div>
        </div>

        <Modal v-model="ifShow" :mask-closable="false" width="500">
            <div slot="header" style="font-size: 18px; font-weight: bold; color:red; text-align: center">首次登录平台，请设置新密码</div>
            <Form ref="editForm" :model="editForm" :rules="editRules" :label-width="90" style="margin-right: 20px;">
                <FormItem prop="password" label="新密码:">
                    <Input clearable type="password" :maxlength="16" v-model.trim="editForm.password"></Input>
                </FormItem>
                <FormItem prop="confirm" label="确认新密码:">
                    <Input clearable type="password" :maxlength="16" v-model.trim="editForm.confirm"></Input>
                </FormItem>
            </Form>
            <template slot="footer">
                <div style="text-align: center;">
                    <Button type="primary" @click="modifyPassword">确定</Button>
                    <Button @click="ifShow = false">取消</Button>
                </div>
            </template>
        </Modal>
    </div>

</template>

<script>
    import md5 from 'md5'
    import { mapActions } from 'vuex'
    import Cookies from 'js-cookie';
    import app from '@/config/app'
    import storage from '@/util/storage'

    export default {
        name: 'login',
        data () {
            return {
                ifShow: false,
                appName: app.name,
                appVersion: app.version,
                form: {
                    username: '',
                    password: ''
                },
                rules: {
                    username: [
                        { required: true, message: '账号不能为空', trigger: 'blur' }
                    ],
                    password: [
                        { required: true, message: '密码不能为空', trigger: 'blur' }
                    ]
                },
                isError: false,
                errorMsg: '',
              editForm: {
                username: '',
                password: '',
                confirm: ''
              },
              editRules: {
                password: [
                  { required: true, message: '新密码不能为空', trigger: 'blur' },
                  { validator:
                    (rule, value, callback) => {
                      let passwordRegx = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{6,16}$/ // /^[a-zA-Z0-9]+$/
                      if (value && !passwordRegx.test(value)) {
                        callback(new Error('请输入英文大写、小写和数字的长度为6-16位的组合密码'))
                      } else {
                        callback()
                      }
                    }
                  }
                ],
                confirm: [
                  { required: true, message: '确认新密码不能为空', trigger: 'blur' },
                  { validator:
                    (rule, value, callback) => {
                      let passwordRegx = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{6,16}$/
                      if (value && !passwordRegx.test(value)) {
                        callback(new Error('请输入英文大写、小写和数字的长度为6-16位的组合密码'))
                      } else {
                        callback()
                      }
                    }
                  }
                ],
              }
            };
        },
        methods: {
            ...mapActions([
                'userLogin'
            ]),

          // 如果是第一次登录系统或者重置初始密码后，首次登录需要重置密码
          modifyPassword () {
            let vm = this
            this.$refs.editForm.validate((valid) => {
              if (!valid) return;
              if (vm.editForm.password !== vm.editForm.confirm) {
                vm.$Message.info('两次输入的的密码不一致，请重新输入！')
                return false
              }
              vm.editForm.username = vm.form.username
              let saveForm = {
                username: vm.editForm.username,
                password: md5(vm.editForm.password),
                confirm: md5(vm.editForm.confirm)
              }
              vm.$net.send({
                server: this.$services.sysService.loginRestController.modifyPassword,
                data: saveForm
              }).then((data) => {
                if (data.success) {
                  vm.form.password = vm.editForm.password
                  vm.handleSubmit()
                } else {
                  vm.$Message.error({duration: 5, content: data.msg});
                }
              })
            })

          },

          // 校验是否第一次登录系统
          checkFirstLogin () {
            // return false
            this.$refs.loginForm.validate((valid) => {
              if (!valid) return;
              this.$net.send({
                server: this.$services.sysService.loginRestController.checkFirstLogin,
                data: {username: this.form.username, password: md5(this.form.password)} // md5(this.form.password)
              }).then((data) => {
                console.log(data)
                if (data.code === 200) {
                  this.handleSubmit()
                } else if (data.code === 304) {
                  this.ifShow = true
                } else {
                  this.$Message.error(data.msg);
                }
              })
            })
          },
            handleSubmit () {
                this.isError = false;
                this.$refs.loginForm.validate((valid) => {
                    if (!valid) return;

                  let saveForm = {
                    username: this.form.username,
                    password: md5(this.form.password)
                  }
                  this.userLogin(saveForm).then(message => {
                        if (message)
                        {
                            this.isError = true;
                            this.errorMsg = message;
                        }
                    }).catch((reason) => {
                        this.$Message.error('用户登录失败', reason);
                    });

                });
            }
        }
    };
</script>
