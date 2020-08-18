<template>
    <div style="width:100%;height:380px;margin-top: 10px;"  ref="chart">
    </div>
</template>

<script>
    import echarts from 'echarts';

    export default {
        name: "jobInstErrorTypePie",

        props: {
            value : Object,
            status: Boolean
        },

        data() {
            return {
                queryCondition: {
                    groupCode: '',      //任务类型
                    jobCodeList: [],     //任务编码
                    dateType: 'oneWeek',       //时间维度查询（oneWeek oneMonth threeMonth oneYear）
                    userDefineDate: 'D',     //用户自定义时间类型
                    startDate: '',      //用户自定义开始时间
                    endDate: '',        //用户自定义结束时间
                },

                option: {
                    title : {
                        text: '错误类型分布图',
                        x:'left'
                    },
                    tooltip : {
                        trigger: 'item',
                        formatter: "{a} <br/>{b} : {c} ({d}%)"
                    },
                    legend: {
                        orient: 'vertical',
                        right: 'right',
                        data: ['系统错误','网络','目标不可用']
                    },
                    series : [
                        {
                            name: '访问来源',
                            type: 'pie',
                            radius : '55%',
                            center: ['40%', '60%'],
                            data:[
                                {value:335, name:'系统错误'},
                                {value:310, name:'网络'},
                                {value:234, name:'目标不可用'},
                            ],
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
            let userFlow = echarts.init(this.$refs.chart);
            userFlow.setOption(this.option);
            userFlow.resize();
            window.addEventListener('resize', function () {
                userFlow.resize();
            });
        },
    }
</script>

