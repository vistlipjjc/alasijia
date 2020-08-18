<template>
    <Modal	width="50%"
              ref="joinTableModal"
              v-model="joinTableModal"
              title="增加关联表"
              :transfer="true"
              :mask-closable = "false"
              @on-ok="setJoinModalSave()"
              @on-cancel="cancel"
              ok-text="保存">
        <template>
            <Form ref="joinTableForm" :model="joinData" :label-width="80" :rules="joinDataValidate">
                <FormItem label="主表" >
                        <Col span="22"> {{showTableName}}</Col>
                </FormItem>
                <FormItem label="关联表" prop="joinTableName" >
                    <Row>
                        <Col span="20">
                            <span  @click.native="openSelectTable">
                                <Input v-model="joinData.joinTableName" @on-focus="openSelectTable" :value="joinData.joinTableName" >
                                    <Button slot="append" icon="ios-search" @click.native="openSelectTable" ></Button>
                                </Input>
                            </span>
                        </Col>
                    </Row>
                </FormItem>
                <FormItem label="关联条件" prop="joinCons" >
                    <Row>
                        <Col span="20">
                            <Input v-model="joinData.joinCons" type="textarea" :autosize="{minRows: 2,maxRows: 5}" disabled="disabled"></Input>
                        </Col>
                        <Col span="4">
                            <Button type="ghost" shape="circle" size = "small" icon="ios-color-wand-outline" @click="openConditionModal" style="margin-left: 15px;"></Button>
                        </Col>
                    </Row>
                </FormItem>
                <FormItem label="关联方式"  prop="joinType">
                    <Row>
                        <Col span="20">
                            <j-select v-model="joinData.joinType" url="fixedDict:QueryJoinType" @on-change="selectChange($event, 'joinType')">
                            </j-select>
                        </Col>
                    </Row>
                </FormItem>
            </Form>
        </template>
        <select-table ref="selectTable" @closeSelectTable="closeSelectTable"></select-table>
        <select-join-condition ref = "selectJoinCondition" @closeSelectJoinCondition="closeSelectJoinCondition"></select-join-condition>
    </Modal>
</template>

<script>
    import SelectTable from "./selectTable";
    import SelectJoinCondition from "./selectJoinCondition";
    export default {
        name: "select-join-table",
        components:{
            SelectTable,
            SelectJoinCondition
        },
        data() {
            return {
                //设置校验
                joinDataValidate: {
                    joinTableName: [
                        { required: true, message: '请选择关联表。'}
                    ],
                    joinCons: [
                        { required: true, message: '请选择关联条件'}
                    ],
                    joinType: [
                        { required: true, message: '请选择关联方式', trigger: 'change' }
                    ]
                },
                joinTableModal: false,
                joinData: {
                },
                showTableName: '',
                tableData : {},
                joinTable: {},
                joinCondition: [], //关联条件
                joinTableAlias: '' //关联表的别名
            }
        },
        methods: {
            init(data){
                this.tableData = JSON.parse(JSON.stringify(data));
                /*给当前主表赋值*/
                this.masterTable = this.tableData.masterTable;
                this.showTableName = this.masterTable.alias + '-' + this.masterTable.name + '(' + this.masterTable.code + ')';
                /*获取关联表的别名*/
                this.joinTableAlias = this.tableData.joinTableAlias;
                /*给当前表格赋值*/
                if(data.joinTable){
                    /*获取当前关联条件*/
                    this.joinCondition = this.tableData.joinCondition.joinCondition;
                    /*给当前关联表赋值*/
                    this.joinTable = this.tableData.joinTable;
                    this.setJoinData(data.joinCondition, data.joinTable, data.masterTable);
                }
                else{
                    /*默认选中内连接*/
                    this.joinData.joinType = 'INNER';
                }


            },
            setJoinData(joinCondition, joinTable, masterTable){
                this.joinData.joinTableName = joinTable.code;
                this.condition2ShowString(joinCondition.joinCondition);
                this.joinData.joinType = joinCondition.joinType;
            },
            cancel(){
                this.$refs['joinTableForm'].resetFields();
                this.$emit('closeSelectJoinTable', true);
            },
            selectChange(value, name){
                this.joinData[name] = value;
            },
            setJoinModalSave(){
                this.$refs.joinTableForm.validate((valid) => { // 数据校验
                    if (!valid) {
                        this.$refs.joinTableModal.visible = true;
                        this.joinTableModal = true;
                    }
                    else {
                        this.tableData.joinTable = this.joinTable;
                        this.tableData.joinCondition = {
                            masterTable: this.masterTable.alias,
                            joinTable: this.joinTable.alias,
                            joinType: this.joinData.joinType,
                            joinCondition: this.joinCondition
                        };
                        this.$emit('closeSelectJoinTable', false, this.tableData);
                    }
                });
            },
            openJoinTableModal(data){
                this.joinData = {};
                this.init(data);
                this.joinTableModal = true;
            },
            openConditionModal(){
                if(this.joinTable.code){
                    let data = {
                        masterTable : this.masterTable,
                        joinTable: this.joinTable,
                        joinCondition: this.joinCondition
                    };
                    this.$refs.selectJoinCondition.openConditionModal(data);
                }
                else{
                    this.$Message.info('请先选择关联表。');
                }
            },
            closeSelectJoinCondition(isCancel, data){
                if(!isCancel){
                    this.joinCondition = data.joinCondition;
                    this.condition2ShowString(data.joinCondition);
                }
            },

            openSelectTable(){
                this.$refs.selectTable.openSelectTable();
            },
            closeSelectTable(isCancel, data){
                if(!isCancel){
                    this.joinTable = data;
                    this.joinTable['alias'] = this.joinTableAlias;
                    /*当重新选则了表的时候，需要清空对应的关联条件*/
                    this.joinCondition = [];
                    this.$delete(this.joinData, 'joinCons');
                    this.$set(this.joinData, 'joinCons', '');
                    this.$delete(this.joinData, 'joinTableName');
                    this.$set(this.joinData, 'joinTableName', data.code);
                }
            },

            condition2ShowString(conditions){
                console.info(conditions);
                let conditionArray = [];
                if(conditions && conditions.length > 0){
                    conditions.forEach((v, i) => {
                        let tmp = this.masterTable.alias + '.' + v.masterColumn + ' = ' + this.joinTable.alias + '.' + v.joinColumn;
                        conditionArray.push(tmp);
                    })
                }
                this.$delete(this.joinData, 'joinCons');
                this.$set(this.joinData, 'joinCons', conditionArray.toString());
            }

        }
    }
</script>

<style scoped>

</style>