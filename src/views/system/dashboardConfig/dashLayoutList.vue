<style lang="less">
    @import '../../../styles/common.less';
    @import 'draggable-list.less';
</style>
<template>
    <div>
        <Card>
            <j-table ref="dashLayoutTable" pagination autoSearch
                     :queryForm="queryForm"
                     :server="server.query"
                     :columns-list="columns" v-model="tableData"
                     :input-col="6"
                     @on-delete="remove"
                     @on-row-click="selectRow">
                <template slot="input-col">
                    <Col span="6">
                    <FormItem label="布局编码" prop="__LIKES_code">
                        <Input v-model="queryForm.__LIKES_code" placeholder="编码"></Input>
                    </FormItem>
                    </Col>
                    <Col span="6">
                    <FormItem label="布局名称" prop="__LIKES_name">
                        <Input v-model="queryForm.__LIKES_name" placeholder="名称"></Input>
                    </FormItem>
                    </Col>
                </template>
                <template slot="toolbar">
                    <router-link to="/dashLayoutEdit/add">
                        <Button type="primary">新增</Button>
                    </router-link>
                    <router-link :to="{path:'/dashLayoutDesign',query: {code: codeValue}}">
                        <Button :disabled="source" type="primary">设计</Button>
                    </router-link>
                    <Button type="primary" :disabled="professional" @click="showProfessional()">
                        专家模式
                    </Button>
                </template>
            </j-table>

        </Card>
        <Modal
                width="800"
                v-model="configmodel"
                title="专家模式设计布局"
                class-name="vertical-center-modal"
                @on-ok="btnSave('editForm')"
                @on-cancel="cancel">
            <Card style="height: 200px">
                <Form ref="editForm" :model="editForm" :rules="configRules" :label-width="71">
                    <Col span="20">
                    <FormItem label="设计脚本" prop="config">
                        <Input v-model="editForm.config" type="textarea" style="min-height: 170px;!important;"></Input>
                    </FormItem>
                    </Col>
                    <Col span="3">
                    <FormItem label="">
                        <Button type="primary" style="margin-left: -50px" @click="preview()">预览</Button>
                    </FormItem>
                    </Col>
                </Form>
            </Card>
            <Card style="display: none;" id="card">
                <div style="width: 100%;height:auto;overflow-y:visible;overflow: auto">
                    <div id="divWidth" style="width: 770px;min-height:228px;height: auto;overflow-y:visible;">

                        <div style="float: left;min-height:228px;height: auto;width: 252px;border: 1px dashed rgb(206, 194, 194);"
                             v-for="col in Cols" :key="col">
                            <ul :id="'column'+col" class="iview-admin-draggable-list"
                                style="min-height:150px;height: auto;width: 250px;overflow-x:visible">

                            </ul>
                        </div>
                    </div>
                </div>
            </Card>


        </Modal>
    </div>
</template>

<script>
    import Card from "iview/src/components/card/card";
    import Sortable from 'sortablejs';

    export default {
        components: {Card},
        data() {
            return {
                Cols: 3,
                codeValue: '',
                configmodel: false,
                server: {
                    query: this.$services.sysService.dashLayoutRestController.query
                },
                queryForm: {
                    __LIKES_code: '',
                    __LIKES_name: ''
                },
                editForm: {
                    config: ''
                },
                tableData: [],
                columns: [
                    {type: 'index', align: 'center', width: 50},
                    {title: '布局编码', align: 'center', key: 'code'},
                    {title: '布局名称', align: 'center', key: 'name'},
                    {title: '优先级', align: 'center', key: 'priority'},
                    {
                        title: '设计模式',
                        align: 'center',
                        key: 'designType',
                        formatter: "fixedDict:DashLayoutDesignType@system"
                    },
                    {title: '布局描述', align: 'center', key: 'desc'},
                    {
                        title: '操作', align: 'center', key: 'action', width: 120, handler: [
                            {action: 'edit', path: '/dashLayoutEdit/edit'},
                            {action: 'view', path: '/dashLayoutView'},
                            {action: 'delete'}
                        ]
                    }],
                professional: true,
                source: true,
                configRules: {
                    config: [
                        {required: true, message: '必填项', trigger: 'blur'}
                    ]
                }
            }
        },
        methods: {
            remove(data, index) {
                this.$net.send({
                    server: this.$services.sysService.dashLayoutRestController.remove,
                    append: data.code
                }).then((data) => {
                    if (data.success) {
                        this.$Message.success(data.msg);
                        this.$refs.dashLayoutTable.refresh();
                    } else {
                        this.$Message.error(data.msg);
                    }
                });
            },
            selectRow(data, index) {
                if (data.designType == "NORMAL") {
                    this.professional = true;
                    this.source = false;
                } else {
                    this.professional = false;
                    this.source = true;
                }
                this.codeValue = data.code;
            },
            showProfessional() {
                this.configmodel = true;
                this.$net.send({
                    server: this.$services.sysService.dashLayoutConfigRestController.query,
                    data: {__EQS_layoutCode: this.codeValue}
                }).then((data) => {
                    if (data.rows.length > 0) {
                        this.editForm = data.rows[0];
                    }
                    this.editForm.layoutCode = this.codeValue;
                });
                document.getElementById("card").style.display = "none";//
            },
            cancel() {

            },
            /*保存*/
            btnSave(name) {
                this.$refs[name].validate((valid) => { // 数据校验
                    if (!valid) {
                        return
                    }

                    this.$net.send({
                        server: this.$services.sysService.dashLayoutConfigRestController.save,
                        data: this.editForm
                    }).then((data) => {
                        if (data.success) {
                            this.$Message.success(data.msg);
                        } else {
                            this.$Message.error(data.msg);
                        }
                    });

                });
            },
            preview() {
                document.getElementById("card").style.display = "";//
                var data = JSON.parse(this.editForm.config);
                this.Cols = data.columns.length;
                document.getElementById('divWidth').setAttribute("style", "width :" + ((data.columns.length * 250) + 20) + "px");
                var _container = $(document.body);
                var _columns = $('<div id="columns"></div>').appendTo(_container);
                for (let i = 0; i < data.columns.length; i++) {
                    var _cc = data.columns[i];
                    var _column = $('<ul class="column" id="' + _cc.id + '"></ul>').appendTo(_columns);
                    for (var j = 0; j < _cc.widgets.length; j++) {
                        var _cw = _cc.widgets[j];
                        if(j==0){
                             $('#' + _cc.id).html("");
                        }
                        this._addWidget2Column(_cc.id, _cw);
                    }
                }
            },
            _addWidget2Column(id, _cw, flag) {
                var _column = $('#' + id);
                var _wt;
                var _wth;
                _wt = $('<li  id="' + _cw.id + '" style="border: 0px;width: 250px"></li>').appendTo(_column);
                _wth = $('<div class="panel panel-default" style="margin-bottom: 0px;"></div>').appendTo(_wt);

                /*组件头部分*/
                var _heading = $('<div class="panel-heading"></div>').appendTo(_wth);
                var _h3 = $('<div class="panel-title" style="font-size: 13px;">' + _cw.title + '</div>').appendTo(_heading);


                /*组件内容部分*/
                var _wtc = $('<div class="panel-body" id="' + _cw.id + '_content" style="padding: 0px; width: 100%;"></div>').appendTo(_wth);

                $('<div style="width:100%;height:100%;"></div>').appendTo(_wtc);
                _wtc.height(_cw.height / 2);
            }
        }
    }
</script>
