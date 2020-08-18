<!--********************选择字段Modal***********************-->
<template>
    <Modal 	width="70%"
              v-model="selectColumnsModal"
              title="选择字段"
              :transfer="true"
              :mask-closable = "false"
              @on-ok="selectColumnSave"
              @on-cancel="cancel">
        <template>
            <Row>
                <div style="margin-bottom: 5px;">
                    <CheckboxGroup v-model="checkedTables" @on-change="checkTableChange">
                        <span v-for="(table, index) in tables" :key="index">  <Checkbox :label="index"><span>{{table.alias + '-' + table.name + '(' + table.code + ')'}}</span></Checkbox></span>
                    </CheckboxGroup>
                </div>
            </Row>
            <Row>
                <Col span="12">
                <div style="margin-right: 10px;">
                    <Row>
                        <Col span="18">
                        <div style="margin-bottom: 5px; margin-left: 10px;">
                            <Input v-model="leftSearch" placeholder="Search"  style="width: 200px" @on-enter="leftSearchMethod" @on-change="leftSearchMethod"> <Button slot="append" icon="ios-search" @on-click="leftSearchMethod"></Button> </Input>
                        </div>
                        </Col>
                        <Col span="6">
                        <div style="text-align: right">
                            <div style="margin-right: 15px;">
                                <Button type="primary" size="small" icon="ios-arrow-right" title="移动" @click="moveToRight"> </Button>
                                <Button type="primary" size="small" icon="ios-fastforward-outline"  title="移动全部" @click="moveAllToRight"> </Button>
                            </div>
                        </div>
                        </Col>
                    </Row>
                    <Row>
                        <Table border ref="leftTable" height="450" :highlight-row="true"  :columns="leftColumns" :data="leftDatas" @on-row-dblclick="moveToRight" @on-row-click="selectLeftRow"></Table>
                    </Row>
                </div>
                </Col>
                <Col span="12">
                <Row>
                    <Col span="12">
                        <div style="margin-bottom: 5px; margin-left: 15px;">
                            <Button type="primary" size="small" icon="ios-rewind-outline" title="移动全部" @click="moveAllToLift"> </Button>
                            <Button type="primary" size="small" icon="ios-arrow-left" title="移动" @click="moveToLift"> </Button>
                            <Button type="info" size="small" title="添加自定义列" @click="addCustomColumn">添加自定义列</Button>
                        </div>
                    </Col>
                    <Col span="12">
                        <div style="text-align: right; float:right; margin-bottom: 5px; margin-right: 10px;">
                            <Input v-model="rightSearch" placeholder="Search" style="width: 200px" @on-enter="rightSearchMethod" @on-change="rightSearchMethod"> <Button slot="append" icon="ios-search" @on-click="rightSearchMethod"></Button></Input>
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Table border ref="rightTable"  height= "450" :highlight-row="true"  :columns="rightColumns" :data="rightDatas" @on-row-dblclick="moveToLift" @on-row-click="selectRightRow"></Table>
                </Row>
                </Col>
            </Row>
        </template>
        <edit-custom-column ref="editCustomColumn" @closeEditCustomColumn="closeEditCustomColumn"></edit-custom-column>
    </Modal>
</template>

<script>
    import EditCustomColumn from "./editCustomColumn";
    export default {
        name: "select-column",
        components:{
            EditCustomColumn
        },
        props:{
        },
        data() {
            return {
                selectColumnsModal: false,
                tables: [],
                leftSearch: '',
                rightSearch: '',
                leftSelectRow: '',
                leftIndex: '',
                rightSelectRow: '',
                rightIndex: '',
                leftColumns: [
                    {title: '表名', key: 'alias'},
                    {title: '列名', key: 'columnCode', render(h, params){
                            let row = params.row;
                           if(row.isKey == 'Y'){
                               return h('span', [h('Icon', {props: {size: 'small', type: 'key'}}),
                                                  h('span', {
                                                      style: {
                                                          marginLeft: '5px'
                                                      }} ,row.columnCode)])
                           }
                           else{
                               return h('span', row.columnCode);
                           }

                        }},
                    {title: '中文名', key: 'columnName'},
                    {title: '类型', key: 'dataType'}

                ],
                leftDatas: [],
                rightColumns: [
                    {title: '表名', key: 'alias'},
                    {title: '列名', key: 'columnCode', render(h, params){
                            let row = params.row;
                            if(row.isKey == 'Y'){
                                return h('span', [h('Icon', {props: {size: 'small', type: 'key'}}), h('span', {style: {marginLeft: '5px'}}, row.columnCode)])
                            }
                            else{
                                return h('span', row.columnCode);
                            }

                        }},
                    {title: '中文名', key: 'columnName'},
                    {title: '类型', key: 'dataType'},
                    {title: '操作', key: 'order', render: (h, params) =>{
                        let row = params.row;
                        if(row.columnType == 'C'){
                            return h('span', [ h('Button', {
                                props: {
                                    type: 'ghost',
                                    icon: 'edit',
                                    shape: 'circle',
                                    size: 'small'
                                },
                                style: {
                                    margin: '0 1px'
                                },
                                on: {
                                    'click': () => {
                                        /*编辑对应的列*/
                                        this.editCustomColumn(row, params.index);
                                    }
                                }
                            }), h('Button', {
                                style: {
                                    margin: '0 1px'
                                },
                                props: {
                                    type: 'ghost',
                                    placement: 'top',
                                    icon: 'trash-a',
                                    shape: 'circle',
                                    size: 'small'
                                },
                                on: {
                                    'click': () => {
                                        /*删除显示的列*/
                                        this.rightDatas.splice(params.index, 1);
                                        this.realRightDatas = this.arr_dive(this.realRightDatas, 'columnCode', [row], 'columnCode');
                                    }
                                }
                            })])
                        }
                        else{

                        }
                     }}
                ],
                rightDatas: [],
                //存放查询前的数据
                realLeftDatas: [],
                realRightDatas: [],
                checkedTables: [],
                selectedColumns: [],
                opt: ''
            }
        },
        methods: {
            init(data){
                this.tables = data.tables;
                this.selectedColumns = JSON.parse(JSON.stringify(data.selectedColumns));
                this.opt = data.opt ? data.opt : '';

                //每次初始化的时候，清空数据
                this.realLeftDatas = [];
                this.realRightDatas = [];

                let tables = JSON.stringify(this.tables);
                this.$net.send({
                    server: this.$services.sysService.metaColumnRestController.getAllColumns,
                    data: {tables:tables}
                }).then((data) => {
                    if(this.selectedColumns.length == 0){
                        this.realLeftDatas = data;
                        this.leftDatas = JSON.parse(JSON.stringify(this.realLeftDatas));
                    }
                    else{
                        this.formatterSelectedColumn(data);
                    }
                });
            },
            openSelectColumnsModal(data){
                this.init(data);
                this.selectColumnsModal = true;
            },
            cancel(){
                this.$emit('closeSelectColumn', true);
            },

            selectColumnSave(){
                /*先清空选择的字段信息*/
                this.selectedColumns = [];
                this.realRightDatas.forEach((v, i) =>{
                    let data = {
                        type:  v.columnType,
                        code:  v.columnCode,
                        name:  (v.columnName) ? v.columnName : '',
                        expr:  v.expr
                    };
                    this.selectedColumns.push(data);
                });
                this.$emit('closeSelectColumn', false, {data: this.selectedColumns, opt: this.opt});
            },
            addCustomColumn(){
                let data = {
                    opt: 'ADD',
                    tables: this.tables,
                    selectColumns: this.realRightDatas
                };
                this.$refs.editCustomColumn.openEditCustomColumnModal(data);
            },
            editCustomColumn(row, index){
                let data = {
                    opt: 'EDIT',
                    row: row,
                    index: index,
                    tables: this.tables,
                    selectColumns: this.arr_dive(this.realRightDatas, 'columnCode', [row], 'columnCode')
                };
                this.$refs.editCustomColumn.openEditCustomColumnModal(data);
            },
            /*关闭编辑自定义字段框*/
            closeEditCustomColumn(isCancel, data){
                debugger;
                if(!isCancel){
                    if(data.opt == 'EDIT'){
                        this.rightDatas.splice(data.index, 1, data.row);
                        /*先删除原来的数据，再把新数据插入到数组中*/
                        this.realRightDatas = this.arr_dive(this.realRightDatas, 'columnCode', [data.oldRow], 'columnCode');
                        this.realRightDatas.push(data.row)
                    }
                    else{
                        this.realRightDatas.push(data.row);
                        this.rightDatas.push(data.row);
                    }

                }
            },
            checkTableChange(data){
                let tableArray = [];
                if(data.length > 0){
                    data.forEach((v, i) =>{
                        tableArray.push(this.tables[v].alias);
                    });
                    this.leftDatas = this.filterTablesMethod (this.realLeftDatas, 'alias', tableArray.toString());
                }
                else{
                    this.leftDatas = JSON.parse(JSON.stringify(this.realLeftDatas));
                }

                /*搜索的时候，需要先把选中的列清空*/
                this.leftSelectRow = '';
                this.leftIndex = -1;
                if(this.leftSearch && this.leftSearch != ''){
                    this.leftDatas = this.filterMethod (this.leftDatas, 'columnCode', 'columnName', this.leftSearch);
                }

            },
            formatterSelectedColumn(initialColumns){
                initialColumns.forEach((v, i)=>{
                    let isHave = false;
                    this.selectedColumns.forEach((b, bi)=>{
                        if(b['type']=='O' && b['expr'] == v['alias'] + '.' + v['columnCode']){
                            isHave = true;
                            return;
                        }
                    });
                    if(!isHave){
                        this.realLeftDatas.push(v);
                    }
                    else {
                        this.realRightDatas.push(v);
                    }
                });
                this.selectedColumns.forEach((b, bi)=>{
                    if(b['type']=='C'){
                        let data = {
                            columnType: "C",
                            columnCode: b.code,
                            columnName:b.name,
                            expr: b.expr
                        };
                        this.realRightDatas.push(data);
                    }
                });
                this.leftDatas = JSON.parse(JSON.stringify(this.realLeftDatas));
                this.rightDatas = JSON.parse(JSON.stringify(this.realRightDatas));
            },
            //移动当前右边列表显示的数据到左边框
            moveAllToRight(){
                /*当显示的数据不为空的时候，才进行移动*/
                if(this.leftDatas.length > 0){
                    /*先判断右边是否已经存在与该数据相同名字的列，如果存在，则不能移动*/
                    if(this.realRightDatas.length != this.arr_dive(this.realRightDatas, 'columnCode', this.leftDatas, 'columnCode').length){
                        this.$Message.info('已存在相同的列名，如需增加相同列名，请新增自定义列。');
                    }
                    else {
                        this.realLeftDatas = this.arr_dive(this.realLeftDatas,'columnId', this.leftDatas, 'columnId');
                        this.realRightDatas = this.realRightDatas.concat(this.leftDatas);
                        this.rightDatas = this.rightDatas.concat(this.leftDatas);
                        this.leftDatas = [];
                    }
                }
            },

            //移动到右边
            moveToRight(row, index){
                if(!index){
                    row = this.leftSelectRow;
                    index = this.leftIndex;
                }
                if(row && row !='') {
                    /*先判断右边是否已经存在与该数据相同名字的列，如果存在，则不能移动*/
                    if(this.realRightDatas.length != this.arr_dive(this.realRightDatas, 'columnCode', [row], 'columnCode').length){
                        this.$Message.info('已存在相同的列名，如需增加相同列名，请新增自定义列。');
                    }
                    else {
                        /*删除左边的元素*/
                        this.leftDatas.splice(index, 1);
                        //删除左边的真实的数组
                        this.realLeftDatas = this.arr_dive(this.realLeftDatas,'columnId', [row], 'columnId');
                        /*添加右边的数据*/
                        this.rightDatas.push(row);
                        /*给右边真实的数组添加数据*/
                        this.realRightDatas.push(row);

                        this.leftSelectRow = '';
                        this.leftIndex = -1;
                    }
                }
                else{
                    this.$Message.info('请选择要移动的数据。');
                }
            },
            //移动当前左边列表显示的数据到右边框
            moveAllToLift(){
                /*当显示的数据不为空的时候，才进行移动*/
                if(this.rightDatas.length > 0){
                    /*把显示的自定义字段和原始字段进行区分*/
                    let customs = [], resources = [];
                    this.rightDatas.forEach((v, i) =>{
                        if(v.columnType == 'C'){
                            customs.push(v);
                        }
                        else{
                            resources.push(v);
                        }
                    });
                    this.realRightDatas = this.arr_dive(this.realRightDatas,'columnId', resources, 'columnId');
                    this.realLeftDatas = this.realLeftDatas.concat(resources);
                    this.leftDatas = this.leftDatas.concat(resources);
                    this.rightDatas = customs;
                }
            },
            //移动到左边
            moveToLift(row, index){
                if(!index){
                    row = this.rightSelectRow;
                    index = this.rightIndex;
                }
                if(row && row !=''){
                    /*先判断是否是自定义列，如果是，就不能移动*/
                    if(row.columnType == 'C'){
                        this.$Message.info('不能移动自定义列。');
                    }
                    else{
                        /*删除右边的元素*/
                        this.rightDatas.splice(index, 1);
                        //删除右边的真实的数组
                        this.realRightDatas = this.arr_dive(this.realRightDatas,'columnId', [row], 'columnId');
                        /*添加左边的数据*/
                        this.leftDatas.push(row);
                        /*给左边真实的数组添加数据*/
                        this.realLeftDatas.push(row);

                        this.rightSelectRow = '';
                        this.rightIndex = -1;
                    }
                }
                else {
                    this.$Message.info('请选择要移动的数据。');
                }
            },
            selectLeftRow(row, index){
                this.leftSelectRow = row;
                this.leftIndex = index;
                console.info('this.leftSelectRow: ', this.leftSelectRow);
            },
            selectRightRow(row, index){
                this.rightSelectRow = row;
                this.rightIndex = index;
            },
            //左边的搜索框
            leftSearchMethod(){
                /*搜索的时候，需要先把选中的列清空*/
                this.leftSelectRow = '';
                this.leftIndex = -1;
                if(this.leftSearch && this.leftSearch != ''){
                    this.leftDatas = this.filterMethod (this.realLeftDatas, 'columnCode', 'columnName', this.leftSearch);
                }
                else{
                    this.leftDatas = JSON.parse(JSON.stringify(this.realLeftDatas));
                }
                /*判断是否勾选了表名*/
                if(this.checkedTables.length > 0){
                    let tableArray = [];
                    this.checkedTables.forEach((v, i) =>{
                        tableArray.push(this.tables[v].alias);
                    });
                    this.leftDatas = this.filterTablesMethod (this.leftDatas, 'alias', tableArray.toString());
                }
            },
            //右边的搜索框
            rightSearchMethod(){
                /*搜索的时候，需要先把选中的列清空*/
                this.rightSelectRow = '';
                this.rightIndex = -1;
                if(this.rightSearch && this.rightSearch != ''){
                    this.rightDatas = this.filterMethod (this.realRightDatas, 'columnCode', 'columnName', this.rightSearch);
                }
                else{
                    this.rightDatas = JSON.parse(JSON.stringify(this.realRightDatas));
                }
            },

            //根据query值查询datas中存在的值，返回新数组
            filterMethod (datas, code, name, query) {
                let newArray = [];
                if(datas && datas.length > 0){
                    datas.forEach((v, i) =>{
                        if(v[code].toLowerCase().indexOf(query.toLowerCase()) > -1 || v[name].toLowerCase().indexOf(query.toLowerCase()) > -1){
                            newArray.push(v);
                        }
                    })
                }
                return newArray;
            },

            /*根据表的名字进行过滤数据*/
            filterTablesMethod (datas, name, tables) {
                let newArray = [];
                if(datas && datas.length > 0){
                    datas.forEach((v, i) =>{
                        let  queryArray = tables.split(",");
                        if(jQuery.inArray(v[name],queryArray)  >= 0 ){
                            newArray.push(v);
                        }
                    })
                }
                return newArray;
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
            }
        }
    }
</script>
<style scoped>

</style>