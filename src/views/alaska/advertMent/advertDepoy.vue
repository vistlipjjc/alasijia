<template>
  <div class="psiBox">
    <Tabs type="card" v-model="name">
      <TabPane label="默认广告配置" name="common">
        <commonParams></commonParams>
      </TabPane>

      <TabPane label="自定义广告配置" name="weight">
        <weightParams></weightParams>
      </TabPane>
    </Tabs>
  </div>
</template>

<script>
import commonParams from './commonParams'
import weightParams from './weightParams'

export default {
  data () {
    return {
      name: 'common'
    }
  },

  components: {
    commonParams,
    weightParams
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
