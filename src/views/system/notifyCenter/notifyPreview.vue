<template>
    <div class="notifyViewCtnr">
        <Card>
            <Row style="border: 1px solid #e7eaec; padding: 24px;">
                <Col span="16">
                    <h3> 私信 </h3>
                </Col>
                <Col span="8" style="text-align: right;">
                    <Button type="ghost" icon="chevron-left" @click="back()">返回</Button>
                </Col>
            </Row>
            <Row style="border: 1px solid #e7eaec; border-top: 0px; border-bottom: 0px;  padding: 24px 24px 0px 0px;">
                <Col span="11">
                    <j-label name="主题"  value="subject" ></j-label>
                </Col>
            </Row>
            <Row>
                <Col span="11">
                    <j-label name="发件人" value="senderName"></j-label>
                </Col>

            </Row>
            <Row>
                <Col span="11">
                    <j-label name="收件人" value="receiverName"></j-label>
                </Col>

            </Row>

        </Card>
        <Card>
            <Row>
                <Col span="24">
                    <div id="content"></div>
                </Col>
            </Row>
        </Card>
    </div>
</template>

<script>
    import $ from 'jquery';
    export default {
        name: "notifyPreview",
        mounted (){
            let row = this.$route.query.row;
            $('#content').html(row.content);
        },
        methods: {
            back(){
                this.$router.go(-1);
            }
        }
    }
</script>
