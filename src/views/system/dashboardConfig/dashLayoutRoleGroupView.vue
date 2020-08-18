<template>
    <div class="dashLayoutRoleGroupViewCtnr">
        <Card>
            <Row class="preview">
                <Col span="__12">
                    <j-label name="角色组编码" value="roleGroupCode"></j-label>
                </Col>
                <Col span="__12">
                    <j-label name="角色组名称" value="roleGroupName"></j-label>
                </Col>
                <Col span="__12">
                <j-label name="角色组描述" value="roleGroupDesc"></j-label>
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
        name: "dashLayoutRoleGroupView",
        methods: {
            init() {
                let data = this.$route.query.row;
                this.paramData = JSON.parse(data.param);
            },
            btnBack(){
                this.$router.go(-1);
                this.$store.commit('removeTag', 'dashLayoutRoleGroupView');
                this.$store.commit('closePage', 'dashLayoutRoleGroupView');
            }
        }
    }
</script>

<style scoped>

</style>