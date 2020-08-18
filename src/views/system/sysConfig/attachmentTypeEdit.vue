<template>
    <div class="attachmentTypeEditCtnr">
        <Card>
            <Row>
                <Form ref="editForm" :model="editForm" :rules="editRules" :label-width="180">
                    <Col span="11">
                        <FormItem label="类型名称" prop="attachTypeName" required>
                            <Input v-model="editForm.attachTypeName"></Input>
                        </FormItem>
                    </Col>
                    <Col span="11">
                        <FormItem label="类型编码" prop="attachTypeCode" required>
                            <Input v-model="editForm.attachTypeCode" :disabled="opt"></Input>
                        </FormItem>
                    </Col>
                    <Col span="11">
                        <FormItem label="附件格式" prop="attachFormat">
                            <Input v-model="editForm.attachFormat" :disabled="true" placeholder="暂未启用"></Input>
                        </FormItem>
                    </Col>
                    <Col span="11">
                        <FormItem label="上传路径" prop="attachPath" required>
                            <Input v-model="editForm.attachPath"></Input>
                        </FormItem>
                    </Col>
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
        name: "attachmentTypeEdit",
        data() {
            return {
                opt: false,
                editForm: {
                    attachTypeName: '',
                    attachTypeCode: '',
                    attachFormat: '',
                    attachPath:''
                },
                editRules: {
                    attachTypeCode: [
                        { required: true, message: '必填项', trigger: 'blur'},
                        { validator: (rule, value, callback) => {
                                if(!this.opt){
                                    this.$net.send({
                                        server: this.$services.sysService.attachmentTypeRestController.check,
                                        data: {attachTypeCode: value}
                                    }).then((data) => {
                                        if (!data.valid) {
                                            callback(new Error('编码已存在，请重新输入。'));
                                        }else{
                                            callback();
                                        }
                                    });
                                }else{
                                    callback();
                                }
                            }}
                    ],
                    attachTypeName: [
                        {required: true, message: '必填项', trigger: 'blur'}
                    ],
                    attachPath: [
                        {required: true, message: '必填项', trigger: 'blur'}
                    ]
                },
                paramData: [],
                column: [
                    { title: '', align: 'center', type: 'selection', width: 80},
                    { title: '类型编码', align: 'center', key: 'attachTypeCode', editable: true},
                    { title: '类型名称', align: 'center', key: 'attachTypeName', editable: true},
                    { title: '附件类型', align: 'center', key: 'attachFormat', editable: true},
                    { title: '上传路径', align: 'center', key: 'attachPath', editable: true},
                    { title: '操作', align: 'center', key: 'handler', width: 120, handler: ['delete']},
                ],
                selectionParam: []
            }
        },
        mounted() {
            this.init();
        },
        methods: {
            init() {
                if (this.$route.params.opt == 'edit') {
                    this.opt = true;
                    this.editForm = this.$route.query.row;
                    if(this.editForm.param){
                        this.paramData = JSON.parse(this.editForm.param);
                    }
                }
            },
            addParam(){
                if(this.checkCellSave())
                {
                    this.paramData.push({
                        editting: true,
                        edittingCell: {attachTypeCode: true, attachTypeName: true, attachFormat: true, attachPath: true},
                        attachTypeCode: '',
                        attachTypeName: '',
                        attachFormat: '',
                        attachPath: ''
                    });
                }
            },
            changeParam(param, paramData, index){
                this.editForm.param = JSON.stringify(param);
                this.paramData = paramData;
            },
            selectionChange(data){
                this.selectionParam = data;
            },
            deleteParam(){
                let unSelectionParam = [];
                this.paramData.forEach(item => {
                    let isContain = false;
                    this.selectionParam.forEach(itemParam => {
                        if(itemParam.attachTypeCode == item.attachTypeCode) isContain = true;
                    });
                    if(!isContain) unSelectionParam.push(item);
                });
                this.paramData = unSelectionParam;
            },

            /*保存*/
            btnSave(name) {
                this.$refs[name].validate((valid) => { // 数据校验
                    if (!valid) {
                        return
                    }

                    this.$net.send({
                        server: this.$services.sysService.attachmentTypeRestController.save,
                        data: this.editForm
                    }).then((data) => {
                        if (data.success) {
                            this.$Message.success(data.msg);
                            this.btnBack();
                        } else {
                            this.$Message.error(data.msg);
                        }
                    });

                });
            },

            /*返回*/
            btnBack() {
                this.$router.go(-1);
                this.$store.commit('removeTag', 'attachmentTypeEdit');
                this.$store.commit('closePage', 'attachmentTypeEdit');
            }
        }
    }
</script>
