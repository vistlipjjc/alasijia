<style lang="less" scoped>
    @import 'jEditor.less';
</style>

<template>
    <div class="j-editor">
        <Row class="j-editor-row-oper">
            <Row>
                <Button type="primary" @click="btnCompile" icon="edit" class="j-editor-button-oper">编译</Button>
                <Button type="primary" @click="btnView" icon="navicon" class="j-editor-button-oper">源码</Button>
                <Button type="primary" @click="btnSave"  class="j-editor-button-oper">保存</Button>
            </Row>
        </Row>
        <Row id="result_code" class="j-editor-row-code">
            <Input v-model="inputCode" type="textarea" :rows="12" placeholder=""></Input>
        </Row>
        <Row id="edit_code" class="j-editor-row">
            <Row><label class="j-editor-row-title">如果：</label></Row>
            <Row class="j-editor-row-condition">
                <Row id="condition" class="j-editor-row-condition-action">
                     
                </Row>
                <Button @click="btnAddCondition" type="primary" icon="android-add" class="j-editor-add">增加一个条件</Button>
            </Row>
            <Row class="j-editor-row-result-title"><label>那么：</label></Row>
            <Row class="j-editor-row-result">
                <Row id="result" class="j-editor-row-condition-action">
                   
                </Row>
                <Button type="primary" icon="android-add" @click="btnAddResult" class="j-editor-add"> 插件新动作</Button>
            </Row>
        </Row>
         <Row class="j-editor-row-result-msg-title"><label>消息提示</label></Row>
        <Row id="result_msg" class="j-editor-row-msg">
            <Row><label class="msg msg-number">编号</label><label class="msg msg-content">错误消息</label></Row>
        </Row>
        <Modal
            v-model="modal1"
            id="modal1"
            title="源码查看"
            @on-ok="关闭">
        </Modal>
    </div>
</template>

<script>
import net from '@/util/net';
import {services} from '@/config/services/index';

export default {
    name: 'jEditor',
    props: {
            ruleId: String,
            ruleCode: String,
            compile: Object,
            save: Object,
            objects: Array,
            functions: Array,
            inputCode: String,
            script: String,
            sourceCode: String
    },
    data () {
        return {
            data: Object,
            actions: Object,
            operates: Object,
            strOperates: Object,
            logics: Object,
            memOperate: Object,
            endLogics: Array,
            inputValue: String,
            modal1: false,
            //inputCode: this.inputCode
        };
    },
    created () {
        
    },
    beforeMount (){
       this.init();
    },
    mounted: function() {
        this.initData();
    },
    methods: {
        init () {
            //初始化条数组
            //操作符
            this.operates = {"==" : "等于", ">" : "大于", ">=" : "大于等于", "<" : "小于", "<=" : "小于等于", "!=" : "不等于", "memberOf" : "属于", "not memberOf" : "不属于"}; //操作符
            //对象数据类型是字符串的操作符
            this.strOperates = {"==":"等于","!=":"不等于"}; 
            //逻辑操作
            this.logics = {"" : "空", "and" : "并且", "or" : "或者", "and (" : "并且(", "or (" :"或者(" , ") and" : ") 并且" , ") or" : ") 或者" , "(" : "(" , ")" : ")"};
            //内存操作
            this.memOperate = {"insert":"添加对象","retract":"删除对象","update":"更新对象"};
            this.actions = {"memOperate":"内存操作","setValue":"对象赋值","addList":"加入返回列表","functions":"方法调用"};
            this.endLogics = {";":"结束符",")":")"};
            this.inputValue = " ";
            //data 存在数据 表明是编辑
            if(this.script !=  '')
            {
                this.data = JSON.stringify(this.script);
            }
            else
            {
                //初始化脚本
                this.data = {
                    condition: new Array(),
                    result: new Array()
                };
            }
            
        },
        btnAddCondition(){//新增条件
            let index = this.data.condition.length;
            $('#condition').append('<div id="row_' + index + '" class="j-editor-row-condition-action_0"></div');
            $('#row_' + index + '').append('<a id="col_' + index + '_0" style=" display: inline-block;background-color: cornsilk; margin-left: 10px; padding: 5px 10px 5px 10px; margin-top: 5px; text-align: center; font-weight: bold; color:black;border-radius: 4px;">请选择</a>');
            let val = '请选择';
            let array = new Array();
            array.push(val);
            this.data.condition.push(array);
            this.addRow(index, 0); 
        },
        btnAddResult(){//新增结果条件
            let index = this.data.result.length;
            $('#result').append('<div id="row_result_' + index + '" class="j-editor-row-condition-action_0"></div');
            $('#row_result_' + index + '').append('<a id="col_result_' + index + '_0" style=" display: inline-block;background-color: cornsilk; margin-left: 10px; padding: 5px 10px 5px 10px; margin-top: 5px; text-align: center; font-weight: bold; color:black;border-radius: 4px;">请选择</a>');
            let val = '请选择';
            let array = new Array();
            array.push(val);
            this.data.result.push(array);
            this.addRowResult(index, 0); 
        },
        addRow(rowIndex, colIndex){ //第rowindex行 第cloindex列
            let rows = this.data.condition[rowIndex];
            let logics = this.logics;
            let objects = this.objects;
            let operates = this.operates;
            let endLogics = this.endLogics;
            let colId = 'col_' + rowIndex + '_' + colIndex;
             //选中回调
            let itemClick = (el, id, r, c) => 
            {
                this.itemClick(el, id, r, c);
            }
            //input绑定输入事件
            let setValue = (val) => {
                this.setValue(val);
            }
            //绑定事件
            $('#' + colId).click(function(){
                //清空输入框
                setValue(" ");
               let value = $(this).attr("value");
                if(value == 'delete')
                {
                    rows.splice(rowIndex, 1);
                    $('#row_' + rowIndex).remove();
                }
                else
                {
                    let html = '<div style="width:100px;">';
                    //组装弹出框显示数据项
                    if(colIndex == 0)
                    {
                        for(let k in logics)
                        {
                            if(rowIndex == 0)
                            {
                                if(k == '' || k == '(')
                                {
                                    html += '<a href="javaScript: void(0);" class="item"  style="color: #000;margin-left: 10px; display: block; padding: 5px;background-color: #FFF;" name="' + logics[k] + '" type="logics" value="' + k + '">' + logics[k] + '</a>';
                                }
                            }
                            else
                            {
                                if(k != '' && k != '(' && k !=')')
                                {
                                    html += '<a href="javaScript: void(0);" class="item"  style="color: #000;margin-left: 10px; display: block; padding: 5px;background-color: #FFF;" name="' + logics[k] + '" type="logics" value="' + k + '">' + logics[k] + '</a>';
                                }
                            }
                        }
                    } 
                    if(colIndex == 1)
                    {
                        $.each(objects,function(k, v){
                            html += '<a href="javaScript: void(0);" name="' + v.name + '" value="' + v.code + '" dataType ="' + v.dataType + '" type="objects1" class="item" style="color: #000;margin-left: 10px; display: block; padding: 5px;background-color: #FFF;">' + v.name + '</a>';
                        })
                    }
                    else if(colIndex == 2)
                    {
                        for(let k in operates)
                        {
                            html += '<a href="javaScript: void(0);" class="item"  style="color: #000;margin-left: 10px; display: block; padding: 5px;background-color: #FFF;" name="' + operates[k] + '" type="oper" value="' + k + '">' + operates[k] + '</a>';
                        }
                    }
                    else if(colIndex == 3)
                    {
                        html += '<input class="input" placeholder="请输入值" id="input_' + rowIndex + '_' + colIndex + '"  class="form-control" dataType="STRING" type="objects2" style="width: 80px;height: 25px;margin-right:5px;display: inline"/><lable class="item" style="cursor:pointer;" type="input" value="input_' + rowIndex + '_' + colIndex + '"> √ </lable>';
                        $.each(objects, function(k, v){
                            html += '<a href="javaScript: void(0);" name="' + v.name + '" value="' + v.code + '" dataType ="' + v.dataType + '" type="objects2" class="item" style="color: #000;margin-left: 10px; display: block; padding: 5px;background-color: #FFF;">' + v.name + '</a>';
                        })
                    }
                    else if(colIndex == 4)
                    {
                        for(let k in endLogics)
                        {
                            html += '<a href="javaScript: void(0);" class="item"  style="color: #000;margin-left: 10px; display: block; padding: 5px;background-color: #FFF;" name="' + endLogics[k] + '" type="endLogics" value="' + k + '">' + endLogics[k] + '</a>';
                        }
                    }
                    html += '</div>'
                    
                    //显示弹出框
                    $(this).popover({
                        trigger : 'manual',
                        placement : 'right',
                        html : 'true',
                        content : html,
                        animation : false
                    }).on("mouseleave", function(){
                        var _this = this;
                        setTimeout(function() {
                            if (!$(".popover:hover").length) {
                                $(_this).popover("hide")
                            }
                        }, 100);
                    }).popover("show");
                    
                    //绑定选中事件
                    $('.item').click(function(){
                        $('#' + colId).popover("hide")                       
                        //选中后处理
                        itemClick(this, colId, rowIndex, colIndex);
                    });

                    //输入框事件
                    $('.input').keyup(function(){
                        setValue(this.value);
                    });
                }
            });
        },
        itemClick(el, id, r, c){
            let type = $(el).attr("type");
            if(type == 'input')
            {     
                $('#' + id).html(this.inputValue);
                this.addDataList(r, c, this.inputValue, this.inputValue, 'input');
            }
            else
            {
                let value = $(el).attr("value");
                let name = $(el).attr("name");
                let dataType = $(el).attr("dataType");
                let type = $(el).attr("type");
                $('#' + id).html(name);
                this.addDataList(r, c, name, value, dataType, type);
            }
        },
        addDataList(rIndex, cIndex, name, val, dataType, type){
            this.data.condition[rIndex][cIndex] = {name: name, value: val, dataType: dataType, type: type};
            //判断当前选中列的下一列是否存在 不存在添加
            let rows = this.data.condition[rIndex];
            let index = cIndex + 1;
            if(!rows[index])
            {   
                //一共6列， 前5列是设置，最后一列是删除
                if(index < 5)
                {
                    let color = 'lightskyblue';
                    if(index == 2 ) color = 'lightpink';
                    else if(index == 3) color = 'orange';
                    else if(index == 4) color = 'cornsilk';

                    this.data.condition[rIndex].push({name: val, value: val});
                    $('#row_' + rIndex + '').append('<a id="col_' + rIndex + '_' + index + '" style=" display: inline-block;background-color: ' + color +  '; margin-left: 10px; padding: 5px 10px 5px 10px; margin-top: 5px; text-align: center; font-weight: bold; color:black;border-radius: 4px;">请选择</a>');
                    //增加下一列
                    this.addRow(rIndex, index); 
                }
                else if(index == 5)
                {
                     this.data.condition[rIndex].push({name: 'X', value: 'X'});
                    $('#row_' + rIndex + '').append('<a id="col_' + rIndex + '_' + index + '" style=" margin-left: 10px;margin-top: 5px; text-align: center; font-weight: bold; color:black;border-radius: 4px;" title="删除这个条件" value="delete"> X </a>');
                    this.addRow(rIndex, index); 
                }
            }
        },
        setValue(value){
            this.inputValue = value;
        },
        addRowResult(rowIndex, colIndex){ //第rowindex行 第cloindex列
            let rows = this.data.result[rowIndex];
            let memOperate = this.memOperate;
            let actions = this.actions;             
            let functions = this.functions;
            let objects = this.objects;
            let colId = 'col_result_' + rowIndex + '_' + colIndex;
            //点击事件
            let resultClick = (el, id, r, c) => {
                this.resultClick(el, id, r, c);
            }

            //input绑定输入事件
            let setValue = (val) => {
                this.setValue(val);
            }

            //绑定事件
            $('#' + colId).click(function(){
                setValue(' ');
                let value = $(this).attr("value");
                if(value == 'delete')
                {
                    rows.splice(rowIndex, 1);
                    $('#row_result_' + rowIndex).remove();
                }
                else
                {
                    let html = '<div style="width:100px;">';
                    //组装弹出框显示数据项
                    if(colIndex == 0)
                    {
                        for(let k in actions)
                        {
                            html += '<a href="javaScript: void(0);" class="result_item"  style="color: #000;margin-left: 10px; display: block; padding: 5px;background-color: #FFF;" name="' + actions[k] + '" value="' + k + '">' + actions[k] + '</a>';               
                        }
                    } 
                    else
                    {
                        let col = rows[colIndex - 1].value;
                        if(col == 'memOperate')
                        {
                            for(let k in memOperate)
                            {
                                html += '<a href="javaScript: void(0);" class="result_item"  style="color: #000;margin-left: 10px; display: block; padding: 5px;background-color: #FFF;" name="' + memOperate[k] + '" dataType="oper" value="' + k + '">' + memOperate[k] + '</a>';               
                            }
                        }
                        else if(col == 'setValue')
                        {   
                            $.each(objects, function(k, v){
                                html += '<a href="javaScript: void(0);" name="' + v.name + '" value="' + v.code + '" dataType ="' + v.dataType + '" class="result_item" style="color: #000;margin-left: 10px; display: block; padding: 5px;background-color: #FFF;">' + v.name + '</a>';
                            })
                        }
                        else if(col == 'addList')
                        {
                            $.each(objects, function(k, v){
                                html += '<a href="javaScript: void(0);" name="' + v.name + '" value="' + v.code + '" dataType ="' + v.dataType + '" class="result_item" style="color: #000;margin-left: 10px; display: block; padding: 5px;background-color: #FFF;">' + v.name + '</a>';
                            })
                        }
                        else if(col == 'functions')
                        {
                            $.each(functions, function(k, v){
                                html += '<a href="javaScript: void(0);" name="' + v.name + '" value="' + v.code + '" class="result_item" dataType="oper" style="color: #000;margin-left: 10px; display: block; padding: 5px;background-color: #FFF;">' + v.name + '</a>';
                            })
                        }
                        else
                        {
                            if(col == '==')
                            {
                                html += '<input class="input_result" placeholder="请输入值" id="input_' + rowIndex + '_' + colIndex + '"  class="form-control" type="input" style="width: 80px;height: 25px;margin-right:5px;display: inline"/><lable class="result_item" style="cursor:pointer;" type="input" value="input_' + rowIndex + '_' + colIndex + '"> √ </lable>';
                                $.each(objects, function(k, v){
                                    html += '<a href="javaScript: void(0);" name="' + v.name + '" value="' + v.code + '" dataType ="' + v.dataType + '" class="result_item" style="color: #000;margin-left: 10px; display: block; padding: 5px;background-color: #FFF;">' + v.name + '</a>';
                                })
                            }
                            else
                            {
                                html += '<a href="javaScript: void(0);" name="等于" value="==" class="result_item" style="color: #000;margin-left: 10px; display: block; padding: 5px;background-color: #FFF;" class="result_item">等于</a>';
                            }
                        }
                    }
                    html += '</div>'
                    
                    //显示弹出框
                    $(this).popover({
                        trigger : 'manual',
                        placement : 'right',
                        html : 'true',
                        content : html,
                        animation : false
                    }).on("mouseleave", function(){
                        var _this = this;
                        setTimeout(function() {
                            if (!$(".popover:hover").length) {
                                $(_this).popover("hide")
                            }
                        }, 100);
                    }).popover("show");
                    //绑定选中事件
                    $('.result_item').click(function(){
                        $('#' + colId).popover("hide");   
                        //选中后处理
                        resultClick(this, colId, rowIndex, colIndex);
                    });
                     //输入框事件
                    $('.input_result').keyup(function(){
                        setValue(this.value);
                    });
                }
            });
        },
        resultClick(el, id, r, c){
            let type = $(el).attr("type");
            if(type == 'input')
            {         
                $('#' + id).html(this.inputValue);
                this.addDataResult(r, c, this.inputValue, this.inputValue);
            }
            else
            {
                let value = $(el).attr("value");
                let name = $(el).attr("name");
                $('#' + id).html(name);
                this.addDataResult(r, c, name, value);
            }
        },
        addDataResult(rIndex, cIndex, name, val){
            let rows = this.data.result[rIndex];
            let length = rows.length;
            rows.splice(cIndex + 1, rows.length - (cIndex + 1));
            for(let i = (length - 1); i > cIndex; i--)
            {
                $('#col_result_' + rIndex + '_' + i).remove();
            }
            this.data.result[rIndex][cIndex] = {
                name: name,
                type: val,
                value: val
            };
            //判断当前选中列的下一列是否存在 不存在添加
            let index = cIndex + 1;
            if(!rows[index])
            {
                //一共5列， 前4列是设置，最后一列是删除
                if(val == 'memOperate' || val == 'setValue' || val == 'addList' || val == 'functions')
                {
                    let color = 'lightskyblue';
                    if(index == 2 ) color = 'lightpink';
                    else if(index == 3) color = 'orange';
                    else if(index == 4) color = 'cornsilk';

                    this.data.result[rIndex].push({
                                                    name: name,
                                                    type: val,
                                                    value: val
                                                });
                    $('#row_result_' + rIndex).append('<a id="col_result_' + rIndex + '_' + index + '" style=" display: inline-block;background-color: ' + color +  '; margin-left: 10px; padding: 5px 10px 5px 10px; margin-top: 5px; text-align: center; font-weight: bold; color:black;border-radius: 4px;">请选择</a>');
                   //增加下一列
                    this.addRowResult(rIndex, index); 
                }
                else
                {   
                    let item = rows[0].value;
                    if(item == 'setValue' && cIndex < 3)
                    {
                        let color = 'lightskyblue';
                        if(index == 2 ) color = 'lightpink';
                        else if(index == 3) color = 'orange';
                        else if(index == 4) color = 'cornsilk';

                        this.data.result[rIndex].push({
                                                        name: name,
                                                        type: val,
                                                        value: val
                                                    });
                        $('#row_result_' + rIndex).append('<a id="col_result_' + rIndex + '_' + index + '" style=" display: inline-block;background-color: ' + color +  '; margin-left: 10px; padding: 5px 10px 5px 10px; margin-top: 5px; text-align: center; font-weight: bold; color:black;border-radius: 4px;">请选择</a>');
                    //增加下一列
                        this.addRowResult(rIndex, index); 
                    }
                    else
                    {
                        if(rows[0].type)
                        {
                            this.data.result[rIndex].push({
                                                            name: 'X',
                                                            type: 'X',
                                                            value: 'X'
                                                        });
                            $('#row_result_' + rIndex + '').append('<a id="col_result_' + rIndex + '_' + index + '" style=" margin-left: 10px;margin-top: 5px; text-align: center; font-weight: bold; color:black;border-radius: 4px;" title="删除这个条件" value="delete"> X </a>');
                            this.addRowResult(rIndex, index); 
                        }                        
                    }
                }
            }
        },
        btnCompile(){
            let rule = this.toDataStr();
            //调用后台验证
            net.send({
                server: this.compile,
                data: {
                    ruleId: this.ruleId,
                    content: rule
                }
            }).then((data) => {
                 $.each(data, function(k, v){
                    $('#result_msg').append('<div><label style=" display: inline-block; width: 10%;border: 1px solid gainsboro;font-size: 14px; font-weight: normal;">' + v.number + '</label><label style=" display: inline-block; width: 90%;border: 1px solid gainsboro;font-size: 14px; font-weight: normal;">' + v.message + '</label></div>');
                 });
            }, err => {
                console.log('请求出错');
            });
        },
        btnView(){
            let rule = this.toDataStr();
            if($("#result_code").is(":hidden"))
            {
                this.inputCode = rule;
                $('#result_code').show();
                $('#edit_code').hide();
            }
            else
            {
                $('#result_code').hide();
                $('#edit_code').show();
            }
        },
        toDataStr(){
            let data = this.data;
            let condition = data.condition;
            let result = data.result;
            let rule = 'rule "' + this.ruleCode + '"\n';;
            rule += "when\n";
            rule += "$map:Map();\n";
            $.each(condition, function(i, array){
                let v = array[1];
                let type = 'toStr';
                if(v.dataType == 'INTEGER')
                {
                    type = 'toInt';
                }
                else if(v.dataType == 'DOUBLE')
                {
                    type = 'toDouble';
                }
                else if(v.dataType == 'DATE')
                {
                    type = 'toDate';
                }

                let v1 = array[3];
                let type1 = 'toStr';
                if(v1.dataType == 'INTEGER')
                {
                    type1 = 'toInt';
                }
                else if(v1.dataType == 'DOUBLE')
                {
                    type1 = 'toDouble';
                }
                else if(v1.dataType == 'DATE')
                {
                    type1 = 'toDate';
                }

                rule += '\n' + array[0].value + 'eval(' + type + '($map.get("' + v.value + '")) ' + array[2].value + ' ' + type1 + '($map.get("' + v1.value + '")))' + ' ' + array[4].value;
            })
            //那么
            rule += "then\n";
            $.each(result, function(i, array){
                rule += '\n';        
                let object = array[0];
                if(object.type == 'setValue')
                {
                    rule += ' $map.put("' + array[1].value + '",$map.get("' + array[3].value + '"));';
                }
                else if(object.type == 'functions')
                {
                    rule += ' ' + array[1].value + '(); ';
                }
                else if(object.type == 'addList')
                {
                    rule += ' resultList.add(new ScoreResult("' + this.ruleCode + '",toStr($map.get(\'' + array[1].value + '\')),"0")); ';
                }
                else if(object.type == 'memOperate')
                {
                    rule += ' insert($map); ';
                }
                rule += '\n';
            })
            rule += 'end';

            return rule;
        },
        initData(data){
            let condition = this.data.condition;
            let addRow = (r, c) => 
            {
                this.addRow(r, c);
            }
            $.each(condition, function(r, array){
                $('#condition').append('<div id="row_' + r + '" class="j-editor-row-condition-action_0"></div');
                $.each(array, function(index, v){
                    if(index < 5)
                    {
                        let color = 'cornsilk';
                        if(index == 1 ) color = 'lightskyblue';
                        if(index == 2 ) color = 'lightpink';
                        else if(index == 3) color = 'orange';
                        else if(index == 4) color = 'cornsilk';

                        $('#row_' + r + '').append('<a id="col_' + r + '_' + index + '" style=" display: inline-block;background-color: ' + color +  '; margin-left: 10px; padding: 5px 10px 5px 10px; margin-top: 5px; text-align: center; font-weight: bold; color:black;border-radius: 4px;">' + v.name + '</a>');
                        addRow(r, index);
                    }
                    else if(index == 5)
                    {
                        $('#row_' + r + '').append('<a id="col_' + r + '_' + index + '" style=" margin-left: 10px;margin-top: 5px; text-align: center; font-weight: bold; color:black;border-radius: 4px;" title="删除这个条件" value="delete"> X </a>');
                        addRow(r, index);
                    }  
                })
            })

            let result = this.data.result;
            let addRowResult = (r, c) => 
            {
                this.addRowResult(r, c);
            }
            $.each(result, function(r, array){
                $('#result').append('<div id="row_result_' + r + '" class="j-editor-row-condition-action_0"></div');
                $.each(array, function(index, v){
                    if(index < (array.length-1))
                    {
                        let color = 'cornsilk';
                        if(index == 1 ) color = 'lightskyblue';
                        if(index == 2 ) color = 'lightpink';
                        else if(index == 3) color = 'orange';
                        else if(index == 4) color = 'cornsilk';
                        $('#row_result_' + r + '').append('<a id="col_result_' + r + '_' + index + '" style=" display: inline-block;background-color: ' + color + '; margin-left: 10px; padding: 5px 10px 5px 10px; margin-top: 5px; text-align: center; font-weight: bold; color:black;border-radius: 4px;">' + v.name + '</a>');
                        addRowResult(r, index);
                    }
                    else
                    {
                        $('#row_result_' + r + '').append('<a id="col_result_' + r + '_' + index + '" style=" margin-left: 10px;margin-top: 5px; text-align: center; font-weight: bold; color:black;border-radius: 4px;" title="删除这个条件" value="delete"> X </a>');
                        addRowResult(r, index);
                    }  
                })
            })
        },
        btnSave(){//保存规则内容
        console.log(this.save);
            let content = this.toDataStr();
            let jsonContent = JSON.stringify(this.data);
            net.send({
                server: this.save,
                data: {
                    ruleId: this.ruleId,
                    content: content,
                    htmlLhs: jsonContent
                }
            }).then((data) => {
                if (data.success)
                {
                    this.$Message.success(data.msg);
                    this.btnBack();
                }
                else
                {
                    this.$Message.error(data.msg);
                }
            });
        }
    }
};
</script>
<style>
    .item:hover{
        background-color: lightskyblue;
        border-radius: 4px;
    }
</style>