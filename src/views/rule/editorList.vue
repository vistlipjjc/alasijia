<!--
<template>
    <div>
        <Card>
            <j-editor ref="ruleObjectTable"
                :compile="server.compile"
                :save="server.save"
                :ruleId="ruleId"
                :objects="objects"
                :functions="functions"
                :value="value"
            >
            </j-editor>
        </Card>
    </div>
</template>

<script>
    import jEditor from './component/jEditor';
    export default {
        components: {
            jEditor
        },
        data() {
            return {
                server: {
                    compile: this.$services.ruleService.rulesRestController.compile,
                    save: this.$services.ruleService.rulesContentRestController.save
                },
                ruleId: "",
                ruleCode: "R001",
                objects: [],
                functions: [],
                value: '',
                sourceCode: ''
            }
        },
        beforeMount (){
            this.init();
        },
        methods: {
            init () {
                this.ruleId = 'R001';
                this.objects = [{code: "c1", dataType: "INTEGER", name: "委托日期"}, {code: "c2", dataType: "INTEGER", name: "委托日期2"}];
                this.functions = [{code: "f1", name: "函数1"}, {code: "f2", name: "函数2"}];
                let value = '{"condition":[[{"name":"空","value":"","type":"oper"},{"name":"委托日期","value":"c1","type":"INTEGER"},{"name":"小于","value":"<","type":"oper"},{"name":"委托日期","value":"c1","type":"INTEGER"},{"name":"结束符","value":";"},{"name":"X","value":"X"}],[{"name":"或者","value":"or","type":"oper"},{"name":"委托日期","value":"c1","type":"INTEGER"},{"name":"小于","value":"<","type":"oper"},{"name":"委托日期","value":"c1","type":"INTEGER"},{"name":"结束符","value":";"},{"name":"X","type":"X","value":"X"}]],"result":[[{"name":"对象赋值","type":"setValue","value":"setValue"},{"name":"委托日期","type":"c1","value":"c1"},{"name":"等于","type":"==","value":"=="},{"name":"委托日期","type":"c1","value":"c1"},{"name":"X","value":"X"}],[{"name":"内存操作","type":"memOperate","value":"memOperate"},{"name":"添加对象","type":"insert","value":"insert"},{"name":"X","type":"X","value":"X"}]]}';
                this.value = JSON.parse(value);
              
                let sourceCode = 'rule "R001"';
                sourceCode += 'when';
                sourceCode += '$map:Map();';
                sourceCode += 'eval(toInt($map.get("c1"))  <  eval(toInt($map.get("c1")) or  eval(toInt($map.get("c1"))  <  eval(toInt($map.get("c1")) ';
                sourceCode += 'then';
                sourceCode += '$map.put("c1",$map.get("c1"));';
                sourceCode += 'end';
                this.sourceCode = sourceCode;
            }
        }
    }
</script>-->
