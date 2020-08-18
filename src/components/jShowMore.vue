<template>
    <row style="text-align: center;">
        <div class="flShowMore"
            @click="showOrHide">
            <span class="flShowMoreIcon" :class="{'flShowMoreIconUp': showMore}"></span>
            <span>{{ showMore ? '收起' : '展开' }}</span>
        </div>
    </row>
</template>

<script>
  export default {
    props: {
      value: Boolean
    },

    data () {
      return {
        showMore: this.value
      }
    },

    watch: {
      value (val) {
        this.showMore = val
      },

      showMore (val) {
        this.$emit('input', val)
      }
    },

    methods: {
      showOrHide () {
        let vm = this
        vm.showMore = !vm.showMore
        vm.$emit('showOrHide', event)
      }
    }
  }
</script>

<style scoped>
    .flShowMore {
        display: inline-block;
        line-height: 21px;
        margin-top: -5px;
        overflow: hidden;
        cursor: pointer;
    }
    .flShowMore span {
        float: left;
    }
    .flShowMoreIcon {
        display: inline-block;
        width: 21px;
        height: 21px;
        margin-right: 5px;
        background: url('../images/up.png') center center no-repeat;
        transform: rotate(180deg);
    }
    .flShowMoreIconUp {
        transform: rotate(0deg);
    }
</style>
