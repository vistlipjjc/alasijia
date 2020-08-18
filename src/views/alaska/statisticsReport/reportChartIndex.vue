<template>
  <div class="rciBox">
    <div class="rciItem">
      <div class="rciTitle">交易量统计图表</div>
      <div class="rciCont">
        <report-chart domId="tradingVolume" :showKey="['countAll', 'countAmt']"></report-chart>
      </div>
    </div>
    <div class="rciItem">
      <div class="rciTitle">交易量统计图表</div>
      <div class="rciCont">
        <report-chart domId="transactionAmount" yName="金额（万）" :showKey="['sumGrantAmt', 'sumCostAmt']"></report-chart>
      </div>
    </div>
    <div class="rciItem rciBtnBox">
      <Button class="rciBtn" type="ghost" icon="ios-undo">返回</Button>
    </div>
  </div>
</template>

<script>
import reportChart from './reportChart'

export default {
  data () {
    return {
    }
  },

  components: {
    reportChart
  }
}
</script>

<style scoped>
.rciBox {
  padding: 20px;
  background: #fff;
  box-shadow: 0 0 3px #ccc;
}
.rciItem {
  margin-bottom: 30px;
}
.rciTitle {
  padding-bottom: 10px;
  font-weight: 500;
  border-bottom: 1px solid #ccc;
}
.rciBtnBox {
  text-align: center;
}
</style>
