<template>
<div class="jobEntityViewCtnr">
    <Card>
        <Row class="preview">
            <Col span="10">
                <j-label name="任务编码" value="code"></j-label>
            </Col>
            <Col span="10">
                <j-label name="任务名称" value="name"></j-label>
            </Col>
        </Row>
        <Row class="preview">
            <Col span="10">
                <j-label name="日历" value="custom:calendar/queryAll.calendarCode@schedule"></j-label>
            </Col>
            <Col span="10">
                <j-label name="任务类型" value="custom:jobGroup/queryAll.groupCode@schedule"></j-label>
            </Col>
        </Row>
        <Row class="preview">
            <Col span="10">
                <j-label name="任务类型1" value="fixedDict:JobType1Dict.jobType1@schedule"></j-label>
            </Col>
            <Col span="10">
                <j-label name="任务类型2" value="fixedDict:JobType2Dict.jobType2@schedule"></j-label>
            </Col>
        </Row>
        <Row class="preview">
            <Col span="10">
                <j-label name="服务" value="serviceId"></j-label>
            </Col>
            <Col span="10">
                <j-label name="开始时间" value="startDate"></j-label>
                <j-label name="结束时间" value="endDate"></j-label>
            </Col>
        </Row>
        <Row class="preview">
            <Col span="10">
                <j-label name="优先级" value="priority"></j-label>
            </Col>
            <Col span="10">
                <span class="keyLabel">超时时间：</span>
                <span class="keyValue">{{row.timeout}} {{row.timeoutUnit}}</span>
            </Col>
        </Row>
        <Row class="preview">
            <Col span="10">
                <j-label name="超时处理" value="fixedDict:JobInstructionDict.timeoutInstruction@schedule"></j-label>
            </Col>
            <Col span="10">
                <j-label name="失败处理" value="fixedDict:JobInstructionDict.errorInstruction@schedule"></j-label>
            </Col>
        </Row>
        <Row class="preview"style="margin-top: 10px;">
            <Col span="4" style="text-align: right; margin-right: 8px; font-size: 12px;">
                <span>任务参数:</span>
            </Col>
            <Col span="15" style="text-align: left;">
            <param-table
                    refs="paramTable"
                    v-model="paramData"
                    :columns-list="column">
            </param-table>
            </Col>
        </Row>
        <Row class="preview">
            <Col span="10">
            <j-label name="任务表达式" value="cronExpression"></j-label>
            </Col>
            <Col span="10">
            <j-label name="状态" value="fixedDict:JobStatusDict.status@schedule"></j-label>
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
    name: 'jobEntityView',
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
    },
      mounted() {
        this.init();
      },
      methods: {
        init(){
            if(this.row.param){
                this.paramData = JSON.parse(this.row.param);
            }else{
                this.$net.send({
                    server: this.$services.schService.jobGroupRestController.get,
                    append: this.row.groupCode
                }).then((data) => {
                    this.paramData = JSON.parse(data.param);
                });
            }

            /^fixedDict\:(\w+).(\w+)@(\w+)/g.test('fixedDict:TimeoutUnitDict.timeoutUnit@schedule');
            let _class = RegExp.$1;
            let _column = RegExp.$2;
            let _server = RegExp.$3;

            this.$store.dispatch('cache/cacheDict', {type: 'fixedDict', url: _class, service: _server})
                .then(data => {
                    this.row.timeoutUnit = this.$store.getters['cache/getCacheDictName'](_class, this.row[ _column]);
                });
        },
          btnBack(){
              this.$router.go(-1);
              this.$store.commit('removeTag', 'jobEntityView');
              this.$store.commit('closePage', 'jobEntityView');
          }
      }
  }
</script>
