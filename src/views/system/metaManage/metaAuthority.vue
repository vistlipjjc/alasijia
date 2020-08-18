<template>
    <div>
        <Row :gutter="5">
            <Col :sm="24" :md="8" :lg="8">
            <Card>
                <p slot="title"><Icon type="stats-bars"></Icon> 角色信息</p>
                <Row>
                <j-table ref="metaRoleTable" auto-search pagination
                         height="373"
                         hidden-form
                         page-size-type="small"
                         :show-refresh="false"
                         :show-column="false"
                         :server="server.query"
                         :columns-list="columns"
                         :v-model="tableData"
                         @on-row-click="rowClick">
                </j-table>
                </Row>
            </Card>
            </Col>
            <Col :sm="24" :md="8" :lg="8">
            <Card>
                <p slot="title"><Icon type="stats-bars"></Icon> 授权元数据区域</p>
                <Row>
                    <Col span="24" >
                        <Button type="primary" @click="authDataModel = true" style="margin-left: 10px">设置</Button>
                    </Col>
                    <Col span="24">
                        <j-tree ref="metaTreeRef"
                                tree-height="401px"
                                :data="metaTree"
                                :query-server = "queryTree"
                                :defaultParams = "treeParam"
                                @on-select-node="selectNode">
                        </j-tree>
                    </Col>
                </Row>
                <Modal
                        v-model="authDataModel" title="设置权限" width="900px"  :mask-closable="false"
                        ok-text="确定" cancel-text="关闭"
                        @on-ok="saveTableAuth"
                        @on-cancel="cancel">
                    <div style="font-weight: bold; color: red;">请先设置区域权限，再设置表权限。区域权限将优于表权限，如设置表权限后再设置区域权限，表权限将有可能被覆盖。</div>
                    <Tabs value="tab1" @on-click="changeTab">
                        <TabPane label="区域权限设置" name="tab1">
                            <j-tree ref="authRegionTree"  multiple
                                    :data="authRegionTreeData"
                                    :query-server = "queryAuthRegionTree"
                                    @on-select-node="authSelectNode">
                            </j-tree>
                        </TabPane>
                        <TabPane label="表权限设置" name="tab2">
                            <Layout>
                                <Sider style="background-color: white">
                                    <j-tree ref="modalMetaTreeRef"
                                            :data="modalMetaTree"
                                            :query-server="modalQueryServer"
                                            @on-select-node="modalSelectNode">
                                    </j-tree>
                                </Sider>
                                <Content>
                                    <j-table ref="metaManageTable"  hidden-form
                                             :show-refresh="false"
                                             :show-column="false"
                                             :height="260"
                                             :server="modalTableQuery"
                                             :defaultParams="modalTableParams"
                                             :columns-list="modalTableColumn"
                                             v-model="modalTableData"
                                             @on-row-click="modalTableRowClick">
                                    </j-table>

                                </Content>
                            </Layout>
                        </TabPane>
                    </Tabs>
                </Modal>
            </Card>
            </Col>
            <Col :sm="24" :md="8" :lg="8">
            <Card>
                <p slot="title"><Icon type="stats-bars"></Icon> 授权数据</p>
                <Row>
                    <Button type="primary" @click="saveAuthorityBelongDAK" :disabled="dakSaveBtn">保存</Button>
                </Row>
                <Row style="min-height: 400px;">
                    <!--<j-table ref="metaAuthorityTable" pagination  hidden-form
                             :server="server.queryAuthority"
                             :show-refresh="false"
                             :show-column="false"
                             :defaultParams="tableParam"
                             :columns-list="authorityColumns"
                             :v-model="authorityTableData"
                             @on-select="authorityRowSelect"
                             @on-selection-change="authorityRowSelect"
                             @on-row-click="authorityRowClick">
                    </j-table>-->
                    <template>
                        <div>
                            <Table border ref="metaAuthorityTable" :columns="authorityColumns" :data="authorityTableData" style="margin-top: 10px"
                                   @on-select-cancel="authorityRowCancelSelect"
                                   @on-select="authorityRowSelect" ></Table>
                        </div>
                    </template>
                </Row>
            </Card>
            </Col>
        </Row>
    </div>
</template>

<script>
    export default {
        name: "metaAuthority",

        data(){
            return {

                //jtable 变量
                server:{
                    query: this.$services.sysService.roleRestController.query,
                    queryAuthority: this.$services.sysService.metaAuthorityRestController.permitTypes
                },

                tableData: [],
                columns: [
                    { type: 'index', align: 'center', width: 50 },
                    { title: '角色编码', align: 'center', key: 'roleCode'},
                    { title: '角色名称', align: 'center', key: 'roleName' },
                    ],

                selectedRow: {},

                roleCode: '',

                //jtree变量
                queryTree: this.$services.sysService.metaRegionRestController.getRegionTreeByRoleCode,
                treeParam: {},  //默认查询参数
                metaTree: [],
                treeNode: [], //树节点的数据
                tableId: '',

                //模态框变量
                authDataModel: false,

                //模态框中的区域权限设置树 变量
                authRegionTreeData: [],
                queryAuthRegionTree: this.$services.sysService.metaRegionRestController.treeNode, //请求路径
              //  authRegionTreeParam: {},  //初始化查询参数
                authRegionTreeNode: [], //区域权限树的数据

                checkNodes:[],    //tree选中框的数组
                regionTreeTableId: '',  //tree 选中框中的tableId

                //模态框中的第二个tab页面的tree变量
                modalMetaTree: [],    //树的数据
                modalTableNode: [],
                modalQueryServer: null,

                //模态框中的第二个tab页面的table变量
                modalTableQuery: this.$services.sysService.metaRegionTableRestController.queryBusinessMetaTabe,
                modalTableParams: {}, //模态框中的table初始化查询参数
                modalTableColumn:[
                    { type: 'selection', align: 'center', width: 60 },
                    { title: '表模式', align: 'center', key: 'schema' },
                    { title: '表名', align: 'center', key: 'tableCode' },
                    { title: '表中文名', align: 'center', key: 'tableName' },
                    { title: '对象类型', align: 'center', key: 'objectType' ,formatter: 'fixedDict:MetaTableObjectType@system'},
                ],
                modalTableData: [],

                tabName:'tab1',

                //jtable  变量
                authorityTableData: [],
                authorityColumns: [
                    {  type: 'selection', align: 'center', width: 60 },
                    { title: '数据权限代码', align: 'center', key: 'value' },
                    { title: '数据权限名称', align: 'center', key: 'name'},
                ],
                tableParam: {},  //查询table的默认参数
                dakSaveBtn: true, //权限表的保存按钮状态

                saveParam: {}, //需要保存的数据对象

                dakChange: 0,

                authDak: ''


            }
        },

        mounted(){
            this.init();
        },

        methods: {
            init(){
            },

            //左边table的行点击
            rowClick(row){
                this.roleCode = row.roleCode;
                this.selectedRow = row;
                this.treeParam = {
                    roleCode : row.roleCode
                };
                this.saveParam = {};
                /*清空数据授权功能*/
                this.selectNode([]);
            },

            //点击树节点时的操作
            selectNode(treeNode){
                if (treeNode.length == 0)  //取消选择节点，清空设置
                {
                    this.treeNode = {};
                    this.tableId = '';
                    this.tableParam = {
                        roleCode: this.selectedRow.roleCode,
                        tableId: '',
                        type: '',
                    };
                    this.dakSaveBtn = true;
                    this.authorityTableData = [];
                    this.authDak = '';
                }
                else  //选择某一个节点时
                {
                    this.treeNode = treeNode[0];
                    this.tableId = this.treeNode.id;
                    this.tableParam = {
                        roleCode: this.selectedRow.roleCode,
                        tableId: this.tableId,
                        type: this.treeNode.type,
                    };

                   if(this.treeNode.type == 'M'){
                       this.dakSaveBtn = true;
                       this.authorityTableData = [];
                       this.authDak='';
                   }
                   else{
                       this.dakSaveBtn = false;
                       /*先把数据授权数据请求回来*/
                       this.$net.send({
                           server: this.server.queryAuthority,
                           data: this.tableParam
                       }).then(
                           (data) =>{
                               this.authorityTableData = data.rows;
                               data.rows.forEach((v, i) =>{
                                   if(v._checked){
                                       this.authDak = v.value;
                                       return;
                                   }
                               });
                           }
                       ).then(() => this.disableAuthoritySelectAll());
                   }
                }
            },

            //右边table保存权限
            saveAuthorityBelongDAK(){
                if(this.treeNode.id){
                    this.saveParam = {
                        idStr: this.authDak,
                        roleCode: this.roleCode,
                        tableId: this.tableId
                    }
                    this.$net.send({
                        server: this.$services.sysService.metaAuthorityRestController.saveAuthorityBelongDAK,
                        data:this.saveParam
                    }).then((data) => {
                        if (data.success) {
                            this.$Message.success(data.msg);
                        } else {
                            this.$Message.error(data.msg);
                        }
                    });
                }
                else {
                    this.$Message.info('请选择要授权的表。');
                }
            },

            /**
             ************************************模态框方法 **************************************
             ************************************          **************************************
             */

            //模态框保存配置权限
            saveTableAuth(){
                if(this.tabName == 'tab1'){
                    let idStr = ''
                    this.checkNodes = this.$refs.authRegionTree.getCheckedNodes();
                    for(let i = 0; i<this.checkNodes.length; i++){
                        idStr += this.checkNodes[i].id + ','
                    }
                    idStr = idStr.substring(0,idStr.length-1);
                    this.$net.send({
                        server: this.$services.sysService.metaAuthorityRestController.saveRegionAuth,
                        data:{
                            roleCode: this.roleCode,
                            idStr: idStr
                        },
                    }).then((data) => {
                        if (data.success) {
                            this.$Message.success(data.msg);
                            this.$refs.metaTreeRef.refresh();
                            this.$refs.metaAuthorityTable.refresh();
                            this.$refs.authRegionTree.refresh();
                            this.$refs.metaManageTable.refresh();
                        } else {
                            this.$Message.error(data.msg);
                        }
                    });
                }else {
                    let idStr = ''
                    this.checkNodes = this.$refs.metaManageTable.getSelections();
                    for(let i = 0; i<this.checkNodes.length; i++){
                        idStr += this.checkNodes[i].regionTableId + ','
                    }

                    if(idStr.length > 0 ){
                        idStr = idStr.substring(0,idStr.length-1);
                    }
                    console.info(idStr);
                    this.$net.send({
                        server: this.$services.sysService.metaAuthorityRestController.saveTableAuth,
                        data:{
                            roleCode: this.roleCode,
                            regionTableIds: idStr,
                            regionId: this.modalTableNode.id
                        },
                    }).then((data) => {
                        if (data.success) {
                            this.$Message.success(data.msg);
                            this.$refs.metaTreeRef.refresh();
                            this.$refs.metaAuthorityTable.refresh();
                            this.$refs.authRegionTree.refresh();
                            this.$refs.metaManageTable.refresh();
                        } else {
                            this.$Message.error(data.msg);
                        }
                    });
                }


            },

            //模态框中第一个tab页面区域表权限设置树selectNode方法
            authSelectNode(){

            },

            //模态框中第二个tab页面的数据权限树的点击节点的方法
            modalSelectNode(treeNode){
                this.modalTableNode=treeNode[0],
                this.modalTableParams={ __EQS_regionId: treeNode[0].regionId, roleCode: this.roleCode,}
            },

            //模态框你中第二个tab页面table点击行事件
            modalTableRowClick(){

            },

            changeTab(name){
                this.tabName = name;
                if (name == 'tab2' && this.modalMetaTree.length == 0){
                    this.modalQueryServer = this.$services.sysService.metaRegionRestController.treeNode;
                }
            },

            //取消
            cancel(){

            },
            authorityRowSelect(selection){
                let dak = '';
                selection.forEach((v, i) =>{
                    if(!v._checked){
                        dak = v;
                        this.authDak = v.value;
                        return;
                    }
                });
                this.authorityTableData.forEach((v, i) =>{
                    if(v.value == dak.value){
                        this.$delete(this.authorityTableData[i], '_checked');
                        this.$set(this.authorityTableData[i], '_checked', true);
                    }
                    else {
                        this.$delete(this.authorityTableData[i], '_checked');
                        this.$set(this.authorityTableData[i], '_checked', false);
                    }
                });
            },
            disableAuthoritySelectAll(){
                let checkBoxWrapper = $(this.$refs.metaAuthorityTable.$el).find('.ivu-table-header').find('.ivu-checkbox-wrapper')[0];
                let checkBox = $(this.$refs.metaAuthorityTable.$el).find('.ivu-table-header').find('.ivu-checkbox')[0];
                let checkBoxInput = $(this.$refs.metaAuthorityTable.$el).find('.ivu-table-header').find('.ivu-checkbox-input')[0];

                if(!$(checkBoxWrapper).hasClass('ivu-checkbox-wrapper-disabled')){
                    $(checkBoxWrapper).addClass('ivu-checkbox-wrapper-disabled');
                }

                if(!$(checkBox).hasClass('ivu-checkbox-disabled')){
                    $(checkBox).addClass('ivu-checkbox-disabled');
                }

                if(!($(checkBoxInput).attr('disabled') == 'disabled')){
                    $(checkBoxInput).attr('disabled', 'disabled');
                }
            },

            //取消选中授权
            authorityRowCancelSelect(){
                this.authDak = '';
            }
        },
    }
</script>

<style scoped>

</style>