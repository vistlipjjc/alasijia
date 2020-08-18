<template>
    <div>
        <Card>
                <j-table ref="pkgRuleMapTable" pagination :autoSearch="false"
                     :queryForm="queryForm"
                     :server="server.query"
                     :columns-list="columns" v-model="tableData"
                     :label-width="80" :input-col="7"
                     @on-delete="remove"
                     @on-row-click="rowClick"
                     :default-params="pkgRuleMapParam">
                <template slot="input-col">
                    <Col span="8">
                    <FormItem label="规则" prop="__LIKES_ruleName">
                        <Input v-model="queryForm.__LIKES_ruleName" placeholder="名称"></Input>
                    </FormItem>
                    </Col>
                </template>
                <template slot="toolbar">
                    <Button type="primary" @click="openSelectWin">增加</Button>
                    <Button type="ghost" @click="btnBack">返回</Button>
                </template>
            </j-table>
            <Modal
                    ref="ruleModel"
                    footerHide
                    v-model="ruleModel"
                    title="选择规则库"
                    width="1000">
                <j-table ref="addRuleMapTable" pagination autoSearch
                         :queryForm="ruleQueryForm"
                         :server="server.ruleQuery"
                         :columns-list="columnsRule" v-model="ruleTableData"
                         @on-select="selectRow">
                    <template slot="input">
                        <FormItem label="规则" prop="__LIKES_name">
                            <Input v-model="ruleQueryForm.__LIKES_name" placeholder="名称"></Input>
                        </FormItem>
                    </template>
                    <template slot="toolbar">
                        <Button type="primary" @click="saveRules">保存</Button>
                    </template>
                </j-table>
            </Modal>
        </Card>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                server: {
                    query: this.$services.ruleService.pkgRuleMapRestController.query,
                    ruleQuery:this.$services.ruleService.rulesRestController.query
                },
                queryForm: {
                    __LIKES_ruleName: ''
                },
                tableData: [],
                pkgRuleMapParam: {},
                ruleModel: false,
                columns: [
                    { type: 'index', align: 'center', width: 50 },
                    { title: '规则', align: 'center', key: 'ruleName' },
                    { title: '操作', align: 'center', key: 'action', width: 120, handler: [
                        {action: 'view', path: '/pkgRuleMapView'},
                        {action: 'delete'}

                    ]
                   }],
                columnsRule: [
                    { type: 'selection', align: 'center', width: 50 },
                    { title: '规则编码', align: 'center', key: 'code' },
                    { title: '规则名称', align: 'center', key: 'name' },
                    { title: '规则优先级', align: 'center', key: 'priority' },
                    { title: '备注', align: 'center', key: 'remark' },
                    { title: '操作', align: 'center', key: 'action', width: 120, handler: [
                        {action: 'view', path: '/rulesView'  }
                    ]
                    }],
                ruleTableData: [],
                ruleQueryForm: {
                    __LIKES_name: ''
                },
                pkgRuleMapTable:[],
                rulesTable:[]
            }
        },
        mounted() {
            this.init()
        },
        methods: {
            selectRow(selection, row){
                this.selectedRow = selection;
            },
            remove(data, index) {
                this.$net.send({
                    server: this.$services.ruleService.pkgRuleMapRestController.remove,
                    append: data.id
                }).then((data) => {
                    if (data.success) {
                        this.$Message.success(data.msg);
                        this.$refs.pkgRuleMapTable.refresh();
                    } else {
                        this.$Message.error(data.msg);
                    }
                });
            },
            init(){
                this.pkgRuleMapParam=this.$route.query;
                this.$net.send({
                    server: this.$services.ruleService.pkgRuleMapRestController.query,
                })
            },
            openSelectWin(){
                this.ruleModel = true;
            },
            saveRules(){
                this.rulesIds=this.arrayToStr(this.selectedRow);
                let obj = {
                    packagesId: this.pkgRuleMapParam.__EQS_pkgId,
                    rules: this.rulesIds
                };
                this.$net.send({
                    server: this.$services.ruleService.pkgRuleMapRestController.batchInsert,
                    data: obj
                }).then((data) => {
                    if (data.success) {
                        this.$Message.success(data.msg);
                        this.ruleModel = false;
                        this.$refs.pkgRuleMapTable.refresh();
                    } else {
                        this.$Message.error(data.msg);
                    }
                });
            },
            arrayToStr(array){
                this.rulesIds="";
                for(var i=0;i<array.length;i++){
                    this.rulesIds+=array[i].id+","
                }
                return this.rulesIds;
            },
            /*返回*/
            btnBack() {
                this.tableData = [];
                this.$router.go(-1);
                this.$store.commit('removeTag', 'rulePackagesList');
                this.$store.commit('closePage', 'rulePackagesList');
            },
            rowClick(row,index){
                this.ruleData={Id: row.id,pkgId:row.pkgId,ruleId:row.ruleId};
            }
        }
    }
</script>
