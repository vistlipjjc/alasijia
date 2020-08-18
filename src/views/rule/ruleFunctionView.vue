<template>
    <div class="ruleFunctionViewCtnr">
        <Card>
            <Row class="preview">
                <Col span="10">
                <j-label name="编码" value="code"></j-label>
                </Col>
                <Col span="10">
                <j-label name="名称" value="name"></j-label>
                </Col>
            </Row>
            <Row class="preview">
                <Col span="10">
                <j-label name="描述" value="remark"></j-label>
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
        name: "ruleFunctionView",
        data() {
            return {
                row: this.$route.query.row,
                paramData: [],
                column: [
                    {title: '编码', align: 'center', key: 'code'},
                    {title: '名称', align: 'center', key: 'name'},
                    {title: '描述', align: 'center', key: 'remark'},
                ]
            }
        }, mounted() {
            this.init();
        },
        methods: {
            init() {
                let data = this.$route.query.row;
                this.paramData = JSON.parse(data.param);
            },
            btnBack() {
                this.$router.go(-1);
                this.$store.commit('removeTag', 'ruleFunctionView');
                this.$store.commit('closePage', 'ruleFunctionView');
            }
        }
    }
</script>