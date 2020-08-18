<template>
    <div>
        <Card>
            <j-table ref="procInstDraftListTable" pagination autoSearch
                     :queryForm="queryForm"
                     :server="server.query"
                     :columns-list="columns" v-model="tableData"
                     :input-col="8" :label-width="90"
                     @on-row-click="onSelect">
                <template slot="input-col">
                    <Col span="15">
                        <FormItem label="业务流程名称" prop="__LIKES_code">
                            <Input v-model="queryForm.__LIKES_procName"></Input>
                        </FormItem>
                        <FormItem label="模块名称" prop="__LIKES_moduleName">
                            <Input v-model="queryForm.__LIKES_moduleName"></Input>
                        </FormItem>
                    </Col>
                </template>
                <template slot="toolbar">
                        <Button type="primary" @click="editBizHandler">编辑</Button>
                        <Button @click="viewBizHandler" type="primary">查看</Button>
                        <Button ref="submitInstHandler" type="primary" @click="submitInstHandler">提交</Button>
                        <Button  @click="delBizHandler" type="primary">删除</Button>
                </template>
            </j-table>
        </Card>
        <Modal
                v-model="roleModal"
                title="请选择岗位"
                @on-ok="roleOk"
                @on-cancel="roleCancel">
            <Table border :columns="roleColumns" :data="roleData" @on-selection-change='selectionRoleClick' @on-select='selectionRoleClick'></Table>
        </Modal>
        <Modal v-model="userModal" title="选择用户" @on-ok="userOk" @on-cancel="userCancel" :mask-closable="false" width="700" :transfer="true">
            <Row style="height: 300px;">
                <Col span="6">
                <Tree :data="treeNode" @on-select-change="getNode" style="height: 300px; overflow: auto;"></Tree>
                </Col>
                <Col span="17" offset="1">
                <Table ref="multipleTable" border
                       @on-select-all="selectionUserClick" @on-selection-change="selectionUserClick"
                       :columns="columnsMultiPle" :data="staffData" height="280" size="small"></Table>
                </Col>
            </Row>
        </Modal>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                server: {
                    query: this.$services.wfService.processRestController.queryData
                },
                editForm: {
                    procName: '',
                    moduleName: '',
                },
                queryForm: {
                    __LIKES_procName: '',
                    __LIKES_moduleName: '',
                    __INS_status:"10,20",
                    __EQS_starterCode:JSON.parse(localStorage.getItem("user")).staffCode
                },
                tableData: [],
                columns: [
                    {type: 'index', align: 'center', width: 50},
                    {title: '业务流程编码', align: 'center', key: 'procCode'},
                    {title: '业务流程名称', align: 'center', key: 'procName'},
                    {title: '模块名称', align: 'center', key: 'moduleName'},
                    {title: '模板名称', align: 'center', key: 'templateName'},
                    {title: '表单名称', align: 'center', key: 'formName'},
                    {title: '发起人    ', align: 'center', key: 'starterName'},
                    {title: '开始时间', align: 'center', key: 'startTimeString'},
                    {title: '状态', align: 'center', key: 'status',formatter:'fixedDict:ProcInstStatus@wf'},
                ],
                row:{},
                appendStaffs: "",
                appendRoles: "",
                userModal: false,
                roleModal: false,
                roleColumns: [
                    {type: 'selection', width: 60,  align: 'center' },
                    { title: '角色编码',   align: 'center',   key: 'value'},
                    { title: '角色名称',   align: 'center',   key: 'name'}
                ],
                roleData: [],
                selectionRole: [],
                selectionUser: [],
                treeNode: [],
                columnsMultiPle: [
                    {type: 'selection'},
                    {title: '用户编码', key: 'staffCode'},
                    {title: '用户名称', key: 'staffName'}
                ],
                staffData: [],
                deptCode: '',
                total: 0,
                currentPage: 1,
                pageSize: 10,

            }

        },
        name: "procInstDraftList",
        methods: {
            onSelect(row){
                this.row = row;
            },
            editBizHandler(){
                if(this.row.id){

                    this.$net.send({
                        server: this.$services.wfService.processRestController.getProcInstData,
                        data: {
                            procInstId: this.row.id,
                        }
                    }).then((data) => {
                        let bizData = null;
                        if(data && data.data){
                            bizData = JSON.parse(data.data.formData);
                        }
                        this.$router.push({
                            path: '/wfStart',
                            query: {procCode: this.row.procCode, bizData: bizData, procInstId: this.row.id,  opt: "EDIT"}
                        });
                    });
                }else{
                    this.$Message.info({duration: 5, content: '请先选择需要编辑的数据'});
                    return;
                }
            },
            //查看业务数据
            viewBizHandler() {
                if (this.row.id) {
                    this.$net.send({
                        server: this.$services.wfService.processRestController.getProcInstData,
                        data: {
                            procInstId: this.row.id,
                        }
                    }).then((data) => {
                        let bizData = null;
                        if(data && data.data){
                             bizData = JSON.parse(data.data.formData);
                        }
                        this.$router.push({
                            path: '/processView',
                            query: {procCode: this.row.procCode, bizData: bizData, opt: "VIEW"}
                        });
                    });
                }else{
                    this.$Message.error("请先选择需要查看的业务数据");
                }
            },
            submitInstHandler(){
                if(this.row.id){
                    this.$Modal.confirm({
                        title: '提交提示',
                        content: '您确定要提交这个流程吗?',
                        onOk: () => {
                            this.procInstId = this.row.id;
                            /* 先判断工作流审批的人员类型，如果是动态指定，则需要弹出对应的机构或者人员，供审批人员选择 */
                            this.$net.send({
                                server: this.$services.wfService.processRestController.getAuth,
                                data: {
                                    procInstId : this.procInstId
                                }
                            }).then((data) => {
                                if(data.success){
                                    /** 如果是自定义用户，就弹出用户选择框 **/
                                    if(data.auth == 'userDynamic'){
                                        this.openUser();
                                    }
                                    else if(data.auth == 'roleDynamic'){
                                        this.openRole();
                                    }
                                    else{
                                        this.sendCompleteData();
                                    }
                                }
                                else{
                                    this.$Message.info(data.msg);
                                }
                            });
                        },
                        onCancel: () => {

                        }
                    });


                }else{
                    this.$Message.info({duration: 5, content: '请先选择需要提交的数据'});
                }
            },
            sendCompleteData(appendStaffs, appendRoles){
                this.$net.send({
                    server: this.$services.wfService.processRestController.submit,
                    data: {
                        procInstId: this.procInstId,
                        appendStaffs: appendStaffs,
                        appendRoles: appendRoles
                    }
                }).then((data) => {
                    if (data.success) {
                        this.$Message.success(data.msg);
                        this.$refs.procInstDraftListTable.refresh();
                    } else {
                        this.$Message.error(data.msg);
                    }
                });
            },
            delBizHandler(){
                if(this.row.id){
                    this.$Modal.confirm({
                        title: '删除提示',
                        content: '您确定要删除这个流程吗?',
                        onOk: () => {
                            this.$net.send({
                                server: this.$services.wfService.processRestController.delete,
                                append:this.row.id
                            }).then((data) => {
                                if (data.success) {
                                    this.$Message.success(data.msg);
                                    this.$refs.procInstDraftListTable.refresh();

                                } else {
                                    this.$Message.error(data.msg);
                                }
                            });
                        },
                        onCancel: () => {

                        }
                    });


                }else{
                    this.$Message.info({duration: 5, content: '请先选择需要删除的数据'});
                }
            },
            openUser(){
                this.userModal = true;

                // 打开 lookup 时加载机构树, 并展开第一个根节点且选中
                if(this.treeNode.length == 0)
                {
                    this.$net.send({
                        server: this.$services.sysService.unitRestController.load
                    }).then((data)=>{
                        if (data.length > 0) {
                            data[0].expand = true;
                            data[0].selected = true;
                        }
                        this.treeNode = data;
                    });
                }
            },
            openRole(){
                this.roleModal = true;
                // 从后台获取所有的角色
                this.$net.send({
                    server: this.$services.sysService.roleRestController.queryAllRole
                }).then((data)=>{
                    this.roleData = data;
                });
            },
            selectionRoleClick(arr) {
                this.selectionRole = arr;
            },
            roleOk(){
                let roleCodes;
                this.selectionRole.forEach((data) => {
                    if(roleCodes){
                        roleCodes += "," + data.value;
                    }
                    else{
                        roleCodes = data.value;
                    }
                });
                this.appendRoles = roleCodes;
                this.selectionRole = [];
                let appendStaffs ;
                this.sendCompleteData(appendStaffs, roleCodes);
            },
            roleCancel(){
                this.selectionRole = [];
            },
            selectionUserClick(arr) {
                debugger;
                this.selectionUser = arr;
            },
            userOk(){
                let appendStaffs;
                console.info(this.selectionUser);
                this.selectionUser.forEach((data) => {
                    if(appendStaffs){
                        appendStaffs += "," + data.staffCode;
                    }
                    else{
                        appendStaffs = data.staffCode;
                    }
                });
                this.sendCompleteData(appendStaffs);
            },
            userCancel(){
                this.selectionUser = [];
                this.clearTable();
                //刷新树
                this.$net.send({
                    server: this.$services.sysService.unitRestController.load
                }).then((data)=>{
                    if (data.length > 0) {
                        data[0].expand = true;
                        data[0].selected = true;
                    }
                    this.treeNode = data;
                });
            },
            getNode(node){
                if (node.length == 1)
                {
                    this.deptCode = node[0].id;
                    this.pageSize = 999999;
                    this.currentPage = 1;
                    this.queryStaff();
                }
                else
                {
                    this.clearTable();
                }
            },
            clearTable (){
                this.deptCode = '';
                this.staffData = [];
                this.total = 0;
            },
            queryStaff(){
                /*加载对应的用户*/
                let params = {__EQS_deptCode: this.deptCode};
                let pageConfig = {
                    pageSize: 999999,
                    pageNumber: this.currentPage
                };

                this.$net.send({
                    server: this.$services.sysService.staffRestController.query,
                    data: {
                        ...params,
                        ...pageConfig
                    }
                }).then((data)=>{
                    this.staffData = data.rows;
                    this.total = data.total;
                });
            }
        },
        mounted() {
        }

    }
</script>