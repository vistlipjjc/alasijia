<template>
        <Card>
            <div>
                <Form :model="queryForm" :show-message="true" >
                    <Row>
                        <Col span="5">
                            <FormItem label="任务类型"  style="width: 100%;" :label-width="80">
                                <j-select v-model="queryForm.__LIKES_groupCode"
                                          url="custom:jobGroup/queryAll@schedule"
                                          ref="queryForm.__LIKES_groupCode"
                                          clearable filterable
                                          @on-change="groupCodeSelectChange($event)">
                                </j-select>
                            </FormItem>
                        </Col>
                        <Col span="7">
                            <FormItem label="任务名称" style="width: 100%;" :label-width="80">
                                <j-select v-model="queryForm.__LIKES_jobCodeList" style="width: 100%"
                                          filterable multiple @on-change="jobCodeSelectChange($event)" :option-list="jobCodeList">
                                </j-select>
                            </FormItem>
                        </Col>
                        <Col span="4" offset="1">
                            <FormItem label="选择时间" style="width: 100%;" :label-width="80">
                                <j-select v-model="queryForm.__LIKES_dateType"
                                          :optionList="timeOptions"
                                          @on-change="dateSelectChange($event)">
                                </j-select>
                            </FormItem>
                        </Col>
                        <Col span="4" offset="1">
                            <FormItem label="查询时间类型" style="width: 100%;" :label-width="90">
                                <j-select v-model="queryForm.__LIKES_userDefineDate"
                                          :optionList="timeTypeOptions"
                                          @on-change="dateTypeSelectChange($event)">
                                </j-select>
                            </FormItem>
                        </Col>
                        <Col span="2"  style="text-align: right">
                            <Button type="info" style="height: 30px;width: 70px" @click="searchAll">查询</Button>
                        </Col>
                    </Row>
                    <Row v-if="showUserDefineDate === 'show'">
                        <Col span="5">
                            <FormItem label="开始时间" :labelWidth="80" style="width: 100%;">
                                <DatePicker type="date" placeholder="开始时间" formate="yyyy-MM-dd"
                                            :options="dateOption" @on-change="startDateChange($event)"
                                            v-model="queryForm.__LIKES_startDate">
                                </DatePicker>
                            </FormItem>
                        </Col>
                        <Col span="5">
                            <FormItem label="结束时间" :labelWidth="80" style="width: 100%;">
                                <DatePicker type="date" placeholder="结束时间" formate="yyyy-MM-dd"
                                            :options="dateOption" @on-change="endDateChange($event)"
                                            v-model="queryForm.__LIKES_endDate">
                                </DatePicker>
                            </FormItem>
                        </Col>
                    </Row>
                </Form>
                <div class="line-gray"></div>
                <Row style="margin-top: 20px">
                    <Col span="9">
                        <job-inst-result-pie :value="subQueryForm" :status="status">
                        </job-inst-result-pie>
                    </Col>
                    <Col span="14" offset="1">
                        <job-inst-result-line :value="subQueryForm" :status="status">
                        </job-inst-result-line>
                    </Col>
                </Row>
                <div class="line-gray"></div>
                <Row style="margin-top: 20px">
                    <Col span="9">
                        <job-inst-execution-time-pie :value="subQueryForm" :status="status">
                        </job-inst-execution-time-pie>
                    </Col>
                    <Col span="14" offset="1">
                        <job-inst-execution-time-line :value="subQueryForm" :status="status">
                        </job-inst-execution-time-line>
                    </Col>
                </Row>

                <div class="line-gray"></div>
                <Row style="margin-top: 20px">
                    <Col span="24">
                        <job-inst-error-type-line :value="subQueryForm" :status="status">
                        </job-inst-error-type-line>
                    </Col>
                </Row>
            </div>
        </Card>
</template>

<script>
    import JobInstResultPie from "./component/jobInstResultPie";
    import JobInstExecutionTimePie from "./component/jobInstExecutionTimePie";
    import JobInstResultLine from "./component/jobInstResultLine";
    import JobInstExecutionTimeLine from "./component/jobInstExecutionTimeLine";
    import JobInstErrorTypeLine from "./component/jobInstErrorTypeLine";
    import JobInstErrorTypePie from "./component/jobInstErrorTypePie";
    export default {
        name: "jobInstMonitorChart",

        components: {
            JobInstErrorTypePie,
            JobInstErrorTypeLine,
            JobInstExecutionTimeLine,
            JobInstResultLine,
            JobInstExecutionTimePie,
            JobInstResultPie
        },
        data() {
            return {
                //查询的form表单
                queryForm: {
                    __LIKES_groupCode: '',      //任务类型
                    __LIKES_jobCodeList: '',     //任务编码
                    __LIKES_dateType: 'oneWeek',       //时间维度查询（oneWeek oneMonth threeMonth oneYear）
                    __LIKES_userDefineDate: 'D',     //用户自定义时间类型
                    __LIKES_startDate: '',      //用户自定义开始时间
                    __LIKES_endDate: '',        //用户自定义结束时间
                },
                //子组件查询条件
                subQueryForm:{
                    __LIKES_groupCode: '',      //任务类型
                    __LIKES_jobCodeList: '',     //任务编码
                    __LIKES_dateType: 'oneWeek',       //时间维度查询（oneWeek oneMonth threeMonth oneYear）
                    __LIKES_userDefineDate: 'D',     //用户自定义时间类型
                    __LIKES_startDate: '',      //用户自定义开始时间
                    __LIKES_endDate: '',        //用户自定义结束时间
                },

                //状态用于子页面监听变化
                status: true,

                jobCodeList: [],


                //时间查询维度
                timeOptions: [
                    {value: 'oneWeek', name: '最近一周'},
                    {value: 'oneMonth', name: '最近一月'},
                    {value: 'threeMonth', name: '最近三月'},
                    {value: 'oneYear', name: '最近一年'},
                    {value: 'defineDate', name: '自定义时间'}
                    ],

                //时间类型查询维度
                timeTypeOptions: [
                    {value: 'D', name: '天'},
                    {value: 'W', name: '周'},
                    {value: 'M', name: '月'},
                    {value: 'Q', name: '季'},
                    {value: 'Y', name: '年'}
                ],


                //自定义时间查询是否显示
                showUserDefineDate: 'hide',

                //时间日期控制不可选时间
                dateOption: {
                    disabledDate (date) {
                        return date && date.valueOf() > Date.now();
                    }
                },
            }
        },

        created() {
           this.init()
        },

        methods: {

            init() {

                this.subQueryForm = this.queryForm

                this.$net.send({
                    server: this.$services.schService.jobEntityRestController.queryJobCode,
                }).then((data) => {
                    this.jobCodeList = data;
                });
            },

            //任务类型下拉框改变时
            groupCodeSelectChange(value) {
                this.queryForm.__LIKES_groupCode = value;
                if(this.queryForm.__LIKES_groupCode === undefined){
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
                }
            },

            //任务编码下拉框改变时
            jobCodeSelectChange(value) {
                var str = value.join(",")
                this.queryForm.__LIKES_jobCodeList = str;
            },

            //日期选择下拉框改变时
            dateSelectChange(value) {
                this.queryForm.__LIKES_dateType = value
                this.queryForm.__LIKES_startDate = ''
                this.queryForm.__LIKES_endDate = ''
                this.showUserDefineDate = 'hide'
                if(value == 'oneWeek') {
                    this.timeTypeOptions = [{value: 'D', name: '天'},{value: 'W', name: '周'}]
                    this.queryForm.__LIKES_userDefineDate = 'D'
                }
                else if(value == 'oneMonth') {
                    this.timeTypeOptions = [
                        {value: 'D', name: '天'},
                        {value: 'W', name: '周'},
                        {value: 'M', name: '月'}]
                    this.queryForm.__LIKES_userDefineDate = 'D'
                }
                else if(value == 'threeMonth') {
                    this.timeTypeOptions = [
                        {value: 'D', name: '天'},
                        {value: 'W', name: '周'},
                        {value: 'M', name: '月'},
                        {value: 'Q', name: '季'}]
                    this.queryForm.__LIKES_userDefineDate = 'D'
                }
                else if(value == 'oneYear') {
                    this.timeTypeOptions = [
                        {value: 'W', name: '周'},
                        {value: 'M', name: '月'},
                        {value: 'Q', name: '季'},
                        {value: 'Y', name: '年'}]
                    this.queryForm.__LIKES_userDefineDate = 'W'
                }
                else if(value == 'defineDate') {
                    this.showUserDefineDate = 'show'
                    this.timeTypeOptions = [
                        {value: 'D', name: '日'},
                        {value: 'W', name: '周'},
                        {value: 'M', name: '月'},
                        {value: 'Q', name: '季'},
                        {value: 'Y', name: '年'}]
                    this.queryForm.__LIKES_userDefineDate = 'D'
                }
            },


            //时间维度下拉框改变时
            dateTypeSelectChange(value) {
                this.queryForm.__LIKES_userDefineDate = value;
            },

            //开始时间变化时
            startDateChange(value) {
                this.queryForm.__LIKES_startDate = value
            },


            //结束时间变化时
            endDateChange(value) {
                this.queryForm.__LIKES_endDate = value
            },

            //button查询按钮，根据条件查询
            searchAll() {
                this.subQueryForm = this.queryForm
                if(this.status) {
                    this.status = false
                }else{
                    this.status = true
                }
            }
        },

    }
</script>

<style scoped>

</style>