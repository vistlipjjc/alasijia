<template>
    <div>
        <div class="versatile-item"
             v-for="(item, index) in menuTree"
             :key="index">
            <Checkbox v-model="item.checked"
                      :indeterminate="item.indeterminate"
                      @on-change="changeMenu('item', item)">
                {{ item.title }}
            </Checkbox>
            <div class="versatile-group-check">
                <Checkbox v-for="button in item.buttons"
                          :key="button.btnCode"
                          v-model="button.view">
                    {{ button.title }}
                </Checkbox>
            </div>
            <div class="versatile-group">
                <div v-for="(children, childIndex) in item.children"
                     :key="childIndex">
                    <Checkbox v-model="children.checked" @on-change="changeMenu('children', children, item)">
                        <div class="versatile-group-check">
                            {{ children.title }}
                        </div>
                    </Checkbox>
                    <div class="versatile-group-check">
                        <Checkbox v-for="button in children.buttons"
                                  :key="button.btnCode"
                                  @on-change="changeBtn(children, button.view)"
                                  v-model="button.view">
                            {{ button.title }}
                        </Checkbox>
                    </div>
                </div>
            </div>
        </div>
        <!-- 保存及返回按钮 -->
        <div style="text-align: center; margin-top: 10px;">
            <Button @click="btnSave"  type="primary" style="margin:0 11px; height: 40px; width: 100px;">保存</Button>
            <Button @click="beforeBtnBack" type="ghost" style="margin:0 11px; height: 40px; width: 100px;">返回</Button>
        </div>
    </div>
</template>

<script>
  export default {
    props: {
      roleParams: Object
    },

    data () {
      return {
        roleInfo: this.roleParams,
        menuServer: this.$services.sysService.menuRestController.getTree, // 菜单树的请求地址
        getButtonServer: this.$services.backendService.buttonRestController.getButtonByMenu, // 按钮的请求地址
        saveServer: this.$services.backendService.buttonRestController.saveMenu, // 按钮的请求地址
        menuTree: [], // 菜单的数据
        treeObject: {}, // 树结构的对象数据
        resourceCodes: [], // 已有权限菜单
        buttons: [], // 菜单按钮
        checkAllGroup: []
      }
    },

    mounted () {
      this.getCheckedMenu()
      this.getButton()
    },

    methods: {
      // 获取已勾选的菜单
      getCheckedMenu () {
        let vm = this
        vm.$net.send({
          server: this.$services.sysService.authorizationRestController.query,
          data: {
            __EQS_auzTarget: vm.roleInfo.code,
            __EQS_kind: 'MENU',
            pageSize: 1000
          }
        }).then(data =>{
          vm.resourceCodes = data.rows.map(item => {
            return item.resourceCode
          })
        })
      },

      // 获取该角色按钮
      getButton () {
        let vm = this
        vm.$net.send({
          server: vm.getButtonServer,
          data: {roleCode: vm.roleInfo.code}
        }).then(data =>{
          // console.log('data', data)
          if (data.code === 200) {
            vm.buttons = data.data
            this.getMenuTree()
          } else {
            vm.$Message.error(data.message)
          }
        })
      },

      // 获取菜单树数据
      getMenuTree () {
        let vm = this
        vm.$net.send({
          server: vm.menuServer
        }).then(data =>{
          vm.setTreeData(data)
          data.forEach(item => {
            // item.indeterminate = true
            item.buttons = vm.buttons[item.menuCode] ? vm.buttons[item.menuCode] : []
            let checkedTotle = 0
            item.children.forEach(child => {
              if (child.checked) {
                checkedTotle ++
              }
              child.buttons = vm.buttons[child.menuCode] ? vm.buttons[child.menuCode] : []
            })
            if (checkedTotle > 0 && checkedTotle < item.children.length ) {
              item.indeterminate = true
            } else if (checkedTotle === item.children.length) {
              item.indeterminate = false
              item.checked = true
            }
          })
          vm.menuTree = data
          // console.log('menuTree', vm.menuTree)
        })
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

      // 点击菜单时触发: 选择上级菜单时，自动选中对应下级菜单和按钮
      changeMenu (name, currentItem, preItem) {
        let flag = currentItem.checked
        currentItem.indeterminate = false
        currentItem.buttons.forEach(item => {
          item.view = flag
        })
        if (name === 'item') {
          currentItem.children.forEach(children => {
            children.checked = flag
            children.buttons.forEach(childrenItem => {
              childrenItem.view = flag
            })
          })
        } else {
          let checkedTotal = 0
          preItem.children.forEach(children => {
            if (children.checked) {
              checkedTotal ++
            }
          })
          if (checkedTotal > 0 && checkedTotal < preItem.children.length ) {
            preItem.indeterminate = true
          } else if (checkedTotal === preItem.children.length) {
            preItem.indeterminate = false
            preItem.checked = true
          } else {
            preItem.indeterminate = false
            preItem.checked = false
          }
        }
      },

      // 按钮
      changeBtn (currentItem, flag) {
        if (flag) {
          currentItem.checked = true
        }
      },

      // 保存
      btnSave () {
        let vm = this
        let saveData = {
          code: vm.$route.query.code,
          type: vm.$route.query.type,
          nodes: [],
          roleCode: vm.$route.query.code,
          btnCodeList: []
        }
        vm.menuTree.forEach(item => {
          // 判断第一层菜单节点有没有勾选
          if (item.checked || item.indeterminate) {
            saveData.nodes.push(item)
          }
          // 遍历第一层菜单按钮
          item.buttons.forEach(buttonItem => {
            buttonItem.menuCode = item.menuCode
            saveData.btnCodeList.push(buttonItem)
          })
          // 遍历第二层菜单
          item.children.forEach(child => {
            if (child.checked) {
              saveData.nodes.push(child)
            }
            child.buttons.forEach(buttonItem => {
              buttonItem.menuCode = child.menuCode
              saveData.btnCodeList.push(buttonItem)
            })
          })
        })
        // console.log('saveData', saveData)
        vm.$net.send({
          server: vm.saveServer,
          data: saveData
        }).then(data =>{
          // console.log('data', data)
          if (data.code === 200) {
            vm.$Message.success('保存成功！')
          } else {
            vm.$Message.error(data.message)
          }
        })

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
      }
    }
  }
</script>
<style>
.versatile-group-check .ivu-checkbox-group {
    display: inline-flex;
}
.versatile-group-check label {
    font-weight: normal;
    margin-left: 15px;
}
</style>
<style scoped>
.versatile-item {
    padding: 8px 0;
    border-bottom: 1px solid #eeeeee;
}
.versatile-item:last-child {
    border-bottom: 0;
}
.versatile-group {
    padding-left: 20px;
}
.versatile-group-check {
    display: inline-block;
}
.versatile-group-check div:first-child {
    margin-left: 20px;
}
</style>
