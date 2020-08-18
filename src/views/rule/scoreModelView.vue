<template>
    <div class="scoreModelViewCtnr">
        <Card>
            <Row class="preview">
                <Col span="10">
                    <j-label name="评分编码" value="code"></j-label>
                </Col>
                <Col span="10">
                    <j-label name="评分名称" value="name"></j-label>
                </Col>
            </Row>
            <Row class="preview">
                <Col span="10">
                    <j-label name="规则集名称" value="rulPkgName"></j-label>
                </Col>
            </Row>
            <Row class="preview">
                 <Col span="10">
                      <j-label name="评分算法" value="algorithm"></j-label>
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
        name: "scoreModelView",
        methods: {
            btnBack(){
                this.$router.go(-1);
                this.$store.commit('removeTag', 'scoreModelView');
                this.$store.commit('closePage', 'scoreModelView');
            }
        }
    }
</script>