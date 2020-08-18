<template>
    <div class="jobEntityCtnr">
        <Card>
            <j-table ref="jobEntityTable" pagination autoSearch :input-col="5"
                     :queryForm="queryForm" :rules="rules"
                     :server="server.query"
                     :columns-list="columns" v-model="tableData"
                     @on-delete="remove"
                     @on-row-click="rowClick">
                <template slot="input">
                    <Row>
                        <Col span="5">
                            <FormItem label="任务类型" :labelWidth="70" prop="__EQS_groupCode" style="width: 100%">
                                <j-select
                                        v-model="queryForm.__EQS_groupCode"
                                        url="custom:jobGroup/queryAll@schedule"
                                        clearable  filterable
                                        @on-change="groupCodeSelectChange($event)">
                                </j-select>
                            </FormItem>
                        </Col>
                        <Col span="5" offset="1">
                            <FormItem label="任务编码" :labelWidth="70" prop="__LIKES_code" style="width: 100%">
                                <Input v-model="queryForm.__LIKES_code" style="width: 100%"/>
                            </FormItem>
                        </Col>
                        <Col span="5" offset="1">
                           <FormItem label="任务名称" :labelWidth="70" prop="__LIKES_name" style="width: 100%">
                               <Input v-model="queryForm.__LIKES_name" style="width: 100%"/>
                            </FormItem>
                        </Col>

                    </Row>
                </template>
                <Col span="5" slot="input-col">
                    <FormItem label="任务状态" :labelWidth="70" prop="__EQS_status" style="width: 100%">
                        <j-select v-model="queryForm.__EQS_status" style="width: 100%"  url="fixedDict:JobStatusDict@schedule"
                                  filterable clearable @on-change="statusSelectChange($event)">
                        </j-select>
                    </FormItem>
                </Col>
                <Col span="5" slot="input-col" offset="1">
                    <FormItem label="开始时间" :labelWidth="70"  style="width: 100%" prop="__GES_startDate">
                        <DatePicker type="date" placeholder="开始时间" formate="yyyy-MM-dd"
                                    :options="dateOption" @on-change="startDateChange($event)"
                                    v-model="queryForm.__GES_startDate" style="width: 100%">
                        </DatePicker>
                    </FormItem>
                </Col>
                <Col span="5" slot="input-col" offset="1" >
                    <FormItem label="结束时间" :labelWidth="70" style="width: 100%" prop="__LES_startDate">
                        <DatePicker type="date" placeholder="结束时间" formate="yyyy-MM-dd"
                                    :options="dateOption" @on-change="endDateChange($event)"
                                    v-model="queryForm.__LES_startDate" style="width: 100%">
                        </DatePicker>
                    </FormItem>
                </Col>
                <!--<Col span="1" slot="input-col"><h5 style="color: white">.</h5></Col>-->
                <template slot="toolbar">
                    <router-link to="/jobEntityEdit/add"><Button type="primary">新增</Button></router-link>
                    <Button type="primary" @click="startClick" :disabled="startBtn">启动</Button>
                    <Button type="primary" @click="pauseClick" :disabled="pauseBtn">暂停</Button>
                    <Button type="primary" @click="stopClick" :disabled="stopBtn">停止</Button>
                    <Button type="primary" @click="startAllClick">全部启动</Button>
                    <Button type="primary" @click="pauseAllClick">全部暂停</Button>
                    <Button type="primary" @click="stopAllClick">全部停止</Button>
                    <Button type="primary" @click="startOnce">调度一次</Button>
                    <Button type="primary" @click="startWeChat">启动微信</Button>
                </template>
            </j-table>
        </Card>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                //不可选时间
                dateOption: {
                    disabledDate (date) {
                        return date && date.valueOf() > Date.now();
                    }
                },
                server: {
                    query: this.$services.schService.jobEntityRestController.query
                },
                queryForm: {
                    __EQS_groupCode: '',
                    __LIKES_code: '',
                    __LIKES_name: '',
                    __EQS_status: '',
                    __GES_startDate: '',
                    __LES_startDate: '',

                },
                tableData: [],
                columns: [
                    { type: 'index', align: 'center', width: 50 },
                    { title: '任务编码', align: 'center', key: 'code' },
                    { title: '任务名称', align: 'center', key: 'name' },
                    { title: '日历', align: 'center', key: 'calendarCode', formatter: 'custom:calendar/queryAll@schedule'},
                    { title: '任务类型', align: 'center', key: 'groupCode', formatter: 'custom:jobGroup/queryAll@schedule'},
                    { title: '开始时间', align: 'center', key: 'startDate'},
                    { title: '优先级', align: 'center', key: 'priority' },
                    { title: '状态', align: 'center', key: 'status', formatter: 'fixedDict:JobStatusDict@schedule'},
                    { title: '操作', align: 'center', key: 'action', width: 120, handler: [
                            {action: 'edit', path: '/jobEntityEdit/edit',visible: 'status=[NEW,STOPPED]'},
                            {action: 'view', path: '/jobEntityView'},
                            {action: 'delete',visible: 'status=[NEW]'}
                        ]
                }],
                rules: {},
                startBtn: false,
                pauseBtn: false,
                stopBtn: false,
                entityCodeList: [],
            }
        },
        beforeRouteEnter(to, from, next){
            next(vm=>{
                vm.refreshTable();
            })
        },
        methods: {
            rowClick(row, index){
                this.selectedRow = row;
                if(row['status'] == 'NEW') //新增的草稿数据
                {
                    this.startBtn = false;
                    this.pauseBtn = true;
                    this.stopBtn = true;
                }
                else if(row['status'] == 'EXECUTING') //执行中
                {
                    this.startBtn = true;
                    this.pauseBtn = false;
                    this.stopBtn = false;
                }
                else if(row['status'] == 'PAUSED') //暂停
                {
                    this.startBtn = false;
                    this.pauseBtn = true;
                    this.stopBtn = true;
                }
                else //停止
                {
                    this.startBtn = false;
                    this.pauseBtn = true;
                    this.stopBtn = true;
                }
            },
            startClick() {
                if(!this.selectedRow.code)
                {
                    this.$Message.error('请选择一条数据。');
                    return;
                }
                else
                {
                    this.$net.send({
                        server: this.$services.schService.jobEntityRestController.start,
                        append: this.selectedRow.code
                    }).then((data) => {
                        if (data.success) {
                            this.$Message.success(data.msg);
                            this.$refs.jobEntityTable.refresh();
                        } else {
                            this.$Message.error(data.msg);
                        }
                    });
                }
            },
            pauseClick() {
                if(!this.selectedRow.code)
                {
                    this.$Message.error('请选择一条数据。');
                    return;
                }
                else
                {
                    this.$net.send({
                        server: this.$services.schService.jobEntityRestController.pause,
                        append: this.selectedRow.code
                    }).then((data) => {
                        if (data.success) {
                            this.$Message.success(data.msg);
                            this.$refs.jobEntityTable.refresh();
                        } else {
                            this.$Message.error(data.msg);
                        }
                    });
                }
            },
            stopClick() {
                if(!this.selectedRow.code)
                {
                    this.$Message.error('请选择一条数据。');
                    return;
                }
                else
                {
                    this.$net.send({
                        server: this.$services.schService.jobEntityRestController.stop,
                        append: this.selectedRow.code
                    }).then((data) => {
                        if (data.success) {
                            this.$Message.success(data.msg);
                            this.$refs.jobEntityTable.refresh();
                        } else {
                            this.$Message.error(data.msg);
                        }
                    });
                }
            },
            startAllClick() {
                this.$net.send({
                    server: this.$services.schService.jobEntityRestController.startAll,
                }).then((data) => {
                    if (data.success) {
                        this.$Message.success(data.msg);
                        this.$refs.jobEntityTable.refresh();
                    } else {
                        this.$Message.error(data.msg);
                    }
                });
            },
            pauseAllClick() {
                this.$net.send({
                    server: this.$services.schService.jobEntityRestController.pauseAll,
                }).then((data) => {
                    if (data.success) {
                        this.$Message.success(data.msg);
                        this.$refs.jobEntityTable.refresh();
                    } else {
                        this.$Message.error(data.msg);
                    }
                });
            },
            stopAllClick() {
                this.$net.send({
                    server: this.$services.schService.jobEntityRestController.stopAll,
                }).then((data) => {
                    if (data.success) {
                        this.$Message.success(data.msg);
                        this.$refs.jobEntityTable.refresh();
                    } else {
                        this.$Message.error(data.msg);
                    }
                });
            },
            startOnce() {
                if(!this.selectedRow.code) {
                    this.$Message.error('请选择一条数据。');
                    return;
                } else {
                    this.$net.send({
                        server: this.$services.schService.jobEntityRestController.startOnce,
                        append: this.selectedRow.code
                    }).then((data) => {
                        if (data.success) {
                            this.$Message.success(data.msg);
                            this.$refs.jobEntityTable.refresh();
                        } else {
                            this.$Message.error(data.msg);
                        }
                    });
                }
            },
            /*启动微信*/
            startWeChat(){
                this.$net.send({
                    server: this.$services.schService.jobEntityRestController.jobStart,
                }).then((data) => {
                    if (data.success) {
                        this.$Message.success(data.msg);
                        this.$refs.jobEntityTable.refresh();
                    } else {
                        this.$Message.error(data.msg);
                    }
                });
            },
            remove(data) {
                this.$net.send({
                    server: this.$services.schService.jobEntityRestController.remove,
                    append: data.code
                }).then((data) => {
                    if (data.success) {
                        this.$Message.success(data.msg);
                        this.$refs.jobEntityTable.refresh();
                    } else {
                        this.$Message.error(data.msg);
                    }
                });
            },

            //任务类型下拉框改变时
            groupCodeSelectChange(value) {
                this.queryForm.__EQS_groupCode = value;
            },



            statusSelectChange(value) {
              this.queryForm.__EQS_status = value
              console.log(value)
            },

            //开始时间变化时
            startDateChange(value) {
                this.queryForm.__GES_startDate = value
            },


            //结束时间变化时
            endDateChange(value) {
                this.queryForm.__LES_startDate = value
            },
            //刷新页面
            refreshTable(){
                this.$refs.jobEntityTable.refresh();
            }
        }
    }
</script>
