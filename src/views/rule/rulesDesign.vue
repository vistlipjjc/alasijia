<template>
    <div>
        <Card>

            <Card>
                <Row>
                    <Col span="8">
                    编辑规则—— <a v-model="this.$route.query.name"/></Col>
                    <Col span="4" offset="12">
                    <Button type="ghost" @click="btnBack()">返回</Button>
                    </Col>
                </Row>
            </Card>
            <Tabs value="name1">
                <TabPane label="对象库" name="name1">
                    <Card title="传入对象">
                        <j-table ref="queryRuleObjectTable" pagination autoSearch hiddenForm
                                 :server="server.queryRuleObject"
                                 :defaultParams="{ruleId: this.$route.query.id}"
                                 :columns-list="columns" v-model="ruleObject"
                                 @requestSuccess="setData"
                                 @on-row-click="selectRow"
                                 @on-select="selectionRule"
                                 @on-select-cancel="selectCancelRule"
                                 @on-select-all="selectAllRule"
                        >
                            <template slot="toolbar">
                                <Button type="ghost" @click="add()">添加</Button>
                                <Button type="ghost" @click="remove()">删除</Button>
                            </template>
                        </j-table>
                    </Card>
                    <Card title="函数">
                        <j-table ref="ruleFunctionsTable" pagination autoSearch hiddenForm
                                 :server="server.queryRuleFunctions"
                                 :columns-list="ruleFunctionColumns" v-model="ruleFunctions"
                                 @requestSuccess="setFunction"
                        >
                        </j-table>
                    </Card>
                    <Card title="常量">
                        <j-table ref="ruleFunctionTable" pagination autoSearch  hiddenForm
                                 :columns-list="columnsRuleFunction" v-model="ruleFunction"
                        >
                        </j-table>
                    </Card>
                </TabPane>
                <TabPane label="编辑器" name="name2">
                    <Card>
                        <j-editor ref="ruleObjectTable"
                                  :compile="server.compile"
                                  :save="server.save"
                                  :ruleId="ruleId"
                                  :objects="objects"
                                  :functions="functions"
                                  :script="script"
                        >
                        </j-editor>
                    </Card>
                </TabPane>

                <TabPane label="源码" name="name3">
                    源码源码源码源码
                </TabPane>
            </Tabs>

        </Card>

        <Modal v-model="ruleObjectModal"
               title="编辑岗位仪表盘布局映射"
               width="800"
               footerHide
        >
            <Card>
                <j-table ref="rulesObjectTable" pagination autoSearch
                         :queryForm="queryForm"
                         :server="server.query"
                         :columns-list="columns" v-model="tableData"
                         @on-select="selection"
                         @on-select-cancel="selectCancel"
                         @on-select-all="selectAll"
                >
                    <template slot="input">
                        <FormItem label="编码" prop="__LIKES_code">
                            <Input v-model="queryForm.__LIKES_code" placeholder="编码"></Input>
                        </FormItem>
                        <FormItem label="名称" prop="__LIKES_name">
                            <Input v-model="queryForm.__LIKES_name" placeholder="名称"></Input>
                        </FormItem>
                    </template>
                    <template slot="toolbar">
                        <Button type="primary" @click="selectRulesObject()">选择</Button>
                        <Button type="primary">取消</Button>
                    </template>
                </j-table>

            </Card>
        </Modal>


        <Modal v-model="ruleTestModal"
               title="规则测试"
               width="800"
        >
            <Card>

                <template slot="input">
                    <FormItem label="编码" prop="__LIKES_code">
                        <Input v-model="queryForm.__LIKES_code" placeholder="编码"></Input>
                    </FormItem>
                    <FormItem label="名称" prop="__LIKES_name">
                        <Input v-model="queryForm.__LIKES_name" placeholder="名称"></Input>
                    </FormItem>
                </template>
                <template slot="toolbar">
                    <Button type="primary" @click="selectRulesObject()">选择</Button>
                    <Button type="primary">取消</Button>
                </template>


            </Card>
        </Modal>

    </div>


</template>

<script>

    import jEditor from './component/jEditor/jEditor.vue';

    export default {
        components: {
            jEditor
        },
        data() {
            return {
                data: [],
                ruleObjectData: [],
                objIds: '',
                ruIds: '',
                queryParam: {},
                server: {
                    compile: this.$services.ruleService.rulesRestController.compile,
                    save: this.$services.ruleService.rulesContentRestController.save,
                    queryRuleObject: this.$services.ruleService.ruleObjectMapRestController.findObjectsByRuleId,
                    queryRuleFunctions: this.$services.ruleService.functionsRestController.query,
                    query: this.$services.ruleService.objectsRestController.query
                },
                ruleId: "",
                ruleCode: "",
                ruleIds: "",
                objects: [],
                functions: [],
                script: '',
                sourceCode: '',
                queryForm: {
                    __LIKES_code: "",
                    __LIKES_name: ""
                },
                ruleObjectModal: false,
                ruleTestModal: false,
                tableData: [],
                ruleObject: [],
                ruleFunctions: [],
                ruleFunction: [],
                permitSet: [],
                columns: [
                    {type: 'selection', align: 'center', title: ' ', key: '', width: 60},
                    {title: '英文名称', align: 'center', key: 'code'},
                    {title: '中文名称', align: 'center', key: 'name'},
                    {title: '数据类型', align: 'center', key: 'dataType'},
                    {title: '分组', align: 'center', key: 'group'},
                    {title: '说明', align: 'center', key: 'remark'}
                ],

                ruleFunctionColumns: [
                    {type: 'index', align: 'center', width: 50},
                    {title: '编码', align: 'center', key: 'code'},
                    {title: '名称', align: 'center', key: 'name'},
                    {title: '说明', align: 'center', key: 'remark'}
                ],
                columnsRuleFunction: [
                    {type: 'index', align: 'center', width: 50},
                    {title: '英文名称', align: 'center', key: 'code'},
                    {title: '中文名称', align: 'center', key: 'name'}
                ]
            }
        },
        beforeRouteEnter(to, from, next){
            next(vm=>{
                // vm.$refs.queryRuleObjectTable.handleQuery();
                // vm.$refs.ruleFunctionsTable.handleQuery();
                // vm.$refs.ruleFunctionTable.handleQuery();
            })
        },
        methods: {
            init() {
                this.ruleId = this.$route.query.id;
                this.ruleCode = this.$route.query.code;
                // this.objects = this.ruleObject;
                // this.functions = this.ruleFunctions;
                this.$net.send({
                    server: this.$services.ruleService.rulesRestController.design,
                    append: this.$route.query.id
                }).then((data) => {
                    if(data.rulesContent){
                        if(data.rulesContent.htmlLhs){
                            this.script = data.rulesContent.htmlLhs;
                        }
                        let sourceCode = data.rulesContent.content;
                        this.sourceCode = sourceCode;
                    }
                });

            },

            setData(data) {
                this.objects= data;
            },
            setFunction(data) {
                this.functions= data;
            },

            selectRow(data, index) {

            },

            add() {
                this.ruleObjectModal = true;
            },
            selection(selection, row) {
                this.data = selection;
            },
            selectCancel(selection, row) {
                this.data = selection;
            },

            selectAll(selection) {
                this.data = selection;
            },

            selectionRule(selection, row) {
                this.ruleObjectData = selection;
            },
            selectCancelRule(selection, row) {
                this.ruleObjectData = selection;
            },

            selectAllRule(selection) {
                this.ruleObjectData = selection;
            },

            selectRulesObject() {
                if (this.data.length <= 0) {
                    this.$Message.warning("请选择数据！");
                    return
                }
                if (this.data.length > 0) {
                    for (let i = 0; i < this.data.length; i++) {
                        this.objIds += this.data[i].id + ",";
                    }
                }
                this.$net.send({
                    server: this.$services.ruleService.ruleObjectMapRestController.batchInsert,
                    data: {
                        ruleId: this.$route.query.id,
                        objIds: this.objIds
                    }
                }).then((data) => {
                    if (data.success) {
                        this.$Message.success(data.msg);
                        this.objIds = '';
                        this.ruleObjectModal = false;
                        this.$refs.queryRuleObjectTable.refresh();
                    } else {
                        this.$Message.error(data.msg);
                    }
                });
            },


            remove() {
                if (this.ruleObjectData.length > 0) {
                    for (let i = 0; i < this.ruleObjectData.length; i++) {
                        this.ruleIds += this.ruleObjectData[i].id + ",";
                    }
                }
                this.$net.send({
                    server: this.$services.ruleService.ruleObjectMapRestController.batchremove,
                    data: {
                        ruleIds: this.ruleIds
                    }
                }).then((data) => {
                    if (data.success) {
                        this.$Message.success(data.msg);
                        this.$refs.queryRuleObjectTable.refresh();
                    } else {
                        this.$Message.error(data.msg);
                    }
                });
                console.log(this.objIds);
                this.ruleIds = '';
            },
            /*返回*/
            btnBack() {
                this.$router.go(-1);
                this.$store.commit('removeTag', 'rulesDesign');
                this.$store.commit('closePage', 'rulesDesign');
            },
        }

    }
</script>

<style scoped>

</style>
