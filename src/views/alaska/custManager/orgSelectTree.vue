<template>
    <Cascader :data="casData"
              change-on-select
              :disabled="disabled"
              v-model="selectedVal"
              @on-change="onChange">
    </Cascader >
</template>

<script>
  export default {
    props: {
      opt: { // 是否只读
        type: Boolean,
        default: false
      },
      organizationJson: { // 树的数据
        type: Array,
        default: []
      },
      seleted: Array
    },

    data () {
      return {
        disabled: this.opt,
        selectedVal: this.seleted,
        casData: this.organizationJson
      }
    },

    methods: {
      // 选择后回调
      onChange (value, selectedData) {
        // console.log(value, selectedData)
        this.$emit('casSelected', selectedData)
      }

    },

    watch: {
      organizationJson (val) {
        // let res = this.handleData(val)
        // console.log(res)
        this.casData = val
      },

      seleted (val) {
        // console.log(val)
        this.selectedVal = val
      },

      selectedVal (val) {
        if (!val) {
          this.$emit('input', val)
        }
      }
    }

  }
</script>