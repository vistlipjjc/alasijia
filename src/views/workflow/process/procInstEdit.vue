<template>
    <div>
        <Card>
            <Row>
                <Form ref="editForm" :model="editForm" :rules="editRules" :label-width="180">
                    <Row>
                        <component  :is="comp" ref="biz" :bizData="bizData" @isSubmit="getSubmit"></component>
                    </Row>
                    <Col span="22">
                    <div align="center">
                        <Button @click="btnSave('editForm')" type="primary" style="margin:0 11px;">保存</Button>
                        <Button type="ghost" @click="btnBack">返回</Button>
                    </div>
                    </Col>
                </Form>
            </Row>
        </Card>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                opt: false,
                bizData:'',
                editForm: {
                    code :'',
                    name :'',
                    formType :'',
                    remark :''
                },
                editRules: {

                },
            }
        },
        mounted() {
            this.init();
        },
        methods: {
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
                this.$net.send({
                    server: this.$services.wfService.processRestController.editDraftProcInst,
                    data: {id:this.$route.query.row.id,status:this.$route.query.row.status}
                }).then((data) => {
                    this.bizData = data.data;
                });
            }
        },
        computed: {
            comp: function () {
                var component = this.componentName;
                if(component){
                    return() => import(`./${component}`);
                }
            }
        }
    }
</script>