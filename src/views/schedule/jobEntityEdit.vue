<template>
    <div class="jobEntityEditCtnr">
        <Card>
            <Row>
                <Form ref="editForm" :model="editForm" :rules="editRules" :label-width="180">
                    <Col span="11">
                        <FormItem label="任务编码" prop="code" required>
                            <Input v-model="editForm.code" :disabled="opt" :maxlength="64"></Input>
                        </FormItem>
                    </Col>
                    <Col span="11">
                        <FormItem label="任务名称" prop="name">
                            <Input v-model="editForm.name"></Input>
                        </FormItem>
                    </Col>
                    <Col span="11">
                    <FormItem label="日历" prop="calendarCode">
                        <j-select v-model="editForm.calendarCode" url="custom:calendar/queryAll@schedule" ref="calendarCode" @on-change="selectChange('calendarCode', $event)"></j-select>
                    </FormItem>
                    </Col>
                    <Col span="11">
                    <FormItem label="任务类型" prop="groupCode" required>
                        <j-select v-model="editForm.groupCode" url="custom:jobGroup/queryAll@schedule" ref="groupCode" @on-change="selectChange('groupCode', $event)"></j-select>
                    </FormItem>
                    </Col>
                    <Col span="11">
                    <FormItem label="任务类型1" prop="jobType1">
                        <j-radio v-model="editForm.jobType1" url="fixedDict:JobType1Dict@schedule" ref="jobType1" @on-change="radioChange('jobType1', $event)"></j-radio>
                    </FormItem>
                    </Col>
                    <Col span="11">
                    <FormItem label="任务类型2" prop="jobType2">
                        <j-radio v-model="editForm.jobType2" url="fixedDict:JobType2Dict@schedule" ref="jobType2" @on-change="radioChange('jobType2', $event)"></j-radio>
                    </FormItem>
                    </Col>
                    <Col span="11">
                    <FormItem label="服务" prop="serviceId" required>
                        <AutoComplete
                                v-model="editForm.serviceId"
                                :data="initService"
                                url="custom:jobInst/getServices@schedule"
                                ref="serviceId"
                                @on-change="selectChange('serviceId', $event)"
                                placeholder="input here"
                                style="width:200px"></AutoComplete>
                    </FormItem>
                    </Col>
                    <Col span="7">
                    <FormItem label="起止日期" required prop="startDate">
                        <DatePicker v-model="editForm.startDate" :options="disableStartDate"  format="yyyy-MM-dd"
                                    type="date" placement="bottom-end" placeholder="开始时间" style="width: 83%">
                        </DatePicker>
                    </FormItem>
                    </Col>
                    <Col span="6">
                        <FormItem>
                            <DatePicker v-model="editForm.endDate" :options="disableEndDate"  format="yyyy-MM-dd"
                                        type="date" placeholder="结束时间" style="width: 120%; margin-left: -180px">
                            </DatePicker>
                        </FormItem>
                    </Col>
                    <Col span="11">
                    <FormItem label="优先级" prop="priority">
                        <InputNumber :max="10" :min="1" v-model="editForm.priority" style="width: 100%"></InputNumber>
                    </FormItem>
                    </Col>
                    <Col span="11">
                    <FormItem label="超时时间" prop="timeout" required>
                        <Select v-model="editForm.timeout" style="width: 57%; margin-right: 10px;" >
                            <Option v-for="item in timeoutList" :value="item.value" :key="item.value" >{{ item.label }}</Option>
                        </Select>
                        <j-radio v-model="editForm.timeoutUnit" url="fixedDict:TimeoutUnitDict@schedule" @on-change="timeoutUnitChange"></j-radio>
                    </FormItem>
                    </Col>
                    <Col span="22">
                    <FormItem label="超时处理" prop="timeoutInstruction">
                        <j-radio v-model="editForm.timeoutInstruction" url="fixedDict:JobInstructionDict@schedule" ref="timeoutInstruction" @on-change="radioChange('timeoutInstruction', $event)"></j-radio>
                    </FormItem>
                    </Col>
                    <Col span="22">
                    <FormItem label="失败处理" prop="errorInstruction">
                        <j-radio v-model="editForm.errorInstruction" url="fixedDict:JobInstructionDict@schedule" ref="errorInstruction" @on-change="radioChange('errorInstruction', $event)"></j-radio>
                    </FormItem>
                    </Col>
                    <Col span="22">
                    <FormItem label="参数" prop="param">
                        <param-table
                                refs="timeTable"
                                v-model="paramData"
                                :columns-list="column"
                                @on-change="saveParam">
                        </param-table>
                    </FormItem>
                    </Col>
                    <Col span="22">
                        <FormItem label="任务表达式" prop="cronExpression">
                            <j-cron ref="jCron" :value="editForm.cronExpression"  @getValue="getCron"></j-cron>
                        </FormItem>
                    </Col>
                    <Col span="22">
                    <FormItem label="备注" prop="remark">
                        <Input type="textarea" v-model="editForm.remark"></Input>
                    </FormItem>
                    </Col>
                    <Col span="22">
                        <div align="center">
                            <Button @click="btnSave('editForm')" type="primary" style="margin:0 11px;">保存</Button>
                            <Button type="ghost" @click="btnBack">返回</Button>
                        </div>
                    </Col>
                </Form>
            </Row>
        </Card>
    </div>
</template>
<script>
    import ParamTable from './component/jobGroupParamTable';
    import JCron from './component/jCron.vue'

export default {
    components: {
        ParamTable,
        JCron
    },
    data() {
        return {
            opt: false,
            test:'1234test',
            initService:[],
            timeoutList: [], //超时时间数值范围
            timeoutFormat: 'mm', //超时时间单位格式
            isExistParam: false,
            originGroupCode: '',
            paramData: [],
            column: [
                { title: '编码', align: 'center', key: 'code'},
                { title: '类型', align: 'center', key: 'type'},
                { title: '默认值', align: 'center', key: 'value', editable: true},
            ],
            disableStartDate: {
                disabledDate (date) {
                    return date && date.valueOf() < Date.now() - 86400000;
                }
            },
            disableEndDate: {
                disabledDate: (date) => {
                    if (this.editForm.startDate != null){
                        return date && date.valueOf() < (new Date(this.editForm.startDate)).getTime();
                    }else {
                        return date && date.valueOf() < Date.now() - 86400000;
                    }
                }
            },
            editForm: {
                code: '',
                name: '',
                calendarCode: '',
                groupCode: '',
                jobType1: '',
                jobType2: '',
                serviceId: '',
                startDate: '',
                endDate: '',
                priority: 1,
                timeout: '',
                timeoutUnit: '',
                timeoutInstruction: '',
                errorInstruction: '',
                param: '',
                cronExpression: '',
                remark: ''
            },
            editRules: {
                code: [
                    { required: true, message: '必填项', trigger: 'blur'},
                    {type: 'string', max: 64, message:'任务编码长度不能大于64'},
                    { validator: (rule, value, callback) => {
                        if(!this.opt){
                            this.$net.send({
                                server: this.$services.schService.jobEntityRestController.check,
                                data: {code: value}
                            }).then((data) => {
                                if (!data.valid) {
                                    callback(new Error('编码已存在，请重新输入。'));
                                }else{
                                    callback();
                                }
                            });
                        }else{
                            callback();
                        }
                    }}
                ],
                name: [
                    {required: true, message: '必填项', trigger: 'blur'}
                ],
                groupCode: [
                    {required: true, message: '必填项', trigger: 'change'}
                ],
                startDate: [
                    {required: true, message: '必填项', trigger: 'change', type: 'date'}
                ],
                serviceId: [
                    {required: true, message: '必填项', trigger: 'change'}
                ],
                timeout: [
                    {required: true, message: '必填项', trigger: 'change'}
                ],
                cronExpression: [
                    {required: true, message: '必填项', trigger: 'blur'}
                ]
            }
        }
    },
    beforeMount(){
        this.init();
    },
    methods: {
        init() {
            if (this.$route.params.opt == 'edit') {
                this.opt = true;
                this.editForm = this.$route.query.row;

                //设置超时时间的反显，及下拉框的值
                let v = this.editForm.timeout;
                if (v != null)
                {
                    this.editForm.timeout = v.toString().length < 2 ? '0' + v : v;
                }
                this.timeoutListChange(this.editForm.timeoutUnit);

                //设置参数，若当前实例存在参数则显示，不存在则显示类型对应的参数
                if(this.editForm.param)
                {
                    this.paramData = JSON.parse(this.editForm.param);
                    this.isExistParam = true;
                    this.originGroupCode = this.editForm.groupCode;
                }
            }else{
                this.timeoutListChange(this.editForm.timeoutUnit);
            }

            this.$net.send({
                server: this.$services.schService.jobInstRestController.getService,
            }).then((data) => {
                this.initService = data
            });

        },
        //将返回的时间转换成相应的格式
        formatDate (time) {
            var date = new Date(time);
            var year = date.getFullYear();
            var month =(date.getMonth() + 1).toString();
            var day = (date.getDate()).toString();
            if (month.length == 1) {
                month = "0" + month;
            }
            if (day.length == 1) {
                day = "0" + day;
            }
            var dateTime = year + "-" + month + "-" + day;
            return dateTime;
        },

        selectChange(name, value){
            this.editForm[name] = value;
            if(name == 'groupCode') //获取参数列表
            {
                this.$net.send({
                    server: this.$services.schService.jobGroupRestController.get,
                    append: value
                }).then((data) => {
                    if(this.isExistParam && this.originGroupCode == value){
                        this.paramData = JSON.parse(this.editForm.param);
                    }else{
                        this.paramData = JSON.parse(data.param);
                        this.editForm.param = data.param;
                    }
                });
            }

        },
        radioChange(name, value){
            this.editForm[name] = value;
        },
        timeoutUnitChange(data){
            this.editForm.timeoutUnit = data;
            this.timeoutListChange(data);
        },

        timeoutListChange(data){
            let timeoutRange;
            if(data == 'MINUTE')
            {
                this.timeoutFormat = 'mm';
                this.timeoutList = [];
                timeoutRange = 60;
            }
            else
            {
                this.timeoutFormat = 'HH';
                this.timeoutList = [];
                timeoutRange = 24;
            }
            //设置超时下拉参数
            for (let i = 1; i < timeoutRange; i++)
            {
                let val = i.toString().length < 2 ? '0' + i : i;
                let obj = {value: val.toString(), label: val};
                this.timeoutList.push(obj);
            }
        },
        saveParam(data){
            this.editForm.param = JSON.stringify(data);
        },
        getCron(data){
            this.editForm.cronExpression = data;
        },

        /*保存*/
        btnSave(name) {
            this.$refs[name].validate((valid) => { // 数据校验
                if (!valid) return;
                //将开始时间和结束时间转换成字符串，以便后台接收
                if(this.editForm.startDate) {
                    this.editForm.startDate = this.formatDate(this.editForm.startDate)
                }
                if(this.editForm.endDate) {
                    this.editForm.endDate = this.formatDate(this.editForm.endDate)
                }

                this.editForm.cronExpression = this.$refs.jCron.getCron();
                this.$net.send({
                    server: this.$services.schService.jobEntityRestController.save,
                    data: this.editForm
                }).then((data) => {
                    if (data.success) {
                        this.$Message.success(data.msg);
                        this.btnBack();
                    } else {
                        this.$Message.error(data.msg);
                    }
                });
            });
        },

        /*返回*/
        btnBack() {
            this.$router.go(-1);
            this.$store.commit('removeTag', 'jobEntityEdit');
            this.$store.commit('closePage', 'jobEntityEdit');
        }
    }
}
</script>
