<template>
<div class="calendarViewCtnr">
    <Card>
      <Row class="preview">
            <Col span="10">
                <j-label name="日历编码" value="code"></j-label>
            </Col>
            <Col span="10">
                <j-label name="日历名称" value="name"></j-label>
            </Col>
        </Row>
        <Row class="preview">
            <Col span="24">
                <j-label name="备注" value="remark" fullLine></j-label>
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
    name: 'calendarView',
    data () {
      return {
          row: this.$route.query.row
        }
    },
      methods: {
          btnBack(){
              this.$router.go(-1);
              this.$store.commit('removeTag', 'calendarView');
              this.$store.commit('closePage', 'calendarView');
          }
      }
  }
</script>
