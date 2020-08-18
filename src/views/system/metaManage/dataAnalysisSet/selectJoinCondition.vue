<template>
    <Modal	width="60%"
              v-model="joinConditionModal"
              title="增加关联条件"
              :transfer="false"
              :mask-closable = "false"
              @on-ok="setModalSave()"
              @on-cancel="cancel"
              ok-text="保存">
        <template>
            <Row>
                <Col span="12">
                    <div style="margin-right: 10px;">
                        <Table border ref="masterTable" height="300" :highlight-row="true"  :columns="masterColumns" :data="masterData" @on-row-click="masterClick" @on-row-dblclick="masterClick"></Table>
                    </div>
                </Col>
                <Col span="12">
                    <Table border ref="joinTable"  height= "300" :highlight-row="true"  :columns="joinColumns" :data="joinData"></Table>
                </Col>
            </Row>
            <Row>
                <Col span="24">
                    <div style="margin-top: 10px;">
                        <Table border ref="joinCondition"  height="150" :columns="conditionColumns" :data="conditionData"></Table>
                    </div>
                </Col>
            </Row>
        </template>
    </Modal>
</template>

<script>
    export default {
        name: "select-join-condition",
        data() {
            return {
                joinConditionModal: false,
                masterColumns: [
                    {title: '列名', align: 'center', key: 'columnCode'},
                    {title: '中文名', align: 'center', key: 'columnName'},
                    {title: '类型', align: 'center', key: 'dataType'}],
                masterData: [],
                joinColumns: [
                    {title: '列名', align: 'center', key: 'columnCode'},
                    {title: '中文名', align: 'center', key: 'columnName'},
                    {title: '类型', align: 'center', key: 'dataType'},
                    { title: '操作', align: 'center', key: 'action', render: (h, params) =>{
                        //判断是否和主表的类型一致，如果一致就可以选择，判断是否已经选择，如果已经选择，则不能选择
                            let row = params.row;
                            let flag = this.masterRow.dataType == row.dataType && !this.selected[this.masterRow.columnCode + row.columnCode];
                            return  flag ? h('Tooltip', {
                                props:{
                                    content: '添加',
                                    placement: 'top',
                                    transfer: true
                                }
                            },[
                                h('Button', {
                                    props: {
                                        type: 'ghost',
                                        icon: 'plus',
                                        shape: 'circle',
                                        size: 'small'
                                    },
                                    style: {
                                        margin: '0 1px'
                                    },
                                    on: {
                                        'click': () => {
                                            console.info('params:', params);
                                            this.addCondition(params.row);
                                        }
                                    }
                                })
                            ]) : '';
                        }
                    }
                ],
                joinData: [],
                conditionColumns: [
                    {title: '列名(主表)', align: 'center', key: 'masterColumnCode'},
                    {title: '中文名(主表)', align: 'center', key: 'masterColumnName'},
                    {title: '类型(主表)', align: 'center', key: 'masterDataType'},
                    {title: '列名(关联表)', align: 'center', key: 'joinColumnCode'},
                    {title: '中文名(关联表)', align: 'center', key: 'joinColumnName'},
                    {title: '类型(关联表)', align: 'center', key: 'joinDataType'},
                    { title: '操作', align: 'center', key: 'action', render: (h, params) =>{
                            return  h('Tooltip', {
                                props:{
                                    content: '删除',
                                    placement: 'top',
                                    transfer: true
                                }
                            },[
                                h('Button', {
                                    props: {
                                        type: 'ghost',
                                        icon: 'minus',
                                        shape: 'circle',
                                        size: 'small'
                                    },
                                    style: {
                                        margin: '0 1px'
                                    },
                                    on: {
                                        'click': () => {
                                            console.info('params:', params);
                                            this.delCondition(params.row, params.index);
                                        }
                                    }
                                })
                            ]);
                        }
                    }

                ],
                conditionData:[],
                masterTable: {},
                joinTable:{},
                masterRow: '',
                selected: {},
                joinCondition: []
            }
        },
        methods: {
             init(data){
                console.info('data:', data);
                this.conditionData = [];
                this.selected = {};
                this.masterTable = data.masterTable;
                this.joinTable = data.joinTable;
                this.joinCondition = data.joinCondition;
                /*根据masterTable查询对于的数据列*/
                 this.$net.send({
                    server: this.$services.sysService.metaColumnRestController.selectMetaColumn,
                    data: {tableId: this.masterTable.id}
                }).then((data) =>{
                    if(data.rows){
                        data.rows.forEach(item => {
                            item._checked = false;
                            item._disabled = false;
                            item._highlight = false;
                        });
                        this.masterData = data.rows;
                        //主表默认选中第一行
                        if(this.masterData.length > 0){
                            this.masterData[0]._highlight = true;//默认高亮第一行
                            this.masterRow = this.masterData[0];
                        }

                        /*根据joinTable查询对于的数据列*/
                        this.$net.send({
                            server: this.$services.sysService.metaColumnRestController.selectMetaColumn,
                            data: {tableId: this.joinTable.id}
                        }).then((data) =>{
                            if(data.rows){
                                this.joinData = data.rows;
                                this.loadCondition();
                            }
                            else{
                                this.$Message.info('查询关联表列信息失败。');
                            }
                        });
                    }
                    else{
                        this.$Message.info('查询主表列信息失败。');
                    }
                })
            },
            masterClick(row){
                this.masterRow = row;
            },
            openConditionModal(data){
                this.init(data);
                this.joinConditionModal = true;
            },
            cancel(){
                this.$emit('closeSelectJoinCondition', true);
            },

            setModalSave(){
                /*先把条件组装好*/
                this.conditionData2Condition();
                let data = {
                    joinCondition: this.joinCondition
                };
                this.$emit('closeSelectJoinCondition', false, data);
            },
            //添加条件，并显示
            addCondition(joinRow){
                /*组装一个条件数据*/
                let condition = {
                    masterColumnCode: this.masterRow.columnCode,
                    masterColumnName: this.masterRow.columnName,
                    masterDataType: this.masterRow.dataType,
                    joinColumnCode: joinRow.columnCode,
                    joinColumnName: joinRow.columnName,
                    joinDataType: joinRow.dataType,
                };
                this.conditionData.push(condition);
                this.$set(this.selected, this.masterRow.columnCode + joinRow.columnCode, true);
            },

            delCondition(condition, index){
                /*删除已选择的标志*/
               this.$delete(this.selected, condition.masterColumnCode + condition.joinColumnCode);
               /*删除表中的数据*/
               this.conditionData.splice(index, 1);
            },

            loadCondition(){
                console.info('this.joinCondition :', this.joinCondition );
                /*先判断原来的条件是否为空*/
                if(this.joinCondition && this.joinCondition.length > 0){
                    console.info(this.joinCondition);
                    /*循环条件，进行组装*/
                    this.joinCondition.forEach((value, index) =>{
                        let mRow, jRow;
                        /*先查询主表*/
                        this.masterData.forEach((v, i)=>{
                            if(value.masterColumn == v.columnCode){
                                mRow = v;
                                return;
                            }
                        });

                        /*再查询关联表*/
                        this.joinData.forEach((v, i)=>{
                            if(value.joinColumn == v.columnCode){
                                jRow = v;
                                return;
                            }
                        });

                        /*组装一个条件数据*/
                        let condition = {
                            masterColumnCode: mRow.columnCode,
                            masterColumnName: mRow.columnName,
                            masterDataType: mRow.dataType,
                            joinColumnCode: jRow.columnCode,
                            joinColumnName: jRow.columnName,
                            joinDataType: jRow.dataType,
                        };
                        this.conditionData.push(condition);
                        this.$set(this.selected, mRow.columnCode + jRow.columnCode, true);
                    });
                }
            },

            conditionData2Condition(){
                /*先清空原来的关联条件*/
                this.joinCondition = [];
                if(this.conditionData && this.conditionData.length > 0){
                    this.conditionData.forEach((v, i)=>{
                        let condition = {
                            masterColumn: v.masterColumnCode,
                            joinColumn: v.joinColumnCode,
                            operator: "="
                        };
                        this.joinCondition.push(condition);
                    });
                }
            }

        }
    }
</script>
<style scoped>

</style>