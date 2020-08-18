<!--********************选择字段Modal***********************-->
<template>
    <Modal 	width="70%"
              v-model="selectGroupColumnModal"
              title="选择字段"
              :transfer="true"
              :mask-closable = "false"
              @on-ok="selectGroupColumnSave"
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
                <Col span="10">
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
                        <Table border ref="leftTable" height="400" :highlight-row="true"  :columns="leftColumns" :data="leftDatas" @on-row-dblclick="moveToRight" @on-row-click="selectLeftRow"></Table>
                    </Row>
                </div>
                </Col>
                <Col span="14">
                <Row>
                    <Col span="12">
                        <div style="margin-bottom: 5px; margin-left: 15px;">
                            <Button type="primary" size="small" icon="ios-rewind-outline" title="移动全部" @click="moveAllToLift"> </Button>
                            <Button type="primary" size="small" icon="ios-arrow-left" title="移动" @click="moveToLift"> </Button>
                        </div>
                    </Col>
                    <Col span="12">
                        <div style="text-align: right; float:right; margin-bottom: 5px; margin-right: 10px;">
                            <Input v-model="rightSearch" placeholder="Search" style="width: 200px" @on-enter="rightSearchMethod" @on-change="rightSearchMethod"> <Button slot="append" icon="ios-search" @on-click="rightSearchMethod"></Button></Input>
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Table border ref="rightTable"  height= "400" :highlight-row="true"  :columns="rightColumns" :data="rightDatas" @on-row-dblclick="moveToLift" @on-row-click="selectRightRow"></Table>
                </Row>
                </Col>
            </Row>
        </template>
    </Modal>
</template>

<script>
    export default {
        name: "select-group-column",
        props:{
        },
        data() {
            return {
                selectGroupColumnModal: false,
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
                    {title: '中文名', key: 'columnName'}
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
                    {
                        title: '汇总方式',
                        align: 'center',
                        children: [
                            {
                                title: '唯一值计数',
                                key: 'DC',
                                align: 'center',
                                render: (h, params) =>{
                                    let row = params.row;
                                    let code = 'DC';
                                    if(row.DC == 'Y'){
                                        return h('Checkbox', {props:{'value' : true},
                                            on: {
                                                'on-change': (data) => {
                                                    this.changeGroup(data, row, code, params.index);
                                                }
                                            }});
                                    }
                                    else{
                                        return h('Checkbox', {props:{'value' : false},
                                            on: {
                                                'on-change': (data) => {
                                                    this.changeGroup(data, row, code, params.index);
                                                }
                                            }});
                                    }
                                }
                            },
                            {
                                title: '求和',
                                key: 'SUM',
                                align: 'center',
                                render: (h, params) =>{
                                    let row = params.row;
                                    let code = 'SUM';
                                    if(row.SUM == 'Y'){
                                        return h('Checkbox', {props:{'value' : true},
                                            on: {
                                                'on-change': (data) => {
                                                    this.changeGroup(data, row, code, params.index);
                                                }
                                            }});
                                    }
                                    else{
                                        return h('Checkbox', {props:{'value' : false},
                                            on: {
                                                'on-change': (data) => {
                                                    this.changeGroup(data, row, code, params.index);
                                                }
                                            }});
                                    }
                                }
                            },
                            {
                                title: '唯一值求和',
                                key: 'DS',
                                align: 'center',
                                render: (h, params) =>{
                                    let row = params.row;
                                    let code = 'DS';
                                    if(row.DS == 'Y'){
                                        return h('Checkbox', {props:{'value' : true},
                                            on: {
                                                'on-change': (data) => {
                                                    this.changeGroup(data, row, code, params.index);
                                                }
                                            }});
                                    }
                                    else{
                                        return h('Checkbox', {props:{'value' : false},
                                            on: {
                                                'on-change': (data) => {
                                                    this.changeGroup(data, row, code, params.index);
                                                }
                                            }});
                                    }
                                }
                            },
                            {
                                title: '最大值',
                                key: 'MAX',
                                align: 'center',
                                render: (h, params) =>{
                                    let row = params.row;
                                    let code = 'MAX';
                                    if(row.MAX == 'Y'){
                                        return h('Checkbox', {props:{'value' : true},
                                            on: {
                                                'on-change': (data) => {
                                                    this.changeGroup(data, row, code, params.index);
                                                }
                                            }});
                                    }
                                    else{
                                        return h('Checkbox', {props:{'value' : false},
                                            on: {
                                                'on-change': (data) => {
                                                    this.changeGroup(data, row, code, params.index);
                                                }
                                            }});
                                    }
                                }
                            },
                            {
                                title: '最小值',
                                key: 'MIN',
                                align: 'center',
                                render: (h, params) =>{
                                    let row = params.row;
                                    let code = 'MIN';
                                    if(row.MIN == 'Y'){
                                        return h('Checkbox', {props:{'value' : true},
                                            on: {
                                                'on-change': (data) => {
                                                    this.changeGroup(data, row, code, params.index);
                                                }
                                            }});
                                    }
                                    else{
                                        return h('Checkbox', {props:{'value' : false},
                                            on: {
                                                'on-change': (data) => {
                                                    this.changeGroup(data, row, code, params.index);
                                                }
                                            }});
                                    }
                                }
                            },
                            {
                                title: '平均',
                                key: 'AVG',
                                align: 'center',
                                render: (h, params) =>{
                                    let row = params.row;
                                    let code = 'AVG';
                                    if(row.AVG == 'Y'){
                                        return h('Checkbox', {props:{'value' : true},
                                            on: {
                                                'on-change': (data) => {
                                                    this.changeGroup(data, row, code, params.index);
                                                }
                                            }});
                                    }
                                    else{
                                        return h('Checkbox', {props:{'value' : false},
                                            on: {
                                                'on-change': (data) => {
                                                    this.changeGroup(data, row, code, params.index);
                                                }
                                            }});
                                    }
                                }
                            }
                        ]
                    }
                ],
                rightDatas: [],
                //存放查询前的数据
                realLeftDatas: [],
                realRightDatas: [],
                checkedTables: [],
                groups: [],
                checked: true,
                unchecked: false
            }
        },
        methods: {
            init(data){
                this.tables = data.tables;
                debugger;
                this.groups = JSON.parse(JSON.stringify(data.groups));

                //每次初始化的时候，清空数据
                this.realLeftDatas = [];
                this.realRightDatas = [];

                let tables = JSON.stringify(this.tables);
                this.$net.send({
                    server: this.$services.sysService.metaColumnRestController.getAllColumns,
                    data: {tables:tables, filter: true}
                }).then((data) => {
                    if(this.groups.length == 0){
                        this.realRightDatas = [];
                        this.rightDatas = [];
                        this.realLeftDatas = this.formatterGroupColumn(data);
                        this.leftDatas = JSON.parse(JSON.stringify(this.realLeftDatas));
                    }
                    else{
                        this.formatterSelectedColumn(data);
                    }
                });
            },

            changeGroup(data, row, code, index){
                let  dc = data ? 'Y' : 'N';
                this.$delete(row, code);
                this.$set(row, code, dc);
                this.rightDatas[index] = row;
                this.updateRealRightDatas(row);
            },
            openSelectGroupColumnModal(data){
                this.init(data);
                this.selectGroupColumnModal = true;
            },
            cancel(){
                this.$emit('closeSelectGroupColumn', true);
            },

            selectGroupColumnSave(){
                /*先清空选择的字段信息*/
                this.groups = [];
                this.realRightDatas.forEach((v, i) =>{
                    console.info('realRightData: ', v);
                    let data = {
                        code: v.columnCode,
                        name:  v.columnName,
                        expr:  v.expr,
                        DC: v.DC,
                        SUM: v.SUM,
                        DS: v.DS,
                        MAX: v.MAX,
                        MIN: v.MIN,
                        AVG: v.AVG
                    };
                    this.groups.push(data);
                });
                this.$emit('closeSelectGroupColumn', false, this.groups);
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

            formatterGroupColumn(columns){
                let groupColumns = [];
                columns.forEach((v, i)=>{
                    v['DC'] = 'N';
                    v['SUM'] = 'N';
                    v['DS'] = 'N';
                    v['MIN'] = 'N';
                    v['MAX'] = 'N';
                    v['AVG'] = 'N';
                    groupColumns.push(v);
                });
                return groupColumns;
            },
            formatterSelectedColumn(initialColumns){
                initialColumns.forEach((v, i)=>{
                    let isHave = false;
                    let bv = '';
                    this.groups.forEach((b, bi)=>{
                        if(b['expr'] == v['alias'] + '.' + v['columnCode']){
                            isHave = true;
                            bv = b;
                            return;
                        }
                    });
                    if(!isHave){
                        v['DC'] = 'N';
                        v['SUM'] = 'N';
                        v['DS'] = 'N';
                        v['MIN'] = 'N';
                        v['MAX'] = 'N';
                        v['AVG'] = 'N';
                        this.realLeftDatas.push(v);
                    }
                    else {
                        v['DC']   = bv['DC']  ;
                        v['SUM']  = bv['SUM'] ;
                        v['DS']   = bv['DS']  ;
                        v['MIN']  = bv['MIN'] ;
                        v['MAX']  = bv['MAX'] ;
                        v['AVG']  = bv['AVG'] ;
                        this.realRightDatas.push(v);
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
                    this.realRightDatas = this.arr_dive(this.realRightDatas,'columnCode', this.rightDatas, 'columnCode');
                    this.realLeftDatas = this.realLeftDatas.concat(this.rightDatas);
                    this.leftDatas = this.leftDatas.concat(this.rightDatas);
                    this.rightDatas = [];
                }
            },
            //移动到左边
            moveToLift(row, index){
                if(!index){
                    row = this.rightSelectRow;
                    index = this.rightIndex;
                }
                if(row && row !=''){
                    /*删除右边的元素*/
                    this.rightDatas.splice(index, 1);
                    //删除右边的真实的数组
                    this.realRightDatas = this.arr_dive(this.realRightDatas,'columnCode', [row], 'columnCode');
                    /*添加左边的数据*/
                    this.leftDatas.push(row);
                    /*给左边真实的数组添加数据*/
                    this.realLeftDatas.push(row);

                    this.rightSelectRow = '';
                    this.rightIndex = -1;
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

            /*更新数组中对应的列数据*/
            updateRealRightDatas(row){
                let index;
                this.realRightDatas.forEach((v, i)=>{
                    if(v.columnCode == row.columnCode){
                        index = i;
                        return;
                    }
                });
                this.realRightDatas.splice(index, 1, row);
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