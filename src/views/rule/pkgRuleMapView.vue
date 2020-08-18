<template>
    <div class="pkgRuleMapViewCtnr">
        <Card>
            <Row class="preview">
                <Col span="10">
                    <j-label name="主键" value="id"></j-label>
                </Col>
                <Col span="10">
                    <j-label name="主键" value="rulId"></j-label>
                </Col>
            </Row>
            <Row class="preview">
                <Col span="10">
                    <j-label name="规则集ID" value="pkgId"></j-label>
                </Col>
                <Col span="10">
                <j-label name="规则ID" value="ruleId"></j-label>
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
        name: "pkgRuleMapView",
        ruleModel: true,
        methods: {
            btnBack(){
                this.$router.go(-1);
                this.$store.commit('removeTag', 'pkgRuleMapView');
                this.$store.commit('closePage', 'pkgRuleMapView');
            }
        }
    }
</script>