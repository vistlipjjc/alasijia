<template>
    <div class="tenantViewCtnr">
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
                    <j-label name="是否根租户" value="isRoot"></j-label>
                </Col>
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
        name: "tenantView",
        methods: {
            btnBack(){
                this.$router.go(-1);
                this.$store.commit('removeTag', 'tenantView');
                this.$store.commit('closePage', 'tenantView');
            }
        }
    }
</script>