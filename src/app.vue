<template>
    <div id="main" class="app-main">
        <router-view></router-view>
    </div>
</template>

<script>
    export default {
        data () {
            return {
                theme: this.$store.state.app.themeColor
            };
        },
        mounted () {
          this.$Message.config({
            top: 120,
            duration: 3
          })
        },
        beforeDestroy () {

        },
        methods: {

        },
        created(){
        }
    };
</script>

<style>
@import "./styles/common.less";

html,body{
    width: 100%;
    height: 100%;
    background: #f0f0f0;
    overflow: auto;
}
.app-main{
    width: 100%;
    height: 100%;
}
</style>
