<template>
    <div class="ruleObjectViewCtnr">
        <Card>
            <Row class="preview">
                <Col span="10">
                    <j-label name="英文名称" value="code"></j-label>
                </Col>
                <Col span="10">
                    <j-label name="中文名称" value="name"></j-label>
                </Col>
            </Row>
            <Row class="preview">
                <Col span="10">
                    <j-label name="数据类型" value="dataType"></j-label>
                </Col>
            </Row>
            <Row class="preview">
                 <Col span="10">
                      <j-label name="传递方向" value="inOut"></j-label>
                 </Col>
            </Row>
            <Row class="preview">
                <Col span="10">
                    <j-label name="分组" value="group"></j-label>
                </Col>
            </Row>
            <Row class="preview">
                <Col span="10">
                    <j-label name="描述" value="remark"></j-label>
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
        name: "ruleObjectView",
        data () {
            return {
                row: this.$route.query.row,
                paramData: [],
                column: [
                    { title: '英文名称', align: 'center', key: 'code' },
                    { title: '中文名称', align: 'center', key: 'name' },
                    { title: '数据类型', align: 'center', key: 'dataType' },
                    { title: '传递方向', align: 'center', key: 'inOut' },
                    { title: '分组', align: 'center', key: 'group' },
                    { title: '描述', align: 'center', key: 'remark' },
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
                this.$store.commit('removeTag', 'ruleObjectView');
                this.$store.commit('closePage', 'ruleObjectView');
            }
        }
    }
</script>