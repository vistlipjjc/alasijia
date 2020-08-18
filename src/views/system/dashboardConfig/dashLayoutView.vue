<template>
    <div class="dashLayoutViewCtnr">
        <Card>
            <Row class="preview">
                <Col span="10">
                    <j-label name="布局编码" value="code"></j-label>
                </Col>
                <Col span="10">
                    <j-label name="布局名称" value="name"></j-label>
                </Col>
            </Row>

            <Row class="preview">
                <Col span="10">
                      <j-label name="优先级" value="priority"></j-label>
                </Col>
                <Col span="10">
                    <j-label name="布局设计模式" value="fixedDict:DashLayoutDesignType.designType@system"></j-label>
                </Col>
            </Row>
            <Row class="preview">
                <Col span="10">
                      <j-label name="布局描述" value="desc"></j-label>
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
        name: "dashLayoutView",
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
                this.$store.commit('removeTag', 'dashLayoutView');
                this.$store.commit('closePage', 'dashLayoutView');
            }
        }
    }
</script>