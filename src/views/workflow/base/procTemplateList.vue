<template>
    <div>
        <card title="流程模板">
            <j-table
                    ref="procTemplateList" pagination autoSearch
                    :queryForm="queryForm"
                    :server="server.query"
                    :columns-list="columns"
                    v-model="tableData"
                    :input-col="8"
                    :label-width="90"
                    @on-row-click="selectRow"
            >
                <template slot="input-col">
                    <Col span="15">
                        <FormItem label="模块编码" prop="__LIKES_code" style="margin-left: 300px">
                            <Input v-model="queryForm.__LIKES_code" placeholder="模块编码"></Input>
                        </FormItem>
                    </Col>
                </template>
                <template slot="toolbar">
                    <!--<router-link to="/procTemplateAdd">
                        <Button type="primary">新增</Button>
                    </router-link>
                    <router-link to="/procTemplateAdd/edit">
                        <Button type="primary" :disabled="editTemplate">编辑</Button>
                    </router-link>-->
                    <router-link to="/procTemplateUpload">
                        <Button type="primary">上传</Button>
                    </router-link>
                    <Button type="primary" :disabled="deployTemplate" @click="deployTempHandler()">部署</Button>
                    <Button type="primary" :disabled="delTemplate" @click="delTempHandler">卸载</Button>
                    <Button type="primary" :disabled="enableTemplate" @click="enableTempHandler">启用</Button>
                    <Button type="primary" :disabled="disableTemplate" @click="disableTempHandler">停用</Button>
                </template>
            </j-table>

        </card>

        <card title="模板图像">

            <!--<Collapse value="1">-->
                <!--<Panel name="1" style="font-size: 12px;">-->
                    <!--模板图像-->
                    <!--<p slot="content">-->
                    <div style="overflow:auto;">
                        <img id="img" alt="流程图片"/>
                    </div>

                    <!--</p>-->
                <!--</Panel>-->
            <!--</Collapse>-->
        </card>

    </div>

</template>
<script>
    export default {
        data() {
            return {
                editTemplate: false,
                deployTemplate: false,
                delTemplate: false,
                enableTemplate: false,
                disableTemplate: false,
                server: {
                    query: this.$services.wfService.procTemplateRestController.query
                },
                queryForm: {
                    __LIKES_code: ''
                },
                rowData: {},
                tableData: [],
                columns: [
                    {type: 'index', align: 'center', width: 50},
                    {title: '模板编码', align: 'center', key: 'code'},
                    {title: '模板名称', align: 'center', key: 'name'},
                    {title: '状态', align: 'center', key: 'status', formatter: "fixedDict:Status@system"},
                    {title: '备注', align: 'center', key: 'remark'}
                ],
            }
        },
        methods: {
            selectRow(data, index) {
                this.rowData = data;
                if (data['status'] == 'ENABLED') {
                    this.enableTemplate = true;
                    this.disableTemplate = false;
                    this.delTemplate = true;
                    this.editTemplate = true;
                    this.deployTemplate = true;
                }
                else if (data['status'] == 'DISABLED') {

                    this.enableTemplate = false;
                    this.disableTemplate = true;
                    this.delTemplate = true;
                    this.editTemplate = true;
                    this.deployTemplate = true;
                }
                else {
                    this.enableTemplate = true;
                    this.disableTemplate = true;
                    this.delTemplate = false;
                    this.editTemplate = false;
                    this.deployTemplate = false;
                }
                if(data['code']){
                    this.$net.send({
                        server: this.$services.wfService.procTemplateRestController.getProcInstDiagram,
                        append: data['code']
                    }).then((data) => {
                        /*加载流程图片  */
                        document.getElementById("img").src ="data:image/png;base64,"+ data.data;
                    });
                }
            },
            //部署
            deployTempHandler() {
                if (this.rowData.code) {
                    this.$net.send({
                        server: this.$services.wfService.procTemplateRestController.deploy,
                        append: this.rowData.code
                    }).then((data) => {
                        if (data.success) {
                            this.$Message.success(data.msg);
                            this.$refs.procTemplateList.refresh();
                        } else {
                            this.$Message.error(data.msg);
                        }
                    });
                } else {
                    this.$Message.info("请先选择需要部署的模板");
                }
            },

            //卸载
            delTempHandler() {
                if (this.rowData.code) {
                    this.$net.send({
                        server: this.$services.wfService.procTemplateRestController.undeploy,
                        append: this.rowData.code
                    }).then((data) => {
                        if (data.success) {
                            this.$Message.success(data.msg);
                            this.$refs.procTemplateList.refresh();
                        } else {
                            this.$Message.error(data.msg);
                        }
                    });
                } else {
                    this.$Message.info("请先选择需要卸载的模板");
                }
            },

            //启用
            enableTempHandler() {
                if (this.rowData.code) {
                    this.$net.send({
                        server: this.$services.wfService.procTemplateRestController.enable,
                        append: this.rowData.code
                    }).then((data) => {
                        if (data.success) {
                            this.$Message.success(data.msg);
                            this.$refs.procTemplateList.refresh();
                        } else {
                            this.$Message.error(data.msg);
                        }
                    });
                } else {
                    this.$Message.info("请先选择需要启用的模板");
                }
            },
            //停用
            disableTempHandler() {
                if (this.rowData.code) {
                    this.$net.send({
                        server: this.$services.wfService.procTemplateRestController.disable,
                        append: this.rowData.code
                    }).then((data) => {
                        if (data.success) {
                            this.$Message.success(data.msg);
                            this.$refs.procTemplateList.refresh();
                        } else {
                            this.$Message.error(data.msg);
                        }
                    });
                } else {
                    this.$Message.info("请先选择需要停用的模板");
                }
            }
        }
    }
</script>
