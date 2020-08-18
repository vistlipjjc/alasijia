<template>
    <div class="procAutoTransferEdit">
        <Card>
            <p slot="title">编辑信息</p>
            <Row>
                <Col span="12" offset="6">
                <Form ref="editForm" :model="editForm" :rules="editRules" :label-width="130">
                    <FormItem label="自动转办用户" prop="transferStaffName" required>
                        <j-staff v-model="editForm.transferStaffName" @on-select="getStaff" style="width: 400px"></j-staff>
                    </FormItem>
                    <FormItem label="开始时间" prop="startTime" >
                        <Date-picker v-model="editForm.startTime" ref="startTime" type="date" placement="bottom-end" placeholder="选择日期" style="width: 400px"></Date-picker>
                    </FormItem>
                    <FormItem label="结束时间" prop="endTime" >
                        <Date-picker v-model="editForm.endTime" type="date" ref="endTime" placement="bottom-end" placeholder="选择日期" style="width: 400px"></Date-picker>
                    </FormItem>
                    <FormItem label="备注" prop="remark">
                        <Input v-model="editForm.remark" type="textarea" style="width: 400px"></Input>
                    </FormItem>
                    <div align="center">
                        <Button @click="btnSave('editForm')" type="primary" style="margin:0 11px;">保存</Button>
                        <Button type="ghost" @click="btnBack">返回</Button>
                    </div>
                </Form>
                </Col>
            </Row>
        </Card>
    </div>
</template>

<script>
    export default {
        name: "procAutoTransferEdit",
        data () {
            return {
                editForm: {
                    transferStaffCode: '',
                    transferStaffName: '',
                    staffCode:'',
                    staffName:'',
                    startTime: '',
                    endTime: '',
                    remark: ''
                },
                editRules: {
                    transferStaffName: [
                        { required: true, message: '必填项', trigger: 'blur'}
                    ],
                    startTime: [
                        { validator: (rule, value, callback) => {
                                if(!this.editForm.startTime){
                                    callback(new Error('必填项'));
                                    return;
                                }
                                this.editForm.staffCode = this.editForm.transferStaffCode;
                                var start= new Date(this.editForm.startTime);
                                var end = new Date(this.editForm.endTime);

                                if(start > end)
                                {
                                    callback(new Error('结束时间不能晚于开始时间。'));
                                    return;
                                }
                                callback();
                            }}
                    ],
                    endTime: [
                        { validator: (rule, value, callback) => {
                                if(!this.editForm.endTime){
                                    callback(new Error('必填项'));
                                    return;
                                }
                                this.editForm.staffCode = this.editForm.transferStaffCode;
                                var start= new Date(this.editForm.startTime);
                                var end = new Date(this.editForm.endTime);
                                if(start > end)
                                {
                                    callback(new Error('结束时间不能晚于开始时间。'));
                                    return;
                                }
                                callback();
                            }}
                    ],
                    remark: [
                        { type: 'string', max: 64, message: '长度不能超过512个字符', trigger: 'blur' }
                    ],
                },
            }
        },
        mounted(){
            this.init();
        },
        methods:{
            init(){
                if (this.$route.params.opt == 'edit') {
                    this.opt = true;
                    this.editForm.id = this.$route.query.row.id;
                    this.editForm.transferStaffCode = this.$route.query.row.transferStaffCode;
                    this.editForm.transferStaffName = this.$route.query.row.transferStaffName;
                    this.editForm.remark = this.$route.query.row.remark;
                    this.editForm.startTime = this.$route.query.row.startTimeString;
                    this.editForm.endTime = this.$route.query.row.endTimeString;
                    this.editForm.staffCode = this.$route.query.row.staffCode;
                    this.editForm.staffName = this.$route.query.row.staffName;
                }
            },
            btnSave(name){
                //save data
                this.$refs[name].validate((valid) => { // 数据校验
                    if (!valid) {
                        return
                    }
                    this.$net.send({
                        server: this.$services.wfService.procAutoTransferRestController.save,
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
            btnBack(){
                this.$router.go(-1);
                this.$store.commit('removeTag', 'procAutoTransferEdit');
                this.$store.commit('closePage', 'procAutoTransferEdit');
            },
            getStaff(val) {
                console.log('val',val);
                if (val)
                {
                    this.editForm.transferStaffCode = val.staffCode;
                    this.editForm.transferStaffName = val.staffName;
                }
                else
                {
                    this.editForm.staffCode = '';
                    this.editForm.staffName = '';
                }
            },
        }
    }
</script>
