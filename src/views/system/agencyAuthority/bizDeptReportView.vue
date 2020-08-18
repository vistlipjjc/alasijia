<template>
    <div class="bizDeptReportViewCtnr">
        <Card>
            <Row class="preview">
                <Col span="10">
                    <j-label name="上报部门" value="deptName"></j-label>
                </Col>
                <Col span="10">
                    <j-label name="业务种类" value="bizName"></j-label>
                </Col>
            </Row>
            <Row class="preview">
                <Col span="10">
                    <j-label name="管理部门" value="managerDeptName"></j-label>
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
        name: "bizDeptProxyView",
        methods: {
            btnBack(){
                this.$router.go(-1);
                this.$store.commit('removeTag', 'bizDeptProxyView');
                this.$store.commit('closePage', 'bizDeptProxyView');
            }
        }
    }
</script>
