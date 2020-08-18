<template>
    <div class="rulePackagesViewCtnr">
        <Card>
            <Row class="preview">
                <Col span="10">
                    <j-label name="英文名称" value="code"></j-label>
                </Col>
                <Col span="10">
                    <j-label name="中文名称" value="name"></j-label>
                </Col>
            </Row>
            <Row class="preview">
                <Col span="10">
                    <j-label name="是否评分" value="fixedDict:YesNo.type@system"></j-label>
                </Col>
            </Row>
            <Row class="preview">
                 <Col span="10">
                      <j-label name="评分模型" value="scoreModel"></j-label>
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
        name: "packagesView",
        methods: {
            btnBack(){
                this.$router.go(-1);
                this.$store.commit('removeTag', 'packagesView');
                this.$store.commit('closePage', 'packagesView');
            }
        }
    }
</script>
