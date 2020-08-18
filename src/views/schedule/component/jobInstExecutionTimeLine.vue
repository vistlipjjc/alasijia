<template>
    <div style="width:100%;height:380px;margin-top: 10px;"  ref="chart">
    </div>
</template>

<script>
    import echarts from 'echarts';

    export default {
        name: "jobInstExecutionTimeLine",

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
                        text: '执行时间走势图'
                    },
                    tooltip: {
                        trigger: 'axis'
                    },
                    legend: {
                        data:['最长时间', '最短时间', '平均时间'],
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
                        name: '执行时间（ms）',
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
                    server: this.$services.schService.jobInstMonitorRestController.selectJobInstTimeLine,
                    data: this.queryForm
                }).then((data) => {
                    let rows = data.result
                    let seriesData = []
                    let maxExecTime = []
                    let minExecTime = []
                    let avgExecTime = []
                    let xAxisData = []
                    for(var j = 0; j < rows.length; j++) {
                        maxExecTime.push(rows[j].maxExecTime)
                        minExecTime.push(rows[j].minExecTime)
                        avgExecTime.push(rows[j].avgExecTime)
                        xAxisData.push(rows[j].periodName)
                    }
                    seriesData.push(
                        {
                            name: '最长时间',
                            type: 'line',
                            data: maxExecTime
                        },
                        {
                            name: '最短时间',
                            type: 'line',
                            data: minExecTime
                        },
                        {
                            name: '平均时间',
                            type: 'line',
                            data: avgExecTime
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