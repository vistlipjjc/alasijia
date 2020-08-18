<template>
    <div>
        <card title="审批中列表信息">
            <j-table
                    ref="procInstRunList" pagination autoSearch
                    :server="server.query"
                    :queryForm="queryForm"
                    :columns-list="columns"
                    :defaultParams="queryParam"
                    v-model="tableData"
                    :input-col="6" :label-width="90"
                    @on-row-click="selectRow"
            >
                <template slot="input-col">
                    <Col span="17">
                        <FormItem label="业务流程名称" prop="__LIKES_procName" style="margin-left: 150px">
                            <Input v-model="queryForm.__LIKES_procName" placeholder="业务流程名称"></Input>
                        </FormItem>
                        <FormItem label="模块名称" prop="__LIKES_moduleName" style="margin-left: 100px">
                            <Input v-model="queryForm.__LIKES_moduleName" placeholder="模块名称"></Input>
                        </FormItem>
                    </Col>
                </template>
                <template slot="toolbar">
                    <Button type="primary"  @click="viewBizHandler">查看</Button>
                    <Button type="primary" :disabled="disabledBack"  @click="backBizHandler">撤回</Button>
                </template>
            </j-table>

        </card>
        <card>
            <Tabs value="name1">
                <TabPane label="审批记录" name="name1">
                    <div style="overflow:auto;" id="logContent">
                    </div>
                </TabPane>
                <TabPane label="流程模板" name="name2">
                    <div style="overflow:auto;">
                        <img id="img" alt="流程图片"/>
                    </div>
                </TabPane>
            </Tabs>
        </card>
    </div>

</template>
<script>
    export default {
        data() {
            return {
                server: {
                    query: this.$services.wfService.processRestController.queryHistory
                },
                rowData: {},
                tableData: [],
                columns: [
                    {type: 'index', align: 'center', width: 50},
                    {title: '业务流程编码', align: 'center', key: 'procCode'},
                    {title: '业务流程名称', align: 'center', key: 'procName'},
                    {title: '模块名称', align: 'center', key: 'moduleName'},
                    {title: '模板名称', align: 'center', key: 'templateName'},
                    {title: '发起人', align: 'center', key: 'starterName'},
                    {title: '开始时间', align: 'center', key: 'startTimeString'},
                    {title: '状态', align: 'center', key: 'status', formatter: "fixedDict:ProcInstStatus@wf"}
                ],
                queryForm:{
                    __LIKES_procName:"",
                    __LIKES_moduleName:""
                },
                enable:true,
                disabledBack: false,
                queryParam:{
                    __INS_status:"30,50",
                    __EQS_starterCode:JSON.parse(localStorage.getItem("user")).staffCode
                },
            }
        },
        methods: {
            selectRow(data, index) {
                this.rowData = data;
                if(this.rowData.status != '30'){
                    this.disabledBack = true;
                }
                else
                {
                    this.disabledBack = false;
                }

                if(data['id']){
                    this.$net.send({
                        server: this.$services.wfService.processRestController.getProcInstDiagram,
                        append: data['id']
                    }).then((data) => {
                        /*加载流程图片  */
                        document.getElementById("img").src ="data:image/png;base64,"+ data.data;
                    });
                }

                if(data['id']){
                    this.$net.send({
                        server: this.$services.wfService.procLogRestController.hisLog,
                        append: data['id']
                    }).then((data) => {
                        $('#logContent').html(data.logContent);
                    });
                }
            },
            //查看业务数据
            viewBizHandler() {
                if(this.rowData.id){
                    this.$net.send({
                        server: this.$services.wfService.processRestController.getProcInstData,
                        data: {
                            procInstId:this.rowData.id,
                        }
                    }).then((data) => {
                        let bizData = JSON.parse(data.data.formData);
                        this.$router.push({path: '/processView', query: {procCode: this.rowData.procCode, bizData: bizData,opt:"VIEW",nodeKey:data.nodeKey}});
                    });
                }else{
                    this.$Message.error("请先选择需要查看的业务数据");
                }
            },
            backBizHandler(){
                if(this.rowData.id){
                    if(this.rowData.status != '30'){
                        this.$Message.error("当前状态不允许撤回");
                        return;
                    }else{
                        let nodeKey = '';
                        this.$net.send({
                            server: this.$services.wfService.approveRestController.queryNodeKey,
                            data: {
                                processDefId: this.rowData.processDefId,
                            }
                        }).then((data) => {
                            nodeKey = data[0].value;
                        });
                        this.$net.send({
                            server: this.$services.wfService.approveRestController.queryTaskList,
                            append: this.rowData.id
                        }).then((data) => {
                            this.$net.send({
                                server: this.$services.wfService.approveRestController.reject,
                                data: {
                                    nodeKey: nodeKey,
                                    taskId: data[0].value,
                                    procInstId: this.rowData.id,
                                }
                            }).then((data) => {
                                if (data.success) {
                                    this.$Message.success(data.msg);
                                    this.$refs.procInstRunList.refresh();
                                } else {
                                    this.$Message.error(data.msg);
                                }
                            });
                        });

                    }
                }else{
                    this.$Message.error("请先选择需要查看的业务数据");
                }
            }
        }
    }
</script>
