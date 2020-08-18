<template>
    <div style="width:100%;height:380px;margin-top: 10px;"  ref="chart">
    </div>
</template>

<script>
    import echarts from 'echarts';

    export default {
        name: "jobInstResultLine",

        props: {
            value : Object,
            status: Boolean
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
                option: {
                    title: {
                        text: '执行结果走势图'
                    },
                    tooltip: {
                        trigger: 'axis'
                    },
                    legend: {
                        data:['成功', '超时', '错误'],
                        right: '5%'
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    xAxis: {
                        type: 'category',
                        boundaryGap: true,
                        data: []
                    },
                    yAxis:{
                        type: 'value',
                        name: '数量',
                        position: 'left',
                        axisLabel: {
                            formatter: '{value}'
                        }
                    },
                    series: []
                }
            }
        },

        mounted() {
            this.init();
        },

        methods: {
            init() {
                this.queryForm = this.value
                this.$net.send({
                    server: this.$services.schService.jobInstMonitorRestController.selectJobInstResultLine,
                    data: this.queryForm
                }).then((data) => {
                    let rows = data.result
                    let seriesData = []
                    let jobInstDone = []
                    let jobInstTimeout = []
                    let jobInstError = []
                    let xAxisData = []
                    for(var j = 0; j < rows.length; j++) {
                        jobInstDone.push(rows[j].jobInstDoneCount)
                        jobInstTimeout.push(rows[j].jobInstTimeoutCount)
                        jobInstError.push(rows[j].jobInstErrorCount)
                        xAxisData.push(rows[j].periodName)
                    }
                    seriesData.push(
                        {
                            name: '成功',
                            type: 'line',
                            data: jobInstDone
                        },
                        {
                            name: '超时',
                            type: 'line',
                            data: jobInstTimeout
                        },
                        {
                            name: '错误',
                            type: 'line',
                            data: jobInstError
                        },
                    )
                    this.option.series = seriesData
                    this.option.xAxis.data = xAxisData

                    let userFlow = echarts.init(this.$refs.chart);
                    userFlow.setOption(this.option);
                    userFlow.resize();
                    window.addEventListener('resize', function () {
                        userFlow.resize();
                    });
                });
            },
        },


        watch: {
            status(newVal, oldVal){
                this.init()
            }
        }
    }
</script>

<style scoped>

</style>