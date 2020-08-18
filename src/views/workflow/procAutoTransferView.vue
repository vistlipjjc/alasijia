<template>
    <div class="procAutoTransferViewCtnr">
        <Card>
            <Row class="preview">
                <Col span="10">
                <j-label name="自动转办用户" value="transferStaffName"></j-label>
                </Col>
                <Col span="10">
                <j-label name="开始时间" value="startTimeString"></j-label>
                </Col>
            </Row>
            <Row class="preview">
                <Col span="10">
                <j-label name="结束时间" value="endTimeString"></j-label>
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
        name: "procAutoTransferView",
        methods: {
            btnBack(){
                this.$router.go(-1);
                this.$store.commit('removeTag', 'procAutoTransferView');
                this.$store.commit('closePage', 'procAutoTransferView');
            }
        }
    }
</script>
