<template>
    <div>
        <!-- 上面是一个提供查询条件设置的div -->
        <div>
            <Card style="width:100%">
                <Form style="width:100%" :label-width="80">
                    <FormItem>
                        <Row>
                            <Col span="11">
                                <FormItem label="服务名称：">
                                    <Select v-model='serviceName' style="width:300px" @on-change="serviceChange">
                                        <Option v-for="(value, key) in services" :key="key" :value="value" >{{value}}</Option>
                                    </Select>
                                </FormItem>
                            </Col>
                            <Col span="11">
                                <FormItem label="跨度名称：">
                                    <Select v-model='spanName' style="width:300px">
                                        <Option v-for="(value, key) in spans" :key="key" :value="value">{{value}}</Option>
                                    </Select>
                                </FormItem>
                            </Col>
                        </Row>
                    </FormItem>
                    <FormItem>
                        <Row>
                            <Col span="11">
                                <FormItem label="开始时间：">
                                    <DatePicker :value="startDate" type="datetime" style="width:300px" format="yyyy-MM-dd HH:mm" placeholder="选择调用链查询开始时间" @on-change="setStartDatetime" />
                                </FormItem>
                            </Col>
                            <Col span="11">
                                <FormItem label="结束时间：">
                                <DatePicker :value="endDate" type="datetime" style="width:300px" format="yyyy-MM-dd HH:mm" placeholder="选择调用链查询结束时间" @on-change="setEndDatetime" />
                                </FormItem>
                            </Col>
                        </Row>
                    </FormItem>
                    <FormItem>
                        <Row>
                            <Col span="11">
                                <FormItem label="持续时间：">
                                    <Input v-model="minDuration" placeholder="输入调用持续最小时间，单位是ms" style="width:300px" clearable  />
                                </FormItem>
                            </Col>
                            <Col span="11">
                                <FormItem label="查询条数：">
                                <Input v-model="limit" placeholder="输入数据的显示条数" style="width:300px" clearable  />
                                </FormItem>
                            </Col>
                        </Row>
                    </FormItem>
                    <FormItem>
                        <Row>
                            <Col span="11">
                                <FormItem label="排列顺序：">
                                    <Select v-model='sortOrder' style="width:300px" @on-change="resortResult">
                                        <Option v-for="(value, key) in sortOrders" :key="key" :value="value" >{{value}}</Option>
                                    </Select>
                                </FormItem>
                            </Col>
                            <Col span="11">
                                <FormItem label="查询条件：">
                                <Input v-model="annotationQuery" placeholder="查询条件(eg:'http.host=/monitor/apiservice/ic/services')" style="width:300px" clearable  />
                                </FormItem>
                            </Col>
                        </Row>
                    </FormItem>
                    <FormItem>
                        <Button type="primary" @click="queryData">查询</Button>
                    </FormItem>
                </Form>
            </Card>
        </div>
        <div>
            <div v-for="(value, key) in result" :key="key" style="margin-top:10px"> 
                <Card style="width:100%">
                    <p slot="title">
                        调用链信息
                    </p>
                    <!-- <a href="#" slot="extra" @click.prevent="showDetail(value)">
                        查看详情
                    </a> -->
                    <Form label-position="right" :label-width="150" style="width:100%">
                        <FormItem>
                            <Row>
                                <Col span="11">
                                    <FormItem label="调用开始时间：">
                                        <!-- <span style="font-size:16px">{{value.startAt}}</span> -->
                                        <Tag type="border" color="green" style="font-size:16px">{{value.startAt}}</Tag>
                                    </FormItem>
                                </Col>
                                <Col span="11">
                                    <FormItem label="调用耗时：">
                                        <!-- <span style="font-size:16px">{{getTime(value.duration)}}</span> -->
                                        <Tag type="border" color="blue" style="font-size:16px">{{getTime(value.duration)}}</Tag>
                                    </FormItem>
                                </Col>
                            </Row>
                        </FormItem>
                        <FormItem>
                            <Row>
                                <Col span="11">
                                    <FormItem label="服务跨度：">
                                        <!-- <span style="font-size:16px">{{value.data.length}}</span> -->
                                        <Tag type="border" color="blue" style="font-size:16px">{{value.data.length}}</Tag>
                                    </FormItem>
                                </Col>
                                <Col span="11">
                                    <FormItem label="服务深度：">
                                        <!-- <span style="font-size:16px">{{value.serviceName}}</span> -->
                                        <Tag type="border" color="blue" style="font-size:16px">{{value.depth}}</Tag>
                                    </FormItem>
                                </Col>
                            </Row>
                        </FormItem>
                        <FormItem>
                            <Row>
                                <Col span="11">
                                    <FormItem label="服务名：">
                                        <!-- <span style="font-size:16px">{{value.serviceName}}</span> -->
                                        <Tag type="border" color="blue" style="font-size:16px">{{value.serviceName}}</Tag>
                                    </FormItem>
                                </Col>
                                <Col span="11">
                                    <FormItem label="服务调用耗时占比：">
                                        <!-- <span style="font-size:16px">{{value.percentage}}%</span> -->
                                        <Tag type="border" color="green" style="font-size:16px" v-if="value.percentage >= 90">{{value.percentage}}%</Tag>
                                        <Tag type="border" color="yellow" style="font-size:16px" v-else-if="value.percentage < 90 && value.percentage >= 75">{{value.percentage}}%</Tag>
                                        <Tag type="border" color="#EF6AFF" style="font-size:16px" v-else-if="value.percentage <75 && value.percentage >= 50">{{value.percentage}}%</Tag>
                                        <Tag type="border" color="red" style="font-size:16px" v-else>{{value.percentage}}%</Tag>
                                    </FormItem>
                                </Col>
                            </Row>
                        </FormItem>
                    </Form>
                    <!-- 在form的底部展示相关的数据 -->
                    <div v-if="value.display" @click="changeDetail(value)" @mouseover="changeDetail(value)">
                        <span>调用详情：</span>
                        <span v-if="value.loading">数据加载中...</span>
                        <Tree :data="value.treeSkeleton" v-else style="font-size:16px" @on-select-change="itemSelected"></Tree>
                    </div>
                    <div @click="changeDisplay(value)" align="center">
                        <i class="ivu-icon ivu-icon-ios-arrow-down" v-if="!value.display"></i>
                        <i v-else class="ivu-icon ivu-icon-ios-arrow-up"></i>
                    </div>
                </Card>
            </div>
        </div>
        <Modal v-model="jsonModal" title="调用链详细数据" width="50%" >
            {{formatResponse()}}
            <div slot="footer">
            </div>
        </Modal>
        <Modal v-model="detailModal" title="调用链详细数据" width="60%" v-if="detailObj !== undefined">
            <!-- TODO：将数据的展示放完整 -->
            <!-- header有两行显示：第一行是${} -->
            <div slot="header">
                <span style="font-size:18px">{{detailObj.header}}</span>
                <p />
                <span style="font-size:14px">{{detailObj.aka}}</span>
            </div>
            <!-- 中间是一个table用来展示数据 -->
            <div >
                <div v-if="detailObj.invocationChain !== undefined">
                    <Table stripe :columns="detailObj.invocationChain.column" :data="detailObj.invocationChain.data"></Table>
                </div>
                <div v-if="detailObj.keyValuePairs !== undefined" style="margin-top:20px">
                    <Table stripe :columns="detailObj.keyValuePairs.column" :data="detailObj.keyValuePairs.data"></Table>
                </div>
            </div>
            <div slot="footer">
            </div>
        </Modal>
    </div>
</template>

<script type="text/javascript">
import net from '@/util/net'
export default {
    data() {
        return {
            serviceName: 'all',
            spanName: 'all', 
            startDateTime: 0,
            endDateTime: 0,
            minDuration: '',
            limit: 10,
            sortOrder: '',
            annotationQuery: '',
            result: [],
            startDate: '',
            endDate: '',
            maxDuration: 0,
            detail: {},
            jsonModal: false,
            detailModal: false,
            // detailObj是用来在调用链的树节点被点击时候显示的数据
            detailObj:{}
        }
    },
    created () {
        // 创建的时候首先去获取所有的serviceNames
        this.$store.dispatch("getInvocationChainServices");
        // 获取所有的排序方式
        this.$store.dispatch("getAllSortOrders");
        // 给时间控件一个以打开页面当时为基准的时间范围
        let now = new Date();
        this.endDate = now.getFullYear() + "-" + (now.getMonth() + 1) + "-" + now.getDate() + " " + now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds();
        this.endDateTime = Date.parse(this.endDate);
        let date = now.getDate() - 7;
        let start = new Date();
        start.setDate(date);
        this.startDate = start.getFullYear() + "-" + (start.getMonth() + 1) + "-" + start.getDate() + " " + start.getHours() + ":" + start.getMinutes();
        this.startDateTime = Date.parse(this.startDate);
    },
    computed: {
        services() {
            return this.$store.state.services;
        },
        spans() {
            return this.$store.state.spans;
        }, 
        sortOrders() {
            let sortOrders = this.$store.state.sortOrders;
            // 如果有数据，那么默认指向第一个选项，因为sortOrders这个计算属性只会在第一个初始化页面的时候被初始化
            if (sortOrders !== undefined && sortOrders.length > 0) {
                this.sortOrder = sortOrders[0];
            }
            return sortOrders;
        }
    },
    methods: {
        serviceChange: function(value) {
            this.spanName = 'all';
            this.$store.dispatch("getSpanNames", this.serviceName);
        },
        setStartDatetime: function(datetime, type) {
            this.startDateTime = Date.parse(datetime);
        }, 
        setEndDatetime: function(datetime, type) {
            this.endDateTime = Date.parse(datetime);
        },
        resortResult: function() {
            // 对查询结果进行重排序
            if ("时间倒序" === this.sortOrder) {
                this.sortBy("timestamp", false);
            } else if ("时间顺序" === this.sortOrder) {
                this.sortBy("timestamp", true);
            } else if ("最大百分比优先" === this.sortOrder) {
                this.sortBy("percentage", false);
            } else if ("最小百分比优先" == this.sortOrder) {
                this.sortBy("percentage", true);
            } else if ("耗时最长优先" === this.sortOrder) {
                this.sortBy("duration", false);
            } else if ("耗时最短优先" === this.sortOrder) {
                this.sortBy("duration", true);
            }
        },
        sortBy: function(property, asc) {
            // 根据给定的属性对result进行排序
            this.result.sort((a, b) => {
                return a[property] - b[property];
            })
            if(!asc) {
                this.result.reverse();
            }
        },
        queryData() {
            // 向服务器发起请求查询调用链数据

            // 首先封装数据
            let queryData = {
                serviceName : this.serviceName,
                spanName : this.spanName, 
                order : this.sortOrder,
                startTs : this.startDateTime,
                endTs: this.endDateTime,
                minDuration: parseInt(this.minDuration) * 1000,
                annotationQuery: this.annotationQuery,
                limit: this.limit
            };
            net.ajax({
                url: "http://localhost:9000/api/monitor/apiservice/ic/search",
                type: "POST",
                data: queryData
            }).then((response) => {
                // 对响应结果进行处理
                if (response === undefined) {
                    this.result = [];
                } else {
                    this.preProcessResult(response);
                }
            }).catch((error) => {

            })
        },
        preProcessResult(response) {
            console.log("Ready to process response");
            // 先将result中的数据清空
            this.result = [];
            // 对result进行处理，添加部分统计数据方便展示以及排序
            for (let index in response) {
                // response[index]本身也是一个数组，还需要再次进行遍历
                let obj = JSON.parse("{}");
                // 根据display的值来确定是否显示下层的树
                obj.display = false;
                obj.loading = false;
                let data = response[index];
                // 首先把数据放进来
                obj.data = data;
                obj.traceId = data[0].traceId;
                // 第一个数据中的timestamp就是整个调用链开始的时间
                obj.timestamp = data[0]["timestamp"];
                // 因为timestamp的单位是微秒，而在解析的时候单位是毫秒，因此这里需要对数据进行处理
                let startAt = new Date(obj.timestamp / 1000);
                // 组装成开始日期
                obj.startAt = startAt.getFullYear() + "-" + (startAt.getMonth() + 1) + "-" + startAt.getDate() + " " + startAt.getHours() + ":" + startAt.getMinutes() + ":" + startAt.getSeconds();
                // 第一个数据就是整个链路调用的总时间
                obj.duration = data[0]["duration"];
                // 统计结果中调用最长时间
                if (obj.duration > this.maxDuration) {
                    this.maxDuration = obj.duration;
                }
                if ("all" === this.serviceName) {
                    obj.percentage = 0;
                    obj.serviceName = "all";
                } else {
                    obj.serviceName = this.serviceName;
                    if (data.length == 1) {
                        obj.percentage = 100;
                    } else {
                        let second = data[1]["duration"];
                        obj.percentage = parseInt(second/obj.duration * 100);
                    }
                }
                // 随后进行数据统计
                // 首先将response中每一个完整调用链数据变成一个tree
                let chain = response[index];
                let tree = this.parseTree(chain);
                // 获取tree的深度，这个就是服务调用的深度
                let depth = this.getTreeDepth(tree);
                // let serviceChain = [];
                // for (let i in response[index]) {
                //     let dd = response[index][i];
                //     let annotations = dd["annotations"];
                //     for (let key in annotations) {
                //         let serviceName = annotations[key]["endpoint"]["serviceName"];
                //         if (serviceChain.length == 0) {
                //             serviceChain.push(serviceName);
                //         } else {
                //             let last = serviceChain[serviceChain.length - 1];
                //             if(last !== serviceName) {
                //                 serviceChain.push(serviceName);
                //             }
                //         }
                //     }
                // }
                // // 对serviceChain中的数据进行统计
                // let spans = {};
                // let serviceCount = 0;
                // for (let key in serviceChain) {
                //     let serviceName = serviceChain[key];
                //     if (spans.hasOwnProperty(serviceName)) {
                //         spans[serviceName] ++;
                //     } else {
                //         spans[serviceName] = 1;
                //         serviceCount ++;
                //     }
                // }
                // obj.serviceCount = serviceCount;
                // obj.spans = spans;
                obj.depth = depth;
                this.result.push(obj);
            }
            // 获取完数据之后对数据进行排序
            this.resortResult();
        },
        getTime (duration) {
            if (duration <= 0) {
                return "0微秒";
            }
            if (duration < 1000) {
                return (duration + "微秒");
            }
            if (duration >= 1000 && duration < 1000 * 1000) {
                return (duration/1000 + "毫秒");
            }
            if (duration >= 1000 * 1000 && duration < 60 * 1000 * 1000) {
                duration = parseInt(duration / 1000);
                return (duration / 1000 + "秒");
            }
            if (duration >= 60 * 1000 * 1000 && duration < 60 * 60 * 1000 * 1000) {
                duration = parseInt(duration / (1000 * 1000));
                return (duration / 60 + "分钟");
            }
            duration = parseInt(duration / (60 * 1000 * 1000));
            return (duration / 60 + "小时");
        }, 
        analyze (data) {
            // 分析的几个步骤：
            // 1. 将数据组装成一棵树，除根节点外，每一棵树有四个属性：ss,sr,cs,cr
            // 2. 组装成树之后遍历树，将每一条路线所经过的节点记录下来
            // 3. 遍历路线，将路线的调用层级梳理出来，最终得到调用的服务和次数
            // 树的生成在下面的parseTree()中，分析过程待补充

        },
        showDetail (value) {
            if(value.tree === undefined) {
                // 如果tree是undefined，那么从后台请求数据并解析成一个tree然后解析出来
                value.loading = true;
                net.ajax({
                    url: "http://localhost:9000/api/monitor/apiservice/ic/trace/" + value.traceId,
                    type: "GET"
                }).then((response) => {
                    if (response !== undefined) {
                        let tree = this.parseTree(response);
                        value.tree = tree;
                        value.resource = response;
                        value.treeSkeleton = this.grabTreeSkeleton(tree);
                        value.loading = false;
                    }
                }).catch((error) => {
                    console.error("获取追踪数据出现异常：", error);
                    value.loading = false;
                })
            } 
        },
        // 将调用链数据解析成一个tree
        parseTree (response) {
            console.log("获取到trace数据");
            console.log(response);
            let head = {};
            let failNodes = [];
            if (response !== undefined && response.length > 0) {
                for (let key in response) {
                    // 首先判断是否是head节点
                    let node = this.toNode(response[key]);
                    if(node.traceId === node.id) {
                        head = node;
                        continue;
                    } else {
                        if (!this.addToTree(head, node)) {
                            // 先将插入失败的节点统计起来
                            failNodes.push(node);
                        }
                    }
                }
                // 循环插入，总能插入成功的
                while(failNodes.length > 0) {
                    let node = failNodes.shift();
                    if(!this.addToTree(head, node)) {
                        // 插入失败的话再次放入数组中
                        failNodes.push(node);
                    }
                }
            }
            return head;
        },
        toNode(data) {
            // 将响应数据转化成树中的节点
            let node = {};
            node.traceId = data.traceId;
            node.id = data.id;
            node.name =  data.name;
            node.timestamp = data.timestamp;
            node.duration = data.duration;
            if(data.parentId !== undefined) {
                node.parentId = data.parentId;
            }
            // 将请求过程添加node
            for(let key in data.annotations) {
                let annotation = data.annotations[key];
                let value = annotation.value;
                if("sr" === value) {
                    node.sr = annotation.endpoint.serviceName;
                } else if ("ss" === value) {
                    node.ss = annotation.endpoint.serviceName;
                } else if ("cr" === value) {
                    node.cr = annotation.endpoint.serviceName;
                } else if ("cs" === value) {
                    node.cs = annotation.endpoint.serviceName;
                }
            }
            return node;
        },
        // 将一个节点添加进tree中
        addToTree (head, node) {
            if(head.children == undefined && head.id !== node.parentId) {
                return false;
            }
            if(head.id === node.parentId) {
                let children = head.children;
                if(children === undefined) {
                    children = [];
                }
                children.push(node);
                head.children = children;
                return true;
            } else {
                // 遍历节点，将children中的子节点作为head递归调用
                for (let index in head.children) {
                    let ch = head.children[index];
                    if (this.addToTree(ch, node)) {
                        // 插入成功返回true
                        return true;
                    }
                }
                // 如果没有添加进任何一个child中，那么返回false表示节点插入失败
                return false;
            }
        },
        // 从tree中抓取出供插件使用的Tree数据
        grabTreeSkeleton (tree) {
            let obj = {};
            obj.expand = true;
            let title = "";
            if (tree.ss === undefined) {
                obj.title = tree.cs + " " + this.getTime(tree.duration) + ":" + tree.name;
            } else {
                obj.title = tree.ss + " " + this.getTime(tree.duration) + ":" + tree.name;
            }
            let children = obj.children;
            if (children === undefined) {
                children = [];
            }
            if (tree.children !== undefined && tree.children.length > 0) {
                for(let index in tree.children) {
                    children.push(this.grabTreeSkeleton(tree.children[index]));
                }
            }
            obj.children = children;
            if (tree.parentId === undefined) {
                // 根节点
                let source = [];
                source.push(obj);
                return source;
            } else {
               
                return obj;
            }
        },
        formatResponse () {
            // 用模态框将响应数据展现出来
            if (this.detail.resource !== undefined) {
                return JSON.stringify(this.detail.resource, null, 4);
            } else {
                return "[]";
            }
        },
        showJson() {
            this.jsonModal = true;
        },
        itemSelected(data) {
            if(data.length > 0) {
                // 根据点击的title从this.detail.source中去拿元数据
                let title = data[0].title;
                let resource = this.detail.resource;
                let infos = title.split(" ");
                let index = infos[1].indexOf(":");
                let time = infos[1].substring(0, index);
                let name = infos[1].substring(index + 1);
                console.log(title);
                // 遍历resources
                // TODO:这种查找方式实际上是有问题的，记得修改查找数据的方式
                let target = undefined;
                // start是指父服务开始的时间
                let start =  undefined;
                for (let key in resource) {
                    let obj = resource[key];
                    if (obj.name === name && this.getTime(obj.duration) === time) {
                        let annotations = obj.annotations;
                        // 对annotations进行遍历比较
                        let ss = undefined, cs = undefined;
                        let serviceNames = {};
                        let aka = "AKA:";
                        for (let index in annotations) {
                            let annotation = annotations[index];
                            let serviceName = annotation.endpoint.serviceName;
                            if (!serviceNames.hasOwnProperty(serviceName)) {
                                serviceNames[serviceName] = 0;
                                aka += serviceName + ",";
                            }
                            if (annotation.value === "ss") {
                                ss = annotation.endpoint.serviceName;
                                // 到ss就可以break了，只有在没有ss的情况下才会去比较cs
                                break;
                            }
                            if (annotation.value === "cs") {
                                cs = annotation.endpoint.serviceName;
                            }
                        }
                        if (ss !== undefined && ss === infos[0]) {
                            target = obj;
                            target.aka = aka.substring(0, aka.length - 1);
                            break;
                        }
                        if (ss === undefined && cs === infos[0]) {
                            target = obj;
                            target.aka = aka.substring(0, aka.length - 1);
                            break;
                        }
                    }
                }
                // 再遍历一遍拿到parentId对应的start
                for (let index in resource) {
                    if (resource[index].parentId === undefined) {
                        start = resource[index].timestamp;
                        break;
                    }
                }
                if (target !== undefined) {
                    // 对target进行处理，得到显示用的detailObj
                    // 第一行
                    this.detailObj.header = infos[0] + "." + name + ": " + time;
                    this.detailObj.aka = target.aka;
                    let invocationChain = [];
                    // 遍历annotations，计算
                    for (let index in target.annotations) {
                        let annotation = target.annotations[index];
                        // 获取到duration，然后得到时间以及相关时间
                        let obj = {};
                        let timestamp = annotation.timestamp;
                        // 显示有四个属性：调用时间，相关时间(相对于整个调用开始)，注解以及地址
                        obj.datetime = new Date(parseInt(timestamp/1000)).toLocaleString();
                        obj.relativeTime = this.getTime((timestamp - start));
                        obj.annotation = this.getFullAnnotation(annotation.value);
                        let endpoint = annotation.endpoint;
                        obj.address = endpoint.ipv4 + ":" + endpoint.port + "(" + endpoint.serviceName + ")";
                        invocationChain.push(obj);
                    }
                    this.detailObj.invocationChain = {};
                    this.detailObj.invocationChain.column = [
                        {
                            title: "Date Time",
                            key: "datetime",
                            width: 200
                        },
                        {
                            title: "Relative Time",
                            key: "relativeTime",
                            width: 150
                        },
                        {
                            title: "Annotation",
                            key: "annotation",
                            width: 150
                        },
                        {
                            title: "Address",
                            key: "address"
                        }
                    ];
                    this.detailObj.invocationChain.data = invocationChain;
                    this.detailObj.keyValuePairs = {};
                    this.detailObj.keyValuePairs.column = [
                        {
                            title: "Key",
                            key: "key",
                            width: 200
                        },
                        {
                            title: "Value",
                            key: "value"
                        }
                    ];
                    // 从binaryAnnotations中拿到数据
                    let binaryData = [];
                    for (let index in target.binaryAnnotations) {
                        let obj = {};
                        let key = target.binaryAnnotations[index].key;
                        if("lc" === key) {
                            key = "Local Component";
                        }
                        obj.key = key;
                        obj.value = target.binaryAnnotations[index].value;
                        binaryData.push(obj);
                    }
                    // 将traceId、spanId和parentId放进去
                    binaryData.push({key:"traceId", value:target.traceId});
                    binaryData.push({key:"spanId", value:target.id});
                    binaryData.push({key:"parentId", value: target.parentId === undefined?"":target.parentId});
                    this.detailObj.keyValuePairs.data = binaryData;
                }
            }
            // 不管是item被选中还是没有被选中，都直接显示整个modal就ok了
            // 如果是取消选中，那么将会是显示上一次点击时的数据，这样模拟了点击事件
            if (this.detailObj !== undefined) {
                this.detailModal = true;
            }
        },
        getFullAnnotation (logogram) {
            if ("ss" === logogram) {
                return "Server Send";
            }
            if ("sr" === logogram) {
                return "Server Received";
            }
            if ("cr" === logogram) {
                return "Client Received";
            }
            if ("cs" === logogram) {
                return "Client Send";
            }
        },
        changeDisplay(value) {
            let display = value.display;
            value.display = (!display);
            this.showDetail(value);
        },
        changeDetail(value) {
            this.detail = value;
        },
        // 对数组中的数据去重
        distinceArray(arr) {
             return arr.filter((val, i, ar) => i <= ar.indexOf(val));
        },
        // 获取tree的深度
        getTreeDepth(tree) {
            if (tree.children === undefined || tree.children.length === 0) {
                return 1;
            } else {
                let subtreeDepths = [];
                for (let index in tree.children) {
                    subtreeDepths.push(this.getTreeDepth(tree.children[index]));
                }
                // 找出最大深度，然后返回1+该深度
                subtreeDepths.sort((a, b) => {
                    return a > b;
                });
                return 1 + subtreeDepths.shift();
            }
        }
    }
    
}
</script>
