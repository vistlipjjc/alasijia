<template>
    <div class="staffViewCtnr">
        <Card>
            <Row class="preview">
                <Col span="10">
                    <j-label name="部门" value="deptName"></j-label>
                </Col>
                <Col span="10">
                    <j-label name="标准角色" value="stdRoleName"></j-label>
                </Col>
            </Row>
            <Row class="preview">
                <Col span="10">
                    <j-label name="代管部门" value="proxyDeptName"></j-label>
                </Col>
                <Col span="10">
                <j-label name="代管标准角色" value="proxyStdRoleName"></j-label>
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