<template xmlns:v-contextmenu="http://www.w3.org/1999/xhtml">
    <Layout class="layout">
        <Sider>
            <div>
                <Row>
                    <Col span="16">
                        <Input v-model.trim="organizationName" placeholder="请输入机构名称 " clearable :maxlength="30"></Input>
                    </Col>
                    <Col span="6">
                        <div align="center">
                            <Button @click="vagueQuery" type="ghost" style="margin-left: 10px;">查询</Button>
                        </div>
                    </Col>
                </Row>
                <v-contextmenu ref="contextmenu" class="propMenu" :class="ifShowContextmenu ? 'hiddenContextmenu': ''">
                    <v-contextmenu-item @click="newLevel" v-if="editForm.parentId">增加同级机构</v-contextmenu-item>
                    <v-contextmenu-item @click="newNextLevel" v-if="editForm.orgNo">增加下级机构</v-contextmenu-item>
                    <v-contextmenu-item @click="removeNode" v-if="editForm.parentId">删除</v-contextmenu-item>
                    <v-contextmenu-item @click="upOrDownNode('up')" v-if="editForm.parentId">上移</v-contextmenu-item>
                    <v-contextmenu-item @click="upOrDownNode('down')" v-if="editForm.parentId">下移</v-contextmenu-item>
                </v-contextmenu>
                <div v-contextmenu:contextmenu>
                    <Tree ref="organizationTree"
                          :data="treeData"
                          :render="renderContent"
                          @on-select-change="selectNode">
                    </Tree>
                </div>
            </div>
        </Sider>
        <Content>
            <Card style="margin-left: 5%;">
                <Row>
                    <Form ref="editForm" :model="editForm" :rules="editRules" :label-width="180">
                        <Col span="11">
                        <FormItem label="上级机构名称222：" prop="parentName">
                            <Input v-model="editForm.parentName" disabled/>
                        </FormItem>
                        </Col>
                        <Col span="11">
                        <FormItem label="上级机构编码：" prop="parentId">
                            <Input v-model="editForm.parentId" disabled/>
                        </FormItem>
                        </Col>

                        <Col span="11">
                        <FormItem label="机构名称：" prop="title" required>
                            <Input v-model="editForm.title" clearable :disabled="!editForm.parentId" :maxlength="30"></Input>
                        </FormItem>
                        </Col>
                        <Col span="11">
                        <FormItem label="机构编码：" prop="orgNo">
                            <Input v-model="editForm.orgNo" disabled></Input>
                        </FormItem>
                        </Col>

                        <Col span="11">
                        <FormItem label="行内机构编号：" prop="ccbOrgCode">
                            <Input v-model="editForm.ccbOrgCode" :maxlength="9" clearable :disabled="!editForm.parentId"></Input>
                        </FormItem>
                        </Col>

                        <Col span="22">
                        <FormItem label="机构描述：" prop="descript">
                            <Input v-model="editForm.descript" type="textarea" :disabled="!editForm.parentId" clearable :maxlength="200"></Input>
                        </FormItem>
                        </Col>
                        <Col span="22" v-if="editForm.parentId">
                        <div align="center">
                            <Button @click="btnSave('editForm')" type="primary" style="margin:0 11px; height: 40px; width: 100px;">保存</Button>
                            <Button v-if="selectedNode.length && !selectedNode[0].orgNo" @click="btnCancle" type="ghost" style="margin:0 11px; height: 40px; width: 100px;">取消</Button>
                        </div>
                        </Col>
                    </Form>
                </Row>
            </Card>
        </Content>
    </Layout>
</template>

<script>
    import $ from 'jquery'
  export default {
    name: "organizationTree",
    data () {
      return {
        organizationName: '', // 查询条件
        ifShowContextmenu: false,
        ysTreeData: [], // 原始数据，记录初始化数据，用于模糊查询的初始数据
        treeData: [], // 用于渲染页面的数据
        editForm: { // 渲染页面及保存的数据
          parentId: '',
          parentName: '',
          orgNo: '',
          title: '',
          descript: '',
          ccbOrgCode: ''
        },
        editRules: {
          title: [{required: true, message: '请输入机构名称', trigger: 'blur'}],
          ccbOrgCode: [
            // {message: '请输入 9 位数字的行内机构编号。', trigger: 'blur'},
            { validator:
              (rule, value, callback) => {
                let bankNoRegx = /^\d{9}$/
                if (value && !bankNoRegx.test(value)) {
                  callback(new Error('请输入 9 位数字的行内机构编号。'))
                } else {
                  callback()
                }
              }
            }
          ],
        },

        formItem: { // 用于新增节点的桥梁数据
          parentId: '',
          parentName: '',
          orgNo: '',
          title: '',
          descript: '',
          ccbOrgCode: ''
        },
        selectedNode: [], // 记录当前点击的节点数据
        selectParent: {} // 记录当前节点的父节点数据
      }
    },

    beforeRouteLeave (to, from, next) {
      let vm = this
      if (vm.selectedNode.length === 1 && (vm.editForm.title !== vm.selectedNode[0].title || vm.editForm.descript !== vm.selectedNode[0].descript || vm.editForm.ccbOrgCode !== vm.selectedNode[0].ccbOrgCode) ) {
        vm.$Modal.confirm({
          content: '表单的信息将不会保存，确定离开吗？',
          onOk: () => {
            next()
          },
          onCancel: () => {
            next(false)
          }
        })
      } else {
        next()
      }
    },

    created () {
      this.init()
    },

    methods:{
      init(){
        this.$net.send({
          server: this.$services.backendService.organizationRestController.getOrganizationTree,
        }).then((data) => {
          console.log(1111)
          if (data.success) {
            
            this.ysTreeData = JSON.parse(JSON.stringify(data.data))
            this.treeData = JSON.parse(JSON.stringify(data.data))
          } else {
            this.$Message.error({duration: 5, content: data.msg});
          }
        });
      },

      // 自定义事件
      renderContent (h, { root, node, data }) {
        return h('span', {
          style: {
            display: 'inline-block',
            cursor: 'pointer',
            padding: '2 4px',
            borderRadius: '3px',
            backgroundColor: node.node.selected ? "#d5e8fc" : ""
          },
          on: {
            click: () => {
              this.$refs.organizationTree.handleSelect(node.nodeKey); // 手动选择树节点
              // console.log(root, node, data)
            },

            //右键点击事件
            contextmenu: (e) => {
              e.preventDefault()
              this.ifShowContextmenu = false
              if (!node.node.selected) {
                this.$refs.organizationTree.handleSelect(node.nodeKey) // 手动选择树节点
              }
            },
          }
        }, [
          h('span', data.title)
        ])
      },

      // 增加同级
      newLevel () {
        if (this.selectedNode.length > 0) {
          /* 取消之前选中节点 */
          let treeNode = this.selectedNode[0]
          this.$set(treeNode, 'selected', false)

          /* 新建节点 */
          let node = JSON.parse(JSON.stringify(this.formItem))
          node['title'] = '新节点'
          // node['selected'] = true
          node['isParent'] = false
          node['children'] = []

          /* 判断是否存在父节点 */
          let parent = this.selectParent
          if (parent)
          {
            node['nodeKey'] = parent.children.length + 1
            node['parentId'] = parent.orgNo
            node['parentName'] = parent.title
            parent.children.push(node)
          }
          else
          {
            node['nodeKey'] = this.treeData.length + 1
            this.treeData.push(node)
          }

          /* 加载到表单 */
          let tmp = []
          tmp.push(node)
          this.selectNode(tmp)
          this.editForm.title = ''
          this.$set(node, 'selected', true)
        } else {
          this.$Message.warning({duration: 5, content: '请先选择一个节点'})
        }
      },

      // 增加下级
      newNextLevel () {
        if (this.selectedNode.length > 0) {
          if (this.selectedNode[0].orgLevel === '6') {
            this.$Message.info('机构最多可增加至6级！')
            return false
          }
          if (!this.selectedNode[0].orgNo) {
            this.$Message.info('请先保存父级机构，再新增子级机构！')
            return false
          }
          /* 取消之前选中节点 */
          let treeNode = this.selectedNode[0]
          this.$set(treeNode, 'selected', false)
          const children = treeNode.children || []

          /* 新建节点 */
          let node = JSON.parse(JSON.stringify(this.formItem))
          // node['selected'] = true
          node['title'] = '新节点'
          node['parentId'] = treeNode.orgNo
          node['parentName'] = treeNode.title
          node['nodeKey'] = children.length + 1
          node['children'] = []
          children.push(node)
          this.$set(treeNode, 'selected', false)
          this.$set(treeNode, 'expand', true)
          this.$set(treeNode, 'children', children)

          /* 加载到表单 */
          let tmp = []
          tmp.push(node)
          this.selectNode(tmp)
          this.editForm.title = ''
          this.$set(node, 'selected', true)
        } else {
          this.$Message.warning({duration: 5, content: '请先选择一个节点'})
        }
      },

      // 删除本节点
      removeNode () {
        let vm = this
        if (vm.selectedNode.length > 0) {
          if (!vm.selectedNode[0].orgNo) {
            // vm.$Message.info('新增的节点未做保存！')
            let treeNode = vm.selectedNode[0]
            let parent = vm.selectParent
            parent.children.forEach((item, index) => {
              if (item.nodeKey === treeNode['nodeKey']) {
                parent.children.splice(index, 1)
              }
            })
            return false
          }
          if (vm.selectedNode[0].children.length !== 0) {
            vm.$Message.info('请先删除下级机构！')
            return false
          }

          vm.$Modal.confirm({
            title: '提示',
            content: '是否确定删除此机构？删除后不能恢复，请谨慎操作',
            onOk: () => {
              let id = {id: vm.selectedNode[0].id}
              vm.$net.send({
                server: vm.$services.backendService.organizationRestController.deleteorganization,
                data: id
              }).then( (data)=>{
                if (data.success) {
                  vm.$Message.success('删除成功！')
                  let treeNode = vm.selectedNode[0]
                  let parent = vm.selectParent
                  parent.children.forEach((item, index) => {
                    if (item.nodeKey === treeNode['nodeKey']) {
                      parent.children.splice(index, 1)
                    }
                  })
                  vm.editForm = { // 渲染页面及保存的数据
                    parentId: '',
                      parentName: '',
                      orgNo: '',
                      title: '',
                      descript: '',
                      ccbOrgCode: ''
                  }
                  vm.formItem = { // 用于新增节点的桥梁数据
                    parentId: '',
                      parentName: '',
                      orgNo: '',
                      title: '',
                      descript: '',
                      ccbOrgCode: ''
                  }
                  vm.selectedNode = [] // 记录当前点击的节点数据
                  vm.selectParent = {} // 记录当前节点的父节点数据
                  // vm.init()
                } else {
                  vm.$Message.error(data.message)
                }
              })
            }
          });

        } else {
          vm.$Message.warning({duration: 5, content: '请先选择一个节点'})
        }
      },

      // 上移及下移事件
      upOrDownNode (type) {
        let vm = this
        let treeNode = vm.selectedNode[0]
        let parent = vm.selectParent
        let len = parent.children.length
        if (type === 'up') {
          if (treeNode.nodeKey === parent.children[0].nodeKey) {
            vm.$Message.warning({duration: 5, content: '已经是第一个节点，不能上移！'})
            return false
          }
        } else {
          if (treeNode.nodeKey === parent.children[len - 1].nodeKey) {
            vm.$Message.warning({duration: 5, content: '已经是最后一个节点，不能下移！'})
            return false
          }
        }
        let params = {
          orgNo: vm.selectedNode[0].orgNo,
          moveType: type
        }
        if (vm.selectedNode.length > 0) {
          vm.$net.send({
            server: vm.$services.backendService.organizationRestController.upDownMove,
            data: params
          }).then( (data)=>{
            if (data.success) {
              let msg = type === 'up' ? '上移成功' : '下移成功！'
              vm.$Message.success(msg)

              // 前端的上移下移
              for (let i = 0; i < len; i ++) {
                if (parent.children[i].nodeKey === treeNode['nodeKey']) {
                  if (type === 'up') {
                    let temp = parent.children[i - 1]
                    parent.children.splice(i - 1, 1, parent.children[i])
                    parent.children.splice(i, 1, temp)
                    break
                  } else {
                    let temp = parent.children[i ]
                    parent.children.splice(i, 1, parent.children[i + 1])
                    parent.children.splice(i + 1, 1, temp)
                    break
                  }
                }
              }
              console.log('parent', parent)
              // vm.init()
            } else {
              vm.$Message.error(data.message)
            }
          })
        } else {
          vm.$Message.warning({duration: 5, content: '请先选择一个节点'})
        }
      },


      // 保存事件
      btnSave (name) {
        let vm = this
        vm.$refs[name].validate((valid) => { // 数据校验
          if (!valid) {
            return
          }
          let flag = false
          vm.selectParent.children.forEach(item => {
            if (item.title === vm.editForm.title && vm.editForm.orgNo !== item.orgNo) {
              vm.$Message.info('在同级机构中，该机构名称已存在，请重新输入！')
              flag = true
            }
          })
          if (flag) {
            return false
          }
          // console.log('ccbOrgCode', vm.editForm.ccbOrgCode)
          // console.log(vm.editForm)

          let server = vm.editForm.id ? this.$services.backendService.organizationRestController.updateorganization : this.$services.backendService.organizationRestController.addorganization
          vm.$net.send({
            server: server,
            data: vm.editForm
          }).then( (data)=>{
            if (data.success) {
              vm.$Message.success('保存成功！')

              // 保存后将id及编号赋值，已不是刷新整棵树
              if (data.data === 1) {
                let row = vm.$refs.organizationTree.getSelectedNodes()
                // console.log(data.data)
                row[0].title = vm.editForm.title
                row[0].descript = vm.editForm.descript
                row[0].ccbOrgCode = vm.editForm.ccbOrgCode
              } else {
                let res = data.data
                let row = vm.$refs.organizationTree.getSelectedNodes()
                // console.log(data.data)
                row[0].parentId = res.parentId
                row[0].id = res.id
                row[0].orgNo = res.orgNo
                row[0].title = res.title
                row[0].descript = res.descript
                row[0].ccbOrgCode = res.ccbOrgCode
                vm.editForm.parentId = res.parentId
                vm.editForm.id = res.id
                vm.editForm.orgNo = res.orgNo
                vm.editForm.title = res.title
                vm.editForm.descript = res.descript
                vm.editForm.ccbOrgCode = res.ccbOrgCode
              }

              // this.init()
            } else {
              vm.$Message.error(data.message)
            }
          })
        })
      },

      // 点击当前节点
      selectNode (row) {
        let vm = this
        // console.log('selectNode', row[0])
        if (row.length === 0) {
          vm.editForm = {
            id: '',
            parentId: '',
            parentName: '',
            orgNo: '',
            title: '',
            descript: '',
            ccbOrgCode: ''
          }
          vm.selectedNode = row
        } else {
          if (vm.selectedNode.length === 1 && (!vm.selectedNode[0].orgNo || vm.editForm.title !== vm.selectedNode[0].title || vm.editForm.descript !== vm.selectedNode[0].descript || vm.editForm.ccbOrgCode !== vm.selectedNode[0].ccbOrgCode) ) {
            vm.ifShowContextmenu = true
            vm.$Modal.confirm({
              content: '表单的信息将不会保存，确定离开吗？',
              onOk: () => {
                // 删除没有保存的新增节点
                let treeNode = vm.selectedNode[0]
                if (!treeNode.orgNo) {
                  let parent = vm.selectParent
                  parent.children.forEach((item, index) => {
                    if (item.nodeKey === treeNode['nodeKey']) {
                      parent.children.splice(index, 1)
                    }
                  })
                }
                vm.assignValue(row)
              },
              onCancel: () => {
                vm.$set(vm.selectedNode[0], 'selected', true)
                vm.$set(row[0], 'selected', false)
              }
            })
          } else {
            vm.assignValue(row)
          }

        }
      },

      assignValue (row) {
        let vm = this
        vm.selectedNode = row
        this.selectParent = this.getParentNode(row[0])
        // console.log('parent', this.selectParent)
        if (row[0] && this.selectParent)
        {
          row[0]['parentName'] = this.selectParent.title
        }
        let res = row[0]

        vm.editForm = {
          id: res.id,
          parentId: res.parentId,
          parentName: res.parentName,
          orgNo: res.orgNo,
          title: res.title,
          descript: res.descript,
          ccbOrgCode: res.ccbOrgCode
        }
      },

      // 获取父节点的名称
      getParentNode(node){
        if (node && node.parentId)
        {
          return this.getNode(this.treeData, node.parentId)
        }else{
          return null
        }
      },

      /* 根据编码遍历结点 */
      getNode (tree, id)
      {
        let Deep,T,F;
        for (F = tree.length; F;)
        {
          T = tree[--F];
          if (id === T.orgNo) return T;
          if (T.children)
          {
            Deep = this.getNode(T.children, id)
            if (Deep) return Deep
          }
        }
      },

      // 模糊查询
      vagueQuery () {
        let vm = this
        vm.treeData = vm.handleData(JSON.parse(JSON.stringify(vm.ysTreeData)))
        // console.log(vm.ysTreeData, vm.treeData)
      },

      // 返回数据
      handleData (node) {
        let handledNode = node
        for (let i = 0, flag = true, len = handledNode.length; i < len; flag ? i++ : i) {
          // 如果没有children时，直接判断是否包含关键字，如果没有则去除改字段
          if (handledNode[i].children && (handledNode[i].children.length === 0 || handledNode[i].children === null)) {
            if (handledNode[i].title.indexOf(this.organizationName) !== -1) {
              flag = true
            } else {
              handledNode.splice(i, 1)
              len = len -1
              flag = false
            }
          } else {
            // 如果父节点含有关键字，则直接返回所有子节点，不用再次遍历
            if (handledNode[i].title.indexOf(this.organizationName) !== -1) {
              handledNode[i].expand = true
              flag = true
              continue
            }
            // 如果含有children时，继续深入判断
            let handledNodeChildren = this.handleData(handledNode[i].children)
            handledNode[i].expand = true
            // 如果 children 被全部去除，则判断当前节点的title是否含有关键字
            if (handledNodeChildren.length === 0 && handledNode[i].title.indexOf(this.organizationName) === -1) {
              handledNode.splice(i, 1)
              len = len -1
              flag = false
            } else {
              flag = true
            }
          }
        }
        return handledNode
      },

      // 取消按钮的操作
      btnCancle () {
        let vm = this
        vm.$refs.editForm.resetFields()
        vm.editForm = {
          id: '',
          parentId: '',
          parentName: '',
          orgNo: '',
          title: '',
          descript: '',
          ccbOrgCode: ''
        }

        let treeNode = vm.selectedNode[0]
        if (!treeNode.orgNo) {
          let parent = vm.selectParent
          parent.children.forEach((item, index) => {
            if (item.nodeKey === treeNode['nodeKey']) {
              parent.children.splice(index, 1)
            }
          })
        }
        vm.selectedNode = []
      }
    }
  }
</script>

<style scoped>
    .layout.ivu-layout{
        background: #fff;
        padding: 10px;
    }
    .help-text{
        top: 100%;
        left: 0;
        line-height: 1;
        padding-top: 6px;
        color: #f30;
    }
    .hiddenContextmenu {
        display: none;
    }
</style>

