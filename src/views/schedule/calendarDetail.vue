<style>
    @import "./component/simpleCalendar.css";
    .label-col{
        text-align: right;
        vertical-align: middle;
        float: left;
        font-size: 12px !important;
        color: rgb(73, 80, 96);
        line-height: 1;
        box-sizing: border-box;
        padding: 10px 12px 10px 0px;
    }
    .ivu-select-dropdown{
        width: auto;
    }
</style>

<template>
    <div class="calendarDetailCtnr">
        <Card>
            <Row>
                <Col span="4" class="label-col"><span>日历名称</span></Col>
                <Col span="8"><span class="keyValue">{{row.name}}</span></Col>
                <Col span="3" class="label-col"><span>日历编码</span></Col>
                <Col span="7"><span class="keyValue">{{row.code}}</span></Col>
            </Row>
            <Row class="margin-top-10">
                <Col span="4" class="label-col"><span>排除星期</span></Col>
                <Col span="18">
                <Button type="ghost" :class="{active:isActive1}" @click="weekendClick(1)">星期一</Button>
                <Button type="ghost" :class="{active:isActive2}" @click="weekendClick(2)">星期二</Button>
                <Button type="ghost" :class="{active:isActive3}" @click="weekendClick(3)">星期三</Button>
                <Button type="ghost" :class="{active:isActive4}" @click="weekendClick(4)">星期四</Button>
                <Button type="ghost" :class="{active:isActive5}" @click="weekendClick(5)">星期五</Button>
                <Button type="ghost" :class="{active:isActive6}" @click="weekendClick(6)">星期六</Button>
                <Button type="ghost" :class="{active:isActive7}" @click="weekendClick(7)">星期日</Button>
                </Col>
            </Row>
            <Row class="margin-top-10">
                <Col span="4" class="label-col"><span>排除时段</span></Col>
                <Col span="18"><Button type="primary" @click="addTime">添加 </Button></Col>
                <Col span="18" offset="4" style="margin-top: 5px;">
                <exclusion-period-table
                        refs="timeTable"
                        v-model="periodData"
                        :columns-list="column"
                        @on-save-time="saveTime"
                        @on-delete-time="deleteTime"
                >
                </exclusion-period-table>
                </Col>
            </Row>
            <Row class="margin-top-10">
                <Col span="4" class="label-col"><span>排除日期</span></Col>
                <Col span="18"><div id='container' ref="myCalendar"></div></Col>
            </Row>
            <Row style="text-align: center;" class="margin-top-10">
                <Button type="ghost" @click="btnBack">返回</Button>
            </Row>
        </Card>
    </div>
</template>
<script>
    import ExclusionPeriodTable from "./component/exclusionPeriodTable";

    export default {
        components: {
            ExclusionPeriodTable
        },
        data() {
            return{
                isActive1: false,isActive2: false,isActive3: false,isActive4: false,isActive5: false,isActive6: false,isActive7: false,
                periodData: [],
                column: [
                    { title: '排除时间段', align: 'center', key: 'period', editable: true},
                    { title: '操作', align: 'center', key: 'handler', width: 120, handler: ['delete']},
                ],
                row: {}
            }
        },
        mounted() {
            this.init();
        },
        methods: {
            init(){
                this.row = this.$route.query.row;
                /* 获取星期数据 */
                this.$net.send({
                    server: this.$services.schService.calendarRestController.week,
                    append: this.row.code
                }).then((data) => {
                    data.forEach(item => {
                        this.weekActiveSet(item);
                    })
                });

                /* 获取排除时段数据 */
                this.$net.send({
                    server: this.$services.schService.calendarRestController.time,
                    append: this.row.code
                }).then((data) => {
                    data.forEach(item => {
                        let start = (item.startHour.toString().length < 2 ? '0' + item.startHour : item.startHour) + ':' + (item.startMinute.toString().length < 2 ? '0' + item.startMinute : item.startMinute);
                        let end = (item.endHour.toString().length < 2 ? '0' + item.endHour : item.endHour) + ':' + (item.endMinute.toString().length < 2 ? '0' + item.endMinute : item.endMinute);
                        this.periodData.push({period: [start, end]});
                    })
                });

                /* 初始化日历控件 */
                let option = {
                    net: this.$net,
                    code: this.row.code,
                    days: this.$services.schService.calendarRestController.days,
                    include: this.$services.schService.calendarRestController.include,
                    exclude: this.$services.schService.calendarRestController.exclude,
                    msg: this.$Message
                };
                this.$calendar(this.$refs.myCalendar, option);
            },
            weekActiveSet(index){
                let isWeekly = '';
                switch (index)
                {
                    case 1:
                        this.isActive1 = !this.isActive1; isWeekly = this.isActive1; break;
                    case 2:
                        this.isActive2 = !this.isActive2; isWeekly = this.isActive2; break;
                    case 3:
                        this.isActive3 = !this.isActive3; isWeekly = this.isActive3; break;
                    case 4:
                        this.isActive4 = !this.isActive4; isWeekly = this.isActive4; break;
                    case 5:
                        this.isActive5 = !this.isActive5; isWeekly = this.isActive5; break;
                    case 6:
                        this.isActive6 = !this.isActive6; isWeekly = this.isActive6; break;
                    case 7:
                        this.isActive7 = !this.isActive7; isWeekly = this.isActive7; break;
                    default:
                        break;
                }
                return isWeekly;
            },
            weekendClick(index) {
                let isWeekly = this.weekActiveSet(index);
                this.$net.send({
                    server: this.$services.schService.calendarRestController.weekSet,
                    data: {code: this.row.code, index: index, isWeek: isWeekly},
                }).then((data) => {
                    if (data.success) {
                        this.$Message.success(data.msg);
                    } else {
                        this.$Message.error(data.msg);
                    }
                });
            },
            addTime(){
                this.periodData.push({
                    editting: true,
                    edittingCell: {period: true},
                    period: ''
                });
            },
            saveTime(time){
                this.$net.send({
                    server: this.$services.schService.calendarRestController.timeSet,
                    data: {code: this.row.code, startHour:time[0], startMinute:time[1], endHour:time[2], endMinute:time[3]},
                }).then((data) => {
                    if (data.success) {
                        this.$Message.success(data.msg);
                    } else {
                        this.$Message.error(data.msg);
                    }
                });
            },
            deleteTime(time, periodData){
                this.periodData = periodData;
                this.$net.send({
                    server: this.$services.schService.calendarRestController.timeRemove,
                    data: {code: this.row.code, startHour:time[0], startMinute:time[1], endHour:time[2], endMinute:time[3]},
                }).then((data) => {
                    if (data.success) {
                        this.$Message.success(data.msg);
                    } else {
                        this.$Message.error(data.msg);
                    }
                });
            },
            btnBack(){
                this.$router.go(-1);
                this.$store.commit('removeTag', 'calendarDetail');
                this.$store.commit('closePage', 'calendarDetail');
            }
        }
    }
</script>
