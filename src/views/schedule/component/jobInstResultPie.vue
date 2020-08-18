<template>
    <div style="width:100%;height:380px;margin-top: 10px;"  ref="chart">
    </div>
</template>

<script>
    import echarts from 'echarts';

    export default {
        name: "jobInstResultPie",

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
                    title : {
                        text: '执行结果分布图',
                        x:'left'
                    },
                    tooltip : {
                        trigger: 'item',
                        formatter: "{a} <br/>{b} : {c} ({d}%)"
                    },
                    legend: {
                        orient: 'vertical',
                        right: 'right',
                        data: ['成功','超时','错误']
                    },
                    series : [
                        {
                            name: '执行结果',
                            type: 'pie',
                            radius : '55%',
                            center: ['40%', '60%'],
                            data:[],
                            itemStyle: {
                                emphasis: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                }
                            }
                        }
                    ]
                }
            }
        },

        mounted(){
            this.init();
        },

        methods: {
            init() {
                this.queryForm = this.value
                this.$net.send({
                    server: this.$services.schService.jobInstMonitorRestController.getJobInstResultPie,
                    data: this.queryForm
                }).then((data) => {
                    let seriesData = []
                        seriesData.push(
                            {
                                value: data.result[0].jobInstDoneCount,
                                name: '成功'
                            },
                            {
                                value: data.result[0].jobInstErrorCount,
                                name: '错误'
                            },
                            {
                                value: data.result[0].jobInstTimeoutCount,
                                name: '超时'
                            },
                        )
                    this.option.series[0].data = seriesData

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

