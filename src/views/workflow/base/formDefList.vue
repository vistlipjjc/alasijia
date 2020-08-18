<template>
    <div>
        <Card>
            <j-table ref="formDefTable" pagination autoSearch
                     :queryForm="queryForm"
                     :server="server.query"
                     :columns-list="columns" v-model="tableData"
                     :input-col="8"
                     :label-width="90"
                     @on-delete="remove"
                     @on-row-click="onSelect">
                <template slot="input-col">
                    <Col span="15">
                    <FormItem label="表单编码" prop="__LIKES_code">
                        <Input v-model="queryForm.__LIKES_code"></Input>
                    </FormItem>
                    <FormItem label="表单名称" prop="__LIKES_name">
                        <Input v-model="queryForm.__LIKES_name"></Input>
                    </FormItem>
                    </Col>
                </template>
                <template slot="toolbar">
                        <router-link to="/formDefEdit/add">
                            <Button type="primary">新增</Button>
                        </router-link>
                        <Button ref="formDefTable_tb_design" :disabled="disabledDesign"  @click="designHandler">设计</Button>
                       <!-- <Button  @click="viewHandler">查看</Button>-->
                        <Button ref="formDefTable_tb_enable"  :disabled="disabledEnable" @click="enabledHandler" >启用</Button>
                        <Button ref="formDefTable_tb_disable" :disabled="disabledDisable"  @click="disableHandler" >停用</Button>
                </template>
            </j-table>
        </Card>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                server: {
                    query: this.$services.wfService.formDefRestController.query
                },
                editForm: {
                    code: '',
                    name: '',
                },
                disabledDisable: false,
                disabledEnable: false,
                disabledDesign: false,
                queryForm: {
                    __LIKES_code: '',
                    __LIKES_name: ''
                },
                tableData: [],
                columns: [
                    {type: 'index', align: 'center', width: 50},
                    {title: '表单编码', align: 'center', key: 'code'},
                    {title: '表单名称', align: 'center', key: 'name'},
                    {title: '表单类型', align: 'center', key: 'formType',formatter: 'fixedDict:PropFormType@wf'},
                    {title: '状态', align: 'center', key: 'status',formatter: 'fixedDict:Status@wf'},
                    {title: '备注', align: 'center', key: 'remark'},
                    { title: '操作', align: 'center', key: 'action', width: 120, handler: [
                            {action: 'edit', path: '/formDefEdit/edit', visible: 'status=[DRAFT]'},
                            {action: 'view', path: '/formPropList'},
                            {action: 'delete', visible: 'status=[DRAFT]'}
                        ]
                    }
                ],
                row:{},

            }

        },
        name: "formPropList",
        methods: {
            onSelect(row){
                this.row = row;
                if(row['status'] == 'DRAFT'){
                    this.disabledDesign = false;
                    this.disabledEnable = false;
                    this.disabledDisable = true;
                }
                else if((row['status'] == 'ENABLED'))
                {
                    this.disabledDesign = true;
                    this.disabledEnable = true;
                    this.disabledDisable = false;
                }
                else
                {
                    this.disabledDesign = false;
                    this.disabledEnable = false;
                    this.disabledDisable = true;

                }

            },
            enabledHandler(){
                if(this.row.code){
                    this.$Modal.confirm({
                        title: '提示',
                        content: '确定要启动该记录吗?',
                        onOk: () => {
                            this.$net.send({
                                server: this.$services.wfService.formDefRestController.enable,
                                data: {code:this.row.code}
                            }).then((data) => {
                                if (data.success) {
                                    this.$Message.success(data.msg);
                                    this.$refs.formDefTable.refresh();
                                } else {
                                    this.$Message.error(data.msg);
                                }
                            });
                        },
                        onCancel: () => {
                            return false;
                        }
                    });
                } else {
                    this.$Message.info("请先选择需要启动的记录");
                }
            },
            disableHandler(){
                if(this.row.code){
                    this.$Modal.confirm({
                        title: '提示',
                        content: '确定要停用该记录吗?',
                        onOk: () => {
                            this.$net.send({
                                server: this.$services.wfService.formDefRestController.disable,
                                data: {code:this.row.code}
                            }).then((data) => {
                                if (data.success) {
                                    this.$Message.success(data.msg);
                                    this.$refs.formDefTable.refresh();
                                } else {
                                    this.$Message.error(data.msg);
                                }
                            });
                        },
                        onCancel: () => {
                            return false;
                        }
                    });
                } else {
                    this.$Message.info("请先选择需要停用的记录");
                }
            },
            designHandler(){
                if(this.row.code){
                    this.$router.push({
                        path: '/formPropList',
                        query:{
                            row:this.row
                        }
                    });
                }
                else {
                    this.$Message.info("请先选择需要设计的记录");
                }

            },
            viewHandler(){
                if(this.row.code){
                this.$router.push({
                    path: '/formPropList',
                    query:{
                        row:this.row,
                        view:true
                    }
                });
                }
                else {
                    this.$Message.info("请先选择需要查看的记录");
                }
            },
            remove(data, index) {
                this.$net.send({
                    server: this.$services.wfService.formDefRestController.remove,
                    append: data.code
                }).then((data) => {
                    if (data.success) {
                        this.$Message.success(data.msg);
                        this.$refs.formDefTable.refresh();
                    } else {
                        this.$Message.error(data.msg);
                    }
                });
            },
        },
        mounted() {
        }

    }
</script>