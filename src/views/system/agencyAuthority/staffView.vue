<template>
  <div class="staffViewCtnr">
    <Card>
        <Row class="item">
            <Col span="8">
            <span class="item-label">用户账号：</span>{{ editForm.staffCode }}
            </Col>
            <Col span="8">
            <span class="item-label">用户名称：</span>{{ editForm.staffName }}
            </Col>
            <Col span="8">
            <span class="item-label">性别：</span>{{ editForm.gender }}
            </Col>
        </Row>

        <Row class="item">
            <Col span="8">
            <span class="item-label">出生日期：</span>{{ editForm.birthdayString }}
            </Col>
            <Col span="8">
            <span class="item-label">角色名称：</span>{{ editForm.roleName }}
            </Col>
            <Col span="8">
            <span class="item-label">移动电话：</span>{{ editForm.mobile }}
            </Col>
        </Row>

        <Row class="item">
            <Col span="8">
            <span class="item-label">邮件：</span>{{ editForm.email }}
            </Col>
            <Col span="8">
            <span class="item-label">状态：</span>{{ editForm.status }}
            </Col>
            <Col span="8">
            <span class="item-label">地址：</span>{{ editForm.address }}
            </Col>
        </Row>

      <Row style="text-align: center;" class="margin-top-10">
        <Button type="ghost" @click="btnBack" style="margin:0 11px; height: 40px; width: 100px;">返回</Button>
      </Row>
    </Card>
  </div>
</template>

<script>
export default {
  name: "staffView",
  data () {
    return {
      editForm: {
        staffName: '',
        staffCode: '',
        status: '',
        gender: '',
        deptCode: '',
        deptName: '',
        birthday: '',
        birthdayString: '',
        roleCode: '',
        roleName: '',
        roleGroupCode: '',
        roleGroupName: '',
        staffType: '',
        mobile: '',
        staffGroup: '',
        staffGroupName:'',
        unitCode: '',
        unitName: ''
      }
    }
  },

  mounted() {
    this.init();
  },

  methods: {
    init() {
      let vm = this
      let genderList = []
      let statusList = []
      let roleList = []

      // 性别的字典
      vm.$store.dispatch('cache/cacheDict', {type: 'fixedDict', url: 'Gender', service: 'system'})
        .then(data => {
          genderList = data
        })

      // 状态的字典
      vm.$store.dispatch('cache/cacheDict', {type: 'fixedDict', url: 'StaffStatus', service: 'system'})
        .then(data => {
          statusList = data
        });

      // 角色的列表
      vm.$net.send({
        server: vm.$services.sysService.roleRestController.queryAll,
        data: {status: 'ENABLE', hierarchy: '30'}
      }).then(
        (data)=>{
          roleList = data
        })

      vm.$net.send({
        server: vm.$services.sysService.staffRestController.getStaffDetail,
        data: {staffCode: this.$route.query.staffCode}
      }).then(
        (data)=>{
          if (data.success) {
            let staff = data.data.staff
            genderList.forEach(item => {
              if(item.value === staff.gender){
                staff.gender = item.name
              }
            })
            statusList.forEach(item => {
              if(item.value === staff.status){
                staff.status = item.name
              }
            })

            let roleCode = []
            roleList.forEach(item => {
              data.data.JS.forEach(roleCodeItem => {
                if(roleCodeItem === item.value){
                  roleCode.push(item.name)
                }
              })
            })
            console.log(roleList, data.data.JS, roleCode)

            vm.editForm = staff
            vm.editForm.roleName = roleCode.join(',')

          }
          // console.log(data)
        })
    },

    btnBack(){
      this.$router.go(-1);
      this.$store.commit('removeTag', 'staffView');
      this.$store.commit('closePage', 'staffView');
    }
  }
}
</script>
<style>
    .item {
        margin-bottom: 15px;
    }
    .item-label {
        display: inline-block;
        width: 140px;
        text-align: right;
    }
</style>