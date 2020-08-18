<template>
    <div style="width:100%;height:100%;" id="data_source_con"></div>
</template>

<script>
import echarts from 'echarts';

export default {
    name: 'dataSourcePie',
    props: {
        data: Array
    },
    data () {
        return {
            //
        };
    },
    methods: {
        init(val) {
            console.log(val);
            var dataSourcePie = echarts.init(document.getElementById('data_source_con'));
            const option = {
                tooltip: {
                    trigger: 'item',
                    formatter: '{a} <br/>{b} : {c} ({d}%)'
                },
                legend: {
                    orient: 'vertical',
                    left: 'right',
                    data: []
                },
                color:['#64d572', '#ffd572','#abd5f2','#ab8df2','#f25e43','#2d8cf0'],
                series: [
                    {
                        name: '交易渠道占比',
                        type: 'pie',
                        radius: '66%',
                        // center: ['50%', '70%'],
                        data: [],
                        itemStyle: {
                            emphasis: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
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
