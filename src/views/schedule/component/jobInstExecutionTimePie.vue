<template>
    <div style="width:100%;height:380px;margin-top: 10px;"  ref="chart">
    </div>
</template>

<script>
    import echarts from 'echarts';

    export default {
        name: "jobInstExecutionTimePie",

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
                        text: '执行时间分布图',
                        x:'left'
                    },
                    tooltip : {
                        trigger: 'item',
                        formatter: "{a} <br/>{b} : {c} ({d}%)"
                    },
                    legend: {
                        orient: 'vertical',
                        right: 'right',
                        data: ['少于1分钟','1-3分钟','3-5分钟','5分钟以上']
                    },
                    series : [
                        {
                            name: '执行时间',
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
                    server: this.$services.schService.jobInstMonitorRestController.getJobInstTimePie,
                    data: this.queryForm
                }).then((data) => {
                    let seriesData = []
                    seriesData.push(
                        {
                            value: data.result[0].jobInstLT60Count,
                            name: '少于1分钟'
                        },
                        {
                            value: data.result[0].jobInstLT180Count,
                            name: '1-3分钟'
                        },
                        {
                            value: data.result[0].jobInstLT300Count,
                            name: '3-5分钟'
                        },
                        {
                            value: data.result[0].jobInstGT300Count,
                            name: '5分钟以上'
                        }
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

