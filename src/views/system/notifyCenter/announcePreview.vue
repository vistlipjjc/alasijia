<template>
    <div>
            <Row style="border: 1px solid #e7eaec; padding: 24px;">
                <Col span="16">
                    <h3> 系统公告 </h3>
                </Col>
            </Row>
            <Row class="title-row">
                <Col span="4" class="label-name"><span>主 题：</span></Col>
                <Col span="20"><span class="label-value">{{data.subject}}</span></Col>
                <Col span="4" class="label-name"><span>发件人：</span></Col>
                <Col span="20"><span class="label-value">{{data.senderName}}</span></Col>
                <Col span="4" class="label-name"><span>收件人：</span></Col>
                <Col span="20"><span class="label-value">{{data.receiverName}}</span></Col>
            </Row>
            <Row style="border: 1px solid #e7eaec; padding: 24px;">
                <Col>
                    <div id="content"></div>
                </Col>
            </Row>
    </div>
</template>

<script>
    import $ from 'jquery';
    export default {
        name: "announcePreview",
        props:{
            row: Object
        },
        data() {
            return {
                data: this.row || {}
            }
        },
        watch: {
            row(val){
                this.data = val;
                $('#content').html(val.content);
            }
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
