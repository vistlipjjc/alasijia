<style>
    .jCronCtnr{
        border: 1px solid #d7dde4;
        border-radius: 4px;
        padding: 10px;
    }
    .wildcard{
        border-bottom: 1px solid #d7dde4;
        padding-bottom: 2px;
    }
    fieldset{
        border-color: #d7dde4;
        border-radius: 4px;
        padding: 5px;
    }
    legend{
        margin-left: 10px;
    }
    .exprTitle{
        text-align: center;
    }
    .exprInput .ivu-input-wrapper-small{
        padding-right: 7px !important;
    }
</style>
<template>
    <div class="jCronCtnr">
        <Tabs value="0" size="small" :animated="false" style="height: 320px;" @on-click="tabChange">
            <TabPane label="秒" name="0">
                <Row>
                    <RadioGroup v-model="secondRadio" vertical @on-change="secondChange">
                        <Radio label="second1">
                            <span>每秒。允许的通配符: </span><span class="wildcard">, - * /</span>
                        </Radio>
                        <Radio label="second2">
                            <span>周期性执行。 从</span><InputNumber v-model="second2Cycle1" size="small" :max="58" :min="1" @on-change="cronUpdate('secondRadio','second2','second2Cycle1',$event)"/> - <InputNumber v-model="second2Cycle2" size="small" :max="59" :min="2" @on-change="cronUpdate('secondRadio','second2','second2Cycle2',$event)"/><span> 秒之间的每一秒执行一次</span>
                        </Radio>
                        <Radio label="second3">
                            <span>执行步长。从</span><InputNumber v-model="second3StartOn" size="small" :max="58" :min="0" @on-change="cronUpdate('secondRadio','second3','second3StartOn',$event)"/><span> 秒开始，每隔 </span><InputNumber v-model="second3Cycle" size="small" :max="59" :min="1" @on-change="cronUpdate('secondRadio','second3','second3Cycle',$event)"/><span> 秒执行一次</span>
                        </Radio>
                        <Radio label="second4">
                            <span>指定秒执行。</span>
                        </Radio>
                    </RadioGroup>
                    <CheckboxGroup v-model="second4Value" style="margin-left: 18px;" @on-change="cronCheckUpdate('secondRadio','second4','second4Value',$event)">
                        <Checkbox v-for="item in second4List" :label="item" :key="item">{{item}}</Checkbox>
                    </CheckboxGroup>
                </Row>
            </TabPane>
            <TabPane label="分" name="1">
                <Row>
                    <RadioGroup v-model="minuteRadio" vertical @on-change="minuteChange">
                        <Radio label="minute1">
                            <span>每分钟。允许的通配符: </span><span class="wildcard">, - * /</span>
                        </Radio>
                        <Radio label="minute2">
                            <span>周期性执行。从</span><InputNumber v-model="minute2Cycle1" size="small" :max="58" :min="1" @on-change="cronUpdate('minuteRadio','minute2','minute2Cycle1',$event)"/> - <InputNumber v-model="minute2Cycle2" size="small" :max="59" :min="2" @on-change="cronUpdate('minuteRadio','minute2','minute2Cycle2',$event)"/><span> 分钟之间的每分钟执行一次</span>
                        </Radio>
                        <Radio label="minute3">
                            <span>执行步长。从</span><InputNumber v-model="minute3StartOn" size="small" :max="58" :min="0" @on-change="cronUpdate('minuteRadio','minute3','minute3StartOn',$event)"/><span> 分钟开始，每隔 </span><InputNumber v-model="minute3Cycle" size="small" :max="59" :min="1" @on-change="cronUpdate('minuteRadio','minute3','minute3Cycle',$event)"/><span> 分钟执行一次</span>
                        </Radio>
                        <Radio label="minute4">
                            <span>指定分钟执行。</span>
                        </Radio>
                    </RadioGroup>
                    <CheckboxGroup v-model="minute4Value" style="margin-left: 18px;" @on-change="cronCheckUpdate('minuteRadio','minute4','minute4Value',$event)">
                        <Checkbox v-for="item in minute4List" :label="item" :key="item">{{item}}</Checkbox>
                    </CheckboxGroup>
                </Row>
            </TabPane>
            <TabPane label="时" name="2">
                <Row>
                    <RadioGroup v-model="hourRadio" vertical @on-change="hourChange">
                        <Radio label="hour1">
                            <span>每小时。允许的通配符: </span><span class="wildcard">, - * /</span>
                        </Radio>
                        <Radio label="hour2">
                            <span>周期性执行。从</span><InputNumber v-model="hour2Cycle1" size="small" :max="23" :min="0" @on-change="cronUpdate('hourRadio','hour2','hour2Cycle1',$event)"/> - <InputNumber v-model="hour2Cycle2" size="small" :max="23" :min="2" @on-change="cronUpdate('hourRadio','hour2','hour2Cycle2',$event)"/><span> 小时之间，每小时执行一次</span>
                        </Radio>
                        <Radio label="hour3">
                            <span>执行步长。从</span><InputNumber v-model="hour3StartOn" size="small" :max="23" :min="0" @on-change="cronUpdate('hourRadio','hour3','hour3StartOn',$event)"/><span> 点开始，每隔 </span><InputNumber v-model="hour3Cycle" size="small" :max="23" :min="1" @on-change="cronUpdate('hourRadio','hour3','hour3Cycle',$event)"/><span> 小时执行一次</span>
                        </Radio>
                        <Radio label="hour4">
                            <span>指定小时执行。</span>
                        </Radio>
                    </RadioGroup>
                    <CheckboxGroup v-model="hour4Value" style="margin-left: 18px;" @on-change="cronCheckUpdate('hourRadio','hour4','hour4Value',$event)">
                        <Checkbox v-for="item in hour4List" :label="item" :key="item">{{item}}</Checkbox>
                    </CheckboxGroup>
                </Row>
            </TabPane>
            <TabPane label="日" name="3">
                <Row>
                    <RadioGroup v-model="dayRadio" vertical @on-change="dayChange">
                        <Radio label="day1">
                            <span>每天。允许的通配符: </span><span class="wildcard">, - * / L W</span>
                        </Radio>
                        <Radio label="day5">
                            <span>不指定</span>
                        </Radio>
                        <Radio label="day2">
                            <span>周期性执行。从</span><InputNumber v-model="day2Cycle1" size="small" :max="31" :min="1" @on-change="cronUpdate('dayRadio','day2','day2Cycle1',$event)"/> - <InputNumber v-model="day2Cycle2" size="small" :max="31" :min="2" @on-change="cronUpdate('dayRadio','day2','day2Cycle2',$event)"/><span> 号之间，每天执行一次</span>
                        </Radio>
                        <Radio label="day3">
                            <span>执行步长。从</span><InputNumber v-model="day3StartOn" size="small" :max="31" :min="1" @on-change="cronUpdate('dayRadio','day3','day3StartOn',$event)"/><span> 号开始，每隔 </span><InputNumber v-model="day3Cycle" size="small" :max="31" :min="1" @on-change="cronUpdate('dayRadio','day3','day3Cycle',$event)"/><span> 天执行一次</span>
                        </Radio>
                        <Radio label="day6">
                            <span>每月 </span><InputNumber v-model="day6No" size="small" :max="31" :min="1" @on-change="cronUpdate('dayRadio','day6','day6No',$event)"/><span>号最近的那个工作日执行</span>
                        </Radio>
                        <Radio label="day7">
                            <span>本月最后一天</span>
                        </Radio>
                        <Radio label="day4">
                            <span>指定日期执行。</span>
                        </Radio>
                    </RadioGroup>
                    <CheckboxGroup v-model="day4Value" style="margin-left: 18px;" @on-change="cronCheckUpdate('dayRadio','day4','day4Value',$event)">
                        <Checkbox v-for="item in day4List" :label="item" :key="item">{{item}}</Checkbox>
                    </CheckboxGroup>
                </Row>
            </TabPane>
            <TabPane label="月" name="4">
                <Row>
                    <RadioGroup v-model="monthRadio" vertical @on-change="monthChange">
                        <Radio label="month1">
                            <span>每月。允许的通配符: </span><span class="wildcard">, - * /</span>
                        </Radio>
                        <Radio label="month5">
                            <span>不指定</span>
                        </Radio>
                        <Radio label="month2">
                            <span>周期性执行。从</span><InputNumber v-model="month2Cycle1" size="small" :max="7" :min="1" @on-change="cronUpdate('monthRadio','month2','month2Cycle1',$event)"/> - <InputNumber v-model="month2Cycle2" size="small" :max="7" :min="2" @on-change="cronUpdate('monthRadio','month2','month2Cycle2',$event)"/><span> 月</span>
                        </Radio>
                        <Radio label="month3">
                            <span>从</span><InputNumber v-model="month3StartOn" size="small" :max="4" :min="1" @on-change="cronUpdate('monthRadio','month3','month3StartOn',$event)"/><span> 月开始，每 </span><InputNumber v-model="month3Cycle" size="small" :max="7" :min="1" @on-change="cronUpdate('monthRadio','month3','month3Cycle',$event)"/><span> 月执行一次</span>
                        </Radio>
                        <Radio label="month4">
                            <span>指定月执行。</span>
                        </Radio>
                    </RadioGroup>
                    <CheckboxGroup v-model="month4Value" style="margin-left: 18px;" @on-change="cronCheckUpdate('monthRadio','month4','monthValue',$event)">
                        <Checkbox v-for="item in month4List" :label="item" :key="item">{{item}}</Checkbox>
                    </CheckboxGroup>
                </Row>
            </TabPane>
            <TabPane label="周" name="5">
                <Row>
                    <RadioGroup v-model="weekRadio" vertical @on-change="weekChange">
                        <label class="ivu-radio-wrapper ivu-radio-group-item"><span style="font-style: italic; color: #657180b5;">注：1 星期天、2 星期一、3 星期二、4 星期三、5 星期四、6 星期五、7 星期六</span></label>
                        <Radio label="week1">
                            <span>每周。允许的通配符: </span><span class="wildcard">, - * / L #</span>
                        </Radio>
                        <Radio label="week5">
                            <span>不指定</span>
                        </Radio>
                        <Radio label="week2">
                            <span>周期性执行。从星期</span><InputNumber v-model="week2Cycle1" size="small" :max="7" :min="1" @on-change="cronUpdate('weekRadio','week2','week2Cycle1',$event)"/> - <InputNumber v-model="week2Cycle2" size="small" :max="7" :min="2" @on-change="cronUpdate('weekRadio','week2','week2Cycle2',$event)"/>
                        </Radio>
                        <Radio label="week3">
                            <span>第 </span><InputNumber v-model="week3StartOn" size="small" :max="4" :min="1" @on-change="cronUpdate('weekRadio','week3','week3StartOn',$event)"/><span> 周的星期 </span><InputNumber v-model="week3Cycle" size="small" :max="7" :min="1" @on-change="cronUpdate('weekRadio','week3','week3Cycle',$event)"/>
                        </Radio>
                        <Radio label="week6">
                            <span>本月最后一个星期 </span><InputNumber v-model="week6No" size="small" :max="7" :min="1" @on-change="cronUpdate('weekRadio','week6','week6No',$event)"/>
                        </Radio>
                        <Radio label="week4">
                            <span>指定星期执行。</span>
                        </Radio>
                    </RadioGroup>
                    <CheckboxGroup v-model="week4Value" style="margin-left: 18px;" @on-change="cronCheckUpdate('weekRadio','week4','week4Value',$event)">
                        <Checkbox v-for="item in week4List" :label="item" :key="item">{{item}}</Checkbox>
                    </CheckboxGroup>
                </Row>
            </TabPane>
            <TabPane label="年" name="6" disabled>
                <Row>
                    <RadioGroup v-model="yearRadio" vertical @on-change="yearChange">
                        <Radio label="year1">
                            <span>不指定。允许的通配符: </span><span class="wildcard">, - * /</span>
                        </Radio>
                        <Radio label="year2">
                            <span>每年</span>
                        </Radio>
                        <Radio label="year3">
                            <span>周期性执行。从</span><InputNumber v-model="year3Cycle1" size="small" :max="2020" :min="2018" @on-change="cronUpdate('yearRadio','year3','year3Cycle1',$event)"/> -
                            <InputNumber v-model="year3Cycle2" size="small" :max="2021" :min="2019" @on-change="cronUpdate('yearRadio','year3','year3Cycle2',$event)"/>
                        </Radio>
                    </RadioGroup>
                </Row>
            </TabPane>

        </Tabs>
        <div class="margin-top-10" style="border-bottom: 1px solid rgb(215, 221, 228);"></div>
        <Row :gutter="2">
            <Col span="3" offset="3" class="exprTitle"><span>秒</span></Col>
            <Col span="3" class="exprTitle"><span>分</span></Col>
            <Col span="3" class="exprTitle"><span>时</span></Col>
            <Col span="3" class="exprTitle"><span>天</span></Col>
            <Col span="3" class="exprTitle"><span>月</span></Col>
            <Col span="3" class="exprTitle"><span>周</span></Col>
            <!--<Col span="3" class="exprTitle"><span>年</span></Col>-->
        </Row>
        <Row :gutter="2">
            <Col span="3"><span>表达式字段：</span></Col>
            <Col span="3"><Input :readonly="true" size="small" class="exprInput" v-model="v_second"/></Col>
            <Col span="3"><Input :readonly="true" size="small" class="exprInput" v-model="v_minute"/></Col>
            <Col span="3"><Input :readonly="true" size="small" class="exprInput" v-model="v_hour"/></Col>
            <Col span="3"><Input :readonly="true" size="small" class="exprInput" v-model="v_day"/></Col>
            <Col span="3"><Input :readonly="true" size="small" class="exprInput" v-model="v_month"/></Col>
            <Col span="3"><Input :readonly="true" size="small" class="exprInput" v-model="v_week"/></Col>
            <!--<Col span="3"><Input :readonly="true" size="small" class="exprInput" v-model="v_year"/></Col>-->
        </Row>
        <Row>
            <Col span="3"><span>Cron 值：</span></Col>
            <Col span="18" :class="{'ivu-form-item-error': error}"><Input v-model="cronExpr" size="small"/></Col>
            <Col span="3"><Button type="primary" size="small" @click="revertCronExpr">反解析到UI</Button></Col>
            <Col span="20" offset="3" v-if="error"><span style="color: #ed3f14;">cron 表达式错误</span></Col>
            <Col span="24">
                <span>最近 7 次运行时间：</span><br/>
                <p style="line-height: 15px; margin-bottom: 5px;text-indent: 1rem" v-for="item in runTimeArray" >{{item}}</p>
            </Col>
        </Row>
        <!--<fieldset>
            <legend>表达式</legend>
            <Row :gutter="2">
                <Col span="3" offset="3" class="exprTitle"><span>秒</span></Col>
                <Col span="3" class="exprTitle"><span>分</span></Col>
                <Col span="3" class="exprTitle"><span>时</span></Col>
                <Col span="3" class="exprTitle"><span>天</span></Col>
                <Col span="3" class="exprTitle"><span>月</span></Col>
                <Col span="3" class="exprTitle"><span>周</span></Col>
                <Col span="3" class="exprTitle"><span>年</span></Col>
                <Col span="3"><span>表达式字段：</span></Col>
                <Col span="3"><Input :readonly="true" size="small" class="exprInput" v-model="v_second"/></Col>
                <Col span="3"><Input :readonly="true" size="small" class="exprInput" v-model="v_minute"/></Col>
                <Col span="3"><Input :readonly="true" size="small" class="exprInput" v-model="v_hour"/></Col>
                <Col span="3"><Input :readonly="true" size="small" class="exprInput" v-model="v_day"/></Col>
                <Col span="3"><Input :readonly="true" size="small" class="exprInput" v-model="v_month"/></Col>
                <Col span="3"><Input :readonly="true" size="small" class="exprInput" v-model="v_week"/></Col>
                <Col span="3"><Input :readonly="true" size="small" class="exprInput" v-model="v_year"/></Col>
                <Col span="3"><span>Cron 表达式：</span></Col>
                <Col span="18"><Input v-model="cronExpr" size="small"/></Col>
                <Col span="3"><Button type="primary" size="small" @click="revertCronExpr">反解析到UI</Button></Col>
                &lt;!&ndash;<Col span="24"><span>最近 5 次运行时间：</span></Col>&ndash;&gt;
            </Row>
        </fieldset>-->
    </div>
</template>
<script>

export default {
    props:{
        value: String //表达式值
    },
    data() {
        return {
            currentTabIndex: 0, //当前tab页
            secondRadio: 'second1',
            second2Cycle1: 1,
            second2Cycle2: 2,
            second3StartOn: 0,
            second3Cycle: 1,
            second4Value: [],
            second4List: [],

            minuteRadio: 'minute1',
            minute2Cycle1: 1,
            minute2Cycle2: 2,
            minute3StartOn: 0,
            minute3Cycle: 1,
            minute4Value: [],
            minute4List: [],

            hourRadio: 'hour1',
            hour2Cycle1: 0,
            hour2Cycle2: 2,
            hour3StartOn: 0,
            hour3Cycle: 1,
            hour4Value: [],
            hour4List: [],

            dayRadio: 'day1',
            day2Cycle1: 1,
            day2Cycle2: 2,
            day3StartOn: 1,
            day3Cycle: 1,
            day4Value: [],
            day4List: [],
            day6No:1,

            monthRadio: 'month1',
            month2Cycle1: 1,
            month2Cycle2: 2,
            month3StartOn: 1,
            month3Cycle: 1,
            month4Value: [],
            month4List: [],

            weekRadio: 'week1',
            week2Cycle1: 1,
            week2Cycle2: 2,
            week3StartOn: 1,
            week3Cycle: 1,
            week4Value: [],
            week4List: [],
            week6No:1,

            yearRadio: 'year1',
            year3Cycle1: 2018,
            year3Cycle2: 2019,

            //表达式值
            v_second: '*',
            v_minute: '*',
            v_hour: '*',
            v_day: '*',
            v_week: '?',
            v_month: '*',
            v_year: ' ',
            cronExpr: '* * * * * ?  ',
            cronExprArray: ['*','*','*','*','*','?',' '],
            runTimeArray: [],
            //验证失败的样式
            error: false
        }
    },
    mounted() {
        this.init();
    },
    methods: {
        init()
        {
            if(this.value) {
                this.cronExpr = this.value;
                this.cronExprArray = this.cronExpr.split(' ');
             }
            else
            {
                this.$emit('getValue', this.cronExpr);
            }
            this.parserCron1();
            this.revertCronExpr();
            this.second4List = this.checkList(0, 59);
            this.minute4List = this.checkList(0, 59);
            this.hour4List = this.checkList(0, 23);
            this.day4List = this.checkList(1, 31);
            this.week4List = this.checkList(1, 7);
            this.month4List = this.checkList(1, 12);
        },
        checkList(start, range){ //构建指定时间数组
            let list = [];
            for (let i = start; i <= range; i++)
            {
                list.push(i);
            }
            return list;
        },
        tabChange(index){
            this.currentTabIndex = index
        },
        setExprRelevance(){ //调整 cron 表达式每部分相关联的值

            //后一项不为* 那么前一项肯定不为为*。
            let isChangeFlag = false;

            //当前选中项之前的如果为*，则都设置成0
            if (this.cronExprArray[this.currentTabIndex] != '*')
            {
                for(let i = Number(this.currentTabIndex); i > 0; i--)
                {
                    if (this.cronExprArray[i] != '*' && this.cronExprArray[i-1] == '*')
                    {
                        if(i == 4 || i == 6){
                            this.cronExprArray[i-1] = '1';
                        }else{
                            this.cronExprArray[i-1] = '0';
                        }
                        isChangeFlag = true;
                    }
                }
            }
            //当前选中项为*，则之后都设置成*或？
            else if (this.cronExprArray[this.currentTabIndex] == '*')
            {
                for(let i = Number(this.currentTabIndex) + 1; i < 6; i++)
                {
                    if (i == 5){
                        this.cronExprArray[i] = '?'; //周通配符设置为 ？
                        isChangeFlag = true;
                    }else{
                        this.cronExprArray[i] = '*';
                        isChangeFlag = true;
                    }
                }
            }
            if(isChangeFlag) //反解析到UI
            {
                this.cronExpr = this.cronExprArray.join(' ');
                this.revertCronExpr();
            }
        },
        secondChange(name){ //秒
            switch (name){
                case 'second1':
                    this.v_second = '*';
                    break;
                case 'second2':
                    this.v_second = this.second2Cycle1 + '-' + this.second2Cycle2;
                    break;
                case 'second3':
                    this.v_second = this.second3StartOn + '/' + this.second3Cycle;
                    break;
                case 'second4':
                    if(this.second4Value.length == 0)
                    {
                        this.second4Value.push(0); //默认选中第一秒 0
                        this.v_second = this.second4Value.join(',');
                    }
                    else if (this.second4Value.length > 0 && this.second4Value.length < 59)
                    {
                        this.v_second = this.second4Value.join(',');
                    }
                    else if(this.second4Value.length == 59)
                    {
                        this.v_second = '*'; //全选表示每秒，则选中秒的第一个radio
                    }
                    break;
                default:
                    break;
            }
            this.cronExprChange(0, this.v_second);
        },
        minuteChange(name) { //分钟
            switch (name){
                case 'minute1':
                    this.v_minute = '*';
                    break;
                case 'minute2':
                    this.v_minute = this.minute2Cycle1 + '-' + this.minute2Cycle2;
                    // this.secondChange('second4');
                    break;
                case 'minute3':
                    this.v_minute = this.minute3StartOn + '/' + this.minute3Cycle;
                    break;
                case 'minute4':
                    if(this.minute4Value.length == 0)
                    {
                        this.minute4Value.push(0); //默认选中第一分钟 0
                        this.v_minute = this.minute4Value.join(',');
                    }
                    else if (this.minute4Value.length > 0 && this.minute4Value.length < 59)
                    {
                        this.v_minute = this.minute4Value.join(',');
                    }
                    else if(this.minute4Value.length == 59)
                    {
                        this.v_minute = '*'; //全选表示每分钟，则选中分的第一个radio
                    }
                    break;
                default:
                    break;
            }
            this.cronExprChange(1, this.v_minute);
        },
        hourChange(name) { //小时
            switch (name){
                case 'hour1':
                    this.v_hour = '*';
                    break;
                case 'hour2':
                    this.v_hour = this.hour2Cycle1 + '-' + this.hour2Cycle2;
                    break;
                case 'hour3':
                    this.v_hour = this.hour3StartOn + '/' + this.hour3Cycle;
                    break;
                case 'hour4':
                    if(this.hour4Value.length == 0)
                    {
                        this.hour4Value.push(0); //默认选中0小时
                        this.v_hour = this.hour4Value.join(',');
                    }
                    else if (this.hour4Value.length > 0 && this.hour4Value.length < 23)
                    {
                        this.v_hour = this.hour4Value.join(',');
                    }
                    else if(this.hour4Value.length == 23)
                    {
                        this.v_hour = '*'; //全选表示每小时，则选中时的第一个radio
                    }
                    break;
                default:
                    break;
            }
            this.cronExprChange(2, this.v_hour);
        },
        dayChange(name) { //天
            switch (name){
                case 'day1':
                    this.v_day = '*';
                    break;
                case 'day2':
                    this.v_day = this.day2Cycle1 + '-' + this.day2Cycle2;
                    break;
                case 'day3':
                    this.v_day = this.day3StartOn + '/' + this.day3Cycle;
                    break;
                case 'day4':
                    if(this.day4Value.length == 0)
                    {
                        this.day4Value.push(1); //默认选中1号
                        this.v_day = this.day4Value.join(',');
                    }
                    else if (this.day4Value.length > 0 && this.day4Value.length < 30)
                    {
                        this.v_day = this.day4Value.join(',');
                    }
                    else if(this.day4Value.length == 30)
                    {
                        this.v_day = '*'; //全选表示每小时，则选中时的第一个radio
                    }
                    break;
                case 'day5':
                    this.v_day = '?';
                    break;
                case 'day6':
                    this.v_day = this.day6No + 'W';
                    break;
                case 'day7':
                    this.v_day = 'L';
                break;
                default:
                    break;
            }
            this.cronExprChange(3, this.v_day);
        },
        weekChange(name) { //周
            switch (name){
                case 'week1':
                    this.v_week = '*';
                    break;
                case 'week2':
                    this.v_week = this.week2Cycle1 + '/' + this.week2Cycle2;
                    break;
                case 'week3':
                    this.v_week = this.week3StartOn + '#' + this.week3Cycle;
                    break;
                case 'week4':
                    if(this.week4Value.length == 0)
                    {
                        this.week4Value.push(1); //默认选中周一
                        this.v_week = this.week4Value.join(',');
                    }
                    else if (this.week4Value.length > 0 && this.week4Value.length < 6)
                    {
                        this.v_week = this.week4Value.join(',');
                    }
                    else if(this.week4Value.length == 6)
                    {
                        this.v_week = '*'; //全选表示每小时，则选中时的第一个radio
                    }
                    break;
                case 'week5':
                    this.v_week = '?';
                    break;
                case 'week6':
                    this.v_week = this.week6No + 'L';
                    break;
                default:
                    break;
            }
            this.cronExprChange(5, this.v_week);
        },
        monthChange(name){
            switch (name){
                case 'month1':
                    this.v_month = '*';
                    break;
                case 'month2':
                    this.v_month = this.month2Cycle1 + '-' + this.month2Cycle2;
                    break;
                case 'month3':
                    this.v_month = this.month3StartOn + '/' + this.month3Cycle;
                    break;
                case 'month4':
                    if(this.month4Value.length == 0)
                    {
                        this.month4Value.push(1); //默认选中1月份
                        this.v_month = this.month4Value.join(',');
                    }
                    else if (this.month4Value.length > 0 && this.month4Value.length < 11)
                    {
                        this.v_month = this.month4Value.join(',');
                    }
                    else if(this.month4Value.length == 11)
                    {
                        this.v_month = '*';
                    }
                    break;
                case 'month5':
                    this.v_month = '?';
                    break;
                default:
                    break;
            }
            this.cronExprChange(4, this.v_month);
        },
        yearChange(name){
            switch (name){
                case 'year1':
                    this.v_year = ' ';
                    break;
                case 'year2':
                    this.v_year = '*';
                    break;
                case 'year3':
                    this.v_year = this.year3Cycle1 + '-' + this.year3Cycle2;
                    break;
                default:
                    break;
            }
            this.cronExprChange(6, this.v_year);
        },
        cronExprChange(index, value){
            this.cronExprArray[index] = value;
            this.cronExpr = this.cronExprArray.join(' ');
            this.setExprRelevance(); //设置cron表达式每部分之间的相关型值的改变
            this.$emit('getValue', this.cronExpr);
        },
        revertCronExpr(){
            if (this.cronExpr == '') this.$Message.error({duration: 5, content: '表达式错误！'});
            else
            {
                let temp = this.cronExpr.split(' ');

                //秒
                let second = temp[0];
                this.v_second = second;
                if(second == '*'){
                    this.secondRadio = 'second1';
                }else if(second.split('-').length == 2){
                    this.secondRadio = 'second2';
                    let tmp = second.split('-');
                    this.second2Cycle1 = Number(tmp[0]);
                    this.second2Cycle2 = Number(tmp[1]);
                }else if(second.split('/').length == 2){
                    this.secondRadio = 'second3';
                    let tmp = second.split('/');
                    this.second3StartOn = Number(tmp[0]);
                    this.second3Cycle = Number(tmp[1]);
                }else{
                    this.secondRadio = 'second4';
                    this.second4Value = this.formatArray(second.split(','));
                }

                //分
                let minute = temp[1];
                this.v_minute = minute;
                if(minute == '*'){
                    this.minuteRadio = 'minute1';
                }else if(minute.split('-').length == 2){
                    this.minuteRadio = 'minute2';
                    let tmp = minute.split('-');
                    this.minute2Cycle1 = Number(tmp[0]);
                    this.minute2Cycle2 = Number(tmp[1]);
                }else if(minute.split('/').length == 2){
                    this.minuteRadio = 'minute3';
                    let tmp = minute.split('/');
                    this.minute3StartOn = Number(tmp[0]);
                    this.minute3Cycle = Number(tmp[1]);
                }else{
                    this.minuteRadio = 'minute4';
                    this.minute4Value = this.formatArray(minute.split(','));
                }

                //时
                let hour = temp[2];
                this.v_hour = hour;
                if(hour == '*'){
                    this.hourRadio = 'hour1';
                }else if(hour.split('-').length == 2){
                    this.hourRadio = 'hour2';
                    let tmp = hour.split('-');
                    this.hour2Cycle1 = Number(tmp[0]);
                    this.hour2Cycle2 = Number(tmp[1]);
                }else if(hour.split('/').length == 2){
                    this.hourRadio = 'hour3';
                    let tmp = hour.split('/');
                    this.hour3StartOn = Number(tmp[0]);
                    this.hour3Cycle = Number(tmp[1]);
                }else{
                    this.hourRadio = 'hour4';
                    this.hour4Value = this.formatArray(hour.split(','));
                }

                //天
                let day = temp[3];
                this.v_day = day;
                if(day == '*'){
                    this.dayRadio = 'day1';
                }else if(day.split('-').length == 2){
                    this.dayRadio = 'day2';
                    let tmp = day.split('-');
                    this.day2Cycle1 = Number(tmp[0]);
                    this.day2Cycle2 = Number(tmp[1]);
                }else if(day.split('/').length == 2){
                    this.dayRadio = 'day3';
                    let tmp = day.split('/');
                    this.day3StartOn = Number(tmp[0]);
                    this.day3Cycle = Number(tmp[1]);
                }else if(day == '?'){
                    this.dayRadio = 'day5';
                }else if(day.indexOf('W') != -1){
                    this.dayRadio = 'day6';
                    this.day6No = Number(day.substring(0,day.length-1));
                }else if(day == 'L'){
                    this.dayRadio = 'day7';
                }else{
                    this.dayRadio = 'day4';
                    this.day4Value = this.formatArray(day.split(','));
                }

                //周
                let week = temp[5];
                this.v_week = week;
                if(week == '*'){
                    this.weekRadio = 'week1';
                }else if(week.split('/').length == 2){
                    this.weekRadio = 'week2';
                    let tmp = week.split('/');
                    this.week2Cycle1 = Number(tmp[0]);
                    this.week2Cycle2 = Number(tmp[1]);
                }else if(week.split('#').length == 2){
                    this.weekRadio = 'week3';
                    let tmp = week.split('#');
                    this.week3StartOn = Number(tmp[0]);
                    this.week3Cycle = Number(tmp[1]);
                }else if(week == '?'){
                    this.weekRadio = 'week5';
                }else if(week.indexOf('L') != -1){
                    this.weekRadio = 'week6';
                    this.week6No = Number(week.substring(0,week.length-1));
                }else{
                    this.weekRadio = 'week4';
                    this.week4Value = this.formatArray(week.split(','));
                }

                //月
                let month = temp[4];
                this.v_month = month;
                if(month == '*'){
                    this.monthRadio = 'month1';
                }else if(month.split('-').length == 2){
                    this.monthRadio = 'month2';
                    let tmp = month.split('-');
                    this.month2Cycle1 = Number(tmp[0]);
                    this.month2Cycle2 = Number(tmp[1]);
                }else if(month.split('/').length == 2){
                    this.monthRadio = 'month3';
                    let tmp = month.split('/');
                    this.month3StartOn = Number(tmp[0]);
                    this.month3Cycle = Number(tmp[1]);
                }else if(month == '?'){
                    this.monthRadio = 'month5';
                }else{
                    this.monthRadio = 'month4';
                    this.month4Value = this.formatArray(month.split(','));
                }

                /*//年
                let year = temp[6];
                this.v_year = year;
                if(year == ' '){
                    this.yearRadio = 'year1';
                }else if(year == '*'){
                    this.yearRadio = 'year2';
                }else if(year.split('-').length == 2){
                    this.yearRadio = 'year3';
                    let tmp = year.split('-');
                    this.year3Cycle1 = Number(tmp[0]);
                    this.year3Cycle2 = Number(tmp[1]);
                }*/
            }
        },
        formatArray(array){ //转换字符串数组为数字数组
            let tmp = [];
            array.forEach(item => {
                tmp.push(Number(item));
            });
            return tmp;
        },
        cronUpdate(type, name, value, event){
            this[type] = name;
            this[value] = event;

            switch (type) {
                case 'secondRadio':
                    this.secondChange(name);
                    break;
                case 'minuteRadio':
                    this.minuteChange(name);
                    break;
                case 'hourRadio':
                    this.hourChange(name);
                    break;
                case 'dayRadio':
                    this.dayChange(name);
                    break;
                case 'weekRadio':
                    this.weekChange(name);
                    break;
                case 'monthRadio':
                    this.monthChange(name);
                    break;
                case 'yearRadio':
                    this.yearChange(name);
                    break;
            }
        },
        cronCheckUpdate(type, name, value, event){
            this[type] = name;
            this[value] = event;

            switch (type) {
                case 'secondRadio':
                    this.secondChange(name);
                    break;
                case 'minuteRadio':
                    this.minuteChange(name);
                    break;
                case 'hourRadio':
                    this.hourChange(name);
                    break;
                case 'dayRadio':
                    this.dayChange(name);
                    break;
                case 'weekRadio':
                    this.weekChange(name);
                    break;
                case 'monthRadio':
                    this.monthChange(name);
                    break;
                case 'yearRadio':
                    this.yearChange(name);
                    break;
            }
        },
        getCron(){
            return this.cronExpr;
        },

        // 请求后端接口检验cron表达式是否正确
        parserCron1(){
            this.$net.send({
                server: this.$services.schService.jobEntityRestController.validCronExpression,
                data: {cronExpression: this.cronExpr}
            }).then((data) => {
                if (data.success) {
                    this.runTimeArray = data.dateStr;
                    this.error = false;
                } else {
                    this.error = true;
                    this.runTimeArray = [];
                }
            });
        },
        getValidCronExpr(){
            return this.error;
        }
    },
    watch:{
        value(val){
            this.cronExpr = val;
            this.cronExprArray = val.split(' ');
            this.revertCronExpr();
        },
        cronExpr(val){
            this.cronExprArray = val.split(' ');
            this.parserCron1();
        }
    }
}
</script>
