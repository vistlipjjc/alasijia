<template>
    <div class="suppliersViewCtnr">
        <Card>
            <Row class="preview">
                <Col span="10">
                    <j-label name="流程编码" value="code"></j-label>
                </Col>
                <Col span="10">
                    <j-label name="流程名称" value="name"></j-label>
                </Col>
            </Row>
            <Row class="preview">
                <Col span="10">
                    <j-label name="模板名称" value="procTemplateName"></j-label>
                </Col>
                <Col span="10">
                    <j-label name="模块名称" value="moduleName"></j-label>
                </Col>
            </Row>
            <Row class="preview">
                <Col span="10">
                    <j-label name="版本号" value="procVersion"></j-label>
                </Col>
                <Col span="10">
                    <j-label name="版本状态" value="fixedDict:VersionStatus.procVersionStatus@system"></j-label>
                </Col>
            </Row>
            <Row class="preview">
                <Col span="10">
                    <j-label name="状态" value="fixedDict:Status.status@system"></j-label>
                </Col>
            </Row>
            <Row class="preview">
                <Col span="10">
                    <j-label name="备注" value="remark" ></j-label>
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
        name: "suppliersView",
        methods: {
            btnBack(){
                this.$router.go(-1);
                this.$store.commit('removeTag', 'suppliersView');
                this.$store.commit('closePage', 'suppliersView');
            }
        }
    }
</script>
