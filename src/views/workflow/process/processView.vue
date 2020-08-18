<template>
    <div class="processTaskCtnr">
        <Card>
            <Row>
                <component  :is="comp" ref="biz" :bizData="bizData" ></component>
            </Row>
            <div align="center" style="margin-top: 5px;">
                <Button type="ghost" @click="btnBack">返回</Button>
            </div>
        </Card>
    </div>
</template>

<script>
    import lazyLoading from "@/libs/lazyLoading";

    export default {
        data() {
            return {
                componentName: '',
                bizData : '',
                procCode: '',
                nodeKey: '',
                data: '',
                procInstId: '',
                opt: '',
                action: ''
            }
        },
        created() {
            this.init();
            debugger
            this.$net.send({
                server: this.$services.wfService.processFormRestController.getModule,
                data: {
                    procCode: this.procCode,
                    nodeKey: this.nodeKey,
                    data: this.data,
                    opt: this.opt,
                        }
            }).then((data) => {
                debugger;
                console.info(data);
                this.componentName = data;
            });
        },
        methods:{
            init() {
                console.info(this.$route.query);
                this.procCode = this.$route.query.procCode;
                this.data = this.$route.query.bizData;
                this.nodeKey = this.$route.query.nodeKey;
                this.opt = this.$route.query.opt;
                this.bizData = this.$route.query.bizData;
                this.procInstId = this.$route.query.procInstId;
            },

            btnBack(){
                this.$router.go(-1);
                this.$store.commit('removeTag', 'processView');
                this.$store.commit('closePage', 'processView');
            }
        },
        computed: {
            comp: function () {
                if (this.componentName) {
                    return lazyLoading(this.componentName);
                }
            }
        }
    }
</script>
