<template>
    <div class="processTaskCtnr">
        <Card>
            <Row>
                <component :is="comp" ref="biz" :bizData="bizData" @isSubmit="getSubmit"></component>
            </Row>

        </Card>
        <Card>
            <Row>
                <Form ref="form" :label-width="180"
                      style="margin-left: -68px;margin-right: 60px;">
                    <FormItem label="处理意见" prop="roleGroupCode">
                        <Input type="textarea" v-model="memo" placeholder="处理意见"></Input>
                    </FormItem>
                    <FormItem label="退回节点" prop="roleGroupCode">
                        <j-select v-model="nodeKey" url="custom:approve/selectCompleteNode@wf"
                                  :param="param"
                                  @on-change="selectChange($event)"
                        >
                        </j-select>
                    </FormItem>
                </Form>
            </Row>
            <div align="center" style="margin-top: 5px;">
                <Button type="ghost" @click="btnSave" class="margin-left-10">通过</Button>
                <Button type="ghost" @click="reject" class="margin-left-10">退回</Button>
                <Button type="ghost" @click="btnBack" class="margin-left-10">返回</Button>
            </div>
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
    import lazyLoading from "@/libs/lazyLoading";
    export default {
        data() {
            return {
                componentName: '',
                bizData: '',
                procCode: '',
                nodeKey: '',
                data: '',
                procInstId: '',
                procId: '',
                opt: '',
                taskId: "",
                memo: "",
                param: {},
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
        created() {
            this.init();
            this.$net.send({
                server: this.$services.wfService.processFormRestController.getModule,
                data: {
                    procCode: this.procCode,
                    nodeKey: this.nodeKey,
                    data: this.data,
                    opt: this.opt,
                }
            }).then((data) => {
                this.componentName = data;
            });
        },
        methods: {
            init() {
                this.param = {'procInstId': this.$route.query.procInstId, "taskId": this.$route.query.taskId};
                this.procCode = this.$route.query.procCode;
                this.data = this.$route.query.bizData;
                this.nodeKey = this.$route.query.nodeKey;
                this.opt = this.$route.query.opt;
                this.bizData = this.$route.query.bizData;
                this.procInstId = this.$route.query.procInstId;
                this.procId = this.$route.query.procId;
                this.taskId = this.$route.query.taskId;
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
                this.sendCompleteData(this.bizData, appendStaffs, roleCodes);
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
                this.sendCompleteData(this.bizData, appendStaffs);
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
            },
            selectChange(value) {
                this.nodeKey = value;
            },
            btnSave(){
                if(typeof this.$refs.biz.getBizData === "function") { //是函数    其中 FunName 为函数名称
                    this.$refs.biz.getBizData();
                } else { //不是函数， 没有对应的方法表示业务数据不需要修改
                    this.complete();
                }
            },
            getSubmit(data){
                if(data[0])
                {
                    let val = JSON.stringify(data[1]);
                    this.bizData = val;
                    this.complete(val);

                }else{
                    console.info('业务数据验证不通过。');
                }
            },
            reject() {
                this.$net.send({
                    server: this.$services.wfService.approveRestController.reject,
                    data: {
                        nodeKey: this.nodeKey,
                        taskId: this.$route.query.taskId,
                        procInstId: this.procInstId,
                        memo: this.memo
                    }
                }).then((data) => {
                    if (data.success) {
                        this.$Message.success(data.msg);
                        this.$router.go(-1);
                        this.$store.commit('removeTag', 'taskProcess');
                        this.$store.commit('closePage', 'taskProcess');
                    } else {
                        this.$Message.error(data.msg);
                    }
                });
            },
            complete(formData) {
                /* 先判断工作流审批的人员类型，如果是动态指定，则需要弹出对应的机构或者人员，供审批人员选择 */
                this.$net.send({
                    server: this.$services.wfService.processRestController.getAuth,
                    data: {taskId : this.taskId,
                           procId : this.procId,
                           procInstId : this.procInstId,
                           bizData : formData
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
                            this.sendCompleteData(formData);
                        }
                    }
                    else{
                        this.$Message.info(data.msg);
                    }
                 });
            },
            sendCompleteData(formData, appendStaffs, appendRoles){
                this.$net.send({
                    server: this.$services.wfService.approveRestController.complete,
                    data: {
                        formData: formData,
                        taskId: this.$route.query.taskId,
                        procInstId: this.procInstId,
                        memo: this.memo,
                        appendStaffs: appendStaffs,
                        appendRoles: appendRoles
                    }
                }).then((data) => {
                    if (data.success) {
                        this.$Message.success(data.msg);
                        this.$router.go(-1);
                        this.$store.commit('removeTag', 'taskProcess');
                        this.$store.commit('closePage', 'taskProcess');
                    } else {
                        this.$Message.error(data.msg);
                    }
                });
            },
            btnBack() {
                this.$router.go(-1);
                this.$store.commit('removeTag', 'taskProcess');
                this.$store.commit('closePage', 'taskProcess');
            }
        },
        computed: {
            comp: function () {
                if (this.componentName) {
                    return lazyLoading(this.componentName);
                }
            }
        }
    }
</script>
