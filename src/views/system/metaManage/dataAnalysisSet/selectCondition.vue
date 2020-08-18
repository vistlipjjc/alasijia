<!--********************选择字段Modal***********************-->
<template>
    <Modal 	width="60%"
              v-model="selectConditionModal"
              title="选择条件"
              :transfer="true"
              :mask-closable = "false"
              @on-ok="selectConditionSave"
              @on-cancel="cancel">
        <template>
            <template>
                <Input v-model="condition" type="textarea" :autosize="{minRows: 2,maxRows: 5}"></Input>
            </template>
            <template>
                <Tabs value="name1" ref="condituonColumn">
                    <TabPane label="原始列" name="name1">
                        <Row>
                            <div style="text-align: right; float:right; margin-bottom: 5px; margin-right: 10px;">
                                <Input v-model="search" placeholder="Search" style="width: 200px" @on-enter="searchMethod" @on-change="searchMethod"> <Button slot="append" icon="ios-search" @on-click="searchMethod"></Button></Input>
                            </div>
                        </Row>
                        <Row>
                            <Table @on-row-dblclick="onHavingDblclick" :columns="selectConditionColumns" :data="searchColumnsData" height="300"></Table>
                        </Row>
                    </TabPane>
                    <TabPane label="函数" name="name2">
                        <Table @on-row-dblclick="onHavingDblclick" :columns="funColumns" :data="funColumnsData" height="300" ></Table>
                    </TabPane>
                </Tabs>
            </template>
        </template>
    </Modal>
</template>

<script>
    export default {
        name: "select-condition",
        props:{
        },
        data() {
            return {
                selectConditionModal: false,
                transfer: true,
                condition: '',
                tables: [],
                search: '',
                selectConditionColumnsData: [],
                searchColumnsData: [],
                selectConditionColumns: [
                    {
                        title: '表名',
                        key: 'alias',
                        render: (h, params) =>{
                            let row = params.row;
                            let name = row.alias == 'T1' ? '(主表)' + row.tableCode : '(关联表-' + row.alias + ')' + row.tableCode;
                            return h('span', name);
                        }
                    },
                    {
                        title: '列名',
                        key: 'columnCode', render(h, params){
                            let row = params.row;
                            if(row.isKey == 'Y'){
                                return h('span', [h('Icon', {props: {size: 'small', type: 'key'}}), h('span', {style: {marginLeft: '5px'}}, row.columnCode)])
                            }
                            else{
                                return h('span', row.columnCode);
                            }

                        }},
                    {
                        title: '中文名',
                        key: 'columnName'
                    },
                    {
                        title: '类型',
                        key: 'dataType'
                    }
                ],
                funColumns: [
                    {
                        title: '函数',
                        key: 'expr'
                    },
                    {
                        title: '函数名',
                        key: 'funcDesc'
                    },
                    {
                        title: '函数类型',
                        key: 'category'
                    }
                ],
                funColumnsData: [
                    {expr: 'CONCAT(text1, text2)', funcDesc: '连接字符串', category: '字符串函数'},
                    {expr: 'LENGTH(text)', funcDesc: '字符串长度', category: '字符串函数'},
                    {expr: 'SUBSTR(text, start, count)', funcDesc: '截取字符串', category: '字符串函数'},
                    {expr: 'LEFT(str, len)', funcDesc: '从左边开始截取字符串', category: '字符串函数'},
                    {expr: 'RIGHT(str, len)', funcDesc: '从右边开始截取字符串', category: '字符串函数'},
                    {expr: 'TRIM(text)', funcDesc: '去除字符串两端的空格', category: '字符串函数'},
                    {expr: 'LTRIM(text)', funcDesc: '去除字符串左边的空格', category: '字符串函数'},
                    {expr: 'RTRIM(text)', funcDesc: '去除字符串右边的空格', category: '字符串函数'},
                    {expr: 'UPPER(text)', funcDesc: '把字符串转化为大写', category: '字符串函数'},
                    {expr: 'LOWER(text)', funcDesc: '把字符串转化为小写', category: '字符串函数'},
                    {expr: 'INSTR(source, target, str, end)', funcDesc: '函数返回“目标字符串”从“起始位置”开始在“源字符串”中第“匹配序号”次出现时的位置', category: '字符串函数'},
                    {expr: 'INSTR(source, target)', funcDesc: '函数返回“目标字符串”从第一个字符开始在“源字符串”中第1次出现时的位置', category: '字符串函数'},
                    {expr: 'REPLACE(text1, text2, text3)', funcDesc: '替换字符串', category: '字符串函数'},
                    {expr: 'RPAD(text, length, format)', funcDesc: '当字符串长度不足length时，用format替换，增加在右边', category: '字符串函数'},
                    {expr: 'LPAD(text, length, format)', funcDesc: '当字符串长度不足length时，用format替换，增加在左边', category: '字符串函数'},
                    {expr: 'TRANSLATE(source, original, replacement)', funcDesc: '转换字符串', category: '字符串函数'},

                    {expr: 'ABS(number)', funcDesc: '返回数字的绝对值', category: '数值函数'},
                    {expr: 'SIGN(number)', funcDesc: '当数字为正数返回1，数字为负数时返回-1', category: '数值函数'},
                    {expr: 'CEIL(number)', funcDesc: '向上取整', category: '数值函数'},
                    {expr: 'FLOOR(number)', funcDesc: '向下取整', category: '数值函数'},
                    {expr: 'ROUND(number, num_digits)', funcDesc: '四舍五入，取小数点后num_digits位。num_digits可以为负数', category: '数值函数'},
                    {expr: 'TRUNC(number, num_digits)', funcDesc: '格式化数字，取小数点后num_digits位。num_digits可以为负数', category: '数值函数'},
                    {expr: 'MOD(number1, number2)', funcDesc: '取余', category: '数值函数'},

                    {expr: 'LAST_DAY(date)', funcDesc: '取该日期当月最后一天', category: '日期时间函数'},
                    {expr: 'ADD_MONTHS(date, months)', funcDesc: '日期增加months个月', category: '日期时间函数'},
                    {expr: 'SYSDATE', funcDesc: '获得当前时间', category: '日期时间函数'},
                    {expr: 'DAYS(date)', funcDesc: 'days函数，返回日期与“date(0000-01-00)”之间的天数', category: '日期时间函数'},
                    {expr: 'HOUR(datetime)', funcDesc: '返回时间是小时数字', category: '日期时间函数'},
                    {expr: 'MINUTE(datetime)', funcDesc: '返回时间的分钟数字', category: '日期时间函数'},
                    {expr: 'SECOND(datetime)', funcDesc: '返回时间的秒数', category: '日期时间函数'},
                    {expr: 'DAY(date)', funcDesc: '返回时间的天数', category: '日期时间函数'},
                    {expr: 'MONTH(date)', funcDesc: '返回时间的月数', category: '日期时间函数'},
                    {expr: 'YEAR(date)', funcDesc: '返回时间的年数', category: '日期时间函数'},
                    {expr: 'DATE(datetime)', funcDesc: '返回日期', category: '日期时间函数'},
                    {expr: 'TIME(datetime)', funcDesc: '返回时间', category: '日期时间函数'},
                    {expr: 'WEEK(date)', funcDesc: '获得时间的周数', category: '日期时间函数'},
                    {expr: 'DAYNAME(date)', funcDesc: '获得日期的英文的星期一到星期日', category: '日期时间函数'},

                    {expr: 'TO_CHAR(number)', funcDesc: '数字转字符串', category: '转换函数'},
                    {expr: 'TO_CHAR(date, format)', funcDesc: '返回日期格式化后的字符串', category: '转换函数'},
                    {expr: 'TO_DATE(text, format)', funcDesc: '字符串转为日期格式', category: '转换函数'},
                    {expr: 'TO_NUMBER(text)', funcDesc: '字符串转数字', category: '转换函数'},
                    {expr: 'TO_TIMESTAMP(text, format)', funcDesc: '字符串转为时间戳格式', category: '转换函数'},
                    {expr: 'NVL(check_expression, replacement_value)', funcDesc: '当check_expression为空时就显示replacement_value', category: '转换函数'}
                ],
            }
        },
        methods: {
            init(data){
                this.condition = data.condition ? data.condition : '';
                this.tables = data.tables;
                let tables = JSON.stringify(this.tables);
                this.$net.send({
                    server: this.$services.sysService.metaColumnRestController.getAllColumns,
                    data: {tables:tables}
                }).then((data) => {
                    this.selectConditionColumnsData = data;
                    this.searchColumnsData = JSON.parse(JSON.stringify(this.selectConditionColumnsData));
                });
            },
            openSelectConditionModal(data){
                this.init(data);
                this.selectConditionModal = true;
            },
            cancel(){
                this.$emit('closeSelectCondition', true);
            },

            selectConditionSave(){
                let data = {condition : this.condition};
                this.$emit('closeSelectCondition', false, data);
            },

            onHavingDblclick(data){
                this.condition += data.expr;
            },

            //右边的搜索框
            searchMethod(){
                if(this.search && this.search != ''){
                    this.searchColumnsData = this.filterMethod (this.selectConditionColumnsData, 'columnCode', 'columnName', this.search);
                }
                else{
                    this.searchColumnsData = JSON.parse(JSON.stringify(this.selectConditionColumnsData));
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
        }
    }
</script>
<style scoped>

</style>