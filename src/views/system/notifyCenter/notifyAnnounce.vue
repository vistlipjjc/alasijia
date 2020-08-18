<template>
    <div class="appConfigEditCtnr">
        <Card>
            <Row style="border: 1px solid #e7eaec; padding: 24px;">
                <Col span="16">
                  <h3>公告编辑</h3>
                </Col>
                <Col span="8" style="text-align: right;">
                    <Button type="ghost" icon="paper-airplane" @click="sendAnnounce('editForm')">发送</Button>
                    <Button type="ghost" icon="eye" @click="preview">预览</Button>
                    <Button type="ghost" icon="edit" @click="saveDraft">存草稿</Button>
                    <Button type="error" icon="close" @click="back">取消</Button>
                </Col>
            </Row>
            <Form ref="editForm" :model="editForm" :rules="editRules" :label-width="130">
                <Row style="border: 1px solid #e7eaec; border-top: 0px; border-bottom: 0px;  padding: 24px 24px 0px 0px;">
                    <Col>
                        <FormItem label="收件人" prop="receiver" required>
                            <Radio-group v-model="receiverRadio" @on-change="selectRadio">
                                <Radio id="all"  label="all"><span>全部用户</span></Radio>
                                <radio  label="custom"><span>自定义</span></radio>
                            </Radio-group>
                            <Row :gutter="10" v-show="receiverRadio === 'custom'">
                                <Col span="8">
                                    <j-unit ref="unitTreeRef"  multiple placeholder="机构搜索"></j-unit>
                                </Col>
                                <Col span="8">
                                    <Input v-model="roleNames" icon="ios-search" placeholder="岗位搜索" @on-focus="selectRole"/>
                                </Col>
                                <Col span="8">
                                    <j-staff :value="editForm.receiverName" multiple @on-select="selectStaffList" placeholder="用户搜索"></j-staff>
                                </Col>
                            </Row>
                        </FormItem>
                        <FormItem label="主题" prop="subject" required>
                            <Input v-model="editForm.subject"></Input>
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="24">
                        <FormItem prop="content" class="content-form-item">
                            <div id="summernote" v-model="editForm.content"></div>
                        </FormItem>
                    </Col>
                </Row>
            </Form>
            <Row style="border: 1px solid #e7eaec; border-top: 0px; padding: 24px;">
                <Col>
                    <j-upload :entityType='entityType'></j-upload>
                </Col>
            </Row>
            <Row type="flex" justify="end" style="padding: 16px 24px 0px 0px;">
                <Col>
                    <Button type="ghost" icon="paper-airplane" @click="sendAnnounce('editForm')">发送</Button>
                    <Button type="error" icon="close" @click="back">取消</Button>
                </Col>
            </Row>
        </Card>

        <!--预览弹出框-->
        <Modal v-model="previewModal" :mask-closable="false" title="公告预览" width="800">
            <ann-preview :row="previewRow"></ann-preview>
            <template slot="footer">
                <Button @click="previewModal = false" type="error" icon="close">关闭</Button>
            </template>
        </Modal>

        <!--收件人-岗位搜索-->
        <Modal v-model="roleModal" @on-ok="ok" @on-cancel="cancel" :mask-closable="false" title="选择岗位" width="800">
            <Row :gutter="10">
                <Col span="12">
                <j-table ref="roleTableRef" pagination hiddenForm height="350" pageSizeType="small"
                         :show-refresh="false" :show-column="false" :default-select-row="false" :autoSearch="false"
                         :server="server.query" :default-params="roleEnableParam"
                         :columns-list="columns" :value="roleTable"
                         @on-row-click="rowClick" @on-selection-change="roleSelectChange">
                    <template slot="toolbar">
                        <Button type="text">岗位</Button>
                    </template>
                </j-table>
                </Col>
                <Col span="12">
                <j-table ref="staffTable" pagination hiddenForm height="350" pageSizeType="small"
                         :autoSearch="false" :show-refresh="false" :show-column="false"
                         :server="server.queryStaff" :default-params="roleCodeParam"
                         :columns-list="columnsR">
                    <template slot="toolbar">
                        <Button type="text">岗位用户</Button>
                    </template>
                </j-table>
                </Col>
            </Row>
        </Modal>

    </div>
</template>

<script>
    import $ from 'jquery';
    import annPreview from './announcePreview';

    export default {
        name: "notifyMessage",
        components: {annPreview},
        data () {
            return {
                // 发件人为岗位时，声明的数据
                roleModal: false, // 岗位搜索弹出框打开标记
                roleEnableParam: {}, //岗位索搜的参数
                entityType:'007',
                server: {
                    query: this.$services.sysService.roleRestController.query,
                    queryStaff: this.$services.sysService.roleRestController.queryRoleStaff,
                },
                roleTable: [],
                columns: [
                    { type: 'selection', align: 'center', width: 80},
                    { title: '角色编码', align: 'center', key: 'roleCode'},
                    { title: '角色名称', align: 'center', key: 'roleName'},
                    { title: '角色类型', align: 'center', key: 'roleStdCode', formatter: 'custom:roleStd/queryAll@system'},
                ],
                roleCodeParam: {}, //查询岗位用户的岗位编码参数
                columnsR: [ //用户表表头字段
                    { title: '序号', type: 'index', align: 'center', width: 80 },
                    { title: '部门', align: 'center', key: 'unitName' },
                    { title: '用户账号', align: 'center', key: 'staffCode' },
                    { title: '用户名称', align: 'center', key: 'staffName' },
                ],
                roleNames: '', //显示的岗位名称
                roleSelection: [], //选中的角色列表

                // 发件人为岗位时，声明的数据
                unitNames: '', //选中的机构名称

                // 发件人类型声明的数据
                receiverRadio:'all',
                editForm: {
                    senderName :'',
                    receiver: '',
                    receiverName: '',
                    unitList:'',
                    roleList: '',
                    subject: '',
                    content: ''
                },

                //预览声明的数据
                previewModal: false,
                previewRow: null,

                editRules: {
                    subject: [
                        { required: true, message: '必填项', trigger: 'blur' },
                        { type: 'string', max: 256, message: '长度不能超过256个字符', trigger: 'blur' }
                    ]
                }
            }
        },
        mounted (){
            /*window.uploadVideo = function() {
                vm.showLoading = true // 因ship上传比较耗时，所以加了个loading提示
                upload($('#video')[0].files[0]).then(url => {// upload是自定义的上传文件函数，这里是上传成功的回调，拿到视频的url
                    var node = document.createElement('div') // 创建节点，用于包裹视频，再加这一层是方便调视频样式
                    node.innerHTML = '<video controls="controls" style="max-width:100%;" src="' + url + '" />'
                    node.cssText = 'width:100%;text-aligen:center;'
                    $('#summernote').summernote('insertNode', node)// 插入视频
                    vm.showLoading = false // 视频上传结束，去掉loading提示
                })
            }
            var myVideoBtn = function(context) {
                var ui = $.summernote.ui
                // create button
                var button = ui.button({
                    contents: '<i class="rich-video-icon"/><input title="视频" onchange="uploadVideo()" type="file" id="videoInput" accept="video/!*" style="opacity: 0; filter:Alpha(opacity=0);width:20px;height: 20px;margin-left: -20px;position:absolute;">', // 这个是展示在富文本顶部的操作图标，这个rich-video-icon是自己写的
                    // tooltip: ''// todo 这个视频提示报错，未知原因
                    // click: function() {// 点击按钮触发事件，这边不需要用到
                    // context.invoke('editor.insertText', 'xxx')
                    // }
                })
                return button.render() // return button as jquery object
            };*/

            this.init();
        },
        methods :{
            init(){
                // 初始化富文本编辑器
                $('#summernote').summernote({
                    lang: 'zh-CN',
                    placeholder: '请输入内容',
                    minHeight: 300,
                    maxHeight: 600,
                    toolbar: [
                        ['style', ['bold', 'italic', 'underline', 'clear']],
                        ['fontname', ['fontname']],
                        ['color', ['color']],
                        ['table',['table']],
                        ['para', ['ul', 'ol', 'paragraph']],
                        ['insert', ['link', 'picture']],
                        ['mybutton', ['myVideo']]
                    ],
                });

                // 草稿箱进入到编辑公告页面，加载编辑数据
                if (this.$route.params.opt == 'edit'){
                    this.$net.send({
                        server: this.$services.sysService.notifyRestController.view,
                        append: this.$route.query.notifyId
                    }).then((data) => {
                        this.editForm = data;
                        $('#summernote').summernote('code', this.editForm.content);
                    });
                }
            },
            /*onImageUpload: function(files) {
                upload(file,).then(url => { // 这个upload是自定义的上传文件函数，最后拿到图片的url，插入到富文本中
                    $('#summernote').summernote('insertImage', url)
                })
            },*/

            selectRole(){
              this.roleModal = true;
              this.roleEnableParam = {__EQS_status: 'ENABLE'};
            },
            rowClick(row, index){
                this.roleCodeParam = {__EQS_roleCode: row.roleCode};
                this.$refs.roleTableRef.toggleSelect(index);
            },
            roleSelectChange(selection){
                this.roleSelection = selection;
            },
            ok(){
                let tmpCode = [], tmpName = [];
                this.roleSelection.forEach(item => {
                    tmpCode.push(item.roleCode);
                    tmpName.push(item.roleName);
                });
                this.editForm.roleList = tmpCode.join(',');
                this.roleNames = tmpName.join(',');
            },
            cancel(){
                this.editForm.roleList = '';
                this.roleNames = '';
            },

            //发送消息
            sendAnnounce(name){
                // 验证表单
                this.$refs[name].validate((valid) => { // 数据校验
                        if (!valid) {
                            return;
                        }
                    this.editForm['receiver'] = this.getReceiver();
                    this.$net.send({
                        server: this.$services.sysService.notifyRestController.saveAnnounce,
                        data: this.editForm
                    }).then((data) => {
                        if (data.success) {
                            this.$Message.success(data.msg);
                            this.back();
                        } else {
                            this.$Message.error(data.msg);
                        }
                    });
                });
            },
            //保存私信草稿
            saveDraft(){
                this.$net.send({
                    server: this.$services.sysService.notifyRestController.saveMessageDraft,
                    data: this.editForm
                }).then((data) => {
                    if (data.success) {
                        this.$Message.success(data.msg);
                        this.$router.go(-1);
                    } else {
                        this.$Message.error(data.msg);
                    }
                });
            },
            //保存公告草稿
            saveDraft(){
                this.editForm.content = $('#summernote').summernote('code');
                this.editForm['receiver'] = this.getReceiver();
                this.$net.send({
                    server: this.$services.sysService.notifyRestController.saveAnnounceDraft,
                    data: this.editForm
                }).then((data) => {
                    if (data.success) {
                        this.$Message.success(data.msg);
                    } else {
                        this.$Message.error(data.msg);
                    }
                });
            },
            //选择人员
            selectStaffList(value){
                this.editForm.receiverName = value.staffName;
                this.editForm.receiver = value.staffCode;
            },
            //选择机构
            selectUnitList(value){
                this.editForm.unitList = value;
            },
            getReceiver(){
                if(this.receiverRadio == 'all') {
                    return 'all';
                } else {
                    let obj = {
                        unitList: this.editForm.unitList,
                        roleList: this.editForm.roleList, 
                        staffList: this.editForm.receiver
                    };
                    return JSON.stringify(obj);
                 }
            },
            selectRadio(value){
                this.receiverRadio = value;
            },
            back(){
                this.$router.go(-1);
                this.$store.commit('removeTag', 'notifyAnnounce');
                this.$store.commit('closePage', 'notifyAnnounce');
            },
            //预览
            preview(){
                this.$net.send({
                    server: this.$services.sysService.notifyRestController.previewReceiver,
                    append: this.getReceiver()
                }).then((data) => {
                    this.editForm.receiverName = data.receiverName;
                    this.editForm.senderName = data.senderName;
                    this.editForm.content = $('#summernote').summernote('code');

                    this.previewModal = true;
                    this.previewRow = this.editForm;
                });
            },
        },
    }
</script>
<style  lang="less">
    .content-form-item{
        margin: 0px 0px -24px -130px;
    }
    #summernote{
        border: 0px;
    }
    .modal-backdrop {
        z-index: 0;
    }
</style>

