<template>
  <div style="min-height: 330px;">
    <div class="authbordertype" style="margin-top:-16px;min-height: 80px;">
      <p slot="title" class="authmargintype">业务数据权限</p>
      <Row calss="authpaddingtype">
        <Col span="24">
          <Tree ref="menuTree" :data="treeData" show-checkbox></Tree>
        </Col>
      </Row> 
    </div>
    <div class="authbordertype">
      <p class="authmargintype">用户账号数据权限</p>
	  <Row calss="authpaddingtype">
	    <Col span="24">
          <RadioGroup v-model="queryData.authority" vertical>
            <Radio label="00" class="authfonttype">个人</Radio>
            <Radio label="01" class="authfonttype">所属机构</Radio>
            <Radio label="02" class="authfonttype">所属机构及以下机构</Radio>
            <Radio label="03" class="authfonttype">所有</Radio>	
          </RadioGroup>
	    </Col>
	    <Col span="24">
	      <div align="center">
          <Button @click="saveMenu"  type="primary" style="margin:0 11px; height: 40px; width: 100px;">保存</Button>
          <Button @click="beforeBtnBack" type="ghost" style="margin:0 11px; height: 40px; width: 100px;">返回</Button>
	      </div>
	    </Col>
	  </Row>
    </div>
  </div>    
</template>

<script>
export default {
  data (){
    return{
      queryData:{//上传时格式
      	roleCode:'',
      	orgNo:'',
      	authority:'00',
      },
      saveFlag:false,
      treeData: [],
      resourceCodes: [], // 已选菜单
      treeObject: {}, // 树结构的对象数据
      server: {
        query: this.$services.backendService.dataAuthorityRestController.getdataAuthority,
        save: this.$services.backendService.dataAuthorityRestController.saveAataAuthority,
        update:this.$services.backendService.dataAuthorityRestController.updateAataAuthority,
      },
    }
  },

  mounted () {
    this.init();
  },
  methods: {
    async init () {   
      await this.getCheckedMenu()
      await this.getMenuTree()
    },
    // 获取已勾选的菜单
    getCheckedMenu () {
      let vm = this
      this.$net.send({
      server: vm.server.query,
      append: vm.$route.query.code
      }).then(
        (data)=>{
          if (data.data) {
           vm.queryData.id = data.data.id
           vm.queryData.orgNo = data.data.orgNo
           vm.queryData.authority = data.data.authority
           vm.saveFlag = true
           vm.resourceCodes = vm.queryData.orgNo.split(",")
          };  
      })
      vm.queryData.roleCode = vm.$route.query.code
    },
    // 获取菜单树数据
    getMenuTree () {
      let vm = this
      this.$net.send({
      	server: this.$services.backendService.organizationRestController.getOrganizationTree     
      }).then(data =>{
      let treeData = data.data
      data.data.forEach((item,i) => {
      	if (item.title !=='资金方') {
    		data.data.splice(i,1)
      	};
      })
      vm.resourceCodes.forEach(orgNo => {
      vm.setTreeData(treeData,orgNo)
      })
	    vm.treeData = treeData
      });

    },
    // 递归遍历，删除loading属性，设置已选勾选,特有属性，之后不需要
    setTreeData (array,orgNos) {
      let vm = this
      array.forEach(item => {
        delete item.loading
        vm.treeObject[item.id] = item
        
        // 非节点选中，若为节点，则由组件通过子元素长度自行判断是否勾选
        if (item.orgNo === orgNos&&item.children.length == 0) {
          item.checked = true
        }
        // 继续编辑子节点
        if (item.children && item.children.length > 0) {
          vm.setTreeData(item.children,orgNos)
        }
      })
    },
    // 保存
    saveMenu () {
      let vm = this
      let submitNodes = []
      vm.queryData.orgNo =''//保存前清空上次存值
      let checkedNodes = this.$refs.menuTree.getCheckedNodes(); //获取所有选中节点
      if (checkedNodes.length>0) {
      	checkedNodes.forEach(item => {
        vm.queryData.orgNo += item.orgNo+','
        })
        vm.queryData.orgNo = (vm.queryData.orgNo.substring(vm.queryData.orgNo.length - 1) == ',') ? vm.queryData.orgNo.substring(0, vm.queryData.orgNo.length - 1) : vm.queryData.orgNo;
        //获取所有上级并去重
        let checkedNodesParentorgNo = vm.queryData.orgNo.split(",")
        checkedNodesParentorgNo.forEach(item => {

          submitNodes.push.apply(submitNodes,vm.getParent(vm.treeData,item))

        })
        submitNodes.push.apply(submitNodes,checkedNodesParentorgNo)
        submitNodes = Array.from(new Set(submitNodes))
        vm.queryData.orgNo = submitNodes.toString()
      }else{
        vm.$Message.warning('请选择相应数据权限再保存');
      	return null
      }

      vm.$net.send({
        server: vm.saveFlag?vm.server.update:vm.server.save,
        data: vm.queryData
      }).then( (data)=>{
        if (data.success) {
          vm.getCheckedMenu()  
          vm.$Message.success('保存数据权限成功');
        } else {
          vm.$Message.error('保存数据权限失败');
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
    // 提示是否返回
  	beforeBtnBack () {
  	  this.$Modal.confirm({
  	    content: '表单的信息将不会保存，确定离开吗？',
  	    onOk: () => {
  	      this.btnBack()
  	    },
  	    onCancel: () => {}
  	  })
  	},
  	// 返回
  	btnBack () {
  	  this.$router.go(-1)
  	  this.$store.commit('closePage', 'authorizeMent')
  	  this.$store.commit('removeTag', 'authorizeMent')
  	},
    //获取所有勾选机构的上级
    getParent(data2, orgNos) {
      let arrRes = [];
      if (data2.length == 0) {
        if (!!orgNos) {
          arrRes.unshift(data2)
        }
        return arrRes;
      }
      let rev = (data, nodeId) => {
        for (var i = 0, length = data.length; i < length; i++) {
          let node = data[i];
          if (node.orgNo == nodeId) {
            arrRes.unshift(node.orgNo)
            rev(data2, node.parentId);
            break;
          }
          else {
            if (!!node.children) {
                rev(node.children, nodeId);
            }
          }
        }
        return arrRes;
      };
      arrRes = rev(data2, orgNos);
      return arrRes;
    }
  }
}
</script>
<style>
.authfonttype{
  font-weight:normal;
}	
.authbordertype{
  border-top:1px solid #e9eaec;
  padding-left:20px;
}
.authpaddingtype{
  padding-left:15px;
}
.authmargintype{
  margin-top:10px;
  font-weight: bold;
}
</style>