<template>
    <div class="roleGroupViewCtnr">
        <Card>
            <p slot="title">查看角色组具体信息</p>
            <Row class="preview">
                <Col span="10">
                    <j-label name="机构层级" value="fixedDict:UnitHierarchy.hierarchy@system"></j-label>
                </Col>
                <Col span="10">
                    <j-label name="角色组编码" value="roleGroupCode"></j-label>
                </Col>
                <Col span="10">
                    <j-label name="角色组名称" value="roleGroupName"></j-label>
                </Col>
                <Col span="10">
                    <j-label name="角色组描述" value="roleGroupDesc"></j-label>
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
        name: "roleGroupView",
        methods: {
            btnBack(){
                this.$router.go(-1);
                this.$store.commit('removeTag', 'roleGroupView');
                this.$store.commit('closePage', 'roleGroupView');
            }
        }
    }
</script>

<style scoped>

</style>