<template>
    <Card>
        <div>
            <Row style="margin-top: 10px">
                <Col span="18">
                    <j-table  :showColumn="false" autoSearch :showRefresh="false" :input-col="5"
                              :server="server.queryErrorInst"  pagination :queryForm="queryForm"
                              :columns-list="errorInstColumns" v-model="errorInstData"
                              @on-row-click="rowClick">
                        <template slot="input">
                            <Row>
                                <Col span="7">
                                    <FormItem label="任务类型" :labelWidth="70" prop="__LIKES_groupCode" style="width: 100%">
                                        <j-select
                                                v-model="queryForm.__LIKES_groupCode"
                                                url="custom:jobGroup/queryAll@schedule"
                                                clearable  filterable
                                                @on-change="groupCodeSelectChange($event)">
                                        </j-select>
                                    </FormItem>
                                </Col>
                                <!--<Col span="7" offset="1">
                                    <FormItem label="任务编码" :labelWidth="70" prop="__LIKES_jobCode" style="width: 100%">
                                        <j-select v-model="queryForm.__LIKES_jobCode" style="width: 100%"
                                                  filterable multiple @on-change="jobCodeSelectChange($event)" :option-list="jobCodeList">
                                        </j-select>
                                    </FormItem>
                                </Col>-->
                                <Col span="7" offset="1">
                                    <FormItem label="任务编码" :labelWidth="70" prop="__LIKES_jobCode" style="width: 100%">
                                        <Input placeholder="任务编码" v-model="queryForm.__LIKES_jobCode" style="width: 100%" />
                                    </FormItem>
                                </Col>
                                <Col span="7" offset="1">
                                    <FormItem label="任务名称" :labelWidth="70" prop="__LIKES_jobName" style="width: 100%">
                                        <Input placeholder="任务名称" v-model="queryForm.__LIKES_jobName" style="width: 100%" />
                                    </FormItem>
                                </Col>
                            </Row>
                        </template>
                        <Col span="7" slot="input-col">
                            <FormItem label="开始时间" :labelWidth="70"  style="width: 100%" prop="__LIKES_startDate">
                                <DatePicker type="date" placeholder="开始时间" formate="yyyy-MM-dd"
                                            :options="dateOption" @on-change="startDateChange($event)"
                                            v-model="queryForm.__LIKES_startDate" style="width: 100%">
                                </DatePicker>
                            </FormItem>
                        </Col>
                        <Col span="7" slot="input-col" offset="1" >
                            <FormItem label="结束时间" :labelWidth="70" style="width: 100%" prop="__LIKES_endDate">
                                <DatePicker type="date" placeholder="结束时间" formate="yyyy-MM-dd"
                                            :options="dateOption" @on-change="endDateChange($event)"
                                            v-model="queryForm.__LIKES_endDate" style="width: 100%">
                                </DatePicker>
                            </FormItem>
                        </Col>
                        <Col span="1" slot="input-col"><h5 style="color: white">.</h5></Col>
                    </j-table>
                </Col>
                <Col span="5" offset="1">
                    <Collapse v-model="collapseValue" style="margin-top: 140px">
                        <Panel name="1">
                            实例日志记录
                            <Timeline slot="content" style="max-height: 400px; overflow: auto;">
                                <span class="time" v-if="showTitle === 'false'">暂未查找到任务实例日志</span>
                                <TimelineItem color="green" v-if="showTitle === 'success'">
                                    <span class="time" >job inst start</span>
                                </TimelineItem>
                                <Timeline-Item v-for="(item,index) in jobInstLogList" :key="index">
                                    <p class="time">{{item.log_time}}</p>
                                    <p class="content">
                                        <Icon type="close-circled"  color="#ed4014"  :size=16
                                              v-if="item.log_level === 'ERROR'">
                                        </Icon>
                                        <Icon type="information-circled"  color="#ff9900"
                                              :size=16 v-if="item.log_level === 'WARN'">
                                        </Icon>
                                        <Icon type="information-circled"  color="#2db7f5"
                                              :size=16 v-if="item.log_level === 'INFO'">
                                        </Icon>
                                        {{item.log_content}}
                                    </p>
                                </Timeline-Item>
                            </Timeline>
                        </Panel>
                    </Collapse>
                </Col>
            </Row>
        </div>
    </Card>
</template>

<script>
    export default {
        name: "errorInstTable",

        data() {
            return {
                //不可选时间
                dateOption: {
                    disabledDate (date) {
                        return date && date.valueOf() > Date.now();
                    }
                },

                //查询的form表单
                queryForm: {
                    __LIKES_groupCode: '',      //任务类型
                    //__LIKES_jobCodeList: '',     //任务编码
                    __LIKES_jobCode: '',                //任务编码
                    __LIKES_jobName: '',                //任务名称
                    __LIKES_startDate: '',      //用户自定义开始时间
                    __LIKES_endDate: '',        //用户自定义结束时间
                },

                //查询出来的所有jobCode
                jobCodeList: [],


                //任务日志折叠框默认显示打开name为1的界面
                collapseValue: '1',

                //显示默认日志的第一条内容
                showTitle: '',

                //每条jobInst的日志集合
                jobInstLogList: [],

                server: {
                    queryErrorInst: this.$services.schService.jobInstMonitorRestController.queryErrorInst,
                },

                errorInstColumns: [
                    {title: '任务类型', align: 'center', key: 'groupName', width:120},
                    {title: '任务名称', align: 'center', key: 'jobName', ellipsis: true,width:200},
                    {title: '开始时间', align: 'center', key: 'startTime', width:150,
                        render: (h, params) => {
                            return h('span', [
                                h('span', this.formatDate(params.row.startTime))
                            ]);
                    }},
                    {title: '错误类型', align: 'center', key:'errorType', width:100},
                    {title: '错误消息', align: 'center', key: 'errorMessage', ellipsis: true},
                ],

                errorInstData: [],
            }
        },


        created() {
           // this.init();
        },

        methods: {

            /*init() {
                this.$net.send({
                    server: this.$services.schService.jobEntityRestController.queryJobCode,
                }).then((data) => {
                    this.jobCodeList = data;
                });
            },*/

            formatDate (time) {
                let date = new Date(time);
                let year = date.getFullYear();
                let month = date.getMonth() + 1;
                let day = date.getDate();
                let hour = date.getHours();
                let minute = date.getMinutes();
                let second = date.getSeconds();
                return year + '/' + month + '/' + day + '  ' + this.checkTime(hour) + ':' + this.checkTime(minute) + ':' + this.checkTime(second);
            },

            //将时间返回值为一位数的前面加0
            checkTime(i) {
                if (i<10) {
                    i="0" + i
                }
                    return i
            },

            //任务类型下拉框改变时
            groupCodeSelectChange(value) {
                this.queryForm.__LIKES_groupCode = value;
                /*if(this.queryForm.__LIKES_groupCode === undefined){
                    this.$net.send({
                        server: this.$services.schService.jobEntityRestController.queryJobCode,
                    }).then((data) => {
                        this.jobCodeList = data;
                    });
                }else {
                    this.$net.send({
                        server: this.$services.schService.jobEntityRestController.queryJobCodeByGroupCode,
                        append: this.queryForm.__LIKES_groupCode,
                    }).then((data) => {
                        this.jobCodeList = data
                    });
                }*/
            },

            //任务编码下拉框改变时
            /*jobCodeSelectChange(value) {
                var str = value.join(",")
                this.queryForm.__LIKES_jobCodeList = str;
            },*/

            //开始时间变化时
            startDateChange(value) {
                this.queryForm.__LIKES_startDate = value
            },



            //结束时间变化时
            endDateChange(value) {
                this.queryForm.__LIKES_endDate = value
            },


            //点击table行展示旁边的log数据
            rowClick(row,index) {
                //判断有没有数据，没数据就不执行日志搜索
                if(index === null){

                }else {
                    this.$net.send({
                        server: this.$services.schService.jobTraceRestController.queryJobInstLog,
                        append: row.jobInstId
                    }).then((data) => {
                        if(data.success) {
                            this.showTitle = 'success'
                            this.jobInstLogList = data.traces
                        }else {
                            this.jobInstLogList = []
                            this.showTitle = 'false'
                        }
                    });
                }
            }
        },
    }
</script>

<style scoped>
    .time{
        font-size: 14px;
        font-weight: bold;
    }
    .content{
        padding-left: 5px;
    }
</style>
