<template>
    <div style="width:100%;height:100%;" :id="id"></div>
</template>

<script>
import echarts from 'echarts';
export default {
    name: 'visiteVolume',
    props: {
        data: Array,
        id: String
    },
    data () {
        return {
            //
        };
    },
    methods: {
        init(val) {
            let visiteVolume = echarts.init(document.getElementById(this.id));
            // let xAxisData = [];
            // let data1 = [];
            // let data2 = [];
            // for (let i = 0; i < 20; i++) {
            //     xAxisData.push('类目' + i);
            //     data1.push((Math.sin(i / 5) * (i / 5 - 10) + i / 6) * 5);
            //     data2.push((Math.cos(i / 5) * (i / 5 - 10) + i / 6) * 5);
            // }

            const option = {
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    }
                },
                grid: {
                    top: 0,
                    left: '2%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: {
                    type: 'value',
                    boundaryGap: [0, 0.01]
                },
                yAxis: {
                    type: 'category',
                    data: [],
                    nameTextStyle: {
                        color: '#c3c3c3'
                    }
                },
                color:['#2d8cf0', '#ffd572','#abd5f2','#ab8df2','#f25e43','#2d8cf0','#64d572'],
                series: [
                    {
                        name: '访问量',
                        type: 'bar',
                        data: []
                    }
                ]
            };
            option.yAxis.data = val.map(c => c.name);
            option.series[0].data = val;

            visiteVolume.setOption(option);

            window.addEventListener('resize', function () {
                visiteVolume.resize();
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
