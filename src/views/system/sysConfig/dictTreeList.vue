<style lang="less">
    .dictTableDre{
        & .ivu-col-span-10{
            width: 18.666667%;
          }
    }
</style>
<template>
    <Card>
        <p slot="title">字典管理</p>
        <Row style="height: 715px;">
            <Col span="4">
                <Tree :data="treeNode" @on-select-change="getNode" style="height: 300px; overflow: auto;"></Tree>
            </Col>
            <Col span="20" class="dictTableDre">
                <Card>
                    <j-table ref="dictTable" pagination
                             :queryForm="queryForm"
                             :server="server.query"
                             :defaultParams="dictParam"
                             :columns-list="columns" v-model="tableData"
                             highlight-row
                             @on-current-change="getSelectRow"
                             @on-delete="remove"
                             @on-edit="editDict">
                        <template slot="input-col" >
                            <Col span="9">
                            <FormItem label="字典编码" prop="__LIKES_dictCode">
                                <Input v-model="queryForm.__LIKES_dictCode" placeholder="字典编码"></Input>
                            </FormItem>
                            </Col>
                            <Col span="9">
                            <FormItem label="字典名称" prop="__LIKES_dictName">
                                <Input v-model="queryForm.__LIKES_dictName" placeholder="字典名称"></Input>
                            </FormItem>
                            </Col>
                        </template>
                        <template slot="toolbar">
                            <Button type="primary" @click="addDict">新增</Button>
                        </template>
                    </j-table>
                    <Modal
                            ref="dictModel"
                            footerHide
                            v-model="dictModel"
                            title="新增字典">
                        <Form ref="editDictForm" :model="editDictForm" :rules="editDictRules" :label-width="130">
                            <FormItem label="所属分类编码" prop="dictCateCode">
                                <Input v-model="editDictForm.dictCateCode" readonly></Input>
                            </FormItem>
                            <FormItem label="字典编码" prop="dictCode" required>
                                <Input v-model="editDictForm.dictCode" :disabled="opt"></Input>
                            </FormItem>
                            <FormItem label="字典名称" prop="dictName" required>
                                <Input v-model="editDictForm.dictName"></Input>
                            </FormItem>
                            <FormItem label="字典描述" prop="dictDesc">
                                <Input v-model="editDictForm.dictDesc" type="textarea"></Input>
                            </FormItem>
                            <div align="center">
                                <Button @click="btnSaveDict('editDictForm')" type="primary" style="margin:0 11px;">保存</Button>
                                <Button type="ghost" @click="btnBack">返回</Button>
                            </div>
                        </Form>
                    </Modal>
                </Card>
                <Card>
                    <j-table ref="dictItemTable" pagination hiddenForm
                             :queryForm="queryForm"
                             :server="server.queryItem"
                             :defaultParams="dictItemParam"
                             :columns-list="columnsItem" v-model="tableItemData"
                             @on-edit="editItem"
                             @on-delete="removeItem">
                        <template slot="toolbar">
                            <Button type="primary" @click="addDictItem">新增</Button>
                        </template>
                    </j-table>
                    <Modal
                            ref="dictItemModel"
                            footerHide
                            v-model="dictItemModel"
                            title="新增字典项">
                        <Form ref="editDictItemForm" :model="editDictItemForm" :rules="editDictItemRules" :label-width="130">
                            <FormItem label="字典类别编码" prop="dictCateCode">
                                <Input v-model="editDictItemForm.dictCateCode" readonly></Input>
                            </FormItem>
                            <FormItem label="字典编码" prop="dictCode">
                                <Input v-model="editDictItemForm.dictCode" readonly></Input>
                            </FormItem>
                            <FormItem label="字典项名称" prop="itemLabel" required>
                                <Input v-model="editDictItemForm.itemLabel"></Input>
                            </FormItem>
                            <FormItem label="字典项值" prop="itemValue" required>
                                <Input v-model="editDictItemForm.itemValue"></Input>
                            </FormItem>
                            <FormItem label="字典项描述" prop="itemDesc">
                                <Input v-model="editDictItemForm.itemDesc" type="textarea"></Input>
                            </FormItem>
                            <div align="center">
                                <Button @click="btnSaveDictItem('editDictItemForm')" type="primary" style="margin:0 11px;">保存</Button>
                                <Button type="ghost" @click="btnBack2">返回</Button>
                            </div>
                        </Form>
                    </Modal>
                </Card>
            </Col>
        </Row>
    </Card>
</template>

<script>
    export default {
        name: 'dictTreeList',
        data () {
            return {
                opt: false,
                treeNode: [],
                dictParam: {},
                dictItemParam: {},
                dictModel: false,
                dictItemModel: false,
                editDictForm: {
                    dictCateCode: '',
                    dictCode:'',
                    dictName: '',
                    dictDesc: ''
                },
                editDictItemForm: {
                    dictCateCode: '',
                    dictCode: '',
                    itemLabel: '',
                    itemValue: '',
                    itemDesc: ''
                },
                editDictForm_dictCateCode:'',
                editDictItemForm_dictCateCode:'',
                editDictItemForm_dictCode: '',
                editDictRules:{
                    dictCode: [
                        {required: true, message: '必填项', trigger: 'blur'},
                        { validator: (rule, value, callback) => {
                                if(!this.opt){
                                    this.$net.send({
                                        server: this.$services.sysService.dictRestController.check,
                                        data: {dictCode: value}
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
                    dictName: [
                        {required: true, message: '必填项', trigger: 'blur'}
                    ]
                },
                editDictItemRules: {
                    itemLabel: [
                        {required: true, message: '必填项', trigger: 'blur'}
                    ],
                    itemValue: [
                        {required: true, message: '必填项', trigger: 'blur'}
                    ]
                },
                server: {
                    query: this.$services.sysService.dictRestController.query,
                    queryItem: this.$services.sysService.dictItemRestController.query
                },
                queryForm: {
                    __LIKES_dictCode: '',
                    __LIKES_dictName: ''
                },
                tableData: [],
                tableItemData: [],
                columns: [
                    { type: 'index', align: 'center', width: 80 },
                    { title: '字典编码', align: 'center', key: 'dictCode' },
                    { title: '字典名称', align: 'center', key: 'dictName' },
                    { title: '字典描述', align: 'center', key: 'dictDesc' },
                    { title: '操作', align: 'center', key: 'action', width: 120, handler: [
                            {action: 'edit' },
                            {action: 'delete'}
                        ]
                    }],
                columnsItem: [
                    { type: 'index', align: 'center', width: 80 },
                    { title: '字典项名称', align: 'center', key: 'itemLabel' },
                    { title: '字典项值', align: 'center', key: 'itemValue' },
                    { title: '字典项描述', align: 'center', key: 'itemDesc' },
                    { title: '操作', align: 'center', key: 'action', width: 120, handler: [
                            {action: 'edit'},
                            {action: 'delete'}
                        ]
                    }]
                }
            },
        created () {
            this.init();
        },
        methods: {
            init(){
                this.$net.send({
                    server: this.$services.sysService.dictCateRestController.load
                }).then((data)=>{
                    this.treeNode = data;
                });
            },
            getNode(node){
                this.tableData= [];
                this.tableItemData= [];
                this.dictParam = { __EQS_dictCateCode: node[0].dictCateCode};
                this.editDictForm.dictCateCode = node[0].dictCateCode;
                this.editDictForm_dictCateCode=node[0].dictCateCode;
                this.editDictItemForm.dictCateCode = node[0].dictCateCode;
                this.editDictItemForm_dictCateCode = node[0].dictCateCode;
            },
            getSelectRow(row){
                if(row.dictCode != undefined)
                {
                    this.dictItemParam = {__EQS_dictCode: row.dictCode};
                    this.editDictItemForm.dictCode = row.dictCode;
                    this.editDictItemForm_dictCode= row.dictCode;
                }
            },
            addDict(){
                this.dictModel = true;
                this.editDictForm={};
                this.editDictForm.dictCateCode=this.editDictForm_dictCateCode;
                this.opt = false;
            },
            addDictItem(){
                this.dictItemModel = true;
                this.editDictItemForm={};
                this.editDictItemForm.dictCode= this.editDictItemForm_dictCode;
                this.editDictItemForm.dictCateCode=this.editDictItemForm_dictCateCode;
            },
            /*保存dict*/
            btnSaveDict(name) {
                this.$refs[name].validate((valid) => { // 数据校验
                    if (!valid) {
                        return
                    }

                    this.$net.send({
                        server: this.$services.sysService.dictRestController.save,
                        data: this.editDictForm
                    }).then((data) => {
                        if (data.success) {
                            this.$Message.success(data.msg);
                            this.$refs.dictTable.refresh();
                            this.btnBack();
                        } else {
                            this.$Message.error(data.msg);
                        }
                    });

                });
            },
            /*保存dictItem*/
            btnSaveDictItem(name) {
                this.$refs[name].validate((valid) => { // 数据校验
                    if (!valid) {
                        return
                    }

                    this.$net.send({
                        server: this.$services.sysService.dictItemRestController.save,
                        data: this.editDictItemForm
                    }).then((data) => {
                        if (data.success) {
                            this.$Message.success(data.msg);
                            this.$refs.dictItemTable.refresh();
                            this.btnBack2();
                        } else {
                            this.$Message.error(data.msg);
                        }
                    });

                });
            },
            remove(data, index) {
                this.$net.send({
                    server: this.$services.sysService.dictRestController.remove,
                    append: data.dictCode
                }).then((data) => {
                    if (data.success) {
                        this.$Message.success(data.msg);
                        this.$refs.dictTable.refresh();
                    } else {
                        this.$Message.error(data.msg);
                    }
                });
            },
            editDict(row){
                this.dictModel = true;
                this.editDictForm = row;
                this.opt=true;
            },
            editItem(row){
                this.dictItemModel = true;
                this.editDictItemForm = row;
            },
            removeItem(data, index) {
                this.$net.send({
                    server: this.$services.sysService.dictItemRestController.remove,
                    append: data.itemId
                }).then((data) => {
                    if (data.success) {
                        this.$Message.success(data.msg);
                        this.$refs.dictItemTable.refresh();
                    } else {
                        this.$Message.error(data.msg);
                    }
                });
            },
            /*返回*/
            btnBack() {
                this.$refs.dictModel.close();
            },
            btnBack2() {
                this.$refs.dictItemModel.close();
            }
        }
    };
</script>
