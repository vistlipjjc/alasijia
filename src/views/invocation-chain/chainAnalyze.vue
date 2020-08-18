<style scoped>
    @import './chainAnalyze.css';
</style>
<template>
    <div >
        <!-- 上面是一个查询的Card -->
        <div id="topCard">
            <Card style="width:100%">
                <Form :label-width="80" style="width:100%">
                    <FormItem>
                        <Row>
                            <Col span="9">
                                <FormItem label="开始时间：">
                                    <DatePicker :value="startDate" type="datetime" style="width:300px" format="yyyy-MM-dd HH:mm" placeholder="选择调用链查询开始时间" @on-change="setStartDatetime" />
                                </FormItem>
                            </Col>
                            <Col span="9">
                                <FormItem label="结束时间：">
                                    <DatePicker :value="endDate" type="datetime" style="width:300px" format="yyyy-MM-dd HH:mm" placeholder="选择调用链查询开始时间" @on-change="setEndDatetime" />
                                </FormItem>
                            </Col>
                            <Col>
                                <Button type="primary" @click="queryDependencies">依赖分析</Button>
                            </col>
                        </Row>
                    </FormItem>
                </Form>
            </Card>
        </div>
        <!-- 下面是一个用来绘制图的地儿 -->
        <div style="margin-top:30px;width=100%;height=100%" id="canvas">
            <svg style="width:100%"><g/></svg>
        </div>
        <!-- TODO:修改，显示调用 -->
        <Modal v-model="detailModal" title="调用链详细数据" width="60%" v-if="response.length > 0">
            <div slot="header">
                <div v-if="invokeStatistics.showDetail" align="center">
                    <a href="#" @click.prevent="showStatisticsModal(invokeStatistics.from)">
                        <span style="font-size:22px">{{invokeStatistics.from}}</span>
                    </a>
                    <br />
                    <Icon type="arrow-down-a" size="48" />
                    <br />
                    <a href="#" @click.prevent="showStatisticsModal(invokeStatistics.to)">
                        <span style="font-size:22px">{{invokeStatistics.to}}</span>
                    </a>
                </div>
                <div v-else>
                    <span style="font-size:28px">{{invokeStatistics.serviceName}}</span>
                </div>
            </div>
            <div>
                <div v-if="invokeStatistics.showDetail">
                    <Table stripe :columns="invokeStatistics.columns" :data="invokeStatistics.data" />
                </div>
                <div v-else>
                    <Row>
                        <Col span="11">
                            <h2>UsedBy</h2>
                            <ul style="list-style-type:square;margin-left:50px">
                                <li v-for="(value, key) in invokeStatistics.usedBy" :key="key">
                                    <a href="#" @click.prevent="showDetail(value, true)"><span style="font-size:16px">{{value}}</span></a>
                                </li>
                            </ul>
                        </Col>
                        <Col span="11">
                            <h2>Uses</h2>
                            <ul style="list-style-type:square;margin-left:50px">
                                <li v-for="(value, key) in invokeStatistics.uses" :key="key">
                                    <a href="#" @click.prevent="showDetail(value, false)"><span style="font-size:16px">{{value}}</span></a>
                                </li>
                            </ul>
                        </Col>
                    </Row>
                </div>
            </div>
            <div slot="footer">
            </div>
        </Modal>
    </div>
</template>

<script type="text/javascript">
import net from '@/util/net';
import * as d3 from 'd3';
import dagre from 'dagre-d3';
import $ from 'jquery';
import app from '@/config/app';

export default {
    data () {
        return {
            startDate: '',
            endDate: '',
            startTs: '',
            endTs: '',
            detailModal: false,
            response: [],
            invokeStatistics:{}
        }
    },
    created () {
        let now = new Date();
        this.endDate = this.formatDate(now);
        this.endTs = Date.parse(now);
        let date = now.getDate() - 7;
        let start = new Date();
        start.setDate(date);
        this.startDate = this.formatDate(start);
        this.startTs = Date.parse(start);
    },
    methods: {
        formatDate (date) {
            return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes();
        },
        setStartDatetime: function(datetime, type) {
            this.startTs = Date.parse(datetime);
        }, 
        setEndDatetime: function(datetime, type) {
            this.endTs = Date.parse(datetime);
        },
        queryDependencies() {
            // 向后台请求数据
            net.ajax({
                url: app.url.server + "/monitor/apiservice/ic/dependency?startTs=" + this.startTs + "&endTs=" + this.endTs,
                type: "GET"
            }).then((response) => {
                this.processDependency2(response);
            }).catch((error) => {
                console.error("查询依赖出现异常：", error);
            })
        },
        arrayUnique(arr) {
            return arr.filter((val, i, ar) => i <= ar.indexOf(val));
        },
        scale(lg, startRange, endRange, minResult, maxResult) {
            return minResult + (lg - startRange) * (maxResult - minResult)/(endRange - startRange);
        },
        processDependency2 (response) {
            if(response !== undefined ) {
                this.response = response;
                let svg = d3.select("svg");
                let svgGroup = svg.select("g");
                // 首先创建一个graph()对象
                let g = new dagre.graphlib.Graph().setGraph({
                    nodesep: 30,
                    ranksep: 200,
                    // LR表示图是从左至右
                    rankdir: "LR"
                });
                let render = new dagre.render();
                // 首先获取所有数据
                let filtered = response.filter(link => link.parent !== link.child);
                // 1. 获取最大/最小调用次数
                let maxCallCount = 0, minCallCount = 0;
                filtered.forEach(link => {
                    if (link.callCount < minCallCount || minCallCount === 0) {
                        minCallCount = link.callCount;
                    }
                    if (link.callCount > maxCallCount) {
                        maxCallCount = link.callCount;
                    }
                })
                let maxLg = Math.log(maxCallCount), minLg = Math.log(minCallCount);
                // 获取所有的服务名称
                let serviceNames = this.arrayUnique(response.map(link => link.parent).concat(response.map(link => link.child)));
                // 首先设置节点
                serviceNames.forEach(serviceName => {
                    g.setNode(serviceName, {
                        label: serviceName,
                        rx: 5,
                        ry: 5
                    })
                });
                // 然后设置边
                filtered.forEach(link => {
                    // width是设置边的长度，宽度的话不能够通过height来设置
                    let strokeWidth = this.scale(Math.log(link.callCount), minLg, maxLg, 0.4, 4);
                    // 不用fill:none的话样式。。。
                    let style="fill:none;stroke-width:" + strokeWidth + "px";
                    g.setEdge(link.parent, link.child, {
                        // style: "stroke-width:" + strokeWidth + "px",
                        style: style,
                        curve: d3.curveBasis, 
                        width: 40
                    })
                });
                console.log(g);
                console.log(g.edge("ijep-router-zuul", "ijep-service-sys"));
                // 重载render的createNodes和createEdgePaths()函数，用来创建点击事件以及修改线条的宽度
                let initEdgePaths = render.createEdgePaths();
                render.createEdgePaths((selection, g, arrows) => {
                    let svgPaths = initEdgePaths(selection, g, arrows);
                    // 给每一条边加上from和to属性，这样就可以去查找到相关的
                    svgPaths.attr("data-from", d => {
                        return d.v;
                    });
                    svgPaths.attr("data-to", d => {
                        return d.w;
                    })
                    console.log(svgPaths);
                    return svgPaths;
                })
                // 应用缩放
                let zoom = d3.zoom().on("zoom", function() {
                    svgGroup.attr("transform", d3.event.transform);
                });
                // 开始绘制图
                svg.call(zoom);
                render(svgGroup, g); 
                // 给node元素绑定事件
                $("svg").delegate("g .node", "click", (event) => {
                    // 首先获取点击的目标
                    let target = event.target;
                    let serviceName = $(target).text();
                    if (serviceName === "") {
                        serviceName = $(target).next().find("tspan").text();
                    }
                    this.showStatisticsModal(serviceName);
                })
                $("svg").delegate("g .edgePath", "mouseenter", (event) => {
                    let parent = $(event.target).parent();
                    let from = this.getNode(parent.attr("data-from"));
                    let to = this.getNode(parent.attr("data-to"));
                    this.addClass(from, "hover");
                    this.addClass(to, "hover");
                    this.addClass(parent, "hover-edge");
                    this.addClass($($("svg").get(0)), "dark");
                });
                $("svg").delegate("g .edgePath", "mouseleave", (event) => {
                    let parent = $(event.target).parent();
                    let from = this.getNode(parent.attr("data-from"));
                    let to = this.getNode(parent.attr("data-to"));
                    this.removeClass(from, "hover");
                    this.removeClass(to, "hover");
                    this.removeClass(parent, "hover-edge");
                    this.removeClass($($("svg").get(0)), "dark");
                });
                var initialScale = 0.75;
                let svgWidth = svg.attr("width")||$($("svg").get(0)).width();
                svg.call(zoom.transform, d3.zoomIdentity.translate((svgWidth - g.graph().width * initialScale) / 2, 20).scale(initialScale));
                // 设置整个svg的高度
                svg.attr("height", $($(".single-page-con").get(0)).height() - $("#topCard").height());
            }
        },
        getNode(serviceName) {
            let nodes = $("g .node").get();
            for (let i in nodes) {
                let node = nodes[i];
                if($(node).find("tspan").text() === serviceName) {
                    return $(node);
                }
            }
        },
        addClass(node, styleClass) {
            console.log(node);
            let nodeClass = node.attr("class") || "";
            if(nodeClass.indexOf(styleClass) === -1) {
                let classes = nodeClass.split(/\s+/);
                // push返回的是长度，因此不要链上去。。。
                classes.push(styleClass);
                nodeClass = classes.join(" ");
                node.attr("class", nodeClass);
            }
        },
        removeClass(node, styleClass) {
            let nodeClass = node.attr("class") || "";
            if(nodeClass.indexOf(styleClass) !== -1) {
                nodeClass = nodeClass.replace(styleClass, "").trim().split(/\s+/).join(" ");
                node.attr("class", nodeClass);
            }
        },
        showStatisticsModal(serviceName) {
            // 展示调用统计模态框
            // 首先获取统计数据，然后将数据添加进invokeStatistics对象中
            this.invokeStatistics = {};
            this.invokeStatistics.serviceName = serviceName;
            // 然后遍历chain
            let usedBy = [], uses = [];
            this.response.forEach(link => {
                if (link.parent === serviceName) {
                    uses.push(link.child);
                }
                if (link.child === serviceName) {
                    usedBy.push(link.parent);
                }
            })
            // 展示的不是详情
            this.invokeStatistics.showDetail = false;
            this.invokeStatistics.usedBy = this.arrayUnique(usedBy);
            this.invokeStatistics.uses = this.arrayUnique(uses);
            if(!this.detailModal)
                this.detailModal = true;
        },
        showDetail(serviceName, usedBy) {
            // 获取当前的serviceName
            let resource = this.invokeStatistics.serviceName;
            this.invokeStatistics = {};
            let from, to;
            if(usedBy) {
                from = serviceName;
                to = resource;
            } else {
                from = resource;
                to = serviceName;
            }
            let detail = this.getDetail(from, to);
            this.invokeStatistics.from = from;
            this.invokeStatistics.to = to;
            this.invokeStatistics.detail = detail;
            this.invokeStatistics.showDetail = true;
            // 获取table相关数据
            this.invokeStatistics.columns = [
                {
                    title: "Key",
                    key: "key"
                },
                {
                    title: "Value",
                    key: "value"
                }
            ];
            // 然后组装value
            this.invokeStatistics.data = [
                {
                    key: "调用次数",
                    value: detail.callCount
                },
                {
                    key: "失败次数",
                    value: detail.errorCount === undefined?0:detail.errorCount
                }
            ];
        },
        getDetail(from, to) {
            if (this.response === undefined || this.response.length > 0) {
                for (let index in this.response) {
                    let link = this.response[index];
                    if(link.parent === from && link.child === to) {
                        return link;
                    }
                }
                return {};
            } else {
                return {};
            }
        }
    }
}
</script>
