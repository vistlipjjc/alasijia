<template>
    <div class="exprCon">
        <Button :type="type" :icon="icon" :disabled="disabled"  @click="open">{{text}}</Button>
        <Modal v-model="status" title="表达式编辑"
               @on-ok="ok" @on-cancel="cancel"
               :mask-closable="false" width="700"
               :transfer="transfer"
               class-name="vertical-center-modal">
            <Row>
                <Col span="24">
                    <Input id="why" v-model="expr" ref="exprRef" type="textarea" :rows="5" placeholder="可手动输入"/>
                </Col>
            </Row>
            <Row class="margin-top-10">
                <Col span="24">
                    <span class="margin-right-10">运算符</span>
                <Button type="ghost" @click="updateOptExpr('+')">+</Button>
                <Button type="ghost" @click="updateOptExpr('-')">-</Button>
                <Button type="ghost" @click="updateOptExpr('*')">*</Button>
                <Button type="ghost" @click="updateOptExpr('/')">/</Button>
                <Button type="ghost" @click="updateOptExpr('!')">!</Button>
                <Button type="ghost" @click="updateOptExpr('&')">&</Button>
                <Button type="ghost" @click="updateOptExpr('(')">(</Button>
                <Button type="ghost" @click="updateOptExpr(')')">)</Button>
                <Button type="ghost" @click="updateOptExpr('=')">=</Button>
                <Button type="ghost" @click="updateOptExpr('<')">&lt;</Button>
                <Button type="ghost" @click="updateOptExpr('>')">&gt;</Button>
                <Button type="ghost" @click="updateOptExpr('!=')">!=</Button>
                <Button type="ghost" @click="updateOptExpr('<=')">&lt;=</Button>
                <Button type="ghost" @click="updateOptExpr('>=')">&gt;=</Button>
                </Col>
            </Row>
            <Row :gutter="10" class="margin-top-10">
                <Col :xs="24" :sm="24" :md="8" :lg="8">
                    <Card icon="ios-keypad" title="类别" class="card-con">
                        <ul class="card-con-ul" ref="type">
                            <li ref="dataElement" @click="selectType('dataElement')"><a ref="dataElementa" href="#">数据绑定</a></li>
                            <li ref="functions" @click="selectType('functions')"><a ref="functionsa" href="#">函数</a></li>
                            <li ref="operators" @click="selectType('operators')"><a ref="operatorsa" href="#">运算符</a></li>
                        </ul>
                    </Card>
                </Col>
                <Col :xs="24" :sm="24" :md="8" :lg="8">
                    <Card icon="navicon-round" title="子类别" class="card-con">
                        <ul class="card-con-ul" ref="childrenType">
                            <li v-for="item in childrenTypeList" :key="item.name" @click="selectChildrenType(item.name)" :ref="item.name"><a href="#" :ref="item.name + 'a'">{{item.value}}</a></li>
                        </ul>
                    </Card>
                </Col>
                <Col :xs="24" :sm="24" :md="8" :lg="8">
                    <Card icon="mouse" title="点击选择" class="card-con">
                        <ul class="card-con-ul" ref="children">
                            <li v-for="item in childrenList" :key="item.name" @click="updateOptExpr(item.name)"><a href="#">{{item.value}}</a></li>
                        </ul>
                    </Card>
                </Col>
            </Row>
        </Modal>
    </div>
</template>

<script>
   export default {
        name: 'expr',
        props:{
            widgetProvierId:"",
            type: { //按钮类型
              type: String,
              default: 'ghost'
            },
            disabled: { //按钮是否可点击
                type: Boolean,
                default: false
            },
            icon: { //按钮图标
                type: String,
                default: 'edit'
            },
            text: String, //按钮文字
            value: String,
            transfer: {	 //是否将弹层放置于 body 内
                type: Boolean,
                default: true
            }
        },
        data () {
            return {
                status: false,
                expr: this.value, //表达式
                childrenTypeList: [], //显示的子类别列表
                childrenList: [], //显示的数据列表

                dataElement:[],
                /* 定义函数子类 */
                functions: [{name: 'f01', value: '字符串函数'}, {name: 'f02', value: '数学函数'}, {name: 'f03', value: '数据库函数'}],
                /* 定义运算符的子类 */
                operators: [{name: 'o01', value: '算数运算符'}, {name: 'o02', value: '逻辑运算符'}],
                /* 定义函数和运算符的具体数据 */
                childrenData: {
                    o01: [
                        {name: '+', value: '+'},
                        {name: '-', value: '-'},
                        {name: '*', value: '*'},
                        {name: '/', value: '/'}
                    ],
                    o02: [
                        {name: '&', value: '&'},
                        {name: '!', value: '!'},
                        {name: '|', value: '|'}
                    ],
                    f01: [
                        {name: '.concat()', value: 'concat'},
                        {name: '.split()', value: 'split'},
                        {name: '.toLowerCase()', value: 'toLowerCase'},
                        {name: '.toUpperCase()', value: 'toUpperCase'},
                        {name: '.length()', value: 'length'},
                        {name: '.indexOf()', value: 'indexOf'},
                        {name: '.substring()', value: 'substring'},
                        {name: '.substr()', value: 'substr'}
                    ],
                    f02: [
                        {name: 'Math.round()', value: 'Math.round'},
                        {name: 'Math.sqrt()', value: 'Math.sqrt'},
                        {name: 'Math.cos()', value: 'Math.cos'},
                        {name: 'Math.sin()', value: 'Math.sin'},
                        {name: 'Math.tan()', value: 'Math.tan'},
                        {name: 'Math.acos()', value: 'Math.acos'},
                        {name: 'Math.floor()', value: 'Math.floor'},
                        {name: 'Math.ceil()', value: 'Math.ceil'}
                    ],
                    f03: [
                        {name: 'COUNT()', value: 'COUNT'},
                        {name: 'SUM()', value: 'SUM'},
                        {name: 'Max()', value: 'Max'},
                        {name: 'Min()', value: 'Min'},
                        {name: 'AVG()', value: 'AVG'}
                    ],
                    p01:[]
                },
            }
        },
       mounted() {
           // this.initDataElement();
       },
        methods: {
            initDataElement(val){
                this.$net.send({
                    server: this.$services.sysService.dashWidgetProviderRestController.getDataProviderByWidgetProvierId,
                    append: this.widgetProvierId
                }).then((data) => {
                    this.dataElement =  [{name: 'p01', value: data.name}];
                    var columns = data.columns;
                    for(var i=0;i<columns.length;i++){
                        let v=columns[i];
                        this.childrenData['p01'].push({name: 'dataRow["' + v.columnCode + '"]', value: v.columnCode});
                    }
                });
            },
            open(){
                this.status = true;
                this.childrenTypeList = [];
                this.childrenList = [];
                if(this.dataElement.length==0){
                    this.initDataElement();
                }
            },
            ok(){
                this.$emit('on-value', this.expr);
            },
            cancel() {
                this.$emit('on-value', '');
            },
            /*加载子类别，并设置选中类别的样式*/
            selectType(type){
                this.childrenTypeList = [];
                this.childrenList = [];
                this.childrenTypeList = this[type];
                /*设置样式*/
                /*let li = this.arrayfrom(this.$refs.type.children);
                li.forEach( (v, i) => {
                    v.classList.remove('li-con');
                    v.children[0].classList.remove('li-con');
                });
                this.$refs[type].className = 'li-con';
                this.$refs[type + 'a'].className = 'li-con';*/
            },
            /*加载对应值，并设置选中子类别的样式*/
            selectChildrenType(type){
                this.childrenList = [];
                this.childrenList = this.childrenData[type];
            },
            /*更新表达式*/
            updateOptExpr(data){
                if(data){
                    let t = this.$refs.exprRef.$refs.textarea;
                    let index = this.getCaretPosition(t);
                    let arr = t.value.split('');
                    arr.splice(index, 0, data);
                    // t.value = arr.join('');
                    this.expr=arr.join('');
                }

            },
            getCaretPosition (oField){
                var iCaretPos = 0;
                var doc = oField.ownerDocument || oField.document;
                var win = doc.defaultView || doc.parentWindow;
                var sel;
                if (typeof win.getSelection != "undefined") {
                    sel = win.getSelection();
                    if (sel.rangeCount > 0) {
                        var range = win.getSelection().getRangeAt(0);
                        var preCaretRange = range.cloneRange();
                        preCaretRange.selectNodeContents(doc);
                        preCaretRange.setEnd(range.endContainer, range.endOffset);
                        iCaretPos = preCaretRange.toString().length;
                    }
                } else if ( (sel = doc.selection) && sel.type !== 'Control') {
                    var textRange = sel.createRange();
                    var preCaretTextRange = doc.body.createTextRange();
                    preCaretTextRange.moveToElementText(oField);
                    preCaretTextRange.setEndPoint('EndToEnd', textRange);
                    iCaretPos = preCaretTextRange.text.length;
                }
                return iCaretPos;
            },

            /*将 nodelist 转为数组*/
            arrayfrom(nidelist) {
                var array = [];
                [].forEach.call(nidelist, function (v) {
                    array.push(v);
                });
                return array;
            }
        },
       watch:{
            value (val){
              this.expr = val;
           }
       }
    }
</script>

<style lang="less" scoped>
    .vertical-center-modal{
        display: flex;
        align-items: center;
        justify-content: center;
        .ivu-modal{
            top: 0;
        }
    }
    .card-con{
        height: 200px;
        &-ul{
            max-height: 120px;
            overflow: auto;
            padding-top: 6px;
            padding-bottom: 6px;
            li{
                cursor: pointer;
            }
        }
    }
    .li-con{
        color: #657180;
        background-color: #ebf7ff;
        border-color: #ebf7ff;
    }

</style>