<style lang="less" scoped>
    @import './ApiDetail.css';
</style>
<template>
 <div v-if="tree.hasOwnProperty('requestMethod')">
      <div style="margin-left: 3px;">
          <Span :class="'method '+ tree.requestMethod">{{tree.requestMethod.toUpperCase()}}</Span>
          <Input  v-model="tree.methodName" readonly="readonly"  style="width: 70%" />
          <Button :class="'method '+ tree.requestMethod" @click="getSendParam" style="width:10%">发送请求</Button>
      </div>
     <div style="margin-top:20px;margin-left:3px;">
      <Collapse  v-model="activeNames" style="width: 99%">
          <Panel  name="1">
                请求参数
                <div slot="content">
                    <table class = "table-class parm-table-class">
                        <tr>
                            <th width="50px">
                                <Checkbox :checked.sync='checkAll' @change="handleCheckAllChange()"/>
                            </th>
                            <th>参数名称</th>
                            <th>参数值</th>
                            <th width="80px">删除</th>
                        </tr>

                        <tr v-for="(value, key) in tree.requestDetail.parameters" :key="key">
                            <td width="50px"><Checkbox checked="true" v-model="value.checked"></Checkbox></td>
                            <td><Input v-model="value.name" readonly="readonly"/></td>
                            <td><Input :placeholder="value.description" v-model="value.value" /></td>
                            <td><Button size="small" type="error" @click="delParam(key)">删除</Button></td>
                        </tr>

                    </table>
                    <div style="color:red; text-align: center" v-if="!tree.requestDetail.parameters">无参数</div>
                </div>
            </Panel>
            <Panel  name="2">
                 响应结果
                 <div slot="content">
                     <Button @click="famtJSON" type="success" size="large" :class='tree.requestMethod' style="margin-right: 10px;">格式化JSON</Button >
                     是否展开所有节点：
                     <i-switch  v-model="openTree" size="large">
                         <span slot="open">是</span>
                         <span slot="close">否</span>
                     </i-switch>
                     <pre style="margin-left:20px" id= "json-renderer_res" v-html="resData"></pre>
                 </div>
            </Panel>
      </Collapse >
     </div>
 </div>
</template>

<script>
    import jsonViewer from 'jquery.json-viewer/json-viewer/jquery.json-viewer.js';
    import net from '@/util/net';

    export default {
        name: 'apiTest',
        props: {
            serviceName: String,        // 服务名
            controllerName: String,    // controller名
            methodIndex: Number         // 方法序列
        },
        data() {
            return {
                activeNames: ['1', '2'],
                checkAll: true,
                openTree: true,
                resData: {}
            };
        },
        methods: {
            delParam(index) {
                this.tree.requestDetail.parameters.splice(index, 1);
            },
            getSendParam() {
                let v_this = this;
                let tree = this.tree;
                let loading;
                let sendParam = {};
                if (tree.requestDetail.parameters) {
                    for (let i = 0; i < v_this.tree.requestDetail.parameters.length; i++) {
                        if (tree.requestDetail.parameters[i].checked) {
                            sendParam[tree.requestDetail.parameters[i].name] = tree.requestDetail.parameters[i].value;
                        }
                    }
                }
                // 首先根据serviceName去组装url
                let url = "http://localhost:9000/api";
                // 首先从routerInfos中拿到服务路径
                if(this.$store.state.routerInfos.hasOwnProperty(this.serviceName)) {
                    url += this.$store.state.routerInfos[this.serviceName];
                } else {
                    console.log("没有在路由中找到路径，退出请求");
                    this.resData = JSON.parse("{'result':'fail', 'message':'没有在路由中找到服务[" + this.serviceName + "]所对应的路径'");
                    return;
                }
                // 然后从serviceNames中拿去到basePath
                if (this.$store.state.serviceNames.hasOwnProperty(this.serviceName) && this.$store.state.serviceNames[this.serviceName].hasOwnProperty('basePath')) {
                    let basePath = this.$store.state.serviceNames[this.serviceName]['basePath'];
                    // 如果basePath只是一个/那么不添加
                    if (basePath !== '/') {
                        url += this.$store.state.serviceNames[this.serviceName]['basePath'];
                    }
                } else {
                    console.log("没有找到服务路径，退出请求");
                    this.resData = JSON.parse("{'result':'fail', 'message':'没有找到服务[" + this.serviceName + "]所对应的路径'");
                    return;
                }
                url += this.tree.methodName;
                // 这里需要对url和sendParam进行处理
                for(let name in sendParam) {
                    // 判断url中是否有name对应的参数
                    let point = '{' + name + '}';
                    if (url.indexOf(point) > -1) {
                        url = url.replace(new RegExp(point, 'g'), sendParam[name]);
                        console.log("url ==> " + url);
                        delete sendParam[name]
                    }
                }
                let type = this.tree.requestMethod.toUpperCase();
                // 用jq的ajax不能把x-user-token带上，因此修改成下面的方式
                net.ajax({
                    url: url,
                    type: type, 
                    data: sendParam
                }).then((response) => {
                    // 对response进行处理
                    if (response !== undefined && response !== '') {
                        this.resData = response;
                    } else {
                        this.resData = eval('({})');
                    }
                }).catch((error) => {
                    this.resData = error;
                });
            },
            famtJSON() {
                let _this = this;
                $('#json-renderer_res').jsonViewer(eval(this.resData), {
                    collapsed: !_this.openTree,
                    withQuotes: !_this.marksTree
                });
            },
            handleCheckAllChange() {
                console.log("clicked!");
                let _this = this;
                console.log(this.checkAll)
                for (let i = 0; i < _this.tree.requestDetail.parameters.length; i++) {
                    if (_this.checkAll) {
                        _this.tree.requestDetail.parameters[i].checked = true;
                    } else {
                        _this.tree.requestDetail.parameters[i].checked = false;
                    }
                }
            },
            openFullScreen() {
                const loading = this.$loading({
                    lock: true,
                    text: 'Loading',
                });
                return loading;
            }
        },
        computed: {
            tree() {
                // 切换tree数据的时候顺便把resData置空
                this.resData = {};
                let methodInfos = this.$store.state.methodInfos;
                let key = this.serviceName + '_' + this.controllerName;
                if(methodInfos.hasOwnProperty(key)) {
                    let result = methodInfos[key][this.methodIndex];
                    return result;
                } else {
                    return {};
                }
            },
            checked() {

            }
        }
    }
</script>
