<template>
    <div>
        <Card>
            <j-table ref="procDefTable" pagination autoSearch
                     :queryForm="queryForm"
                     :server="server.query" highlight-row
                     :columns-list="columns" v-model="tableData"
                     :input-col="8"
                     :label-width="90"
                     @on-select="selectRow"
                     @on-row-click="selectRow"
                     @on-delete="remove">
                <template slot="input-col">
                    <Row>
                        <FormItem label="流程编码" prop="__LIKES_code">
                            <Input v-model="queryForm.__LIKES_code" placeholder="流程编码"></Input>
                        </FormItem>
                        <FormItem label="流程名称" prop="__LIKES_name">
                            <Input v-model="queryForm.__LIKES_name" placeholder="流程名称"></Input>
                        </FormItem>
                    </Row>
                    <Col span="15">
                        <FormItem label="模板名称" prop="__LIKES_procTemplateName">
                            <Input v-model="queryForm.__LIKES_procTemplateName" placeholder="模板名称"></Input>
                        </FormItem>
                        <FormItem label="模块名称" prop="__LIKES_moduleName">
                            <Input v-model="queryForm.__LIKES_moduleName" placeholder="模块名称"></Input>
                        </FormItem>
                    </Col>
                </template>
                <template slot="toolbar">
                    <router-link to="/procDefEdit/add"><Button type="primary">新增</Button></router-link>
                    <Button type="primary" :disabled="disabledDesign"  @click="design" >设计</Button>
                    <Button type="primary" :disabled="disabledCopyProc" @click="copyProc" >复制</Button>
                    <Button type="primary" :disabled="disabledEnable" @click="enable" >启用</Button>
                    <Button type="primary" :disabled="disabledDisable" @click="disable" >停用</Button>
                    <Button type="primary" :disabled="disabledUpdate" @click="update" >升级</Button>
                </template>
            </j-table>
        </Card>
        <Modal v-model="businessModal" title="复制流程" @on-ok="copyOk" >
            <Row>
            <Form ref="form" :model="form" :label-width="180"
                  style="margin-left: -68px;margin-right: 60px;">
                <Col span="22">
                    <FormItem label="流程编码" prop="newCode">
                        <Input v-model="form.newCode"></Input>
                    </FormItem>
                </Col>
                <Col span="22">
                    <FormItem label="流程名称" prop="newName">
                        <Input v-model="form.newName" ></Input>
                    </FormItem>
                </Col>
            </Form>
            </Row>
        </Modal>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                server: {
                    query: this.$services.wfService.procDefRestController.query
                },
                queryForm: {
                    __LIKES_code: '',
                    __LIKES_name: ''
                },
                disabledDesign: true,
                disabledCopyProc: true,
                disabledEnable: true,
                disabledDisable: true,
                disabledUpdate: true,
                form: {},
                tableData: [],
                bizData: {},
                businessModal : false,
                columns: [
                    { type: 'index', align: 'center', width: 50 },
                    { title: '流程编码',   align: 'center',   key: 'code'              },
                    { title: '流程名称',   align: 'center',   key: 'name'              },
                    { title: '模块名称',   align: 'center',   key: 'moduleName'        },
                    { title: '模板名称',   align: 'center',       key: 'procTemplateName'  },
                    { title: '表单名称', align: 'center', key: 'formName'          },
                    { title: '版本号', align: 'center', key: 'procVersion'       },
                    { title: '版本状态',       align: 'center',       key: 'procVersionStatus' ,formatter: "fixedDict:VersionStatus@system"},
                    { title: '状态',       align: 'center',       key: 'status'  ,formatter: "fixedDict:Status@system"},
                    { title: '操作', align: 'center', key: 'action', width: 120, handler: [
                            {action: 'edit', path: '/procDefEdit/edit', visible: 'status=[DRAFT]'},
                            {action: 'delete', visible: 'status=[DRAFT]'}
                        ]
                    }],
            }
        },
        methods: {
            selectRow(data, index) {
                if (data['status'] == 'ENABLED') {
                    this.disabledDesign = true;
                    this.disabledCopyProc = false;
                    this.disabledEnable = true;
                    this.disabledDisable = false;
                    if(data['procVersionStatus'] == 'C'){
                        this.disabledUpdate = false;
                    }
                    else{
                        this.disabledUpdate = true;
                    }

                }
                else if (data['status'] == 'DISABLED') {

                    this.disabledDesign = true;
                    this.disabledCopyProc = false;
                    this.disabledEnable = false;
                    this.disabledDisable = true;
                    this.disabledUpdate = false;
                }
                else {
                    this.disabledDesign = false;
                    this.disabledCopyProc = true;
                    this.disabledEnable = false;
                    this.disabledDisable = true;
                    this.disabledUpdate = true;
                }
            },
            remove(data, index) {
                this.$net.send({
                    server: this.$services.wfService.procDefRestController.remove,
                    append: data.id
                }).then((data) => {
                    if (data.success) {
                        this.$Message.success(data.msg);
                        this.$refs.procDefTable.refresh();
                    } else {
                        this.$Message.error(data.msg);
                    }
                });
            },
            design(){
                let crru = this.$refs.procDefTable.getSelectedRow();
                if(crru.code){
                    this.$router.push({path: '/procDefDesign', query: {procDef: crru}});
                }else{
                    this.$Message.info('请先选择需要设计的流程。');
                }
            },
            enable(){
                let crru = this.$refs.procDefTable.getSelectedRow();
                if(crru.code){
                    this.$Modal.confirm({
                        title: '启用提示',
                        content: '您确定要启用该流程吗?',
                        onOk: () => {
                            this.$net.send({
                                server: this.$services.wfService.procDefRestController.enable,
                                data: {code: crru.code, procVersion: crru.procVersion}
                            }).then((data) => {
                                if (data.success) {
                                    this.$Message.success(data.msg);
                                    this.$refs.procDefTable.refresh();
                                } else {
                                    this.$Message.error(data.msg);
                                }
                            });
                        },
                        onCancel: () => {
                            return false;
                        }
                    });
                }
                else
                {
                    this.$Message.info('请先选择需要启动的流程。');
                }
            },
            disable(){
                let crru = this.$refs.procDefTable.getSelectedRow();
                if(crru){
                    this.$Modal.confirm({
                        title: '停用提示',
                        content: '您确定要停用该流程吗?',
                        onOk: () => {
                            this.$net.send({
                                server: this.$services.wfService.procDefRestController.disable,
                                data: {code: crru.code, procVersion: crru.procVersion}
                            }).then((data) => {
                                if (data.success) {
                                    this.$Message.success(data.msg);
                                    this.$refs.procDefTable.refresh();
                                } else {
                                    this.$Message.error(data.msg);
                                }
                            });
                        },
                        onCancel: () => {
                            return false;
                        }
                    });
                }
                else
                {
                    this.$Message.success('请先选择需要停用的流程。');
                }
            },
            update(){
                let crru = this.$refs.procDefTable.getSelectedRow();
                if(crru){
                    this.$Modal.confirm({
                        title: '升级提示',
                        content: '您确定要升级该流程吗?',
                        onOk: () => {
                            this.$net.send({
                                server: this.$services.wfService.procDefRestController.newProcDef,
                                data: {code: crru.code, procVersion: crru.procVersion}
                            }).then((data) => {
                                if (data.success) {
                                    this.$Message.success(data.msg);
                                    this.$refs.procDefTable.refresh();
                                } else {
                                    this.$Message.error(data.msg);
                                }
                            });
                        },
                        onCancel: () => {
                            return false;
                        }
                    });
                }
                else
                {
                    this.$Message.success('请先选择需要升级的流程。');
                }
            },
            copyProc(){
                let crru = this.$refs.procDefTable.getSelectedRow();
                if(crru){
                    this.businessModal = true;
                }
                else
                {
                    this.$Message.success('请先选择需要复制的流程。');
                }

            },
            copyOk(){
                let crru = this.$refs.procDefTable.getSelectedRow();
                let params = {code: crru.code,
                    procVersion: crru.procVersion,
                    newCode: this.form.newCode,
                    newName: this.form.newName
                };
                this.$net.send({
                    server: this.$services.wfService.procDefRestController.copy,
                    data: params
                }).then((data) => {
                    this.newCode = '';
                    this.newName = '';
                    if (data.success) {
                        this.$Message.success(data.msg);
                        this.$refs.procDefTable.refresh();
                    } else {
                        this.$Message.error(data.msg);
                    }
                });
            }

        }
    }
</script>
