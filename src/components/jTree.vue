<template xmlns:v-contextmenu="http://www.w3.org/1999/xhtml">
    <div :style="{height: treeHeight}" style="overflow: auto;">
        <div v-if="editable">
            <v-contextmenu ref="contextmenu" class="propMenu"  :class="ifShowContextmenu ? 'hiddenContextmenu': ''">
                <v-contextmenu-item @click="newLevel" v-if="showNewLevel">增加同级</v-contextmenu-item>
                <v-contextmenu-item @click="newNextLevel" v-if="showNewNextLevel">增加下级</v-contextmenu-item>
                <v-contextmenu-item @click="removeNode" v-if="showRemoveNode">移除</v-contextmenu-item>
            </v-contextmenu>
            <div v-contextmenu:contextmenu>
                <Tree ref="tree"
                      :data="treeData"
                      :render="renderContent"
                      :load-data="loadData"
                      @on-toggle-expand="toggleExpand"
                      @on-select-change="selectNode">
                </Tree>
            </div>
        </div>
        <div v-else>
            <Tree ref="tree"
                :show-checkbox="multiple"
                :data="treeData"
                :render="renderContent"
                :load-data="loadData"
                @on-toggle-expand="toggleExpand"
                @on-select-change="selectNode">
            </Tree>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'jTree',
        props: {
            data: Array, //树数据
            queryServer: Object, //服务
            defaultParams: Object, // 默认查询参数
            append: { //追加数据项
                type: [String, Array]
            },
            removeServer: Object, //移除节点服务
            editable: {
                type: Boolean,
                default: false
            }, //是否可编辑
            showNewLevel: {
                type: Boolean,
                default: true
            }, //显示新增同级按钮
            showNewNextLevel: {
                type: Boolean,
                default: true
            }, //显示新增下级按钮
            showRemoveNode: {
                type: Boolean,
                default: true
            }, //显示删除按钮
            removeThisNode: {type: Function, default : null}, //删除节点
            formItem: Object, //关联表单的表单对象,
            multiple: {
                type: Boolean,
                default: false
            }, //是否多选
            treeHeight: {
                type: [String, Number],
                default: '100%'
            },
            expendKey: { //展开节点传参的key名称
                type: String,
                default: 'parentId'
            }
        },
        data () {
            return{
                treeData: this.data,
                selectedNode: [],
                ifShowContextmenu: false
            }
        },
        mounted () {
            this.init();
        },
        methods: {
            init(){
                /*节点属性：
                * title: 节点名称（必须）
                * children 子节点属性数组。
                * loading: 异步加载标志，箭头符号显示标志。true 箭头加载中转圈标志，false 箭头加载完成标志
                * expand、selected、checked 和 disabled：都为true时含义，展开、选中节点、选中节点的checkbox 禁用节点checkbox。
                * multiple：针对select而言，是否支持多选。
                * */

                /*加载数据*/
                if(this.queryServer){
                    let params = Object.assign({}, this.defaultParams || {});
                    this.$net.send({
                        server: this.queryServer,
                        data: {...params},
                        append: this.append
                    }).then( (data)=>{
                        data.forEach((item,index) => {
                            item.checked = false;
                            item.selected = false;
                            item.expand = false;
                            if (index === 0){
                                // 设置默认选中第一个节点，并触发点击事件
                                item.selected = true;
                                let node = [];
                                node.push(item);
                                this.selectNode(node);

                                // 默认展开第一个节点，触发展开事件
                                item.expand = true;
                                this.loadData(item, (data)=>{
                                    return item.children = data;
                                });
                            }
                        });
                        // 数据为空时，添加一个虚拟节点
                        if (data === '[]' || data.length === 0)
                        {
                            let node = {};
                            if (this.formItem !== undefined) node = JSON.parse(JSON.stringify(this.formItem));
                            node['id'] = '-1';
                            node['title'] = '虚拟节点';
                            node['pid'] = null;
                            node['selected'] = true;
                            node['isParent'] = false;
                            data.push(node);
                        }
                        this.treeData = data;
                    });
                }
            },

            /* 加载数据 */
            loadData (item, callback) {
                let param = Object.assign({}, this.defaultParams || {});
                param[this.expendKey] = item.id;

                this.$net.send({
                    server: this.queryServer,
                    data: param
                }).then( (data)=>{
                    if (data === '[]' || data.length === 0){
                        delete item.loading;
                        // delete item.children;
                        let treeData = [ ...this.treeData ]
                        this.treeData = []
                        this.$nextTick(() => {
                          this.treeData = [ ...treeData ]
                          this.$emit('on-lazy-expand', data);
                        })
                    }else{
                        data.forEach(item => {
                            item.checked = false;
                            item.selected = false;
                            item.expand = false;
                        });
                        this.$emit('on-lazy-expand', data);
                        callback(data);
                    }
                });
            },
            toggleExpand(currentNode){
                this.$emit('on-toggle-expand', currentNode);
            },

          // 给树加上鼠标右击选中事件
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
                  this.$refs.tree.handleSelect(node.nodeKey); // 手动选择树节点
                },

                //右键点击事件
                contextmenu: (e) => {
                  e.preventDefault()
                  this.ifShowContextmenu = false
                  if (!node.node.selected) {
                    this.$refs.tree.handleSelect(node.nodeKey) // 手动选择树节点
                    // console.log('renderContent', root, node, data)
                  }
                },
              }
            }, [
              h('span', data.title)
            ])
          },

          // 修改是否显示右边菜单的值
          changeShowContextmenu (){
            this.ifShowContextmenu = true
          },

            /* 选中树节点 */
            selectNode(node){
                let parent = this.getParentNode(node[0]);
                if (node[0] && parent)
                {
                    node[0]['parentId'] = parent.id;
                    node[0]['parentName'] = parent.title;
                }
                //取消选中时，取消表单映射
                else if (node.length === 0){
                    node[0] = JSON.parse(JSON.stringify(this.formItem));
                    if (this.formItem === undefined) {
                        let obj = {
                            parentId: '',
                            parentName: ''
                        };
                        node[0] = obj;
                    }
                }
                // console.log('selectNode', node)
                this.$emit('on-select-node', node, parent);
                this.selectedNode = node;
            },

            /* 增加同级 */
            newLevel() {
                if (this.selectedNode.length == 0)
                {
                    this.$Message.warning({duration: 5, content: '请选择一个节点'});
                }
                else
                {
                    /* 取消之前选中节点 */
                    let treeNode = this.selectedNode[0];
                    this.$set(treeNode, 'selected', false);

                    /* 新建节点 */
                    let node = JSON.parse(JSON.stringify(this.formItem));
                    node['id'] = '-1';
                    node['title'] = '新节点';
                    node['pid'] = treeNode.pid;
                    // node['selected'] = true;
                    node['isParent'] = false;
                    node['children'] = []

                    /* 判断是否存在父节点 */
                    let parent = this.getParentNode(treeNode);
                    if (parent)
                    {
                        node['nodeKey'] = parent.children.length + 1;
                        node['parentId'] = parent.id;
                        node['parentName'] = parent.title;
                        node['children'] = []
                        parent.children.push(node);
                    }
                    else
                    {
                        node['nodeKey'] = this.treeData.length + 1;
                        node['parentId'] = treeNode.pid;
                        node['children'] = []
                        this.treeData.push(node);
                    }

                    /* 加载到表单 */
                    let tmp = [];
                    tmp.push(node);
                    this.selectNode(tmp);
                    this.$set(node, 'selected', true)
                }
                this.$emit('on-new-level')
            },

            /* 增加下级 */
            newNextLevel() {
              let vm = this

              if (vm.selectedNode.length == 0) {
                vm.$Message.warning({duration: 5, content: '请选择一个节点'});
              } else {
                let treeNode = vm.selectedNode[0];

                if (treeNode.id === '-1') {
                  vm.$Message.warning({duration: 5, content: '请先保存节点，再为该节点添加下级节点'})
                  return false
                }

                const children = treeNode.children || [];

                //懒加载节点数据
                if (children.length == 0) {
                  vm.$net.send({
                      server: vm.queryServer,
                      data: {parentId: treeNode.id}
                  }).then( (data)=>{
                    children.push(...data);

                    /* 新建节点 */
                    let node = JSON.parse(JSON.stringify(vm.formItem));
                    node['id'] = '-1';
                    node['title'] = '新节点';
                    node['pid'] = treeNode.id;
                    // node['selected'] = true;
                    node['isParent'] = false;
                    node['nodeKey'] = children.length + 1;
                    node['parentId'] = treeNode.id;
                    node['parentName'] = treeNode.title;
                    node['children'] = []
                    children.push(node);

                    treeNode['selected'] = false;
                    treeNode['expand'] = true;
                    treeNode['isParent'] = true;
                    treeNode.children = children;

                    /* 加载到表单 */
                    let tmp = [];
                    tmp.push(node);
                    vm.selectNode(tmp);
                    this.$set(node, 'selected', true)
                  });
                } else {
                  /* 新建节点 */
                  let node = JSON.parse(JSON.stringify(vm.formItem));
                  node['id'] = '-1';
                  node['title'] = '新节点';
                  node['pid'] = treeNode.id;
                  // node['selected'] = true;
                  node['isParent'] = false;
                  node['nodeKey'] = children.length + 1;
                  node['parentId'] = treeNode.id;
                  node['parentName'] = treeNode.title;
                  node['children'] = []
                  children.push(node);

                  vm.$set(treeNode, 'selected', false);
                  vm.$set(treeNode, 'expand', true);
                  vm.$set(treeNode, 'children', children);

                  /* 加载到表单 */
                  let tmp = [];
                  tmp.push(node);
                  vm.selectNode(tmp);
                  this.$set(node, 'selected', true)
                }
              }
              vm.$emit('on-new-nextLevel')
            },

            /* 移除 */
            removeNode() {
                if (this.selectedNode.length == 0)
                {
                    this.$Message.warning({duration: 5, content: '请选择一个节点'});
                }
                else
                {
                    //当设置了该方法的话，就直接调用该方法
                   if(typeof this.removeThisNode === "function"){
                       this.removeThisNode(this.selectedNode[0], this.getParentNode(this.selectedNode[0]));
                   }
                   else{
                     this.$Modal.confirm({
                       title: '提示',
                       content: '是否确定删除此机构？删除后不能恢复，请谨慎操作',
                       onOk: () => {
                         this.$net.send({
                           server: this.removeServer,
                           append: this.selectedNode[0].id
                         }).then( (data)=>{
                           if (data.success) {
                             this.$Message.success({duration: 5, content: data.msg});
                             this.$emit('on-remove-node')
                             let node = this.selectedNode[0];
                             let parent = this.getParentNode(node);
                             if (parent) {
                               const index = parent.children.indexOf(node);
                               parent.children.splice(index, 1);
                             } else {
                               this.treeData.splice(node.nodeKey, 1);
                             }
                           } else {
                             this.$Message.error({duration: 5, content: data.msg});
                           }
                         });
                       }
                     });

                    }
                }

            },

            /* 获取节点的父节点 */
            getParentNode(node){
                if (node && node.pid)
                {
                    return this.getNode(this.treeData, node.pid);
                }else{
                    return null;
                }
            },
            /* 刷新树 */
            refresh(){
                this.init();
            },
            /* 根据编码遍历结点 */
            getNode (tree, id)
            {
                let Deep,T,F;
                for (F = tree.length; F;)
                {
                    T = tree[--F];
                    if (id === T.id) return T;
                    if (T.children)
                    {
                        Deep = this.getNode(T.children, id);
                        if (Deep) return Deep
                    }
                }
            },
            getCheckedNodes(){
                return this.$refs.tree.getCheckedNodes();
            },
            getSelectedNodes(){
                return this.$refs.tree.getSelectedNodes();
            },
            getTree(){
                return this.treeData;
            },
            clearSelection(){
                this.selectedNode = [];
            }
        },
        watch: {
            data(val){
                this.treeData = val || [];
            },
            defaultParams(){
                this.init();
            },
            queryServer(){
                this.init();
            }
        }
    }
</script>

<style>
    .propMenu{
        font-size: 12px;
        color: #495060;
    }
    .hiddenContextmenu {
        display: none;
    }
</style>
