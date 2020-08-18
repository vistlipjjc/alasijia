<template>
    <div>
        <card title="已审批列表信息">
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
                queryParam:{
                    __INS_status:"40,60",
                    __EQS_starterCode:JSON.parse(localStorage.getItem("user")).staffCode
                },

                enable:true
            }
        },
        methods: {
            selectRow(data, index) {
                this.rowData = data;
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
        }
    }
</script>
