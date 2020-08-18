<template>
    <div>
        <Card>
            <Row>
                <Col span="12">
                    <j-label name="属性编码" value="propCode"></j-label>
                </Col>
                <Col span="12">
                    <j-label name="属性名称" value="propName"></j-label>
                </Col>
            </Row>
            <Row>
                <Col span="12">
                    <j-label name="是否是主键" value="primaryKey"></j-label>
                </Col>
            </Row>
                <Row>
                    <Col span="12">
                        <j-label name="备注" value="remark"></j-label>
                    </Col>
                </Row>
            <Row>
                <Col>
                    <Button type="ghost" @click="btnBack">返回</Button>
                </Col>
            </Row>
        </Card>
    </div>
</template>

<script>
    export default {
        data() {
            return {

            }

        },
        name: "formPropView",
        methods: {
            /*返回*/
            btnBack() {
                this.$router.go(-1);
                this.$store.commit('removeTag', 'formPropView');
                this.$store.commit('closePage', 'formPropView');
            },
        },
        mounted() {
        }

    }
</script>