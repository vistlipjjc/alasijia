<style lang="less">
    @import './announce.less';
</style>

<template>
    <Row class="stallNotifyCntr">
        <Col :xs="24" :sm="24" :md="4" :lg="4">
            <div class="main-con">
                <div >
                    <Button type="primary" long  @click="toSendMessage('')">发私信</Button>
                </div>
                <div style="padding-left: 10px">
                    <h5>文件夹</h5>
                </div>
                <div class="main-col-list">
                    <Button @click="setCurrentMesType('unread')" size="large" long type="text">
                        <transition name="mes-current-type-btn">
                            <Icon v-show="currentMessageType === 'unread'" type="checkmark"></Icon>
                        </transition>
                        <Icon type="archive"></Icon>
                        <span class="mes-type-btn-text">收件箱</span>

                        <Badge class="message-count-badge-outer" class-name="message-count-badge" :count="hasreadCount"></Badge>
                    </Button>
                </div>
                <div class="main-con-list">
                    <Button @click="setCurrentMesType('sent')" size="large" long type="text">
                        <transition name="mes-current-type-btn">
                            <Icon v-show="currentMessageType === 'sent'" type="checkmark"></Icon>
                        </transition>
                        <Icon type="ios-email-outline"></Icon>
                        <span class="mes-type-btn-text">发件箱</span>
                        <Badge class="message-count-badge-outer" class-name="message-count-badge" ></Badge>
                    </Button>
                </div>
                <div class="main-con-list">
                    <Button @click="setCurrentMesType('presend')" size="large" long type="text">
                        <transition name="mes-current-type-btn">
                            <Icon v-show="currentMessageType === 'presend'" type="checkmark"></Icon>
                        </transition>
                        <Icon type="ios-compose-outline"></Icon>
                        <span class="mes-type-btn-text">草稿箱</span>
                        <Badge class="message-count-badge-outer" class-name="message-count-badge" :count="unreadCount"></Badge>
                    </Button>
                </div>
                <div class="main-con-list">
                    <Button @click="setCurrentMesType('recyclebin')" size="large" long type="text">
                        <transition name="mes-current-type-btn">
                            <Icon v-show="currentMessageType === 'recyclebin'" type="checkmark"></Icon>
                        </transition>
                        <Icon type="ios-trash-outline"></Icon>
                        <span class="mes-type-btn-text">垃圾箱</span>
                        <Badge class="message-count-badge-outer" class-name="message-count-badge" ></Badge>
                    </Button>
                </div>
                <div style="padding-left: 10px;">
                    <h5>分类</h5>
                </div>
                <div class="main-con-list">
                    <Button size="large" long type="text" @click="filterBtn('announce')">
                        <transition name="mes-current-type-btn"></transition>
                        <Icon type="speakerphone" color="#33a3dc"></Icon>
                        <span class="mes-type-btn-text">系统公告</span>
                        <Badge class="message-count-badge-outer" class-name="message-count-badge"></Badge>
                    </Button>
                </div>
                <div class="main-con-list">
                    <Button size="large" long type="text" @click="filterBtn('todo')">
                        <Icon type="edit" color="#d93a49"></Icon>
                        <transition name="mes-current-type-btn"></transition>
                        <span class="mes-type-btn-text">待办任务</span>
                        <Badge class="message-count-badge-outer" class-name="message-count-badge"></Badge>
                    </Button>
                </div>
                <div class="main-con-list">
                    <Button size="large" long type="text" @click="filterBtn('message')">
                        <transition name="mes-current-type-btn"></transition>
                        <Icon type="email" color="#65c294"></Icon>
                        <span class="mes-type-btn-text">私信消息</span>
                        <Badge class="message-count-badge-outer" class-name="message-count-badge"></Badge>
                    </Button>
                </div>
                <div class="main-con-list">
                    <Button size="large" long type="text" @click="filterBtn('remind')">
                        <transition name="mes-current-type-btn"></transition>
                        <Icon type="ios-bell" color="#fcaf17"></Icon>
                        <span class="mes-type-btn-text">提醒信息</span>
                        <Badge class="message-count-badge-outer" class-name="message-count-badge"></Badge>
                    </Button>
                </div>
                <div >
                    <router-link to="/staffNotifyEdit">
                        <Button type="primary" long>配置</Button>
                    </router-link>
                </div>
            </div>
        </Col>
        <Col  :xs="24" :sm="24" :md="20" :lg="20">
            <Card >
                <Row style="margin-top: 10px">
                    <Col span="9" style="padding-left: 30px;">
                        <h1>{{h1}}</h1>
                    </Col>
                    <Col span="11" style="text-align: right; padding-right: 5px;">
                        <ButtonGroup>
                            <Tooltip content="公告" placement="top" transfer>
                                <Button type="ghost" :class="{active:isActive1}" icon="speakerphone" @click="filterBtn('announce')"/>
                            </Tooltip>
                            <Tooltip content="待办" placement="top" transfer>
                                <Button type="ghost" :class="{active:isActive2}" icon="edit" @click="filterBtn('todo')"/>
                            </Tooltip>
                            <Tooltip content="私信" placement="top" transfer>
                                <Button type="ghost" :class="{active:isActive3}" icon="email" @click="filterBtn('message')"/>
                            </Tooltip>
                            <Tooltip content="提醒" placement="top" transfer>
                                <Button type="ghost" :class="{active:isActive4}" icon="ios-bell" @click="filterBtn('remind')"/>
                            </Tooltip>
                            <Tooltip content="全部" placement="top" transfer>
                                <Button type="ghost" :class="{active:isActive5}"  icon="ios-paper-outline" @click="filterBtn('')"/>
                            </Tooltip>
                        </ButtonGroup>
                    </Col>
                    <Col span="4">
                        <Input v-model="search" icon="search" placeholder="搜索" v-on:input="autosearch"/>
                    </Col>
                </Row>
                <Row  style="margin-top: 15px">
                    <Col span="1" style="text-align: left; padding-left: 19px; margin-top: 5px">
                        <Checkbox v-model="checked" @on-change="checkedAll"/>
                    </Col>
                    <Col span="23" style="text-align: left; padding-left: 13px">
                        <ButtonGroup>
                            <Button type="ghost" icon="refresh" id="btnRefresh" @click="refresh" v-show="currentMessageType === 'unread'">刷新</Button>
                            <Button type="ghost" icon="eye" @click="markAsRead('')" id="btnMarkAsRead" v-show="currentMessageType === 'unread'">标记已读</Button>
                            <Button type="ghost" icon="checkmark-round" @click="markAllAsRead" id="btnMarkAllAsRead" v-show="currentMessageType === 'unread'">全部标记已读</Button>
                            <Button type="ghost" icon="eye-disabled" @click="markAsUnread('')" id="btnMarkAsUnread" v-show="currentMessageType === 'unread'">标记未读</Button>
                            <Button type="ghost" icon="ios-trash-outline" @click="deleteFlag" id="btnDeleteFlag">删除</Button>
                            <Button type="ghost" icon="ios-trash" @click="deleteCompletely" id="btnDelCompletely" v-show="currentMessageType === 'unread'">彻底删除</Button>
                            <Button type="ghost" icon="ios-trash" @click="recovery" id="recovery" v-show="currentMessageType === 'recyclebin'">恢复</Button>

                        </ButtonGroup>
                    </Col>
                </Row>
                <div class="content-con" style="margin-top: 10px">
                    <transition name="view-message">

                        <div v-if="showMesTitleList" class="message-title-list-con"><!--:show-header="false"-->
                            <Table ref="notifyTable" height="360"
                                   :columns="notifyTitleColumns"
                                   :data="currentNotifyList"
                                   :no-data-text="noDataText"
                                   :filter-key="search"
                                   @on-select="selectRow"
                                   @on-select-cancel="selectRow"
                                   @on-select-all="selectRow"
                                    />
                            <Page :total="dataCount"
                                  :page-size="pageSize"
                                  :current="pageNumber"
                                  @on-change="changepage"
                                  simple/>
                        </div>
                    </transition>
                    <transition name="back-message-list">
                        <div v-if="!showMesTitleList" class="message-view-content-con">
                            <div class="message-content-top-bar">
                                <span class="mes-back-btn-con"><Button type="text" @click="backMesTitleList"><Icon type="chevron-left"></Icon>&nbsp;&nbsp;返回</Button></span>
                            </div>
                            <div>
                                <h3 class="mes-title">{{ mes.subject }}</h3>
                            </div>
                            <p class="mes-time-con"><Icon type="android-time"></Icon>&nbsp;&nbsp;{{ mes.createTime }}</p>
                            <div class="message-content-body">
                                <p class="message-content">{{ mes.content }}</p>
                            </div>
                        </div>
                    </transition>
                </div>
            </Card>
        </Col>
    </Row>
</template>

<script>
    const deleteMesBtn = (h, params) => {
        return h('Button', {
            props: {
                size: 'small',
                type: 'error'
            },
            on: {
                click: () => {
                    this.remove(params.row.id);
                }
            }
        }, '删除');
    };
    const restoreBtn = (h, params) => {
        return h('Button', {
            props: {
                size: 'small'
            },
            on: {
                click: () => {
                    this.hasreadMesList.unshift(this.recyclebinList.splice(params.index, 1)[0]);
                }
            }
        }, '还原');
    };

    export default {
        name: 'message_index',
        data () {
            return {
                h1:'收件箱',
                server: {
                    query: this.$services.sysService.notifyRestController.queryNotify
                },
                queryForm: {
                    __LIKES_subject: '',
                    __LIKES_content: ''
                },
                filterType: '',
                search: '',
                isActive1: false,isActive2: false,isActive3: false,isActive4: false,isActive5: false,
                currentNotifyList: [],
                unreadMesList: [],
                hasreadMesList: [],
                recyclebinList: [],
                currentMessageType: 'unread',
                showMesTitleList: true,
                unreadCount: 0,
                hasreadCount: 0,
                recyclebinCount: 0,
                noDataText: '暂无未读公告',
                mes: {
                    senderName: '',
                    createTime: '',
                    subject: '',
                    content: '',
                    notifyId:''
                },
                ajaxHistoryData:[],
                // 初始化信息总条数
                dataCount: 0,
                // 每页显示多少条
                pageSize: 50,
                //当前页码
                pageNumber:0,
                //
                checked: false,
                selectRowData: [],
                ids: '',
                senderName:'',
                notifyTable:[],
                notifyTitleColumns: [
                    {
                        title: '',
                        type: 'selection',
                        align: 'left',
                        width: 60,
                        render: (h, params) => {
                            if (this.currentMessageType === 'unread') {
                                return h('div', [
                                    deleteMesBtn(h, params)
                                ]);
                            } else if (this.currentMessageType === 'sent') {
                                return h('div', [
                                ]);
                            } else if (this.currentMessageType === 'present'){
                                return h('div', [
                                    restoreBtn(h, params)
                                ]);
                            } else {
                                return h('div', [
                                    restoreBtn(h, params)
                                ]);
                            }
                        }
                    },
                    {
                        title: '发送人',
                        key: 'senderName',
                        align: 'left',
                        width: 180,
                        render: (h, params) => {
                            return h('a', {
                                on: {
                                    click: () => {
                                        if(this.currentMessageType == 'presend'){
                                            //如果是草稿箱，则转型发送私信页面
                                            this.toSendMessage(params.row.id);
                                        }else if(this.currentMessageType == 'sent'){
                                            //发件箱
                                            this.notifyView(params.row);
                                        }else if(this.currentMessageType == 'unread'){
                                            params.row.folderType = 'inbox';
                                            this.staffNotifyView(params.row);
                                            this.markAsRead(params.row.staffNotifyId);

                                        }else{
                                            params.row.folderType = 'trashbox';
                                            this.staffNotifyView(params.row);

                                        }
                                    }
                                },
                                style: {
                                    fontWeight: (params.row.isRead == 'N') ? 'bold' : 'normal'
                                }
                            }, params.row.senderName);
                        }
                    },
                    {
                        title: '主题',
                        key: 'subject',
                        align: 'left',
                        ellipsis: true,
                        render: (h, params) => {
                            return h('a', {
                                on: {
                                    click: () => {
                                        if(this.currentMessageType == 'presend'){
                                            //如果是草稿箱，则转型发送私信页面
                                            this.toSendMessage(params.row.id);
                                        }else if(this.currentMessageType == 'sent'){
                                            //发件箱
                                            this.notifyView(params.row);
                                        }else if(this.currentMessageType == 'unread'){
                                            params.row.folderType = 'inbox';
                                            this.staffNotifyView(params.row);
                                            this.markAsRead(params.row.staffNotifyId);

                                        }else{
                                            params.row.folderType = 'trashbox';
                                            this.staffNotifyView(params.row);
                                        }
                                    }
                                },
                                style: {
                                    fontWeight: (params.row.isRead == 'N') ? 'bold' : 'normal'
                                }
                            }, params.row.subject);
                        }
                    },
                    {
                        title: '发送时间',
                        key: 'createTime',
                         align: 'center',
                        width: 180,
                        render: (h, params) => {
                            return h('span', [
                                h('Icon', {
                                    props: {
                                        type: 'android-time',
                                        size: 12
                                    },
                                    style: {
                                        margin: '0 5px'
                                    }
                                }),
                                h('span', {
                                    props: {
                                        type: 'android-time',
                                        size: 12
                                    }
                                }, this.computeTimeDiff(params.row.createTime,this.formatDate(params.row.createTime)))
                            ]);
                        }
                    }
                ],
            };
        },
        methods: {
            formatDate (time) {
                let date = new Date(time);
                let year = date.getFullYear();
                let month = date.getMonth() + 1;
                let day = date.getDate();
                let hour = date.getHours();
                let minute = date.getMinutes();
                let second = date.getSeconds();
                return year + '/' + month + '/' + day + '  ' + hour + ':' + minute + ':' + second;
            },
            backMesTitleList () {
                this.showMesTitleList = true;
            },
            setCurrentMesType (type) {
                if (this.currentMessageType !== type) {
                    this.showMesTitleList = true;
                }
                this.currentMessageType = type;
                if (type === 'unread') {
                    this.h1 = '收件箱';
                    this.noDataText = '收件箱是空的';
                    this.init();
                } else if (type === 'sent') {
                    this.h1 = '发件箱';
                    this.noDataText = '发件箱是空的';
                    this.outbox();
                    this.selectRowData = [];
                } else if (type === 'presend'){
                    this.h1 = '草稿箱';
                    this.noDataText = '草稿箱是空的';
                    this.draftbox();
                    this.selectRowData = [];
                } else {
                    this.h1 = '垃圾箱';
                    this.noDataText = '垃圾箱是空的';
                    this.trashbox();
                    this.selectRowData = [];
                }
            },
            getContent (index) {
                // you can write ajax request here to get message content
                let mesContent = '';
                switch (this.currentMessageType + index) {
                    case 'unread0': mesContent = '这是您点击的《欢迎登录iView-admin后台管理系统，来了解他的用途吧》的相关内容。'; break;
                    case 'unread1': mesContent = '这是您点击的《使用iView-admin和iView-ui组件库快速搭建你的后台系统吧》的相关内容。'; break;
                    case 'unread2': mesContent = '这是您点击的《喜欢iView-admin的话，欢迎到github主页给个star吧》的相关内容。'; break;
                    case 'hasread0': mesContent = '这是您点击的《这是一条您已经读过的消息》的相关内容。'; break;
                    default: mesContent = '这是您点击的《这是一条被删除的消息》的相关内容。'; break;
                }
            },
            init () {
                this.selectRowData = [];
                this.$net.send({
                    server: this.$services.sysService.staffNotifyRestController.query,
                    data: {pageNumber: 0,
                        __EQS_status: 'INBOX',
                        __INS_type: '',
                        __EQS_searchText: ''}
                }).then((data) => {
                    // 保存取到的所有数据
                    this.senderName = data.staffName;
                    this.ajaxHistoryData = data.rows;
                    this.dataCount = data.total;
                    this.pageNumber = data.pageNumber;
                    this.currentNotifyList = this.ajaxHistoryData;
                });
                this.synchBadges();

            },
            requestData(data){
                this.$net.send({
                    server: this.$services.sysService.staffNotifyRestController.query,
                    data: data
                }).then((data) => {
                    this.currentNotifyList = data.rows;
                    this.dataCount = data.total;
                });
            },
            changepage (index){
                this.$net.send({
                    server: this.$services.sysService.staffNotifyRestController.query,
                    data: {pageNumber:index,pageSize:this.pageSize}
                }).then(
                    (data) => {
                        this.ajaxHistoryData = data.rows;
                        this.dataCount = data.total;
                        this.pageNumber = data.pageNumber;
                        this.currentNotifyList = this.ajaxHistoryData;
                    });

            },
            filterBtn (type) {
                this.filterType = type;
                let data = {
                    pageNumber: 0,
                    __EQS_status: 'INBOX',
                    __INS_type: type,
                    __EQS_searchText: ''
                };
                this.requestData(data);
            },
            //自动搜索
            autosearch (){
                this.$net.send({
                    server: this.$services.sysService.notifyRestController.queryNotify,
                }).then((data) => {
                    let filterKey = this.search && this.search.toLowerCase();
                    this.ajaxHistoryData = data.rows;
                    // 保存过滤的所有数据
                    if(filterKey){
                        this.ajaxHistoryData = data.rows.filter(function (row) {
                            return Object.keys(row) .some(function (key){
                                if(key === 'subject'|| key === 'senderName'){
                                    return String(row[key]).toLowerCase().indexOf(filterKey) > -1;
                                }
                            })
                        })
                    }
                    this.dataCount = data.rows.length;
                    if(data.length < this.pageSize){
                        this.currentNotifyList = this.ajaxHistoryData;
                    } else {
                        this.currentNotifyList = this.ajaxHistoryData.slice(0, this.pageSize);
                    }
                })
            },
            staffNotifyView (row) {
                this.$router.push({
                    path: '/staffNotifyView',
                    query:{
                        id: row.id,
                        folderType: row.folderType,
                        staffNotifyId: row.staffNotifyId
                    }
                });
            },
            notifyView (row){
                this.$router.push({
                    path: '/notifyView',
                    query:{
                        id: row.id
                    }
                });
            },
            //全选
            checkedAll (val){
                this.$refs.notifyTable.selectAll(val);
            },
            watch: {
                'currentNotifyList': {
                    handler: function(val) {
                        if (val.length === this.currentNotifyList.length - 1) {
                            this.checked = true;
                        } else {
                            this.checked = false;
                        }
                    },
                    deep: true
                }
            },
            remove (id) {
                this.$Modal.confirm({
                    title: '删除提示',
                    content: '您确定要删除这条数据吗?',
                    onOk: () => {
                        this.$net.send({
                            server: this.$services.sysService.notifyRestController.remove,
                            data: {ids: id}
                        }).then((data) => {
                            this.init();
                        });
                    },
                    onCancel: () => {
                        return false;
                    }
                });
            },
            //标记已读
            markAsRead(id){
                let ids = '';
                //如果传入了id，则是点击了详情，直接用传入的id作为参数，如果没有传入id，则拼接选中的id
                if(id){
                    ids=id;
                }else{
                    if(this.selectRowData.length == 0){
                        this.$Message.destroy();
                        this.$Message.info({duration: 5, content: '请先选择数据'});
                        return;
                    }
                    this.selectRowData.forEach(item => {
                        ids += item.staffNotifyId+',';
                    });
                }
                this.$net.send({
                    server: this.$services.sysService.staffNotifyRestController.markAsRead,
                    data: ids
                }).then((data) => {
                    if (data.success) {
                        this.synchBadges();
                        //如果是查看详情则不提示标记成功
                        if(!id){
                            this.$Message.success(data.msg);
                            this.init();
                        }
                    } else {
                        this.$Message.error(data.msg);
                    }

                });
            },
            //标记未读
            markAsUnread(id){
                let ids = '';
                //如果传入了id，则是点击了详情，直接用传入的id作为参数，如果没有传入id，则拼接选中的id
                if(id){
                    ids=id;
                }else{
                    if(this.selectRowData.length == 0){
                        this.$Message.destroy();
                        this.$Message.info({duration: 5, content: '请先选择数据'});
                        return;
                    }
                    this.selectRowData.forEach(item => {
                        ids += item.staffNotifyId+',';
                    });
                }
                this.$net.send({
                    server: this.$services.sysService.staffNotifyRestController.markAsUnread,
                    data: ids
                }).then((data) => {
                    if (data.success) {
                        this.synchBadges();
                        this.$Message.success(data.msg);
                        this.init();
                    } else {
                        this.$Message.error(data.msg);
                    }
                });
            },
            //同步收件箱、草稿箱上的角标数字
            synchBadges(){
                this.$net.send({
                    server: this.$services.sysService.staffNotifyRestController.synch
                }).then((data) => {
                    this.hasreadCount = data.inboxUnread;
                    this.unreadCount = data.draftUnsend;
                });
            },
            selectRow(selection, row){
                this.selectRowData = selection;
            },
            //全部标记已读
            markAllAsRead(){
                let ids = '';
                this.$net.send({
                    server: this.$services.sysService.staffNotifyRestController.markAllAsRead
                }).then((data) => {
                    if (data.success) {
                        this.synchBadges();
                        this.$Message.success(data.msg);
                        this.init();
                    } else {
                        this.$Message.error(data.msg);
                    }
                });
            },
            //逻辑删除
            deleteFlag(){
                let ids = '';
                if(this.selectRowData.length == 0){
                    this.$Message.destroy();
                    this.$Message.info({duration: 5, content: '请先选择数据'});
                    return;
                }

                this.$Modal.confirm({
                    title: '确认对话框',
                    content: '<p>你确定要删除选中的数据吗?</p>',
                    onOk: () => {
                        let ids = '';
                        if(this.currentMessageType == 'sent'){
                            this.selectRowData.forEach(item => {
                                ids += item.id+',';
                            });
                            //删除发件箱
                            this.$net.send({
                                server: this.$services.sysService.notifyRestController.deleteFlag,
                                data : ids
                            }).then((data) => {
                                if (data.success) {
                                    this.$Message.success(data.msg);
                                    this.outbox();
                                } else {
                                    this.$Message.error(data.msg);
                                }
                            });
                        }else if(this.currentMessageType == 'presend'){
                            this.selectRowData.forEach(item => {
                                ids += item.id+',';
                            });
                            //删除草稿箱
                            this.$net.send({
                                server: this.$services.sysService.notifyRestController.remove,
                                data : ids
                            }).then((data) => {
                                if (data.success) {
                                    this.$Message.success(data.msg);
                                    this.draftbox();
                                } else {
                                    this.$Message.error(data.msg);
                                }
                            });
                        }else if(this.currentMessageType == 'recyclebin'){
                            this.selectRowData.forEach(item => {
                                ids += item.staffNotifyId+',';
                            });
                            this.$net.send({
                                server: this.$services.sysService.staffNotifyRestController.deleteCompletely,
                                data : ids
                            }).then((data) => {
                                if (data.success) {
                                    this.$Message.success(data.msg);
                                    this.trashbox();
                                } else {
                                    this.$Message.error(data.msg);
                                }
                            });
                        }else {
                            //删除收件箱
                            this.selectRowData.forEach(item => {
                               ids += item.staffNotifyId+',';
                           });
                           this.$net.send({
                               server: this.$services.sysService.staffNotifyRestController.deleteFlag,
                               data : ids
                           }).then((data) => {
                               if (data.success) {
                                   this.$Message.success(data.msg);
                                   //收件箱
                                   this.init();
                               } else {
                                   this.$Message.error(data.msg);
                               }
                           });
                        }

                    },
                    onCancel: () => {

                    }
                });
            },
             //查询发件箱数据
            outbox(){
                this.synchBadges();
                this.$net.send({
                    server: this.$services.sysService.notifyRestController.queryNotify,
                    data: {pageNumber: 0,
                        __EQS_status: 'SEND',
                        __INS_type: 'MESSAGE',
                        __EQS_searchText: ''}
                }).then((data) => {

                    // 保存取到的所有数据
                    this.ajaxHistoryData = data.rows;
                    this.dataCount = data.total;
                    this.currentNotifyList = this.ajaxHistoryData;
                });
            },

            //查询垃圾箱数据
            trashbox(){
                this.synchBadges();
                this.$net.send({
                    server: this.$services.sysService.staffNotifyRestController.query,
                    data: {pageNumber: 0,
                        __EQS_status: 'TRASH',
                        __INS_type: '',
                        __EQS_searchText: ''}
                }).then((data) => {
                    // 保存取到的所有数据
                    this.ajaxHistoryData = data.rows;
                    this.dataCount = data.total;
                    this.currentNotifyList = this.ajaxHistoryData;
                });
            },
            //查询草稿箱数据
            draftbox() {
                this.synchBadges();
                this.$net.send({
                    server: this.$services.sysService.notifyRestController.queryNotify,
                    data: {
                        pageNumber: 0,
                        __EQS_status: 'DRAFT',
                        __INS_type: 'MESSAGE',
                        __EQS_searchText: ''
                    }
                }).then((data) => {
                    // 保存取到的所有数据
                    this.ajaxHistoryData = data.rows;
                    this.dataCount = data.total;
                    this.currentNotifyList = this.ajaxHistoryData;
                });
            },
            //彻底删除
            deleteCompletely(){
                if(this.selectRowData.length == 0){
                    this.$Message.destroy();
                    this.$Message.info({duration: 5, content: '请先选择数据'});
                    return;
                }
                let ids = '';
                this.selectRowData.forEach(item => {
                    ids += item.staffNotifyId+',';
                });

                this.$Modal.confirm({
                    title: '确认对话框',
                    content: '<p>你确定要彻底删除选中的数据吗?</p>',
                    onOk: () => {
                        this.$net.send({
                            server: this.$services.sysService.staffNotifyRestController.deleteCompletely,
                            data : ids
                        }).then((data) => {
                            if (data.success) {
                                this.$Message.success(data.msg);
                                this.trashbox();
                            } else {
                                this.$Message.error(data.msg);
                            }
                        });
                    },
                    onCancel: () => {

                    }
                });
            },
            //恢复
            recovery(){
                let ids = '';
                this.selectRowData.forEach(item => {
                    ids += item.staffNotifyId+',';
                });
                if(this.selectRowData.length == 0){
                    this.$Message.destroy();
                    this.$Message.info({duration: 5, content: '请先选择数据'});
                    return;
                }
                this.$net.send({
                    server: this.$services.sysService.staffNotifyRestController.recovery,
                    data : ids
                }).then((data) => {
                    if (data.success) {
                        this.$Message.success(data.msg);
                        this.trashbox();
                    } else {
                        this.$Message.error(data.msg);
                    }
                });
            },
            refresh(){
                this.init();
            },

            //转到发送私信页面
            toSendMessage(notityId){
                if(notityId){
                    this.$router.push({
                        path: '/notifyMessage/edit',
                        query:{notifyId:notityId,senderName:this.senderName}
                    });
                }else{
                    this.$router.push({path: '/notifyMessage/add',query:{senderName:this.senderName}});
                }
            },
            /* 计算时间差 */
             computeTimeDiff(createTime, createTimeString){
                var date = new Date();
                var time = date.getTime() - createTime; //时间差的毫秒数（时间戳）

                //计算相差天数
                var days = Math.floor(time / (24 * 3600 * 1000));

                //计算相差小时
                var modulus = time % (24 * 3600 * 1000);  //计算天数后剩余的时间戳
                var hours = Math.floor(modulus / (3600 * 1000));

                //计算相差分钟数
                var modulusMin = modulus % (3600 * 1000); //计算小时数后剩余的时间戳
                var minutes = Math.floor(modulusMin / (60 * 1000));

                //计算相差秒数
                var modulusSec = modulusMin % (60 * 1000);      //计算分钟数后剩余的时间戳
                var seconds = Math.round(modulusSec / 1000);

                var timeString = '';
                if(days != 0 && days < 2)
                {
                    timeString = '昨天';
                }
                else if(days != 0 && days == 2)
                {
                    timeString = days + '天前';
                }
                else if(days == 0 && hours != 0)
                {
                    timeString = hours + '小时前';
                }
                else if(days == 0 && minutes > 1)
                {
                    timeString = minutes +'分钟前';
                }
                else if(days == 0 && minutes <= 1)
                {
                    timeString = '刚刚';
                }
                else
                {
                    timeString = createTimeString;
                }

                return timeString
            }

        },
        mounted () {
            this.init();
        },
        watch: {
            unreadMesList (arr) {
                this.unreadCount = arr.length;
            },
            hasreadMesList (arr) {
                this.hasreadCount = arr.length;
            },
            recyclebinList (arr) {
                this.recyclebinCount = arr.length;
            }
        }
    };
</script>
