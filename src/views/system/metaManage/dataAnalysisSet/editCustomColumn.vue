<!--********************选择字段Modal***********************-->
<template>
    <Modal 	width="50%"
              ref="editCustomColumnModal"
              v-model="editCustomColumnModal"
              title="选择字段"
              :transfer="false"
              :mask-closable = "false"
              @on-ok="editCustomColumnSave"
              @on-cancel="cancel">
        <template>
            <div style="min-height: 260px;">
                <Form ref="editCustomColumn" :model="editCustomColumn" :label-width="180" :rules="customColumnValidate">
                    <Col span="20">
                        <FormItem label="列名称" prop="columnCode" >
                            <Input v-model="editCustomColumn.columnCode"></Input>
                        </FormItem>
                    </Col>
                    <Col span="20">
                        <FormItem label="列中文名称" prop="columnName" >
                            <Input v-model="editCustomColumn.columnName"></Input>
                        </FormItem>
                    </Col>
                    <Col span="20">
                        <FormItem label="表达式" prop="expr">
                            <Input v-model="editCustomColumn.expr" type="textarea" :rows="5"></Input>
                        </FormItem>
                    </Col>
                    <Col span="2">
                        <Button type="ghost" shape="circle" size = "small" icon="ios-color-wand-outline" @click="openSelectCustomConditionModal"></Button>
                    </Col>
                </Form>
            </div>
        </template>
        <select-custom-condition ref="selectCustomCondition" @closeSelectCustomCondition="closeSelectCustomCondition"></select-custom-condition>
    </Modal>
</template>

<script>
    import SelectCustomCondition from "./selectCustomCondition"
    export default {
        name: "edit-cunstom-column",
        components:{
            SelectCustomCondition
        },
        props:{
        },
        data() {
            return {
                customColumnValidate: {
                    columnCode:[{required: true, message: '请输入列名',  trigger: 'blur'},
                        {validator : (rule, value, callback) =>{
                            if(this.isInArray(this.selectColumns, value, 'columnCode')){
                                callback(new Error('列名称与已选择的列重复，请核实后输入'));
                            }
                            else{
                                callback();
                            }
                        }},
                        {
                            validator : (rule, value, callback) =>{
                                if(!/^[a-zA-Z]{1}[a-zA-Z\\d_]*$/.test(value)){
                                    callback(new Error('编码必须以字母开头，且只包含字母、数字和下划线的字符串！'));
                                }
                                else{
                                    callback();
                                }
                            }
                        }
                    ],
                    columnName:[{required: true, message: '请输入列中文名称。', trigger: 'blur'}],
                    expr: [{required: true, message: '请选择输入对应的表达式。', trigger: "blur"}]
                },
                editCustomColumnModal: false,
                editCustomColumn: {},
                tables: [],
                selectColumns: [],
                rowIndex: '',
                oldRow: {},
                opt: ''
            }
        },
        methods: {
            init(data){
                this.opt = data.opt;
                this.rowIndex = data.index;
                this.oldRow = data.row;
                this.editCustomColumn = data.row ? JSON.parse(JSON.stringify(data.row)) : {};
                this.tables = data.tables;
                this.selectColumns = data.selectColumns;
            },
            openEditCustomColumnModal(data){
                this.init(data);
                this.editCustomColumnModal = true;
            },
            cancel(){
                this.$refs.editCustomColumn.resetFields();
                this.$emit('closeEditCustomColumn', true);
            },
            editCustomColumnSave(){
                this.$refs.editCustomColumn.validate((valid) =>{
                    if(!valid){
                        this.$refs.editCustomColumnModal.visible=true;
                        this.editCustomColumnModal = true;
                    }
                    else{
                        let row = {
                            columnType: "C",
                            columnCode: this.editCustomColumn.columnCode,
                            columnName:this.editCustomColumn.columnName,
                            expr: this.editCustomColumn.expr
                        };

                        let data = {
                            opt: this.opt,
                            row: row,
                            index: this.rowIndex,
                            oldRow: this.oldRow
                        }
                        this.$emit('closeEditCustomColumn', false, data);
                    }
                })

            },
            openSelectCustomConditionModal(){
                /*组装选择条件的参数*/
                let data = {
                    tables: this.tables,
                    condition: this.editCustomColumn.expr,
                };
                this.$refs.selectCustomCondition.openSelectCustomConditionModal(data);
            },
            closeSelectCustomCondition(isCancel, data){
                if(!isCancel){
                    this.$delete(this.editCustomColumn, 'expr');
                    this.$set(this.editCustomColumn, 'expr',  data.condition);
                    this.$refs.editCustomColumn.validateField('expr');
                }
            },
            //判断值是否存在数组的name属性中，如果name为空就直接比较。
            isInArray(array , value, name){
                if( !value || value == ''){
                    return false;
                }
                else if(array.length == 0){
                    return true;
                }
                else{
                    let flag = false;
                    array.forEach((v, i) =>{
                        let c = (name && name != '') ?  v[name] : v;
                        if(c.toLowerCase() == value.toLowerCase()){
                            flag = true;
                            return ;
                        }
                    })
                     return flag;
                }
            }

        }
    }
</script>
<style scoped>

</style>