<template>
    <div class="jobGroupEditCtnr">
        <Card>
            <Row>
                <Form ref="editForm" :model="editForm" :rules="editRules" :label-width="180">
                    <Col span="11">
                    <FormItem label="类型编码" prop="code" required>
                        <Input v-model="editForm.code" :disabled="opt"></Input>
                    </FormItem>
                    </Col>
                    <Col span="11">
                        <FormItem label="类型名称" prop="name" required>
                            <Input v-model="editForm.name"></Input>
                        </FormItem>
                    </Col>
                    <Col span="22">
                        <FormItem label="参数" prop="param">
                            <Button type="primary" @click="addParam">添加 </Button>
                            <Button type="primary" @click="deleteParam">移除 </Button>
                            <param-table
                                refs="timeTable"
                                v-model="paramData"
                                :columns-list="column"
                                @on-change="changeParam"
                                @on-selection-change="selectionChange">
                            </param-table>
                        </FormItem>
                    </Col>
                    <Col span="22">
                        <FormItem label="备注" prop="remark">
                            <Input type="textarea" v-model="editForm.remark"></Input>
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
    import ParamTable from './component/jobGroupParamTable';

export default {
    components: {
      ParamTable
    },
    data() {
        return {
            opt: false,
            editForm: {
                code: '',
                name: '',
                param: '',
                remark: ''
            },
            editRules: {
                code: [
                    { required: true, message: '必填项', trigger: 'blur'},
                    { validator: (rule, value, callback) => {
                        if(!this.opt){
                            this.$net.send({
                                server: this.$services.schService.jobGroupRestController.check,
                                data: {code: value}
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
                name: [
                    {required: true, message: '必填项', trigger: 'blur'}
                ]
            },
            paramData: [],
            column: [
                { title: '', align: 'center', type: 'selection', width: 80},
                { title: '编码', align: 'center', key: 'code', editable: true},
                { title: '类型', align: 'center', key: 'type', editable: true},
                { title: '默认值', align: 'center', key: 'value', editable: true},
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
                    edittingCell: {code: true, type: true, value: true},
                    code: '',
                    type: '',
                    value: ''
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
                    if(itemParam.code == item.code) isContain = true;
                });
                if(!isContain) unSelectionParam.push(item);
            });
            this.paramData = unSelectionParam;
            this.editForm.param = JSON.stringify(unSelectionParam);
        },
        checkCellSave(){
            let result = true;
            this.paramData.forEach(item => {
                if(item.edittingCell)
                {
                    if(item.edittingCell['code'])
                    {
                        result = false;
                        this.$Message.error('还有参数未保存！');
                        return;
                    }else if(item.edittingCell['type'])
                    {
                        result = false;
                        this.$Message.error('还有参数未保存！');
                        return;
                    }else if(item.edittingCell['value'])
                    {
                        result = false;
                        this.$Message.error('还有参数未保存！');
                        return;
                    }
                }
            });
            return result;
        },
        /*保存*/
        btnSave(name) {
            this.$refs[name].validate((valid) => { // 数据校验
                if (!valid || !this.checkCellSave()) {
                    return
                }

                this.$net.send({
                    server: this.$services.schService.jobGroupRestController.save,
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
            this.$store.commit('removeTag', 'jobGroupEdit');
            this.$store.commit('closePage', 'jobGroupEdit');
        }
    }
}
</script>
