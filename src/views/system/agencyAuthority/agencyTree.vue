<template>
    <div>
    <Layout class="layout">
        <Sider >
            <j-tree ref="unitTreeRef" :data="unitData" editable
                    :formItem="formItem"
                    :query-server="load"
                    :remove-server="remove"
                    @on-select-node="clickNode"
                    @on-new-level="newNode"
                    @on-new-nextLevel="newNode"
                    @on-remove-node="removeNode">
            </j-tree>
        </Sider>
        <Content>
            <Card style="margin-left: 5%">
                <Row>
                <Form ref="editForm" :model="editForm" :rules="editRules" :label-width="180">
                    <Col span="11">
                        <FormItem label="上级机构名称" prop="parentName">
                            <Input v-model="editForm.parentName" disabled/>
                        </FormItem>
                    </Col>
                    <Col span="11">
                        <FormItem label="上级机构编码" prop="parentId">
                            <Input v-model="editForm.parentId" disabled/>
                        </FormItem>
                    </Col>
                    <Col span="11">
                        <FormItem label="机构名称" prop="unitName" required>
                            <Input v-model="editForm.unitName"></Input>
                        </FormItem>
                    </Col>
                    <Col span="11">
                        <FormItem label="机构编码" prop="unitCode" required>
                            <Input v-model="editForm.unitCode" :disabled="isUpdate"></Input>
                        </FormItem>
                    </Col>
                    <!-- <Col span="11">
                        <FormItem label="机构层级" prop="hierarchy">
                            <j-select v-model="editForm.hierarchy" url="fixedDict:UnitHierarchy@system"
                                      @on-change="selectChange($event, 'hierarchy')">
                            </j-select>
                        </FormItem>
                    </Col>
                   <Col span="11">
                        <FormItem label="机构类型" prop="kind">
                            <j-select v-model="editForm.kind" url="fixedDict:UnitKind@system"
                                      @on-change="selectChange($event, 'kind')">
                            </j-select>
                        </FormItem>
                    </Col>
                    <Col span="11">
                        <FormItem label="状态" prop="status">
                            <j-select v-model="editForm.status" url="fixedDict:UnitStatus@system"
                                      @on-change="selectChange($event, 'status')">
                            </j-select>
                        </FormItem>
                    </Col>
                    <Col span="11">
                        <FormItem label="是否为业务部门" prop="isBizDept">
                            <j-radio v-model="editForm.isBizDept" url="fixedDict:YesNo@system"
                                     @on-change="selectChange($event, 'isBizDept')">
                            </j-radio>
                        </FormItem>
                    </Col> -->
                    <Col span="22">
                        <FormItem label="选择业务种类" prop="bizTypeName" style="display: none">
                            <Col span="24" @click.native="bizTypeModal = true" style="display: inline-block">
                                <Input v-model="editForm.bizTypeName">
                                <Button slot="append" icon="ios-search"></Button>
                                </Input>
                            </Col>
                        </FormItem>
                    </Col>
                    <Col span="22">
                        <FormItem label="路径名称" prop="pathName"  style="display: none">
                            <Input v-model="editForm.pathName" disabled></Input>
                        </FormItem>
                    </Col>
                    <Col span="22">
                        <FormItem label="机构描述" prop="unitDesc">
                            <Input v-model="editForm.unitDesc" type="textarea"></Input>
                        </FormItem>
                    </Col>
                    <Col span="22">
                        <div align="center">
                            <Button @click="btnSave('editForm')" type="primary" style="margin:0 11px; height: 40px; width: 100px;">保存</Button>
                            <Button v-if="editForm.id === '-1'" @click="btnCancle" type="ghost" style="margin:0 11px; height: 40px; width: 100px;">取消</Button>
                        </div>
                    </Col>
                </Form>
                </Row>
            </Card>
        </Content>
    </Layout>
    <Modal v-model="bizTypeModal"
           title="选择业务种类"
           @on-ok="ok"
           @on-cancel="cancel">
        <Tree :data="dataTrees"
              :showCheckbox="true"
              @on-check-change="clickBizTypeNode"
        ></Tree>
    </Modal>
    </div>
</template>

<script>
  export default {
    name: "agencyTree",
    data () {
      return {
        load: this.$services.sysService.unitRestController.treeNode,
        remove: this.$services.sysService.unitRestController.removeNode,
        unitData: [],
        formItem: {
          parentId: '',
          parentName: '',
          unitCode: '',
          unitName: '',
          hierarchy: '',
          kind: '',
          status: 'APPLY',
          isBizDept: '',
          bizTypeCode: '',
          bizTypeName: '',
          pathName: '',
          unitDesc: ''
        },
        dataTrees: [],
        bizTypeModal: false, //业务种类
        isUpdate: false, // 是否是编辑
        editForm: {
          hierarchy: '30',
          kind: 'DEPT',
          status: 'OPEN',
          isBizDept: 'N',
          tempBizTypeCode: '',
          tempBizTypeName: '',
        },
        selectedNode: {}, // 记录当前选中的节点，以判断是否有修改过内容
        selectParent: {}, // 记录当前节点的父节点
        editRules: {
          unitCode: [
            { required: true, message: '必填项', trigger: 'blur'},
            /*{ validator: (rule, value, callback) => {
                    if(!this.opt){
                        this.$net.send({
                            server: this.$services.sysService.unitRestController.check,
                            data: {code: value}
                        }).then((data) => {
                            if (!data.valid) {
                                callback(new Error('编码已存在，请重新输入。'));
                            }else{
                                callback();
                            }
                        });
                    }else{
                        callback();
                    }
                }
            }*/
          ],
          unitName: [
            {required: true, message: '必填项', trigger: 'blur'}
          ],
          // hierarchy: [
          //     {required: true, message: '必填项', trigger: 'blur'}
          // ],
          // kind: [
          //     {required: true, message: '必填项', trigger: 'blur'}
          // ],
          // status: [
          //     {required: true, message: '必填项', trigger: 'blur'}
          // ]
        }
      }
    },

    beforeRouteLeave (to, from, next) {
      let vm = this
      if (vm.selectedNode.id === '-1' || vm.editForm.unitName !== vm.selectedNode.unitName || vm.editForm.unitCode !== vm.selectedNode.unitCode || vm.editForm.unitDesc !== vm.selectedNode.unitDesc)  {
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

    mounted (){
      this.init()
    },

    methods:{
      // 请求机构树的数据
      init(){
        this.$net.send({
          server: this.$services.sysService.bizTypeRestController.load
        }).then(
          (data) => {
            console.log(data)
            this.dataTrees = data;
          });
      },

      selectChange(value, name){
        this.editForm[name] = value;
      },

      // 点击树节点后事件
      clickNode(data, parent){
        let vm = this

        // 取消选择节点，将表单设为默认值
        if (!data[0].unitCode && !data[0].parentId) {
          vm.editForm.id = ''
          vm.editForm.parentId = ''
          vm.editForm.parentName = ''
          vm.editForm.unitCode = ''
          vm.editForm.unitName = ''
          vm.editForm.unitDesc = ''
          // vm.editForm = JSON.parse(JSON.stringify(vm.formItem));
          vm.selectedNode = {
            id: '',
            parentId: '',
            parentName: '',
            unitCode: '',
            unitName: '',
            unitDesc: ''
          }
          vm.selectParent = parent
          // 选择某一个节点时，将节点数据加载到表单
        } else {
          // 判断是否有修改内容
          if ( vm.selectedNode.id === '-1' || vm.editForm.unitName !== vm.selectedNode.unitName || vm.editForm.unitCode !== vm.selectedNode.unitCode || vm.editForm.unitDesc !== vm.selectedNode.unitDesc)  {
            vm.$refs.unitTreeRef.changeShowContextmenu()
            let message = vm.selectedNode.id === '-1' ? '请先保存新增机构，否则新增机构信息将不会保存，确定不保存吗？' : '表单的信息将不会保存，确定离开吗？'
            vm.$Modal.confirm({
              content: message,
              onOk: () => {
                // 有父节点的新增节点，直接删除父节点的children
                if (vm.selectedNode.id === '-1') {
                  if (vm.selectParent) {
                    vm.selectParent.children.forEach((item, index) => {
                      if (item.id === vm.selectedNode['id']) {
                        vm.selectParent.children.splice(index, 1)
                      }
                    })
                  } else {
                    // 删除树的第一层的新增节点
                    let treeData = vm.$refs.unitTreeRef.getTree()
                    treeData.splice(treeData.length - 1, 1)
                  }
                }
                vm.editForm = JSON.parse(JSON.stringify(data[0]));
                vm.selectedNode = data[0];
                vm.selectParent = parent
              },
              onCancel: () => {
                vm.$set(vm.selectedNode, 'selected', true)
                vm.$set(data[0], 'selected', false)
              }
            })
          } else {
            vm.editForm = JSON.parse(JSON.stringify(data[0]));
            vm.selectedNode = data[0];
            vm.selectParent = parent
          }

        }
        // id为-1为未保存的新节点，可修改机构编码，否则不可修改机构编码
        if (data[0].id === '-1') {
          vm.isUpdate = false
        } else {
          vm.isUpdate = true
        }

        // 加这一判断和必填校验，是为了解决，在新增节点并且输入框获取节点后，又点击其他节点，这是输入框出现必填校验的问题
        if (vm.editForm.unitCode && vm.editForm.unitName) {
          vm.$nextTick(() => {
            vm.$refs.editForm.validate()
          })
        }
      },

      // 确定选择业务
      ok () {
        this.editForm.bizTypeCode = this.editForm.tempBizTypeCode;
        this.editForm.bizTypeName = this.editForm.tempBizTypeName;
        // console.log(this.editForm)
        this.$Message.info({content: '选择成功！'});
      },

      // 取消选择业务
      cancel () {
        this.$Message.info({content: '取消选择！'});
      },

      // 选中业务
      clickBizTypeNode(node) {
        // console.log(node)
        this.editForm.tempBizTypeCode = '';
        this.editForm.tempBizTypeName = '';
        for (let i = 0; i < node.length; i++){
          this.editForm.tempBizTypeCode += node[i].id;
          this.editForm.tempBizTypeName += node[i].title;
          if (i != node.length-1){
            this.editForm.tempBizTypeCode += ',';
            this.editForm.tempBizTypeName += ',';
          }
        }
      },

      // 用户机构保存事件
      btnSave (name) {
        this.$refs[name].validate((valid) => { // 数据校验
          if (!valid) return;

          this.$net.send({
            server: this.$services.sysService.unitRestController.updateNode,
            data: this.editForm
          }).then(
            (data)=>{
              if (data.success) {
                this.$Message.success(data.msg);
                let row = this.$refs.unitTreeRef.getSelectedNodes()
                let id = data.id
                this.selectedNode.id = id
                this.selectedNode.title = this.editForm.unitName
                this.selectedNode.unitCode = this.editForm.unitCode
                this.selectedNode.unitName = this.editForm.unitName
                this.selectedNode.unitDesc = this.editForm.unitDesc
                row.splice(0, 1, this.selectedNode)

                // 保证新增的节点保存后，能赋值给树并且能展示出来
                if (!this.selectedNode.pathCode) {
                  row[0].selected = false
                  this.$nextTick(()=>{
                    this.$set(row[0], 'selected', true)
                  })
                }
              } else {
                this.$Message.error(data.msg);
              }
            }
          );
        })
      },

      // 删除
      removeNode () {
        this.editForm = {
          hierarchy: '30',
          kind: 'DEPT',
          status: 'OPEN',
          isBizDept: 'N',
          tempBizTypeCode: '',
          tempBizTypeName: '',
          unitCode: '',
          unitName:'',
          unitDesc: '',
          id: ''
        }
        this.selectedNode = {
          unitCode: '',
          unitName:'',
          unitDesc: '',
          id: ''
        } // 记录当前选中的节点，以判断是否有修改过内容
        this.selectParent = {} // 记录当前节点的父节点
      },

      // 点击增加同级、增加下级，机构编码输入框可输入
      newNode () {
        setTimeout(() => {
          this.isUpdate = false
        }, 500)
      },

      // 新增节点时取消新增的内容
      btnCancle () {
        let vm = this
        vm.editForm.unitCode = ''
        vm.editForm.unitName = ''
        vm.editForm.unitDesc = ''
        vm.editForm.id = ''
        if (vm.selectParent) {
          vm.selectParent.children.forEach((item, index) => {
            if (item.id === vm.selectedNode['id']) {
              vm.selectParent.children.splice(index, 1)
            }
          })
        } else {
          // 删除树的第一层的新增节点
          let treeData = this.$refs.unitTreeRef.getTree()
          treeData.splice(treeData.length - 1, 1)
        }
        vm.selectParent = {}
        vm.selectedNode = {
          unitCode: '',
          unitName:'',
          unitDesc: '',
          id: ''
        }
      }
    }
  }
</script>

<style scoped>
    .layout{
        background-color: #fff;
        padding: 10px;
    }
    .ivu-layout-sider{
        background-color: #fff;
    }
</style>