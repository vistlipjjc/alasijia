<template>
    <Card class="box">
        <Row style="margin-top: -10px; margin-right: -5px;margin-left: -5px">
            <Col span="4">
                {{nodeName}}
            </Col>
            <Col span="2" offset="12">
                <Tooltip placement="top" content="启动服务端">
                    <Button   type="success" @click.native="startClick" style="width: 20px;height: 100%;vertical-align: middle;line-height: 100%" :disabled="startButtonStatus">
                    <icon type="play" style="margin-left: -3px"></icon>
                    </Button>
                </Tooltip>
            </Col>
            <Col span="2" offset="1">
                <Tooltip placement="top" content="暂停服务端">
                    <Button type="primary" @click.native="pauseClick" style="width: 20px;height: 100%;vertical-align: middle;line-height: 100%" :disabled="pauseButtonStatus">
                    <icon type="pause" style="margin-left: -3px"></icon>
                    </Button>
                </Tooltip>
            </Col>
            <Col span="2" offset="1">
                <Tooltip placement="top" content="停止服务端">
                    <Button  type="error" @click.native="shutdownClick" style="width: 20px;height: 100%;vertical-align: middle;line-height: 100%" :disabled="shutdownButtonStatus">
                    <icon type="stop" style="margin-left: -4px"></icon>
                    </Button>
                </Tooltip>
            </Col>
        </Row>
        <div class="line-gray" style="margin-top: 7px;margin-left: -15px;margin-right: -15px"></div>
        <div style="width:100%;height:200px"  ref="chart">

        </div>
    </Card>
</template>

<script>

    import echarts from 'echarts';

    export default {
        name: "serverOilMap",

        props: {
            serviceId: String,
            instanceId: String,
        },

        data() {
            return {
                //三个按钮的状态是否可点击
                startButtonStatus: false,

                pauseButtonStatus: false,

                shutdownButtonStatus: false,

                serviceInfo:{
                    state: '',
                    jobCount: '',
                    poolSize: '',
                },

                nodeName: '',

                option :{
                    tooltip: { //弹窗组件
                        formatter: "{a} <br/>{b} : {c}"
                    },
                    series: [{
                        name: '当前服务端',
                        type: 'gauge',
                        startAngle: 180,
                        endAngle: 0,
                        center : ['50%', '80%'],
                        detail: {formatter:'{value}'},
                        min: '0',
                        max: '200',
                        radius: '140%',
                        data: [{value: '50', name: '任务数'}]
                    }]
                }
            }
        },

        created(){
            //20秒刷新一次
            setInterval(this.init,20000)
        },

        mounted() {
            this.init();
        },

        methods: {

            init() {
                this.nodeName = this.subStringInstanceId(this.instanceId);
                this.$net.send({
                    server: this.$services.schService.scheduleRestController.getServiceInfo,
                    append: this.instanceId
                }).then((data) => {
                    this.serviceInfo = data.data
                    this.option.series[0].max = this.serviceInfo.poolSize
                    this.option.series[0].data[0].value = this.serviceInfo.jobCount
                    this.option.series[0].data[0].name = '任务数'

                    this.loadButtonStatus(this.serviceInfo.state);
                    this.loadChart();
                });
            },

            //加载echarts图表
            loadChart() {
                let userFlow = echarts.init(this.$refs.chart);
                userFlow.setOption(this.option);
                userFlow.resize();
                window.addEventListener('resize', function () {
                    userFlow.resize();
                });
            },

            loadButtonStatus(stateValue) {
                if(stateValue == 'ready') {    //状态为准备的时候能点启动按钮
                    this.startButtonStatus = false
                    this.pauseButtonStatus = true
                    this.shutdownButtonStatus = true
                }else  if(stateValue == 'running') {   //状态为运行状态的时候能点暂停、停止
                    this.startButtonStatus = true
                    this.pauseButtonStatus = false
                    this.shutdownButtonStatus = false
                }else  if(stateValue == 'standby') {   //状态为暂停状态的时候能点启动、停止
                    this.startButtonStatus = false
                    this.pauseButtonStatus = true
                    this.shutdownButtonStatus = false
                }else  if(stateValue == 'shutdown') {   //状态为停止状态的时候什么都不能点
                    this.startButtonStatus = true
                    this.pauseButtonStatus = true
                    this.shutdownButtonStatus = true
                }
            },

            //截取instanceId为node显示的名称
            subStringInstanceId(instanceId) {
                return  'Node_' + instanceId.substr(0,6)
            },

            //操作按钮是否成功提示消息
            successMessage (message) {
                this.$Message.success(message);
            },
            errorMessage (message) {
                this.$Message.error(message);
            },

            //开始服务
            startClick() {
                this.$net.send({
                    server: this.$services.schService.scheduleRestController.startServer,
                    append: this.instanceId
                }).then((data) => {
                    console.log('启动')
                    if(data.success) {
                        let state = data.status.state
                        this.loadButtonStatus(state)
                        this.successMessage(this.serviceId + '启动成功')
                    }else {
                        this.errorMessage(this.serviceId + '启动失败')
                    }
                });
            },

            //暂停服务
            pauseClick() {
                this.$net.send({
                    server: this.$services.schService.scheduleRestController.pauseServer,
                    append: this.instanceId
                }).then((data) => {
                    console.log('暂停')
                    if(data.success) {
                        let state = data.status.state
                        this.loadButtonStatus(state)
                        this.successMessage(this.serviceId + '暂停成功')
                    }else {
                        this.errorMessage(this.serviceId + '暂停失败')
                    }
                });
            },

            //停止服务
            shutdownClick() {
                this.$net.send({
                    server: this.$services.schService.scheduleRestController.shutdownServer,
                    append: this.instanceId
                }).then((data) => {
                    console.log('停止')
                    if(data.success) {
                        let state = data.status.state
                        this.loadButtonStatus(state)
                        this.successMessage(this.serviceId + '停止成功')
                    }else {
                        this.errorMessage(this.serviceId + '停止失败')
                    }
                });
            },
        }
    }
</script>

<style scoped>
    .box {
        margin-left: 2%;
        margin-right: 2%;
    }
</style>
