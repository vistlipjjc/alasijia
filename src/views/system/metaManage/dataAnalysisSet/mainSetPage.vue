<template>
    <div>
        <Modal	width="60%"
                  v-model="mainSetPageModal"
                  ref="mainSetPage"
                  :transfer="true"
                  :mask-closable = "false"
                  title="增加关联表"
                  @on-ok="setModalSave('setForm')"
                  @on-cancel="cancel"
                  ok-text="保存并执行">
            <template>
                <Form ref="setForm" :model="formItem" :label-width="80" :rules="formItemValidate">
                    <FormItem label="选择表" >
                       <Row v-for="(table, index) in formItem.tables" :key="index" >
                            <Col span="18"> <span>{{table.alias + '-' + table.name + '(' + table.code + ')'}}</span> </Col>
                            <Col span="2">  <Button type="ghost" shape="circle" size = "small" icon="android-add" @click="addTable(index)"></Button> </Col>
                            <Col span="2">  <Button type="ghost" shape="circle" size = "small" icon="edit" @click="editTable(index)" v-if="index != 0"></Button>  </Col>
                            <Col span="2">  <Button type="ghost" shape="circle" size = "small" icon="android-delete" @click="delTable(index)" v-if="index != 0"></Button>  </Col>
                        </Row>
                    </FormItem>
                    <FormItem label="查询方式">
                        <RadioGroup v-model="formItem.queryType" @on-change="queryTypeChange()">
                            <Radio label="N" >普通查询</Radio>
                            <Radio label="G" >汇总查询</Radio>
                        </RadioGroup>
                    </FormItem>
                    <template v-if="formItem.queryTypeN">
                        <FormItem label="选择字段" prop="selectedColumns">
                            <Row>
                                <Col span="20">
                                <Input v-model="formItem.selectedColumns" readonly = readonly type="textarea" :autosize="{minRows: 2,maxRows: 5}"></Input>
                                </Col>
                                <Col span="4">
                                <Button type="ghost" shape="circle" size = "small" icon="ios-color-wand-outline" @click="openSelectColumnsModal"></Button>
                                </Col>
                            </Row>
                        </FormItem>
                    </template>
                    <template v-if="formItem.queryTypeG">
                        <FormItem label="分组字段" prop="groupBy">
                            <Row>
                                <Col span="20">
                                <Input v-model="formItem.groupBy" readonly = readonly type="textarea" :autosize="{minRows: 2,maxRows: 5}"></Input>
                                </Col>
                                <Col span="4">
                                <Button type="ghost" shape="circle" size = "small" icon="ios-color-wand-outline" @click="openGroupModal"></Button>
                                </Col>
                            </Row>

                        </FormItem>
                        <FormItem label="计数">
                            <Row>
                                <Col span="20">
                                    <Checkbox v-model="formItem.COUNT" true-value="Y" false-value="N">&nbsp;</Checkbox>
                                </Col>
                            </Row>

                        </FormItem>
                        <FormItem label="汇总计算" prop = 'groups' >
                            <Row>
                                <Col span="20">
                                <Input v-model="formItem.groups" readonly = readonly type="textarea" :autosize="{minRows: 2,maxRows: 5}"></Input>
                                </Col>
                                <Col span="4">
                                <Button type="ghost" shape="circle" size = "small" icon="ios-color-wand-outline" @click="openSelectGroupColumns"></Button>
                                </Col>
                            </Row>
                        </FormItem>

                        <FormItem label="汇总筛选" prop="having">
                            <Row>
                                <Col span="20">
                                <Input v-model="formItem.having" type="textarea" :autosize="{minRows: 2,maxRows: 5}"></Input>
                                </Col>
                                <Col span="4">
                                <Button type="ghost" shape="circle" size = "small" icon="ios-color-wand-outline" @click="openSelectGroupCondition"></Button>
                                </Col>
                            </Row>

                        </FormItem>
                    </template>
                    <FormItem label="筛选条件">
                        <Row>
                            <Col span="20">
                            <Input v-model="formItem.selectCondition" type="textarea" :autosize="{minRows: 2,maxRows: 5}"></Input>
                            </Col>
                            <Col span="4">
                            <Button type="ghost" shape="circle" size = "small" icon="ios-color-wand-outline" @click="openSelectConditionModal"></Button>
                            </Col>
                        </Row>

                    </FormItem>
                    <FormItem label="排序字段" prop="selectedOrder">
                        <Row>
                            <Col span="20">
                            <Input v-model="formItem.selectedOrder" readonly = readonly type="textarea" :autosize="{minRows: 2,maxRows: 5}"></Input>
                            </Col>
                            <Col>
                            <Button type="ghost" shape="circle" size = "small" icon="ios-color-wand-outline" @click="openSelectOrderModal"></Button>
                            </Col>
                        </Row>
                    </FormItem>
                </Form>
            </template>
        </Modal>
        <select-join-table ref="selectJoinTable" @closeSelectJoinTable="closeSelectJoinTable"></select-join-table>
        <select-column ref="selectColumn" @closeSelectColumn="closeSelectColumn"></select-column>
        <select-condition ref="selectCondition" @closeSelectCondition="closeSelectCondition"></select-condition>
        <select-order ref="selectOrder" @closeSelectOrder="closeSelectOrder" > </select-order>
        <select-group-column ref="selectGroupColumn" @closeSelectGroupColumn="closeSelectGroupColumn"></select-group-column>
        <select-group-condition ref="selectGroupCondition" @closeSelectGroupCondition="closeSelectGroupCondition"></select-group-condition>
    </div>
</template>

<script>
    import SelectJoinTable from "./selectJoinTable";
    import SelectColumn from "./selectColumn";
    import SelectCondition from "./selectCondition";
    import SelectOrder from "./selectOrder";
    import SelectGroupColumn from "./selectGroupColumn";
    import SelectGroupCondition from "./selectGroupCondition";
    export default {
        name: "main-set-page",
        components:{
            SelectJoinTable,
            SelectColumn,
            SelectCondition,
            SelectOrder,
            SelectGroupColumn,
            SelectGroupCondition
        },
        props:{
            array2String: {type: Function, default : null}
        },
        data() {
            return {
                //设置校验
                formItemValidate: {
                    selectedColumns: [
                        { required: true, message: '请选择字段。', trigger: 'blur' }
                    ],
                    groupBy: [
                        { required: true, message: '请选择分组字段。', trigger: 'blur' }
                    ],
                    groups: [
                        {validator: (rule, value, callback)=>{
                            if((!value || value == '') && this.formItem.COUNT == 'N' ){
                                callback(new Error('汇总查询模式下【计数】和【汇总计算】必须选择一项。'));
                            }
                            return callback();
                        }}
                    ]
                },
                mainSetPageModal: false,
                tableCount: 1,
                formItem: {
                    tables: '',
                    select: '',
                    selectedColumns: '',//选择字段
                    selectedOrder: '',//排序字段
                    queryType: 'N',
                    COUNT: 'N',
                    switch: true,
                    date: '',
                    time: '',
                    slider: [20, 50],
                    queryTypeG: false,
                    queryTypeN: true,
                    groupBy: '',
                    groups: '',
                    selectCondition: '',
                    having: '',
                },
                joinTables: [],
                selectedColumns: [],
                condition: '',
                orders: [],
                groups: [],
                groupBy: [],
                script: {}
            }
        },
        methods: {
            init(scriptObject){
                this.script = scriptObject;

                /*对对象进行深度复制*/
                let script = JSON.parse(JSON.stringify(this.script));

                /*当前表格*/
                this.formItem.tables = script.tables;

                /*关联关系及关联条件*/
                this.joinTables = script.joinTables;

                this.selectedColumns = script.columns;

                this.formItem.selectedColumns = this.array2String(this.selectedColumns, 'code');//设置数据

                this.formItem.selectCondition =  script.where;

                // this.condition =  script.where;

                this.orders =  script.orders;

                this.formItem.selectedOrder =  this.array2String(this.orders, 'code');//设置数据

                this.groups =  script.groups;
                this.formItem.groups =  this.groups2String(this.groups);//设置数据

                this.formItem.queryType =  script.queryType;
                /*初始化显示类型*/
                this.showQueryType();


                this.formItem.COUNT = script.COUNT;

                this.groupBy = script.groupBy;
                this.formItem.groupBy = this.array2String(this.groupBy, 'code');//设置数据

                this.formItem.having = script.having;
            },
            openSetModal(script){
                this.init(script);
                this.mainSetPageModal = true;
            },
            queryTypeChange () {
                /*切换查询方式的时候，需要清空排序条件*/
                this.orders =  [];
                this.formItem.selectedOrder =  '';//设置数据
                this.showQueryType();
            },

            showQueryType(){

                if(this.formItem.queryType == 'G'){
                    this.formItem.queryTypeG = true;
                    this.formItem.queryTypeN = false;
                    // this.$refs.setForm.validateField('groupBy', (errMsg) => {
                    //     if (errMsg) return '请选择分组字段。';
                    // });
                    // this.$refs.setForm.validateField('groups', (errMsg) => {
                    //     if (errMsg) return '汇总查询模式下【计数】和【汇总计算】必须选择一项。';
                    // });
                }
                if(this.formItem.queryType == 'N'){
                    this.formItem.queryTypeG = false;
                    this.formItem.queryTypeN = true;
                    // this.$refs.setForm.validateField('selectedColumns', (errMsg) => {
                    //     if (errMsg) return '请选择字段。';
                    // });
                }
            },
            cancel(){
                this.$emit('closeSetModal', true);
            },
            setModalSave(name){
                this.$refs.setForm.validate((validate) =>{
                    if(!validate){
                        this.$refs.mainSetPage.visible = true;
                        this.mainSetPageModal = true;
                    }
                    else{
                        debugger;
                        /*当前表格*/
                        this.script.tables = this.formItem.tables;

                        /*关联关系及关联条件*/
                        this.script.joinTables = this.joinTables;

                        this.script.columns = this.selectedColumns;

                        this.script.where = this.formItem.selectCondition ;

                        this.script.orders = this.orders;

                        this.script.groups = this.groups;

                        this.script.queryType = this.formItem.queryType;

                        this.script.COUNT = this.formItem.COUNT;

                        this.script.groupBy = this.groupBy;

                        this.script.having = this.formItem.having;

                        this.$emit('closeSetModal', false, this.script);
                    }
                });
            },
            openSelectColumnsModal(){
                /*组装选择字段的参数*/
                let data = {
                    tables: this.formItem.tables,
                    selectedColumns: this.selectedColumns
                };
                this.$refs.selectColumn.openSelectColumnsModal(data);
            },

            /*关闭选择字段框*/
            closeSelectColumn(isCancel, data){
                if(!isCancel){
                    if( data.opt == 'GROUP'){
                        this.groupBy = data.data;
                        this.formItem.groupBy = this.array2String(this.groupBy, 'code');//设置数据
                    }
                    else{
                        this.selectedColumns = data.data;
                        this.formItem.selectedColumns = this.array2String(this.selectedColumns, 'code');//设置数据
                    }
                }
            },


            openSelectConditionModal(){
                /*组装选择条件的参数*/
                let data = {
                    tables: this.formItem.tables,
                    condition: this.formItem.selectCondition
                };
                this.$refs.selectCondition.openSelectConditionModal(data);
            },
            closeSelectCondition(isCancel, data){
                if(!isCancel){
                    this.formItem.selectCondition =  data.condition;
                    // this.condition =   data.condition;
                }
            },
            openSelectOrderModal(){
                /*根据查询方式不同，设置不同的selectedColumns*/
                let selectedColumns =  this.queryType == 'G' ? this.groupBy : this.selectedColumns;
                /*组装选择条件的参数*/
                let data = {
                    selectedColumns,
                    orders: this.orders
                };
                this.$refs.selectOrder.openSelectOrderModal(data);
            },
            closeSelectOrder(isCancel, data){
                if(!isCancel){
                    console.info(data);
                    this.orders = data.orders;
                    this.formItem.selectedOrder =  this.array2String(this.orders, 'code');//设置数据
                }
            },

            openGroupModal(){
                /*组装选择字段的参数*/
                let data = {
                    opt: 'GROUP',
                    tables: this.formItem.tables,
                    selectedColumns: this.groupBy
                };
                this.$refs.selectColumn.openSelectColumnsModal(data);
            },

            openSelectGroupColumns(){
                /*组装选择字段的参数*/
                let data = {
                    tables: this.formItem.tables,
                    groups: this.groups
                };
                this.$refs.selectGroupColumn.openSelectGroupColumnModal(data);
            },

            closeSelectGroupColumn(isCancel, data){
                if(!isCancel){
                    this.groups = data;
                    this.formItem.groups = this.groups2String(this.groups);
                }
            },

            openSelectGroupCondition(){
                /*首先判断是否已经选择了分组字段*/
                if(this.groupBy.length > 0){
                    let data = {groupColumns :this.groupBy, condition : this.formItem.having};
                    this.$refs.selectGroupCondition.openSelectGroupConditionModal(data);
                }
                else{
                    this.$Message.info('请先选择分组字段。');
                }

            },
            closeSelectGroupCondition(isCancel, data){
                if(!isCancel){
                    this.$delete(this.formItem, 'having');
                    this.$set(this.formItem, 'having', data.condition);
                    // this.formItem.having =   data.condition;
                }
            },
            addTable(index){
                /*先判断当前查询是否已经存在6张表，如果存在，则不能再选择关联表*/
                if(this.formItem.tables.length > 5){
                    this.$Message.info('最多能选择6张表。');
                }
                else {
                    /* 1. 设置数据*/
                    let masterTable = this.formItem.tables[index];
                    /*2. 获取打开窗口的的新表的别名*/
                    let joinTableAlias = this.getAlias(this.formItem.tables);
                    /*3. 组装对应的参数*/
                    let opt = 'add';
                    let data = {masterTable, joinTableAlias, opt};
                    /*4. 打开对应的窗口*/
                    this.$refs.selectJoinTable.openJoinTableModal(data);
                }
            },
            editTable(index){
                /* 1. 获取要编辑的关联表 */
                let joinTable = this.formItem.tables[index];
                /*2. 获取关联表的关联主表的关系 */
                let joinCondition = this.getJoinCondition(joinTable.alias);
                /*3. 根据关系中表的别名查询到对应的主表数据  */
                let masterTable = this.getTable(joinCondition.masterTable);
                /*4. 获取关联表的别名*/
                let joinTableAlias = joinTable.alias;
                /*5. 组装对应的参数*/
                let opt = 'edit';
                let data = {masterTable, joinTable, joinCondition, joinTableAlias, opt};
                /*6. 打开对应的窗口*/
                this.$refs.selectJoinTable.openJoinTableModal(data);
            },
            delTable(index){
                /*1. 获取要删除的表*/
                let joinTable = this.formItem.tables[index];
                /*2. 根据关联表别名删除对应的关联表及关系*/
                this.delJoinTable(joinTable.alias);
                /*3. 再删除对应的关联表*/
                this.formItem.tables.splice(index, 1);
            },
            closeSelectJoinTable(isCancel, data){
                /*如果不是取消，就更新对应的数据*/
                if(!isCancel){
                    if(data.opt == 'add'){
                        this.formItem.tables.push(data.joinTable);
                        this.joinTables.push(data.joinCondition);
                    }
                    else{
                        this.updateTables(data.joinTable);
                        this.updateJoinTables(data.joinCondition);
                    }
                }
            },

            /*删除数组中对应的关联表关系*/
            delJoinTable(joinTableAlias){
                let index;
                this.joinTables.forEach((v, i)=>{
                    if(v.joinTable == joinTableAlias){
                        index = i;
                        return;
                    }
                });
                this.joinTables.splice(index, 1);
            },

            /*更新数组中对应的关联表*/
            updateTables(table){
                let index;
                this.formItem.tables.forEach((v, i)=>{
                    if(v.alias == table.alias){
                       index = i;
                        return;
                    }
                });
                this.formItem.tables.splice(index, 1, table);
            },

            /*更新数组中对应的关联表关系*/
            updateJoinTables(condition){
                let index;
                this.joinTables.forEach((v, i)=>{
                    if(v.joinTable == condition.joinTable){
                       index = i;
                        return;
                    }
                });
                this.joinTables.splice(index, 1, condition);
            },
            //根据别名，返回当前表数组中对应的表
            getTable(alias){
                let table;
                this.formItem.tables.forEach((v, i)=>{
                    if(v.alias == alias){
                        table = v;
                        return;
                    }
                });
                return table;
            },
            /*根据关联表的别名，查询关联表对应的关联关系*/
            getJoinCondition(joinTableAlias){
                let condition;
                this.joinTables.forEach((v, i)=>{
                    if(v.joinTable == joinTableAlias){
                        condition = v;
                        return;
                    }
                });
                return condition;
            },
            /* 根据表列表，生成一个新的表别名 */
           getAlias(tables){
               if(tables && tables.length > 0){
                   let alias, flag = 0;
                    tables.forEach(function (t, i) {
                        let aliasCount = Number(t.alias.replace('T', ''));
                        flag = (flag > aliasCount) ? flag : aliasCount;
                    });
                    flag = flag + 1;
                    return 'T' + flag;
               }
               else{
                   return 'T1';
               }
           },
            /*两个数组相减， 返回已经删除aArr中存在bArr的数据的数组*/
            arr_dive(aArr,aCode, bArr, bCode){
                if(aArr.length == 0) return [];
                if(bArr.length == 0) return aArr;
                let newArray = [];
                aArr.forEach((a, ai)=>{
                    let isHave = false;
                    bArr.forEach((b, bi)=>{
                        if(a[aCode] && b[bCode] && a[aCode] == b[bCode]){
                            isHave = true;
                            return;
                        }
                    })
                    if(!isHave){
                        newArray.push(a);
                    }
                })
                return newArray;
            },

            /*根据汇总字段，转换为显示字符串*/
            groups2String(groups){
                if(groups.length > 0){
                    let delGroups = []; //记录全部是N的记录，
                    let groupArray = [];
                    groups.forEach((v, i)=>{
                        let l = groupArray.length;
                        if(v['DC'] == 'Y'){
                            groupArray.push('DC(' + v['code'] + ')');
                        }
                        if(v['SUM'] == 'Y'){
                            groupArray.push('SUM(' + v['code'] + ')');
                        }
                        if(v['DS'] == 'Y'){
                            groupArray.push('DS(' + v['code'] + ')');
                        }
                        if(v['MAX'] == 'Y'){
                            groupArray.push('MAX(' + v['code'] + ')');
                        }
                        if(v['MIN'] == 'Y'){
                            groupArray.push('MIN(' + v['code'] + ')');
                        }
                        if(v['AVG'] == 'Y'){
                            groupArray.push('AVG(' + v['code'] + ')');
                        }
                        /*如果相等，就说明没有是Y值的数*/
                        if( l == groupArray.length){
                            delGroups.push(v);
                        }
                    })
                    /*根据索引值，删除对应的数据*/
                    if(delGroups.length > 0){
                        this.groups = this.arr_dive(groups, 'code', delGroups, 'code');
                    }
                    return groupArray.toString();
                }
                else{
                    return "";
                }
            }
        }
    }
</script>

<style scoped>

</style>