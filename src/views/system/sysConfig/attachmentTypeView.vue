<template>
    <div class="attachmentTypeViewCtnr">
        <Card>
            <Row class="preview">
                <Col span="10">
                    <j-label name="类型编码" value="attachTypeCode"></j-label>
                </Col>
                <Col span="10">
                    <j-label name="类型名称" value="attachTypeName"></j-label>
                </Col>
            </Row>
            <Row class="preview">
                <Col span="10">
                    <j-label name="附件格式" value="attachFormat"></j-label>
                </Col>
                <Col span="10">
                    <j-label name="上传路径" value="attachPath"></j-label>
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
        name: "attachmentTypeView",
        methods: {
            btnBack(){
                this.$router.go(-1);
                this.$store.commit('removeTag', 'attachmentTypeView');
                this.$store.commit('closePage', 'attachmentTypeView');
            }
        }
    }
</script>
