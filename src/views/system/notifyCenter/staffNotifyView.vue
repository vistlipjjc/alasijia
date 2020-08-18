<template>
    <div class="staffNotifyViewCtnr">
        <Card>
            <Row >
                <Col span="18">
                    <h3 id="type"></h3>
                </Col>
                <Col span="6">
                <ButtonGroup>
                    <Button ref="ghost" type="ghost" icon="pencil" @click="toForward" id="forwardBtn">转发</Button>
                    <Button ref="ghost" type="ghost"  @click="blacklistClick" id="msgBtn">黑名单</Button>
                    <Button ref="ghost" type="ghost"  @click="deleteFlag">删除</Button>
                    <Button ref="ghost" type="ghost"  @click="btnBack">返回</Button>
                </ButtonGroup>
                </Col>

            </Row>
            <Row class="preview">
                <div class="previewTitle">主题:</div>
                <div class="previewCont">{{ details.subject }}</div>
            </Row>
            <Row class="preview">
                <div class="previewTitle">发件人:</div>
                <div class="previewCont">{{ details.senderName }}</div>
            </Row>
            <Row  class="preview">
                <div class="previewTitle">时间:</div>
                <div class="previewCont">{{ details.sendTimeString }}</div>
            </Row>
        </Card>
        <Card>
            <Row>
                <Col>
                    <span id="content"></span>
                </Col>
            </Row>
        </Card>
    </div>
</template>

<script>
    export default {
        name: "staffNotifyView",
        data () {
            return {
                id: '',
                folderType: '',
                details: {}
            }
        },

        methods: {
            init(){
                let vm = this
                let typeString;

                vm.id = vm.$route.query.id
                vm.folderType = vm.$route.query.folderType

                vm.$net.send({
                    server: vm.$services.sysService.notifyRestController.view,
                    append: vm.id
                }).then((data) => {
                    vm.details = data

                    if(vm.details.type == 'ANNOUNCE'){
                        typeString = '系统公告';
                    }else if(vm.details.type == 'MESSAGE'){
                        typeString = '私信消息';
                    }else if(vm.details.type == 'TODO'){
                        typeString = '代办任务';
                    }else if(vm.details.type == 'REMIND'){
                        typeString = '提醒信息';
                    }

                    document.querySelector('#type').innerText = typeString;
                    document.querySelector('#content').innerText = vm.details.content;
                });

                if(vm.folderType == 'trashbox'){
                    document.querySelector('#forwardBtn').hidden = true;
                    document.querySelector('#msgBtn').hidden = true;
                }
            },
            btnBack(){
                this.$router.go(-1);
                this.$store.commit('removeTag', 'staffNotifyView');
                this.$store.commit('closePage', 'staffNotifyView');
            },
            //转发
            toForward(){
                let vm = this
                vm.$router.push({
                    path: '/notifyMessage/edit',
                    query:{notifyId: vm.id, opt: 'forward'}
                });
            },
            //黑名单
            blacklistClick(){
                let vm = this
                let sender = vm.details.sender;
                let senderName = vm.details.senderName;
                vm.$net.send({
                    server:vm.$services.sysService.notifyConfigRestController.getBlacklistByStaffCode,
                    append:sender
                }).then((data) => {
                   //如果发件人没有在黑名单中，则允许添加黑名单,否则不允许
                    if(data.isExist){
                        vm.$Message.info({duration: 5, content: senderName + '已存在您的黑名单中。'});
                    }else{
                        let obj = {
                            blacklist: sender,
                            blacklistName: senderName
                        }
                        vm.$net.send({
                            server: vm.$services.sysService.notifyConfigRestController.addBlacklist,
                            data: obj
                    }).then((data) => {
                            if (data.success) {
                                vm.$Message.success(data.msg);
                                vm.$router.go(-1);
                            } else {
                                vm.$Message.error(data.msg);
                            }
                        });
                    }

                });
            },
            deleteFlag(){
                let vm = this
                let id = vm.$route.query.staffNotifyId;
                if(vm.folderType == 'inbox'){
                    //收件箱逻辑删除
                    vm.$Modal.confirm({
                        title: '删除提示',
                        content: '您确定要删除吗?',
                        onOk: () => {
                            vm.$net.send({
                                server: vm.$services.sysService.staffNotifyRestController.deleteFlag,
                                data: id
                            }).then((data) => {
                                vm.$Message.success(data.msg);
                                vm.$router.go(-1);
                            });
                        },
                        onCancel: () => {
                            return false;
                        }
                    });

                }else if(vm.folderType == 'trashbox'){
                    //垃圾箱物理删除
                    vm.$Modal.confirm({
                        title: '删除提示',
                        content: '您确定要删除吗?',
                        onOk: () => {
                            vm.$net.send({
                                server: vm.$services.sysService.staffNotifyRestController.deleteCompletely,
                                data: id
                            }).then((data) => {
                                vm.$Message.success(data.msg);
                                vm.$router.go(-1);
                            });
                        },
                        onCancel: () => {
                            return false;
                        }
                    });
                }
            }
        },
        mounted () {
            this.init();
        }
    }
</script>

<style scoped>
.preview {
    position: relative;
    padding: 10px 0 10px 180px;
    font-size: 12px;
    color: #495060;
    line-height: 20px;
}
.previewTitle {
    position: absolute;
    top: 10px;
    left: 0;
    width: 160px;
    text-align: right;
}
</style>
