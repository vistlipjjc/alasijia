<template>
    <div>
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
        mounted() {
            this.init();

        },
        methods: {
            created() {
                this.init();
                this.$net.send({
                    server: this.$services.wfService.processFormRestController.getModule,
                    data: {
                        procCode: this.procCode,
                        nodeKey: this.nodeKey,
                        data: this.data,
                        opt: this.opt,
                    }
                }).then((data) => {
                    this.componentName = data;
                });
            },
            /*保存*/
            btnSave(formDefName) {

                this.$net.send({
                    server: this.$services.wfService.formDefRestController.save,
                    data: this.editForm
                }).then((data) => {
                    if (data.success) {
                        this.$Message.success(data.msg);
                        this.btnBack();
                    } else {
                        this.$Message.error(data.msg);
                    }
                });

            },

            /*返回*/
            btnBack() {
                this.$router.go(-1);
                this.$store.commit('removeTag', 'staffEdit');
                this.$store.commit('closePage', 'staffEdit');
            },
            selectChange(value, name){
                this.editForm[name] = value;
            },
            init(){
                this.procCode = this.$route.query.procCode;
                this.data = this.$route.query.bizData;
                this.opt = this.$route.query.opt;
                this.bizData = this.$route.query.bizData;
                this.procInstId = this.$route.query.procInstId;
            }
        },
        computed: {
            comp: function () {
                var component = this.componentName;
                    return() => import(`./${component}`);
            }
        }
    }
</script>