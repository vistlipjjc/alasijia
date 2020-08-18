<template>
    <Card>
        <p slot="title">权限管理（当前角色：{{ roleParams.name }}）</p>
        <Tabs type="card" v-model="name">
            <TabPane label="功能权限" name="versatile">
                <versatile-authorize v-if="name === 'versatile'" :roleParams="roleParams"></versatile-authorize>
            </TabPane>

            <TabPane label="数据权限" name="data">
                <data-authorize v-if="name === 'data'"></data-authorize>
            </TabPane>
        </Tabs>
    </Card>
</template>

<script>
  import versatileAuthorize from './versatileAuthorize.vue'
  import dataAuthorize from './dataAuthorize.vue'
  export default {
    components: {
      versatileAuthorize,
      dataAuthorize
    },

    data () {
      return {
        name: 'versatile',
        roleParams: this.$route.query
      }
    }
  }
</script>

<style>

</style>
