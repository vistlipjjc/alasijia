<template>
    <div style="width:100%;height:100%;" id="data_source_ring_con"></div>
</template>

<script>
import echarts from 'echarts';

export default {
    name: 'dataSourcePieRing',
    props: {
        data: Array
    },
    data () {
        return {
            color:['#64d572', '#ffd572','#abd5f2','#ab8df2','#f25e43','#2d8cf0']
        };
    },
    methods: {
        init(val) {
            var dataSourcePie = echarts.init(document.getElementById('data_source_ring_con'));
            const option = {
                tooltip: {
                    trigger: 'item',
                    formatter: "{a} <br/>{b}: {c} ({d}%)"
                },
                legend: {
                    orient: 'vertical',
                    x: 'left',
                    data: []
                },
                color:['#64d572', '#ffd572','#abd5f2','#ab8df2','#f25e43','#2d8cf0'],
                series: [
                    {
                        name:'交易风险分布',
                        type:'pie',
                        radius: ['50%', '70%'],
                        avoidLabelOverlap: false,
                        label: {
                            normal: {
                                show: false,
                                position: 'center'
                            },
                            emphasis: {
                                show: true,
                                textStyle: {
                                    fontSize: '30',
                                    fontWeight: 'bold'
                                }
                            }
                        },
                        labelLine: {
                            normal: {
                                show: false
                            }
                        },
                        data:[]
                    }
                ]
            };

            // this.color.map((value, key) => {
            //     let itemStyle ={normal: {color: value}};
            //     val[key]['itemStyle'] = itemStyle;
            // });

            option.legend.data = val.map(c => c.name);
            option.series[0].data = val;

            dataSourcePie.setOption(option);
            window.addEventListener('resize', function () {
                dataSourcePie.resize();
            });
        }
    },
    watch: {
        data(val){
            this.init(val);
        }
    }
};
</script>
