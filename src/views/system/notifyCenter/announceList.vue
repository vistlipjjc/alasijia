<style lang="less">
    @import './announce.less';
</style>

<template>
    <Row class="notifyCntr">
        <Col :xs="24" :sm="24" :md="4" :lg="4">
            <div class="main-con">
                <div>
                    <Button type="primary" long @click="toSendAnnounce('ADD')">发公告</Button>
                </div>
                <div  style="padding-left: 3px;">
                    <h5>文件夹</h5>
                </div>
                <div class="main-con-list">
                    <Button @click="setCurrentMesType('sendbox')" size="large" long type="text" class="main-con-btn">
                        <transition name="mes-current-type-btn">
                            <Icon v-show="currentMessageType === 'sendbox'" type="checkmark"></Icon>
                        </transition>
                        <Icon type="email" size="17"/>
                        <span class="mes-type-btn-text">发件箱</span>
                    </Button>
                </div>
                <div class="main-con-list">
                    <Button @click="setCurrentMesType('draftbox')" size="large" long type="text" class="main-con-btn">
                        <transition name="mes-current-type-btn">
                            <Icon v-show="currentMessageType === 'draftbox'" type="checkmark"></Icon>
                        </transition>
                        <Icon type="ios-compose" size="17"/>
                        <span class="mes-type-btn-text">草稿箱</span>
                        <Badge class="message-count-badge-outer" class-name="message-count-badge" :count="draftUnsend"></Badge>
                    </Button>
                </div>
                <div >
                    <router-link to="/announceEdit">
                        <Button type="primary" long>默认配置</Button>
                    </router-link>
                </div>
            </div>
        </Col>
        <Col  :xs="24" :sm="24" :md="20" :lg="20">
            <Card >
                <Row>
                    <Col span="16" style="padding-left: 19px;">
                        <h3 style="margin: 0px;">{{h1}}</h3>
                    </Col>
                    <Col span="8">
                        <Input v-model="searchText" icon="search" placeholder="搜索" v-on:input="autoSearch(currentMessageType)"/>
                    </Col>
                </Row>
                <Row  style="margin-top: 15px">
                    <Col span="1" style="text-align: left; padding-left: 19px; margin-top: 5px">
                        <Checkbox v-model="checked" @on-change="checkedAll"/>
                    </Col>
                    <Col span="12" style="text-align: left; padding-left: 13px">
                        <Button type="ghost" icon="ios-trash" @click="deleteFlag">删除</Button>
                    </Col>
                </Row>
                <div class="content-con" style="margin-top: 10px">
                    <div class="message-title-list-con">
                        <Table ref="notifyList" height="500"
                               :columns="notifyTitleColumns"
                               :data="currentNotifyList"
                               :no-data-text="noDataText"
                               :show-header="false"
                               :border="false"
                               @on-selection-change="selectRow">
                        </Table>
                        <Row type="flex" justify="end" style="margin-top: 10px;">
                            <Col>
                                <Page :total="dataCount" :current="pageNumber" :page-size="50" @on-change="changePage"></Page>
                            </Col>
                        </Row>
                    </div>
                </div>
            </Card>
        </Col>
    </Row>
</template>

<script>

    export default {
        name: 'announceList',
        data () {
            return {
                h1:'发件箱',
                queryNotify: this.$services.sysService.notifyRestController.queryNotify,
                searchText: '', //搜索文本
                currentMessageType: 'sendbox',
                noDataText: '暂无未读公告',
                dataCount: 0, // 初始化信息总条数
                pageNumber: 1, //当前页码
                currentNotifyList: [], //表格数据
                selectRowData:[], //选中的公告列表
                checked: false, //全选多选框的状态
                draftUnsend: 0, //草稿箱未发送的公告数量
                notifyTitleColumns: [
                    {
                        title: '',
                        type: 'selection',
                        size: 'large',
                        align: 'left',
                        width: 46,
                        className: 'column-selection',
                        render: (h, params) => {
                            if (this.currentMessageType === 'sendbox') {
                                return h('div', [
                                    deleteMesBtn(h, params)
                                ]);
                            } else if (this.currentMessageType === 'draftbox') {
                                return h('div', [
                                ]);
                            } else {
                                return h('div', [
                                    restoreBtn(h, params)
                                ]);
                            }
                        }
                    },
                    {
                        title: '',
                        key: 'receiverName',
                        align: 'left',
                        width: 150,
                        ellipsis: true,
                        className: 'column-receiver-name',
                        render: (h, params) => {
                            return h('a', {
                                on: {
                                    click: () => {
                                        this.$store.commit('notify/updateAnnBoxStatus', this.currentMessageType); //管理当前文件夹被选中的类型

                                        if(this.currentMessageType == 'draftbox'){
                                            //如果是草稿箱，则转型发送私信页面
                                            this.toSendAnnounce(params.row.id);
                                        }else if(this.currentMessageType == 'sendbox'){
                                            //发件箱
                                            this.notifyView(params.row);
                                        }
                                    }
                                }
                            }, params.row.receiverName);
                        }
                    },
                    {
                        title: '',
                        key: 'type',
                        align: 'right',
                        width: 30,
                        ellipsis: true,
                        className: 'column-type',
                        render: (h, params) => {
                            let type = params.row.type;
                            if ('ANNOUNCE' === type){
                                return h('Icon',{
                                    props:{
                                        type: 'speakerphone',
                                        color: '#33a3dc'
                                    }
                                });
                            }else if ('TODO' === type){
                                return h('Icon',{
                                    props:{
                                        type: 'edit',
                                        color: '#d93a49'
                                    }
                                });
                            }else if ('REMIND' === type){
                                return h('Icon',{
                                    props:{
                                        type: 'ios-bell',
                                        color: '#fcaf17'
                                    }
                                });
                            }else if ('MESSAGE' === type){
                                return h('Icon',{
                                    props:{
                                        type: 'email',
                                        color: '#65c294'
                                    }
                                });
                            }
                        }
                    },
                    {
                        title: '',
                        key: 'subject',
                        align: 'left',
                        width: 380,
                        ellipsis: true,
                        render: (h, params) => {
                            return h('a', {
                                on: {
                                    click: () => {
                                        this.$store.commit('updateAnnBoxStatus', this.currentMessageType); //管理当前文件夹被选中的类型

                                        if(this.currentMessageType == 'draftbox'){
                                            //如果是草稿箱，则转型发送私信页面
                                            this.toSendAnnounce(params.row.id);
                                        }else if(this.currentMessageType == 'sendbox'){
                                            //发件箱
                                            this.notifyView(params.row);
                                        }
                                    }
                                }
                            }, params.row.subject);
                        }
                    },
                    {
                        title: '',
                        key: 'isUpload',
                        align: 'center',
                        width: 30,
                        className: 'column-type',
                        render: (h, params) => {
                            let isUpload = params.row.isUpload;
                            if ('Y' === isUpload){
                                return h('Icon',{
                                    props:{
                                        type: 'android-attach',
                                    }
                                });
                            }
                        }
                    },
                    {
                        title: '',
                        key: 'createTime',
                        align: 'center',
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
                                },this.computeTimeDiff(params.row.createTime,this.formatDate(params.row.createTime)))
                            ]);
                        }
                    }
                ]
            };
        },
        mounted () {
            this.init();
        },
        methods: {
            init () {
                // this.currentMessageType = this.$store.getters['notify/getAnnBoxStatus']; // TODO 状态管理文件夹选中状态，测试失败

                //获取数据前先清空全选
                this.selectRowData = [];

                //查询公告列表数据
                this.$net.send({
                    server: this.queryNotify,
                    data: {
                        pageNumber: 0,
                        __EQS_status: 'SEND',
                        __INS_type: 'ANNOUNCE'
                    }
                }).then ((data) => {
                    this.currentNotifyList = data.rows;
                    this.dataCount = data.total;
                });

                //获取草稿箱消息条数角标
                this.synchBadges();
            },
            selectRow(selection){
                this.selectRowData = selection;
                this.checked = selection.length === this.currentNotifyList.length;
            },
            setCurrentMesType (type) {
                this.searchText = ''; //切换文件夹类型时，清空搜索框
                this.currentMessageType = type; //设置当前公告箱类型

                if (type === 'sendbox') {
                    this.h1 = '发件箱';
                    this.noDataText = '发件箱是空的';
                    this.currentNotifyList = this.init();
                } else if (type === 'draftbox') {
                    this.h1 = '草稿箱';
                    this.noDataText = '草稿箱是空的';
                    this.currentNotifyList = this.draftbox();
                }
            },
            //翻页
            changePage (index){
                this.pageNumber = index; //当前页码

                this.$net.send({
                    server: this.queryNotify,
                    data: {
                        pageNumber: index,
                        __EQS_status: 'SEND',
                        __INS_type: 'ANNOUNCE'
                    }
                }).then ((data) => {
                    this.currentNotifyList = data.rows;
                    this.dataCount = data.total;
                });
            },
            //自动搜索
            autoSearch (type){
                let status = '';
                if(type === 'sendbox') status = 'SEND'; //发件箱列表
                else if(type === 'draftbox') status = 'DRAFT'; //草稿箱列表

                this.$net.send({
                    server: this.queryNotify,
                    data: {
                        pageNumber: 0,
                        __EQS_type: 'ANNOUNCE',
                        __EQS_status: status,
                        __EQS_searchText: this.searchText,
                    }
                }).then((data) => {
                    this.currentNotifyList = data.rows;
                    this.dataCount = data.total;
                })
            },
            //全选
            checkedAll (val){
                this.$refs.notifyList.selectAll(val);
            },
            //查询草稿箱数据
            draftbox() {
                //获取数据前先清空全选
                this.selectRowData = [];

                //获取草稿箱消息条数角标
                this.synchBadges();

                //查询公告列表草稿箱数据
                this.$net.send({
                    server: this.queryNotify,
                    data: {
                        pageNumber: 0,
                        __EQS_status: 'DRAFT',
                        __INS_type: 'ANNOUNCE'
                    }
                }).then ((data) => {
                    this.currentNotifyList = data.rows;
                    this.dataCount = data.total;
                });
            },
            //同步草稿箱上的角标数字
            synchBadges(){
                this.$net.send({
                    server: this.$services.sysService.notifyRestController.synch
                }).then((data) => {
                    this.draftUnsend = data.draftUnsend;
                });
            },
            //逻辑删除
            deleteFlag(){
                let ids = '';
                if(this.selectRowData.length == 0){
                    this.$Message.warning({duration: 5, content: '请先选择数据'});
                    return;
                }

                this.$Modal.confirm({
                    title: '确认对话框',
                    content: '<p>你确定要删除选中的数据吗?</p>',
                    onOk: () => {
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
                                if(this.currentMessageType == 'sendbox'){
                                    //如果是删除发件箱，则刷新发件箱列表
                                    this.init();
                                }else if(this.currentMessageType == 'draftbox'){
                                    //如果是删除草稿箱，则刷新草稿箱列表
                                    this.draftbox();
                                }
                            } else {
                                this.$Message.error(data.msg);
                            }
                        });

                    }
                });
            },
            // 跳转公告编辑页面
            toSendAnnounce(notityId){
                if(notityId !== 'ADD'){
                    this.$router.push({
                        path: '/notifyAnnounce/edit',
                        query:{notifyId: notityId}
                    });
                }else{
                    this.$router.push({path: '/notifyAnnounce/add'});
                }
            },
            // 跳转公告查看页面
            notifyView (row){
                this.$router.push({
                    path: '/notifyView',
                    query:{
                        row:row
                    }
                });
            },
            // 转换日期格式
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
            /* 计算时间差 */
            computeTimeDiff(createTime, createTimeString){
                let date = new Date();
                let time = date.getTime() - createTime; //时间差的毫秒数（时间戳）

                //计算相差天数
                let days = Math.floor(time / (24 * 3600 * 1000));

                //计算相差小时
                let modulus = time % (24 * 3600 * 1000);  //计算天数后剩余的时间戳
                let hours = Math.floor(modulus / (3600 * 1000));

                //计算相差分钟数
                let modulusMin = modulus % (3600 * 1000); //计算小时数后剩余的时间戳
                let minutes = Math.floor(modulusMin / (60 * 1000));

                //计算相差秒数
                let modulusSec = modulusMin % (60 * 1000);      //计算分钟数后剩余的时间戳
                let seconds = Math.round(modulusSec / 1000);

                let timeString = '';
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
        }
    };
</script>
