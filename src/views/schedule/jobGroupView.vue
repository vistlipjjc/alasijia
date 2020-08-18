<template>
<div class="jobGroupViewCtnr">
    <Card>
      <Row class="preview">
            <Col span="10">
                <j-label name="类型编码" value="code"></j-label>
            </Col>
            <Col span="10">
                <j-label name="类型名称" value="name"></j-label>
            </Col>
        </Row>
        <Row class="preview">
            <Col span="4" style="text-align: right; margin-right: 8px; font-size: 12px;">
                <span>参数:</span>
            </Col>
            <Col span="15" style="text-align: left;">
                <param-table
                        refs="timeTable"
                        v-model="paramData"
                        :columns-list="column">
                </param-table>
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
    import ParamTable from './component/jobGroupParamTable';

export default {
    name: 'jobGroupView',
    components: {
        ParamTable
    },
    data () {
      return {
          row: this.$route.query.row,
          paramData: [],
          column: [
              { title: '编码', align: 'center', key: 'code'},
              { title: '类型', align: 'center', key: 'type'},
              { title: '默认值', align: 'center', key: 'value'},
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
              this.$store.commit('removeTag', 'jobGroupView');
              this.$store.commit('closePage', 'jobGroupView');
          }
      }
  }
</script>
