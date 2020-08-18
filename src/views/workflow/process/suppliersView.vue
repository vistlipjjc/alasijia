<template>
    <div class="suppliersViewCtnr">
        <Card>
            <Row class="preview">
                <Col span="10">
                    <j-label name="资产编码" value="code"></j-label>
                </Col>
                <Col span="10">
                    <j-label name="资产名称" value="name"></j-label>
                </Col>
            </Row>
            <Row class="preview">
                <Col span="10">
                    <j-label name="购入日期" value="purchaseDt"></j-label>
                </Col>
                <Col span="10">
                    <j-label name="单价" value="price"></j-label>
                </Col>
            </Row>
            <Row class="preview">
                <Col span="10">
                    <j-label name="使用者编码" value="staffCode"></j-label>
                </Col>
                <Col span="10">
                    <j-label name="使用者名称" value="staffName"></j-label>
                </Col>
            </Row>
            <Row class="preview">
                <Col span="10">
                    <j-label name="备注" value="remark" ></j-label>
                </Col>
            </Row>
        </Card>
    </div>
</template>

<script>
    export default {
        name: "suppliersView",
        methods: {
            btnBack(){
                this.$router.go(-1);
                this.$store.commit('removeTag', 'suppliersView');
                this.$store.commit('closePage', 'suppliersView');
            }
        },
        created() {
            this.$route.query.row = this.bizData;
        },
        props: ['bizData']
    }
</script>
