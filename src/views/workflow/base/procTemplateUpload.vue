<template>
    <Card>
        <Row justify="center">

            <Col span="12" offset="6">
            <Form ref="editForm" :model="editForm" :rules="editRules" :label-width="180">
                <FormItem label="请选择流程图资源(*.bpmn)">
                    <Col span="10">
                    <input type="file" @change="getFile($event)"></input>
                    </Col>

                </FormItem>

                <FormItem label="备注" prop="remark">

                    <Col span="20">
                    <Input v-model="editForm.remark" type="textarea"></Input>
                    </Col>
                </FormItem>

                <div align="center">
                    <Button @click="submit($event)" type="primary" style="margin:0 11px;">保存</Button>
                    <Button type="ghost" @click="btnBack">返回</Button>
                </div>
            </Form>
            </Col>

        </Row>
    </Card>
</template>
<script>
    import axios from 'axios';
    import app from '@/config/app';

    export default {
        data() {
            return {
                file: null,
                editForm: {
                    remark: ''
                },
                editRules: {}
            }
        },
        methods: {
            getFile: function (event) {
                this.file = event.target.files[0];
            },
            submit: function (event) {
                //阻止元素发生默认的行为
                event.preventDefault();
                let userToken = sessionStorage.getItem('userToken');
                let formData = new FormData();
                formData.append('uploadFile', this.file);
                formData.append('remark', this.editForm.remark);

                let _this = this;
                axios.post(app.url.server+"/wf/procTemplate/deployProcess", formData,{
                    headers: {
                        'x-user-token': userToken
                    }
                }).then(function (response) {
                        if (response.data.success) {
                            _this.$Message.success(response.data.msg);
                            this.btnBack();
                        } else {
                            _this.$Message.error(response.data.msg);
                        }
                    })
                    .catch(function (error) {

                    });
            },

            /*返回*/
            btnBack() {
                this.$router.go(-1);
                this.$store.commit('removeTag', 'procTemplateAdd');
                this.$store.commit('closePage', 'procTemplateAdd');
            }
        }
    }
</script>