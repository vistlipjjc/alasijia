<template>
    <div>
        <card title="模板图像">
            <!--模板图像-->
            <a href="#" slot="extra" @click.prevent="btnBack">
                <Icon type="ios-arrow-back"></Icon>
                返回
            </a>
            <div style="overflow:auto;">
                <img id="img" alt="流程图片" @click="showPopup"/>
            </div>
            <Row>
            <Tabs>
                <TabPane label="流程基本信息" icon="logo-apple">
                    <Row class="preview">
                        <Col span="10">
                        <j-label name="流程编码" value="code"></j-label>
                        </Col>
                        <Col span="10">
                        <j-label name="流程名称" value="name"></j-label>
                        </Col>
                    </Row>
                    <Row class="preview">
                        <Col span="10">
                        <j-label name="模板名称" value="procTemplateName"></j-label>
                        </Col>
                        <Col span="10">
                        <j-label name="模块名称" value="moduleName"></j-label>
                        </Col>
                    </Row>
                    <Row class="preview">
                        <Col span="10">
                        <j-label name="备注" value="remark" ></j-label>
                        </Col>
                    </Row>
                </TabPane>
                <TabPane label="节点授权" icon="logo-windows">
                    <Form ref="authForm" :model="authForm"  :label-width="180">
                        <Row class="preview" style="margin-left: 3px;">
                            <Col span="2" style="margin-top: 5px;">
                                <Checkbox v-model="candidateCheck" :disabled="disabledCandidateCheck"  @on-change="candidateCheckChange">候选人</Checkbox>
                            </Col>
                            <Col span="4">
                                <Select v-model="authForm.userScope" :value="authForm.userScope"  @on-change="userScopeChange"
                                        ref="userScope" clearable :disabled="disabledUserScope" transfer>
                                    <Option v-for="item in userScopes" :value="item.value" :key="item.value">{{ item.name }}</Option>
                                </Select>
                            </Col>
                            <Col span="10" style="margin-left: 15px;" v-if="showUserCustom">
                                <j-staff v-model="authForm.authUserName" @on-select="getStaff" multiple :disabled="disabledAuthUserName"></j-staff>
                            </Col>
                            <Col span="10" style="margin-left: 15px;" v-if="showUserForm">
                                <Select v-model="authForm.authUser" label-in-value  :value="authForm.authUser"
                                        @on-change="selectChange($event, 'authUser', 'authUserName')" clearable :disabled="disabledAuthUser" transfer>
                                    <Option v-for="item in formProps" :value="item.value" :key="item.value">{{ item.name }}</Option>
                                </Select>
                            </Col>
                            <Col span="10" style="margin-left: 15px;" v-if="showUserRule">
                                <j-select v-model="authForm.authUser" :value="authForm.authUser" url="custom:packages/queryRule@rule" labelInValue
                                          ref="formCode" @on-change="selectChange($event, 'authUser', 'authUserName')" :disabled="disabledUserRule">
                                </j-select>
                            </Col>
                            <Col span="10" style="margin-left: 15px;" v-if="showUserDynamic">
                            </Col>
                        </Row>
                        <Row class="preview" style="margin-left: 3px;">
                            <Col span="2" style="margin-top: 5px;">
                                <Checkbox v-model="roleCheck" :disabled="disabledRoleCheck" @on-change="roleCheckChange">候选岗位</Checkbox>
                            </Col>
                            <Col span="4">
                                <Select v-model="authForm.roleScope" :value="authForm.roleScope"   @on-change="roleScopeChange"
                                        ref="roleScope" clearable :disabled="disabledRoleScope" transfer>
                                    <Option v-for="item in roleScopes" :value="item.value" :key="item.value">{{ item.name }}</Option>
                                </Select>
                            </Col>
                            <Col span="10" style="margin-left: 15px;" v-if="showRoleUnit">
                                <Input v-model="authForm.authRoleName" @on-focus="businessModal = true" :value="authForm.authRoleName" :disabled="disabledAuthRoleName">
                                    <Button @click="businessModal = true" slot="append" icon="ios-search" :disabled="disabledAuthRoleName"></Button>
                                </Input>
                            </Col>
                            <Col span="10" style="margin-left: 15px;" v-if="showRoleForm">
                                <Row>
                                    <Col span="6">
                                        <Select v-model="authForm.authRoleProp" :value="authForm.authRoleProp"  label-in-value  @on-change="selectChange($event, 'authUser', 'authUserName')" transfer>
                                            <Option v-for="item in formProps" :value="item.value" :key="item.value">{{ item.name }}</Option>
                                        </Select>
                                    </Col>
                                    <Col span="1">&nbsp;
                                    </Col>
                                    <Col span="17">
                                        <span  @click.native="businessModal = true">
                                            <Input v-model="authForm.authRoleName" @on-focus="businessModal = true" :value="authForm.authRoleName" >
                                                <Button slot="append" icon="ios-search" @click.native="businessModal = true" ></Button>
                                            </Input>
                                        </span>
                                    </Col>
                                </Row>
                            </Col>
                            <Col span="10" style="margin-left: 15px;" v-if="showRoleDynamic">
                            </Col>
                            <Col span="10" style="margin-left: 15px;" v-if="showRoleRule">
                                <j-select v-model="authForm.authRole" :value="editForm.authRole" url="custom:packages/queryRule@rule" labelInValue
                                          ref="formCode" @on-change="selectChange($event, 'authRole', 'authRoleName')" transfer>
                                </j-select>
                            </Col>
                        </Row>
                        <Row style="margin-left: 20px;">
                            <Button type="ghost"  @click="btnAuthSave()" :disabled="disabledAuthSave">保存</Button>
                        </Row>
                    </Form>
                </TabPane>
                <TabPane label="变量映射" icon="logo-tux">
                    <Form ref="editForm" :model="editForm"  :label-width="180">
                        <Row class="preview">
                            <div style="float: left; text-align: left; margin-left: 30px">
                                <span >连线名称：</span>
                                <span >{{flowNane}}</span>
                            </div>
                        </Row>
                        <Row style="margin-left: 20px;">
                            <Button type="ghost"  @click="btnVarMapSave()">保存</Button>
                        </Row>
                        <Row style="margin-left: 3px;">
                            <proc-def-table
                                    refs="procDefTable"
                                    v-model="tableData"
                                    :columns-list="columns"
                                    :form-props="formProps"
                                    :rule-props="ruleProps"
                                    @on-change="changeParam"
                                    @on-selection-change="selectionChange">
                            </proc-def-table>
                        </Row>
                    </Form>

                </TabPane>
            </Tabs>
            </Row>
        </card>
        <Modal
                v-model="businessModal"
                title="请选择岗位"
                @on-ok="roleOk"
                @on-cancel="roleCancel">
            <Table border :columns="roleColumns" :data="roleData" @on-selection-change='selectionClick'></Table>
        </Modal>
    </div>
</template>

<script>
    import ProcDefTable from '../component/procDefTable';
    export default {
        components: {
            ProcDefTable
        },
        data() {
            return {
                procDef: {},
                authForm: {},
                flowNane: '',
                nodes: [],
                checkedNodKey: '',
                templateCode: '',
                tableData: [],
                formProps: [],
                ruleProps: [],
                roleScopes: [],
                userScopes: [],
                server: {
                    query: this.$services.wfService.procDefRestController.selectProcVarMap
                },
                columns: [
                    { title: '连线名称',   align: 'center',   key: 'nodeKey'},
                    { title: '变量名称',   align: 'center',   key: 'varCode'},
                    { title: '变量来源',   align: 'center',   key: 'varSource', editable: true},
                    { title: '表单属性',   align: 'center',   key: 'propCode',  editable: true},
                   ],
                roleColumns: [
                    {type: 'selection', width: 60,  align: 'center' },
                    { title: '角色类型编码',   align: 'center',   key: 'value'},
                    { title: '角色类型名称',   align: 'center',   key: 'name'}
                ],
                roleData: [],
                editForm: {
                    nodeKey: '',
                    varCode: '',
                    varSource: '',
                    propCode: ''
                },
                selectionParam : [],
                candidateCheck: false, //候选人勾选框
                roleCheck: false, //候选岗位勾选框
                showUserCustom: true,
                showUserForm: false,
                showUserRule:false,
                showUserDynamic: false,
                showRoleUnit: true,
                showRoleRule: false,
                showRoleForm: false,
                showRoleDynamic: false,
                businessModal: false,
                selectionRole: [],
                disabledCandidateCheck: true,
                disabledRoleCheck: true,
                disabledUserScope: true,
                disabledAuthUser: true,
                disabledUserRule: true,
                disabledAuthUserName: true,
                disabledRoleScope: true,
                disabledAuthRoleName: true,
                disabledAuthSave: true

            }
        },
        created() {
            this.procDef = this.$route.query.procDef;
            this.$route.query.row = this.procDef;
            this.templateCode = this.procDef['procTemplateCode'];
            this.$net.send({
                server: this.$services.wfService.procDefRestController.selectNodes,
                append: this.templateCode
            }).then((data) => {
               this.nodes = data;
            });
            this.$net.send({
                server: this.server.query,
                data: {code: this.procDef['code'], version: this.procDef['procVersion']}
            }).then((data) => {
                this.tableData = data.rows;
            });

            this.$net.send({
                server: this.$services.wfService.procDefRestController.queryFormProp,
                data: {formCode: this.procDef['formCode']}
            }).then((data) => {
                this.formProps = data;
            });

            this.$net.send({
                server: this.$services.ruleService.packagesRestController.queryRule,
            }).then((data) => {
                this.ruleProps = data;
            });

            this.$net.send({
                server: this.$services.wfService.procDefRestController.selectUnitScop,
            }).then((data) => {
                this.roleScopes = data;
            });

            this.$store.dispatch('cache/cacheDict', {type: 'fixedDict', url: 'UserScope', service: 'wf'})
                .then(data => {
                    this.userScopes = data;
                });

            this.$net.send({
                server: this.$services.sysService.roleStdRestController.queryAll,
            }).then((data) => {
                this.roleData = data;
            });
        },
        mounted(){
            this.init();
        },
        methods: {
            showPopup(e){
                let x = e.offsetX, y = e.offsetY;
                for(let i = 0; i < this.nodes.length; i++)
                {
                    let node = this.nodes[i];

                    if(node.type == 'STARTEVENT' || node.type == 'ENDEVENT')
                    {
                        let xd = node.startX + node.width/2 - x;
                        let yd = node.startY + node.width/2 - y;
                        let dis = Math.pow((xd * xd + yd * yd), 0.5) - node.width/2;
                        /*如果小于0，则点在圆形内*/
                        if(dis < 0){
                            /*不相等就点到了另一个node上*/
                            if(this.checkedNodKey != node.key){
                                this.pointImg(node.key, 'USERTASK', this.templateCode);
                                this.checkedNodKey = node.key;
                                this.setProcAuth(true);
                            }
                            this.flowNane = '';
                            break;
                        }

                    }
                    else if(node.type == 'USERTASK'){
                        let xd = x - node.startX;
                        let yd = y - node.startY;

                        if(xd > 0 && xd < node.width && yd > 0 && yd < node.height){
                            /*不相等就点到了另一个node上*/
                            if(this.checkedNodKey != node.key){
                                this.pointImg(node.key, 'USERTASK', this.templateCode);
                                this.checkedNodKey = node.key;
                                /*回调选择节点函数*/
                                this.getProcAuth(this.procDef['code'], this.procDef['procVersion'], node.key);
                            }
                            this.flowNane = '';
                            break;
                        }
                    }
                    else if(node.type == 'FLOW'){
                        /*获得这个FLOW的线路图*/
                        let wayPoints = node.wayPoints;
                        wayPoints = $.parseJSON(wayPoints);
                        /*判断是否点在线路图上*/
                        let inWay = this.pointInWay(wayPoints, x, y);
                        if(inWay){
                            this.pointImg(node.key, 'FLOW', this.templateCode);
                            this.checkedNodKey = node.key;
                            this.flowNane = node.key;
                            this.setProcAuth(true);
                            break;
                        }
                    }
                }
            },
            pointInWay(wayPoints, pointX, pointY){
                /*依次判断点是否在相邻的点的连线上*/
                for(let i = 0; i < wayPoints.length - 1; i++){
                    if(this.pointInLine(wayPoints[i].X, wayPoints[i + 1].X, wayPoints[i].Y, wayPoints[i + 1].Y, pointX, pointY))
                    {
                        return true;
                        break;
                    }
                }
            },
            pointInLine(startX, endX, startY, endY, pointX, pointY){
                /*如果是一条竖线*/
                if(startX == endX && pointX == startX && pointY > Math.min(startY, endY) && pointY < Math.max(startY, endY)){
                    return true;
                }
                /*如果是一条横线*/
                else if(startY == endY && pointY == startY && pointX > Math.min(startX, endX) && pointX < Math.max(startX, endX)){
                    return true;
                }
                /*先判断点击的点是否在起点到终点的矩形框中*/
                else if(!(pointX < Math.min(startX, endX)) && !(pointX > Math.max(startX, endX)) && !(pointY < Math.min(startY, endY)) && !(pointY > Math.max(startY, endY))){
                    /*获得线的倾斜度, 从起点开始*/
                    var angle1 = this.angle(startX, endX, startY, endY);
                    var angle2 = this.angle(startX, pointX, startY, pointY);

                    /*获得线的倾斜度, 从终点开始*/
                    var angle3 = this.angle(endX, startX, endY, startY);
                    var angle4 = this.angle(endX, pointX, endY, pointY);
                    /*如果倾斜度相同就说明在一条直线上*/
                    if(Math.round(angle3*10) == Math.round(angle4*10) || Math.round(angle1*10) == Math.round(angle2*10)) {
                        return true;
                    }
                    else
                    {
                        return false;
                    }
                }
                else
                {
                    return false;
                }
            },
            angle(startX, endX, startY, endY){
                var diff_x = endX - startX,
                    diff_y = endY - startY;
                //返回倾斜率
                return diff_y/diff_x;
            },
            pointImg(nodeKey, nodeType, code){
                this.$net.send({
                    server: this.$services.wfService.procDefRestController.pointNodeImage,
                    data: {nodeKey: nodeKey ,
                        nodeType : nodeType,
                        code : code
                    }
                }).then((data) => {
                    /*加载流程图片  */
                    document.getElementById("img").src ="data:image/png;base64,"+ data.data;
                });
            },
            init(){
                this.$net.send({
                    server: this.$services.wfService.procTemplateRestController.getProcInstDiagram,
                    append: this.procDef['procTemplateCode']
                }).then((data) => {
                    /*加载流程图片  */
                    document.getElementById("img").src ="data:image/png;base64,"+ data.data;
                });
            },
            btnVarMapSave(){
                if(this.editForm.param){
                    this.$net.send({
                        server: this.$services.wfService.procDefRestController.updateProcVarMap,
                        data: {varMapJson: this.editForm.param }
                    }).then((data) => {
                        if (data.success) {
                            this.$Message.success(data.msg);
                            // this.btnBack();
                        } else {
                            this.$Message.error(data.msg);
                        }
                    });
                }
            },
            selectionChange(data){
                this.selectionParam = data;
            },
            changeParam(param,tableData, index){
                param[0].formCode = this.$route.query.row.code;
                this.editForm.param = JSON.stringify(param);
                this.tableData = tableData;
            },
            selectChange(data, code, name) {
                if(data){
                    this.authForm[code] =data.value;
                    this.authForm[name] =data.label;
                }
            },
            userScopeChange(value, setFlag){
                if(!setFlag){
                    this.authForm.userScope = value;
                    this.authForm.authUser = '';
                    this.authForm.authUserName = '';
                }
                if(value == 'RULE'){
                    this.showUserCustom = false;
                    this.showUserForm = false;
                    this.showUserDynamic = false;
                    this.showUserRule = true;
                }
                else if(value == 'DYNAMIC'){
                    this.showUserCustom = false;
                    this.showUserForm = false;
                    this.showUserDynamic = true;
                    this.showUserRule = false;
                }
                else if(value == 'FORM'){
                    this.showUserCustom = false;
                    this.showUserForm = true;
                    this.showUserDynamic = false;
                    this.showUserRule = false;
                }
                else{
                    this.showUserCustom = true;
                    this.showUserForm = false;
                    this.showUserDynamic = false;
                    this.showUserRule = false;
                }
            },
            roleScopeChange(value, setFlag){
                if(!setFlag) {
                    this.authForm.roleScope = value;
                    this.authForm.authRole = '';
                    this.authForm.authRoleName = '';
                    this.authForm.authRoleProp == '';
                }
                if(value == 'RULE'){
                    this.showRoleUnit = false;
                    this.showRoleForm = false;
                    this.showRoleDynamic = false;
                    this.showRoleRule = true;
                }
                else if(value == 'DYNAMIC'){
                    this.showRoleUnit = false;
                    this.showRoleForm = false;
                    this.showRoleDynamic = true;
                    this.showRoleRule = false;
                }
                else if(value == 'FORM'){
                    this.showRoleUnit = false;
                    this.showRoleForm = true;
                    this.showRoleDynamic = false;
                    this.showRoleRule = false;
                }
                else{
                    this.showRoleUnit = true;
                    this.showRoleForm = false;
                    this.showRoleDynamic = false;
                    this.showRoleRule = false;
                }
            },
            getStaff(val) {
                if (val)
                {
                    this.authForm.authUser = val.staffCode;
                    this.authForm.authUserName = val.staffName;
                }
                else
                {
                    this.authForm.authUser = '';
                    this.authForm.authUserName = '';
                }
            },
            selectionClick(arr) {
                this.selectionRole = arr;
            },
            roleOk(){
                let roleCodes, roleNames;
                this.selectionRole.forEach((data) => {
                    if(roleCodes){
                        roleCodes += "," + data.value;
                        roleNames += ","+ data.name;
                    }
                    else{
                        roleCodes = data.value;
                        roleNames = data.name;
                    }
                });
                this.authForm.authRole = roleCodes;
                this.authForm.authRoleName = roleNames;
                this.selectionRole = [];
            },
            roleCancel(){
                this.selectionRole = [];
            },
            getProcAuth(code, version, nodeKey){
                this.$net.send({
                    server: this.$services.wfService.procDefRestController.getNodeProcAuth,
                    data:{code: code, version: version, nodeKey : nodeKey}
                }).then((data) => {
                    if(data.procAuth){
                        console.info('data.procAuth:', data.procAuth.authUser);
                        // this.clearSelect();
                        this.authForm = data.procAuth;
                        this.setProcAuth(false);
                    }
                    else{
                        this.setProcAuth(true);
                    }
                });
            },
            setProcAuth(disabled){
                if(!disabled){
                    this.enableAuth();
                   /* 1. 先判断是否有设定权限 */
                    if((!this.authForm.userScope || this.authForm.userScope == '') && (!this.authForm.roleScope || this.authForm.roleScope == '')){
                        /*如果是没有设定权限的节点，就不做操作*/
                        this.candidateCheck = true;
                        this.roleCheck = true;
                    }
                    /* 2. 判断是否已经设定候选岗位,而没有选择人员*/
                    else if((!this.authForm.userScope || this.authForm.userScope == '') && (this.authForm.roleScope && this.authForm.roleScope != '')){
                       /* 设置人员选择为禁用状态*/
                        this.disabledUserScope = true;
                        this.roleCheck = true;
                        this.disabledRoleCheck = true;
                        this.candidateCheck = false;
                        this.disabledAuthRoleName = false;
                        this.disabledAuthUserName = true;
                        this.roleScopeChange(this.authForm.roleScope, true);
                    }
                    /*3. 判断是否设置人员权限 */
                    else if((!this.authForm.roleScope || this.authForm.roleScope == '') && (this.authForm.userScope && this.authForm.userScope != '')){
                        /* 设置候选岗位选择为禁用状态*/
                        this.disabledRoleScope = true;
                        this.roleCheck = false;
                        this.candidateCheck = true;
                        this.disabledCandidateCheck = true;
                        this.disabledAuthRoleName = true;
                        this.disabledAuthUserName= false;
                        this.userScopeChange(this.authForm.userScope, true);

                    }
                    /*3. 两种权限都设定的情况 */
                    else {
                        this.candidateCheck = true;
                        this.roleCheck = true;
                        this.userScopeChange(this.authForm.userScope, true);
                        this.roleScopeChange(this.authForm.roleScope, true);
                    }
                }
                else {
                    this.disableAuth();
                }
            },
            // 保存节点授权的配置
            btnAuthSave(){
                if(this.authForm){
                    if(this.candidateCheck){
                        if(!this.authForm.userScope || this.authForm.userScope == ''){
                            this.$Message.error('请选择候选人类型.');
                            return;
                        }
                        if((!this.authForm.authUser || this.authForm.authUser == '') && this.authForm.userScope != 'DYNAMIC'){
                            this.$Message.error('请选择候选人.');
                            return;
                        }
                    }

                    if(this.roleCheck){
                        if(!this.authForm.roleScope || this.authForm.roleScope == ''){
                            this.$Message.error('请选择候选岗位类型.');
                            return;
                        }
                        if((!this.authForm.authRole || this.authForm.authRole == '') && this.authForm.roleScope != 'DYNAMIC'){
                            this.$Message.error('请选择候选岗位.');
                            return;
                        }

                        if((!this.authForm.authRoleProp || this.authForm.authRoleProp == '') && this.authForm.roleScope == 'FORM'){
                            this.$Message.error('请选择表单属性.');
                            return;
                        }
                    }

                    if(this.authForm.roleScope == 'DYNAMIC' && this.authForm.userScope == 'DYNAMIC'){
                        this.$Message.error('候选岗位和候选人不能同时为动态指定.');
                        return;
                    }

                    this.$net.send({
                        server: this.$services.wfService.procDefRestController.updateNodeProcAuth,
                        data: this.authForm
                    }).then((data) => {
                        if (data.success) {
                            this.$Message.success(data.msg);
                            // this.btnBack();
                        } else {
                            this.$Message.error(data.msg);
                        }
                    });
                }
            },
            // 禁用节点授权
            disableAuth(){
                this.authForm ={};
                this.disabledCandidateCheck = true;
                this.candidateCheck = false;
                this.disabledRoleCheck = true;
                this.roleCheck = false;
                this.disabledUserScope = true;
                this.disabledAuthUser = true;
                this.disabledUserRule = true;
                this.disabledAuthUserName = true;
                this.disabledRoleScope = true;
                this.disabledAuthRoleName = true;
                this.disabledAuthSave = true;
            },
            // 启用节点授权
            enableAuth(){
                this.disabledCandidateCheck = false;
                this.disabledRoleCheck = false;
                this.disabledUserScope = false;
                this.disabledAuthUser = false;
                this.disabledUserRule = false;
                this.disabledAuthUserName = false;
                this.disabledRoleScope = false;
                this.disabledAuthRoleName = false;
                this.disabledAuthSave = false;
            },
            clearSelect(){
                this.$refs.userScope.clearSingleSelect();
                this.$refs.roleScope.clearSingleSelect();
            },
            //候选岗位勾选事件
            roleCheckChange(val){
                if(val){
                    this.disabledRoleScope = false;
                    this.disabledAuthRoleName = false;
                    this.disabledCandidateCheck = false;
                }
                else{
                    this.authForm.authRole = '';
                    this.authForm.authRoleName = '';
                    this.authForm.authRoleProp == '';
                    this.disabledRoleScope = true;
                    this.disabledAuthRoleName = true;
                    this.disabledCandidateCheck = true;  // 禁用候选人勾选框，必须选择一项
                }
            },
            //候选人勾选事件
            candidateCheckChange(val){
                if(val){
                    this.disabledUserScope = false;
                    this.disabledAuthUser = false;
                    this.disabledUserRule = false;
                    this.disabledAuthUserName = false;
                    this.disabledRoleCheck = false;
                }
                else{
                    this.authForm.userScope = '';
                    this.authForm.authUser = '';
                    this.authForm.authUserName = '';
                    this.disabledUserScope = true;
                    this.disabledAuthUser = true;
                    this.disabledUserRule = true;
                    this.disabledAuthUserName = true;
                    this.disabledRoleCheck = true; // 禁用岗位勾选框，必须选择一项
                }
            },
            btnBack(){
                this.$router.go(-1);
                this.$store.commit('removeTag', 'procDefDesign');
                this.$store.commit('closePage', 'procDefDesign');
            }
        }
    }
</script>
