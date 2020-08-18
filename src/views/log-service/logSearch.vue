<template>

    <div>
        <!-- 头部是一个搜索框 -->
        <div>
            <Card style="width:100%">
                <Form :label-width="100" style="width:100%">
                    <FormItem>
                        <Row>
                            <Col span="11">
                                <FormItem label="开始时间：">
                                    <DatePicker :value="startDate" type="date" style="width:300px" format="yyyy.MM.dd" placeholder="选择日志查询开始时间" @on-change="setStartDate" />
                                </FormItem>
                            </Col>
                            <Col span="11">
                                <FormItem label="结束时间：">
                                    <DatePicker :value="endDate" type="date" style="width:300px" format="yyyy.MM.dd" placeholder="选择日志查询开始时间" @on-change="setEndDate" />
                                </FormItem>
                            </Col>
                        </Row>
                    </FormItem>
                    <FormItem>
                        <Row>
                            <Col span="11">
                                <FormItem label="服务名：">
                                    <Input v-model="serviceName" placeholder="输入服务名" style="width:300px" clearable />
                                </FormItem>
                            </Col>
                            <Col span="11">
                                <FormItem label="查询关键字：">
                                    <Input v-model="keyword" placeholder="输入查询关键字" style="width:300px" clearable />
                                </FormItem>
                            </Col>
                        </Row>
                    </FormItem>
                    <FormItem>
                        <Row>
                            <Col span="11">
                                <FormItem label="日志级别：">
                                    <Select v-model='level' style="width:300px">
                                        <Option v-for="(value, key) in levels" :key="key" :value="value" >{{value}}</Option>
                                    </Select>
                                </FormItem>
                            </Col>
                            <Col span="11">
                                <Button type="primary" @click="doQuery" style="margin-left:100px">查询</Button>
                            </Col>
                        </Row>
                    </FormItem>
                </Form>
            </Card>
        </div>
        <!-- 底部是一个显示数据的控件 -->
        <div style="margin-top:30px">
            <Table :loading="loading" border stripe :columns="columns" :data="data" height="500"></Table>
            <Page  :total="count" :page-size=500 show-total :current="current" @on-change="pageChange"></Page>
        </div>
    </div>
</template>

<script>
import net from '@/util/net';
import $ from 'jquery';
import app from '@/config/app'

export default {
    data() {
        return {
            loading: false,
            startDate: '',
            endDate: '',
            levels: [
                "TRACE",
                "DEBUG",
                "INFO",
                "WARN",
                "ERROR"
            ],
            level: '',
            keyword: '',
            serviceName: '',
            columns:[
                {
                    title: "服务名",
                    key: "serviceName",
                    width: 200
                },
                {
                    title: "时间",
                    key: "timestamp",
                    width: 200
                },
                {
                    title: "日志级别",
                    key: "level",
                    width: 200
                },
                {
                    title: "日志消息",
                    key: "msg",
                    render: (h, params) => {
                        return h('div', params.row.msg);
                    }
                }
            ],
            data: [],
            page: 1,
            count: 200 * 50
        }
    },
    created () {
        // 获取startDate和endDate，默认endDate是当天，startDate是当天的前一天
        let now = new Date();
        this.endDate = this.formatDate(now);
        let date = now.getDate() - 1;
        let start = new Date();
        start.setDate(date);
        this.startDate = this.formatDate(start);
    },
    methods: {
        formatDate(date) {
            let month = date.getMonth() + 1;
            let day = date.getDate();
            if (month < 10) {
                month = "0" + month;
            }
            if (day < 10) {
                day = "0" + day;
            }
            
            return date.getFullYear() + "." + month + "." + day;
        },
        setStartDate(date, type) {
            this.startDate = date;
        },
        setEndDate(date, type) {
            this.endDate = date;
        },
        pageChange(page) {
            this.page = page;
            this.doQuery();
        },
        doQuery() {
            this.loading = true;
            let data = {
                startDate: this.startDate,
                endDate: this.endDate,
                level: this.level,
                serviceName: this.serviceName,
                keyword: this.keyword,
                page: this.page
            };
            net.ajax({
                url: app.url.server + "/monitor/apiservice/log/search",
                type: "POST",
                data: data
            }).then((response) => {
                if (response !== undefined) {
                    this.processResponse(response);
                }
                this.loading = false;
            }).catch((error) => {
                console.error("查询出现异常：", error);
                this.loading = false;
            });
        },
        // 对响应数据进行处理，使得可以显示
        processResponse(response) {
            // let responseData = response.data;
            this.data = [];
            for (let index in response.data) {
                let data = response.data[index];
                let obj = {};
                obj.serviceName = data.service_name;
                obj.timestamp = data.timestamp;
                obj.className = data.className;
                obj.threadName = data.threadName;
                obj.level = data.level;
                if (data.costTime !== undefined) {
                    obj.costTime = data.costTime;
                    obj.mapperId = data.mapperId;
                }
                if (data.exceptionMsg !== undefined) {
                    obj.exceptionMsg = data.exceptionMsg;
                }

                // let stack = data.exceptionStack;
                // let msg = data.msg;
                // obj.msg = (stack === undefined?msg:(msg + stack));
                obj.msg = data.msg;
                this.data.push(obj);
            }
            // this.data = response.data;
        }
    }
}
</script>
