<template>
    <div class="dashWidgetViewCtnr">
        <Card>
            <Row class="preview">
                <Col span="10">
                    <j-label name="组件编码" value="code"></j-label>
                </Col>
                <Col span="10">
                    <j-label name="组件名称" value="name"></j-label>
                </Col>
            </Row>
            <Row class="preview">
                <Col span="10">
                    <j-label name="组件类型" value="fixedDict:DashWidgetType.type@system" ></j-label>
                </Col>
                <Col span="10">
                    <j-label name="组件实现类" value="implClass"></j-label>
                </Col>
            </Row>
            <Row class="preview">
                <Col span="10">
                      <j-label name="状态" value="fixedDict:Status.status@system"></j-label>
                </Col>
                <Col span="10">
                    <j-label name="组件描述" value="desc"></j-label>
                </Col>
            </Row>
            <Row class="preview">
                <Col span="10">
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
        name: "dashWidgetView",
        mounted() {
            // this.init();
        },
        methods: {
            // init() {
            //     let data = this.$route.query.row;
            //     // console.info(data);
            //     // this.paramData = JSON.parse(data.param);
            // },
            btnBack(){
                this.$router.go(-1);
                this.$store.commit('removeTag', 'dashWidgetView');
                this.$store.commit('closePage', 'dashWidgetView');
            }
        }
    }
</script>