<!--********************选择字段Modal***********************-->
<template>
    <Modal 	width="70%"
              v-model="selectOrderModal"
              title="选择排序字段"
              :transfer="true"
              :mask-closable = "false"
              @on-ok="selectOrderSave"
              @on-cancel="cancel">
        <template>
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
                        <Col span="6">
                            <div style="margin-bottom: 5px; margin-left: 15px;">
                                <Button type="primary" size="small" icon="ios-rewind-outline" title="移动全部" @click="moveAllToLift"> </Button>
                                <Button type="primary" size="small" icon="ios-arrow-left" title="移动" @click="moveToLift"> </Button>
                            </div>
                        </Col>
                        <Col span="18">
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
    </Modal>
</template>

<script>
    export default {
        name: "select-Order",
        props:{
        },
        data() {
            return {
                selectOrderModal: false,
                leftSearch: '',
                rightSearch: '',
                leftSelectRow: '',
                leftIndex: '',
                rightSelectRow: '',
                rightIndex: '',
                leftColumns: [
                    {title: '列名', key: 'code'},
                    {title: '中文名', key: 'name'}
                ],
                leftDatas: [],
                rightColumns: [
                    {title: '列名', key: 'code'},
                    {title: '中文名', key: 'name'},
                    {title: '排序规则', key: 'order',
                        render: (h, params) =>{
                            let row = params.row;
                            if(row.order == 'ASC'){
                                return  h('span', {
                                    on: {
                                        click: () => {
                                            this.$delete(row, 'order');
                                            this.$set(row, 'order', 'DESC');
                                            this.rightDatas[params.index] = row;
                                            this.updateRealRightDatas(row);
                                        }
                                    }
                                },  [h('Button', {props: {type: 'info', shape: 'circle', size: 'small', icon: 'arrow-up-c'}})]);
                            }
                            else{
                                return h('span', {
                                    on: {
                                        click: () => {
                                            this.$delete(row, 'order', 'ASC');
                                            this.$set(row, 'order', 'ASC');
                                            this.rightDatas[params.index] = row;
                                            this.updateRealRightDatas(row);
                                        }
                                    }
                                },  [h('Button', {props: {type: 'info', shape: 'circle', size: 'small', icon: 'arrow-down-c'}})]);
                            }
                        }}
                ],
                rightDatas: [],
                //存放查询前的数据
                realLeftDatas: [],
                realRightDatas: []
            }
        },
        methods: {
            init(data){
                /*先把所有的数据都加上默认升序排序*/
                data.selectedColumns.forEach((v, i)=>{
                    v['order'] = 'ASC';
                });
                if(!data.orders || data.orders.length == 0){
                    this.leftDatas = JSON.parse(JSON.stringify(data.selectedColumns));
                    this.realLeftDatas = JSON.parse(JSON.stringify(data.selectedColumns));
                }
                else{
                    /*1. 减去已经选择的字段*/
                    this.leftDatas = this.arr_dive(data.selectedColumns,'code', data.orders, 'code');
                    this.realLeftDatas = JSON.parse(JSON.stringify(this.leftDatas));
                    this.rightDatas = data.orders;
                    this.realRightDatas = JSON.parse(JSON.stringify(this.rightDatas));

                }
            },
            openSelectOrderModal(data){
                this.init(data);
                this.selectOrderModal = true;
            },
            cancel(){
                this.$emit('closeSelectOrder', true);
            },

            selectOrderSave(){
                let orders = [];
                this.realRightDatas.forEach((v, i) =>{
                    let o = {code: v.code, name: v.name, order: v.order};
                    orders.push(o);
                });
                let data = {orders : orders};
                this.$emit('closeSelectOrder', false, data);
            },

            //移动当前右边列表显示的数据到左边框
            moveAllToRight(){
                /*当显示的数据不为空的时候，才进行移动*/
                if(this.leftDatas.length > 0){
                    this.realLeftDatas = this.arr_dive(this.realLeftDatas,'code', this.leftDatas, 'code');
                    this.realRightDatas = this.realRightDatas.concat(this.leftDatas);
                    this.rightDatas = this.rightDatas.concat(this.leftDatas);
                    this.leftDatas = [];
                }
            },

            //移动到右边
            moveToRight(row, index){
                if(!index){
                    row = this.leftSelectRow;
                    index = this.leftIndex;
                }
                if(row && row !='') {
                    /*删除左边的元素*/
                    this.leftDatas.splice(index, 1);
                    //删除左边的真实的数组
                    this.realLeftDatas = this.arr_dive(this.realLeftDatas,'code', [row], 'code');
                    /*添加右边的数据*/
                    this.rightDatas.push(row);
                    /*给右边真实的数组添加数据*/
                    this.realRightDatas.push(row);

                    this.leftSelectRow = '';
                    this.leftIndex = -1;
                }
                else{
                    this.$Message.info('请选择要移动的数据。');
                }
            },
            //移动当前左边列表显示的数据到右边框
            moveAllToLift(){
                /*当显示的数据不为空的时候，才进行移动*/
                if(this.rightDatas.length > 0){
                    this.realRightDatas = this.arr_dive(this.realRightDatas,'code', this.rightDatas, 'code');
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
                    this.realRightDatas = this.arr_dive(this.realRightDatas,'code', [row], 'code');
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
                console.info('row: ', row);
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
                    this.leftDatas = this.filterMethod (this.realLeftDatas, 'code', 'name', this.leftSearch);
                }
                else{
                    this.leftDatas = JSON.parse(JSON.stringify(this.realLeftDatas));
                }
            },
            //右边的搜索框
            rightSearchMethod(){
                /*搜索的时候，需要先把选中的列清空*/
                this.rightSelectRow = '';
                this.rightIndex = -1;
                if(this.rightSearch && this.rightSearch != ''){
                    this.rightDatas = this.filterMethod (this.realRightDatas, 'code', 'name', this.rightSearch);
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

            /*两个数组相减， 返回已经删除aArr中存在bArr的数据的数组*/
            arr_dive(aArr,aCode, bArr, bCode){
                if(aArr.length == 0) return [];
                if(bArr.length == 0) return aArr;
                let newArray = [];
                aArr.forEach((a, ai)=>{
                    let isHave = false;
                    bArr.forEach((b, bi)=>{
                        if(a[aCode] == b[bCode]){
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
            /*更新数组中对应的列数据*/
            updateRealRightDatas(row){
                let index;
                this.realRightDatas.forEach((v, i)=>{
                    if(v.code == row.code){
                        index = i;
                        return;
                    }
                });
                this.realRightDatas.splice(index, 1, row);
            },
        }
    }
</script>
<style scoped>

</style>