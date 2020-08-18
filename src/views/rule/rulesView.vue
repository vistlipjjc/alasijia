<template>
    <div class="rulesViewCtnr">
        <Card>
            <Row class="preview">
                <Col span="22">
                <j-label name="主键" value="id"></j-label>
                </Col>
                <Col span="22">
                <j-label name="规则编码" value="code"></j-label>
                </Col>
                <Col span="22">
                <j-label name="规则名称" value="name"></j-label>
                </Col>

                <Col span="22">
                <j-label name="优先级" value="priority"></j-label>
                </Col>
                <Col span="22">
                <j-label name="备注" value="remark"></j-label>
                </Col>
            </Row>

            <Row style="text-align: center;" class="margin-top-10">
                <Button type="ghost" @click="btnBack">返回</Button>
            </Row>
        </Card>
    </div>
</template>

<script>
    export default {
        name: "rulesView",
        mounted() {
            this.init();
        },
        methods: {
            init() {
                let data = this.$route.query.row;
                this.paramData = JSON.parse(data.param);
            },
            btnBack(){
                this.$router.go(-1);
                this.$store.commit('removeTag', 'rulesView');
                this.$store.commit('closePage', 'rulesView');
            }
        }
    }
</script>