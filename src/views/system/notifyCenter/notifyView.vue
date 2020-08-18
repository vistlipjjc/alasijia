<template>
    <div class="announcePreviewCtnr">
        <Card>
            <Row style="border: 1px solid #e7eaec; padding: 24px;">
                <Col span="16">
                    <h3> {{title}} </h3>
                </Col>
                <Col span="8" style="text-align: right;">
                    <Button type="ghost" icon="forward" @click="toForward">转发</Button>
                    <Button type="error" icon="close"  @click="deleteFlag">删除</Button>
                    <Button type="ghost" icon="chevron-left" @click="btnBack">返回</Button>
                </Col>
            </Row>
            <Row class="title-row">
                <Col span="4" class="label-name"><span>主 题：</span></Col>
                <Col span="20"><span class="label-value">{{details.subject}}</span></Col>
                <Col span="4" class="label-name"><span>发件人：</span></Col>
                <Col span="20"><span class="label-value">{{details.senderName}}</span></Col>
                <Col span="4" class="label-name"><span>收件人：</span></Col>
                <Col span="20"><span class="label-value">{{details.receiverName}}</span></Col>
            </Row>
            <Row style="border: 1px solid #e7eaec; padding: 24px;">
                <Col>
                <div id="content"></div>
                </Col>
            </Row>
        </Card>
    </div>
</template>

<script>
    export default {
        name: "notifyView",
        data (){
            return{
                id: '',
                title: '',
                details: {}
            }
        },
        methods: {
            init(){
                let vm = this
                vm.id = vm.$route.query.id

                vm.$net.send({
                    server: vm.$services.sysService.notifyRestController.view,
                    append: vm.id
                }).then((data) => {
                    vm.details = data

                    if ('ANNOUNCE' === vm.details.type){
                        vm.title = '系统公告';
                    }
                    else if ('MESSAGE' === vm.details.type){
                        vm.title = '私信消息';
                    }

                    $('#content').html(vm.details.content);
                })
            },
            btnBack(){
                this.$router.go(-1);
                this.$store.commit('removeTag', 'notifyView');
                this.$store.commit('closePage', 'notifyView');
            },
            //转发
            toForward(){
                let vm = this
                vm.$router.push({
                    path: '/notifyMessage/edit',
                    query:{notifyId: vm.details.id, opt: 'forward'}
                });
            },
            deleteFlag(){
                let vm = this
                let id = vm.details.id;

                vm.$Modal.confirm({
                    title: '删除提示',
                    content: '您确定要删除吗?',
                    onOk: () => {
                        vm.$net.send({
                            server: vm.$services.sysService.notifyRestController.deleteFlag,
                            data: id
                        }).then((data) => {
                            vm.$Message.success(data.msg);
                            vm.btnBack();
                        });
                    },
                    onCancel: () => {
                        return false;
                    }
                });
            }
        },
        mounted () {
            this.init();
        }
    }
</script>
<style scoped>
    .label-name{
        font-size: 12px;
        color: #495060;
        text-align: right;
    }
    .label-value{
        font-size: 12px;
        color: #495060;
        margin-left: 5px;
    }
    .title-row{
        border: 1px solid #e7eaec;
        border-top: 0px;
        border-bottom: 0px;
        padding: 24px 24px 6px 24px;
    }
    .title-row div{
        margin-bottom: 18px;
    }
</style>