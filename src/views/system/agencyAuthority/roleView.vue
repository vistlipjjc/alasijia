<template>
    <div class="roleEditCtnr">
        <Card>
            <p slot="title">角色详情</p>
            <Row class="item">
                <Col span="11">
                    <span class="item-label">角色编码：</span>{{ editForm.roleCode }}
                </Col>
                <Col span="11">
                    <span class="item-label">角色名称：</span>{{ editForm.roleName }}
                </Col>
            </Row>
            <Row class="item">
                <Col span="11">
                    <span class="item-label">角色描述：</span>{{ editForm.roleDesc }}
                </Col>
                <Col span="11">
                    <span class="item-label">状态：</span>{{ editForm.status }}
                </Col>
            </Row>
            <Row>
                <Col span="24">
                <div align="center">
                    <Button type="ghost" @click="btnBack" style="margin:0 11px; height: 40px; width: 100px;">返回</Button>
                </div>
                </Col>
            </Row>

        </Card>
    </div>
</template>

<script>
  export default {
    data(){
      return {
        editForm: {
          hierarchy: '30',
          roleStdCode: '',
          roleGroupCode: '',
          roleName: '',
          roleCode: '',
          status:'',
          roleDesc:''
        }
      }
    },

    mounted() {
      this.init();
    },

    methods: {
      init() {
        let vm = this
        let statusList = []
        // 角色状态的查询
        vm.$store.dispatch('cache/cacheDict', {type: 'fixedDict', url: 'RoleStatus', service: 'system'})
          .then(data => {
            statusList = data
          })

        vm.$net.send({
          server: vm.$services.sysService.roleRestController.getRole,
          data: {roleCode: vm.$route.query.roleCode}
        }).then(data =>{
          if (data.success) {
            vm.editForm = data.data
            statusList.forEach(item => {
              if(item.value === vm.editForm.status){
                vm.editForm.status = item.name
              }
            })
          }
          // console.log(data)
        })
      },

      /*返回*/
      btnBack(){
        this.$router.go(-1);
        this.$store.commit('removeTag', 'roleEdit');
        this.$store.commit('closePage', 'roleEdit');
      }
    }
  }
</script>
<style>
    .item {
        margin-bottom: 15px;
        text-align: center;
    }
    .item-label {
        display: inline-block;
        width: 70px;
        text-align: right;
    }
</style>