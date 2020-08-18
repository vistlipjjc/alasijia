<template>
    <div class="dashLayoutRoleViewCtnr">
        <Card>
            <Row class="preview">
                <Col span="__12">
                    <j-label name="岗位编码" value="roleCode"></j-label>
                </Col>
                <Col span="__12">
                    <j-label name="岗位名称" value="roleName"></j-label>
                </Col>
                <Col span="__12">
                <j-label name="岗位描述" value="roleDesc"></j-label>
                </Col>

                <Col span="__12">
                <j-label name="布局编码  " value="layoutCode"></j-label>
                </Col>
                <Col span="__12">
                <j-label name="布局名称  " value="layoutName"></j-label>
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
        name: "dashLayoutRoleView",
        methods: {
            init() {
                let data = this.$route.query.row;
                this.paramData = JSON.parse(data.param);
            },
            btnBack(){
                this.$router.go(-1);
                this.$store.commit('removeTag', 'dashLayoutRoleView');
                this.$store.commit('closePage', 'dashLayoutRoleView');
            }
        }
    }
</script>

<style scoped>

</style>