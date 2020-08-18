<template>
    <div>
        <Card>
            <Row>
                <Col span="12">
                    <j-label name="表单编码" value="code"></j-label>
                </Col>
                <Col span="12">
                    <j-label name="表单名称" value="name"></j-label>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Button type="ghost" @click="btnBack">返回</Button>
                </Col>
            </Row>
        </Card>
        <Card>
            <Form ref="editForm" :model="editForm"  :label-width="180">
                <Button type="primary" v-show="!this.$route.query.view" @click="addEventHandler">新增</Button>
                <Button type="ghost" v-show="!this.$route.query.view" @click="deleteEventHandler">删除</Button>
                <Button type="ghost" v-show="!this.$route.query.view" @click="btnSave('editForm')">保存</Button>
                <Button type="primary" v-show="this.$route.query.view"  @click="viewEventHandler">查看</Button>
                <form-PropTable
                                refs="formPropTable"
                                v-model="tableData"
                                :columns-list="columns"
                                @on-change="changeParam"
                                @on-selection-change="selectionChange">

                </form-PropTable>
            </Form>
        </Card>
    </div>
</template>

<script>
    import FormPropTable from '../component/formPropTable';
    export default {
        components: {
            FormPropTable
        },
        data() {
            return {
                server: {
                    query: this.$services.wfService.formPropRestController.list
                },
                editForm: {
                    propCode: '',
                    propName: '',
                    primaryKey: '',
                    remark:'',
                    formCode:'',
                    param:[]
                },
                editRules: {
                    propCode: [
                        { required: true, message: '必填项', trigger: 'blur'},
                        { validator: (rule, value, callback) => {
                                this.$net.send({
                                    server: this.$services.wfService.formPropRestController.check,
                                    data: {
                                        formCode: this.$route.query.row.code,
                                        propCode: value,
                                    }
                                }).then((data) => {
                                    if (!data.valid) {
                                        callback(new Error('编码已存在，请重新输入。'));
                                    }else{
                                        callback();
                                    }
                                });
                            }}
                    ],
                    name: [
                        {required: true, message: '必填项', trigger: 'blur'}
                    ]
                },
                columns: [
                    {type: 'selection', align: 'center', width: 50},
                    {title: '属性编码', align: 'center', key: 'propCode',editable: true},
                    {title: '属性名称', align: 'center', key: 'propName',editable: true},
                    {title: '是否是主键', align: 'center', key: 'primaryKey',formatter: 'fixedDict:YesNo@system',editable: true,},
                    {title: '备注', align: 'center', key: 'remark',editable: true},

                ],
                tableData: [],
                row:{},
                selectionParam: []
            }

        },
        name: "formPropList",
        methods: {
            /*返回*/
            btnBack() {
                this.$router.go(-1);
                this.$store.commit('removeTag', 'formPropList');
                this.$store.commit('closePage', 'formPropList');
            },
            init(){
                this.$net.send({
                    server: this.$services.wfService.formPropRestController.list,
                    data:{formCode:this.$route.query.row.code}
                }).then((data) => {
                    this.tableData = data.rows
                });

            },
            viewEventHandler(){
                this.$router.push({
                    path: '/formPropView',
                    query:{
                        row:this.row
                    }
                });
            },
            changeParam(param,tableData, index){
                param[index].formCode = this.$route.query.row.code;
                this.editForm.param = JSON.stringify(param);
                this.tableData = tableData;
            },
            addEventHandler(){
                if(this.checkCellSave())
                {
                    this.tableData.push({
                        editting: true,
                        edittingCell: {propCode: true, propName: true, primaryKey: true,primaryKey:true},
                        propCode: '',
                        propName: '',
                        primaryKey: '',
                        remark:''
                    });
                }
            },
            checkCellSave(){
                let result = true;
                this.tableData.forEach(item => {
                    if(item.edittingCell)
                    {
                        if(item.edittingCell['propCode'])
                        {
                            result = false;
                            this.$Message.error('还有参数未保存！');
                            return;
                        }else if(item.edittingCell['propName'])
                        {
                            result = false;
                            this.$Message.error('还有参数未保存！');
                            return;
                        }else if(item.edittingCell['primaryKey'])
                        {
                            result = false;
                            this.$Message.error('还有参数未保存！');
                            return;
                        }else if(item.edittingCell['remark'])
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
                this.$net.send({
                    server: this.$services.wfService.formPropRestController.save,
                    data: { formCode: this.$route.query.row.code,
                        formProp: this.tableData
                    }
                }).then((data) => {
                    if (data.success) {
                        this.$Message.success(data.msg);
                        this.btnBack();
                    } else {
                        this.$Message.error(data.msg);
                    }
                });
            },
            deleteEventHandler(){
                let unSelectionParam = [];
                this.tableData.forEach(item => {
                    let isContain = false;
                    this.selectionParam.forEach(itemParam => {
                        if(itemParam.propCode == item.propCode) isContain = true;
                    });
                    if(!isContain) unSelectionParam.push(item);
                });

                this.tableData = unSelectionParam;
            },

            selectionChange(data){
                this.row = data[0];
                this.selectionParam = data;

            },
        },
        mounted() {
            this.init();
        }

    }
</script>