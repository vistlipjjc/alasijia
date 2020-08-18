<template>
    <div style="width:100%;height:300px;" id="job_log_pie_con"></div>
</template>

<script>
import echarts from 'echarts';
export default {
    name: 'jobInstPie',
    mounted () {
        const option = {
            title : {
                text: '调度状态统计',
                subtext: '2018-07-16',
                x:'center'
            },
            tooltip : {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
                orient: 'vertical',
                left: 'left',
                data: ['执行中','执行完毕','执行失败','执行超时']
            },
            color: ['#ffaaa5', '#ffd3b6', '#fdffab', '#a8e6cf'],
            series : [
                {
                    name: '调度详情',
                    type: 'pie',
                    radius : '55%',
                    center: ['50%', '60%'],
                    data:[
                        {value:335, name:'执行中'},
                        {value:310, name:'执行完毕'},
                        {value:234, name:'执行失败'},
                        {value:135, name:'执行超时'},
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
        };
        const serviceRequestCharts = echarts.init(document.getElementById('job_log_pie_con'));
        serviceRequestCharts.setOption(option);

        window.addEventListener('resize', function () {
            serviceRequestCharts.resize();
        });
    }
};
</script>