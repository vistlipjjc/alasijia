<template>
    <div class="staffGroupViewCtnr">
        <Card>
            <p slot="title">查看用户组具体信息</p>
            <Row class="preview">
                <Col span="12" offset="6">
                    <j-label name="用户组编码" value="staffGroupCode"></j-label>
                </Col>
                <Col span="12" offset="6">
                    <j-label name="用户组名称" value="staffGroupName"></j-label>
                </Col>
                <Col span="12" offset="6">
                <j-label name="用户组描述" value="staffGroupDesc"></j-label>
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
        name: "staffGroupView",
        data () {
            return {
                row: this.$route.query.row,
                paramData: [],
                column: [
                    { title: '用户组编码', align: 'center', key: 'staffGroupCode' },
                    { title: '用户组名称', align: 'center', key: 'staffGroupName' },
                    { title: '用户组描述', align: 'center', key: 'staffGroupDesc' },
                ]
            }
        },mounted() {
            this.init();
        },
        methods: {
            init() {
                let data = this.$route.query.row;
                this.paramData = JSON.parse(data.param);
            },
            btnBack(){
                this.$router.go(-1);
                this.$store.commit('removeTag', 'staffGroupView');
                this.$store.commit('closePage', 'staffGroupView');
            }
        }
    }
</script>

<style scoped>

</style>