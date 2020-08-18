<style lang="less" scoped>
    @import './ApiDetail.css';
</style>
<template>
    <div v-if="tree.hasOwnProperty('requestMethod')">
        <Collapse  v-model="activeNames" >
            <Panel  name="1" >
                基本信息
                <!--接口详情列表-->
                <div slot="content">
                    <table class = "table-class">
                        <tr>
                            <td style="width:200px">
                                URL
                            </td>
                            <td>
                                {{tree.methodName}}
                            </td>
                        </tr>
                        <tr>
                            <td>请求方式</td>
                            <td><span :class="'method ' + tree.requestMethod">{{tree.requestMethod.toUpperCase()}}</span></td>
                        </tr>
                        <tr>
                            <td>接口摘要</td>
                            <td> {{tree.requestDetail.summary}}</td>
                        </tr>
                        <tr>
                            <td>consumes</td>
                            <td> {{tree.requestDetail.consumes}}</td>
                        </tr>
                        <tr>
                            <td>produces</td>
                            <td> {{tree.requestDetail.produces}}</td>
                        </tr>
                    </table>
                </div>
            </Panel >
            <Panel  name="2" >
                请求参数
                <div slot="content">
                    <table class = "table-class parm-table-class">
                        <tr>
                            <td>参数名称</td>
                            <td >描述</td>
                            <td>类型</td>
                            <td>IN</td>
                            <td>是否必须</td>
                        </tr>

                        <tr v-for="(value, key) in tree.requestDetail.parameters" :key="key">
                            <td >{{value.name}}</td>
                            <td >{{value.description}}</td>
                            <td>{{value.type}}</td>
                            <td>{{value.in}}</td>
                            <td>{{value.required}}</td>

                        </tr>

                    </table>
                    <div style="color:red; text-align: center" v-if="!tree.requestDetail.parameters">无参数</div>
                </div>
            </Panel>
            <Panel name="3" >
                响应模型
                <div slot="content">
                    <div v-if="tree.requestDetail.responses[200].schema">
                        <Button @click="famtJSON" type="success" size="large" style="margin-right: 10px;">格式化JSON</Button>
                        是否展开所有节点：
                        <i-switch v-model="openTree" size="large">
                            <span slot="open">是</span>
                            <span slot="close">否</span>
                        </i-switch>
                    </div>
                    <pre id="json-renderer" v-if="tree.requestDetail.responses[200].schema">
                         {{originTree}}
                    </pre>
                    <div style="color:red;margin-left:10px" v-else>暂无响应模型</div>
                </div>
            </Panel>

            <Panel  name="4" >
                响应状态码
                <div slot="content">
                    <table class = "table-class parm-table-class">
                        <tr>
                            <td>状态码</td>
                            <td>说明</td>
                            <td>模式</td>
                        </tr>
                        <tr v-for="(key,index) in tree.requestDetail.responses" :key ="index">
                            <td>{{index}}</td>
                            <td>{{key.description}}</td>
                            <td>{{key.schema}}</td>
                        </tr>
                    </table>
                </div>
            </Panel>

        </Collapse>
    </div>
</template>

<script>
    import jsonViewer from 'jquery.json-viewer/json-viewer/jquery.json-viewer.js'
    export default {
        name: 'apiDetail',
        props: {
            serviceName: String,        // 服务名
            controllerName: String,     // Controller名称
            methodIndex: Number         // 方法顺序，因为一个controller中一个方法的一种请求方式就是一个方法显示对象，因此这里采用index而不是直接使用methodName
        },
        data() {
            return {
                activeNames: ['1', '2',  '4'],
                openTree: false,
                marksTree: true
            };
        },
        methods: {
            famtJSON() {
                let _this = this
                $('#json-renderer').jsonViewer(eval(_this.originTree), {
                    collapsed: !_this.openTree,
                    withQuotes: !_this.marksTree
                });
            }
        },
        computed: {
            tree() {
                let methodInfos = this.$store.state.methodInfos;
                let key = this.serviceName + '_' + this.controllerName;
                if (this.methodIndex == -1) {
                    return {};
                }
                if(methodInfos.hasOwnProperty(key)) {
                    let result = methodInfos[key][this.methodIndex];
                    return result;
                } else {
                    return {};
                }
            },
            originTree() {
                let def = this.tree.requestDetail.responses[200].schema;
                if (def['$ref'] || (def['items'] && def['items']['$ref'])) {
                    // 获取响应数据的类型
                    let ref = def['$ref'] === undefined ? def['items']['$ref'] : def['$ref'];
                    let model = ref.substr(ref.lastIndexOf("/") + 1);
                    let key = this.serviceName + "_" + model;
                    let definations = this.$store.state.definations;
                    if(definations.hasOwnProperty(key)) {
                        return definations[key];
                    } else {
                        this.$store.dispatch("getDefination", {serviceName: this.serviceName, refName:model});
                        return definations[key];
                    }
                }
                return JSON.parse("{}");
            }
        }

    }
</script>