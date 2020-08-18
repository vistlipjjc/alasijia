<template>
    <div style="width:100%;height:100%;" id="rules_log_cart"></div>
</template>

<script>
    import echarts from 'echarts';

    var option = {
        title: {
            text: '访问量',
            left: 'center'
        },
        legend: {
            data: ['访问量']
        },
        toolbox: {
            show: true,
            feature: {
                dataView: {show: true, readOnly: false},
                magicType: {show: true, type: ['line', 'bar']},
                restore: {show: true},
                saveAsImage: {show: true}
            }
        },
        color: ['#3398DB'],
        tooltip: {
            trigger: 'axis',
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            }
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: [
            {
                type: 'category',
                name: '周',
                data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
                axisTick: {
                    alignWithLabel: true
                }
            }
        ],
        yAxis: [
            {
                type: 'value',
                name: '访问量'
            }
        ],
        series: [
            {
                name: '直接访问',
                type: 'bar',
                barWidth: '50%',
                data: [10, 52, 46, 57, 45, 34, 57]
            }
        ]
    };

    export default {
        name: 'rulesLogCart',
        mounted () {
            let userFlow = echarts.init(document.getElementById('rules_log_cart'));
            userFlow.setOption(option);

            window.addEventListener('resize', function () {
                userFlow.resize();
            });
        }
    };
</script>