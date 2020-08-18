<template>
    <div class="roleStdViewCtnr">
        <Card>
            <p slot="title">查看角色类型</p>
            <Row class="preview">
                <Col span="10">
                    <j-label name="角色编码" value="roleStdCode"></j-label>
                </Col>
                <Col span="10">
                    <j-label name="角色名称" value="roleStdName"></j-label>
                </Col>
            </Row>
            <Row class="preview">
                <Col span="10">
                    <j-label name="角色描述" value="roleStdDesc"    ></j-label>
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
        name: "roleStdView",
        methods: {
            btnBack(){
                this.$router.go(-1);
                this.$store.commit('removeTag', 'roleStdView');
                this.$store.commit('closePage', 'roleStdView');
            }
        }
    }
</script>
