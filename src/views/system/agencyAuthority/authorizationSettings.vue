<template>
  <Row :gutter="10">
    <Col :sm="24" :md="12" :lg="12">
      <Card>
        <p slot="title">
          <Icon type="grid"></Icon> 菜单授权
        </p>
        <Row style="min-height: 330px;">
          <Col span="12">
            <Tree ref="menuTree" :data="treeData" show-checkbox></Tree>
          </Col>
          <Col span="12">
            <Button type="primary" @click="saveMenu" style="margin:0 5px;">保存</Button>
            <Button type="ghost" @click="btnBack">返回</Button>
          </Col>
        </Row>
      </Card>
    </Col>
  </Row>
</template>

<script>
export default {
  name: 'authorizeMenuToRole',

  data (){
    return{
      btnSavedisable: true,
      initCheckMenu: null,
      permitType: '',
      menuCode: '',
      treeData: [],
      resourceCodes: [], // 已选菜单
      treeObject: {}, // 树结构的对象数据
      queryServer: this.$services.sysService.menuRestController.getTree,
    }
  },

  mounted () {
    this.init();
  },

  methods: {
    async init () {
      await this.getCheckedMenu()
      this.getMenuTree()
    },

    // 获取已勾选的菜单
    getCheckedMenu () {
      let vm = this
      vm.$net.send({
        server: this.$services.sysService.authorizationRestController.query,
        data: {
          __EQS_auzTarget: this.$route.params.code,
          __EQS_kind: 'MENU',
          pageSize: 1000
        }
      }).then(data =>{
        vm.resourceCodes = data.rows.map(item => {
          return item.resourceCode
        })
      })
    },

    // 获取菜单树数据
    getMenuTree () {
      let vm = this
      vm.$net.send({
        server: vm.queryServer
      }).then(data =>{
        let treeData = data
        vm.setTreeData(treeData)
        vm.treeData = treeData
      });
    },

    // 递归遍历，删除loading属性，设置已选勾选
    setTreeData (array) {
      let vm = this
      array.forEach(item => {
        delete item.loading
        vm.treeObject[item.id] = item

        // 如果已选节点包括当前节点，且是叶节点，则勾选
        if (vm.resourceCodes.includes(item.id) && item.leafNode === 'Y') {
          item.checked = true
        }

        // 继续编辑子节点
        if (item.children && item.children.length > 0) {
          vm.setTreeData(item.children)
        }
      })
    },

    // 保存
    saveMenu () {
      let vm = this
      let submitNodes = []
      let checkedNodes = this.$refs.menuTree.getCheckedNodes(); //获取所有选中节点
      submitNodes = [ ...checkedNodes ]

      // 编辑获取每个已选节点的父节点
      checkedNodes.forEach(item => {
        vm.getParentNode(item, submitNodes)
      })

      vm.$net.send({
        server: vm.$services.sysService.authorizationRestController.save,
        data: {
          nodes: JSON.stringify(submitNodes),
          code: vm.$route.params.code,
          type: vm.$route.params.type
        }
      }).then( (data)=>{
        if (data.success) {
          vm.$Message.success(data.msg);
        } else {
          vm.$Message.error(data.msg);
        }
      });
    },

    // 递归遍历已选节点的所有父节点
    getParentNode (node, submitNodes) {
      let vm = this
      let submitNodesIds = submitNodes.map(item => {
         return item.id
      })

      // 如果节点有父节点id，且有这个父节点对象，并且数据里面没有这个父节点的id
      if (node.pid && vm.treeObject[node.pid] && !submitNodesIds.includes(node.pid)) {
        submitNodes.push(vm.treeObject[node.pid])
        vm.getParentNode(vm.treeObject[node.pid], submitNodes)
      }
    },

    //返回
    btnBack() {
      let vm = this
      vm.$router.push({
        path: '/sys/authorization'
      })
      vm.$store.commit('removeTag', 'authorizeSet');
      vm.$store.commit('closePage', 'authorizeSet');
    }
  }
}
</script>
