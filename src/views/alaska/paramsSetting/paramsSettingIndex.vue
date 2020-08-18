<template>
  <div class="psiBox">
    <Tabs type="card" v-model="name">
      <TabPane label="常规派单参数" name="common">
        <commonParams v-if="name === 'common'"></commonParams>
      </TabPane>

      <TabPane label="机构派单权重" name="weight">
        <weightParams v-if="name === 'weight'"></weightParams>
      </TabPane>

      <TabPane label="额度测算参数" name="amount">
        <amountParams v-if="name === 'amount'"></amountParams>
      </TabPane>
      <TabPane label="节假日参数" name="holiday">
        <holidayParams v-if="name === 'holiday'"></holidayParams>
      </TabPane>
    </Tabs>
  </div>
</template>

<script>
import commonParams from './commonParams'
import weightParams from './weightParams'
import amountParams from './amountParams'
import holidayParams from './holidayParams'

export default {
  data () {
    return {
      name: 'common'
    }
  },

  components: {
    commonParams,
    weightParams,
    amountParams,
    holidayParams
  }
}
</script>

<style scoped>
.psiBox {
  padding: 10px;
  background-color: #fff;
}
</style>

<style>
.psiBox .ivu-tabs {
  overflow: auto;
  overflow-x: hidden;
}
</style>
