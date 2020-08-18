<template>
    <div>

          <Card>
              <Row :gutter="10">
                      <Col :sm="24" :md="12" :lg="8">
            <j-table ref="rulesTable" pagination :autoSearch="false" hiddenForm
                     :server="server.queryRuleList"
                     :columns-list="columns" v-model="rulesTableData"
                     :default-params="rulesParams"
                     @on-row-click="rowClick">
            </j-table>
              </Col>
                  <Col :sm="24" :md="12" :lg="16">

            <j-table ref="modelRuleScoreTable" pagination  hiddenForm
                     :server="server.queryModelRuleScore"
                     :columns-list="columnsR" v-model="modelRuleScoreTableData"
                     :default-params="modelRuleScoreParams"
                     @on-edit="editItem"
                     @on-delete="remove">
                <template slot="toolbar">
                    <Button type="primary" @click="addItem">新增</Button>
                    <Button type="ghost" @click="btnBack" >返回</Button>
                </template>
            </j-table>
              </Col>
        </Row>
            <Modal
                    ref="scoreModel"
                    footerHide
                    v-model="scoreModel"
                    title="选择规则库"
                    width="800">
                <Row>
                    <Form ref="editForm" :model="editForm"  :label-width="100">
                        <Col span="11">
                            <FormItem label="最小阈值" prop="minValue" required>
                                <Input-number :max="9999" :min="1" :step="1" v-model="editForm.minValue" style="width: 100%"></Input-number>
                            </FormItem>
                        </Col>
                        <Col span="11">
                            <FormItem label="最大阈值" prop="maxValue" required>
                                <Input-number :max="9999" :min="1" :step="1" v-model="editForm.maxValue" style="width: 100%"></Input-number>
                            </FormItem>
                        </Col>
                        <Col span="11">
                            <FormItem label="分值" prop="score">
                                <Input-number :max="9999" :min="1" :step="1" v-model="editForm.score" style="width: 100%"></Input-number>
                            </FormItem>
                        </Col>
                        <Col span="22" >
                            <FormItem label="备注" prop="remark">
                                <Input v-model="editForm.remark" type="textarea" ></Input>
                            </FormItem>
                        </Col>
                        <Col span="22">
                            <div align="center">
                                <Button @click="btnSave('editForm')" type="primary" style="margin:0 11px;">保存</Button>
                                <Button type="ghost" @click="closeModal">返回</Button>
                            </div>
                        </Col>
                    </Form>
                </Row>
            </Modal>
        </Card>

    </div>
</template>

<script>
    export default {
        data() {
            return {
                server: {
                    queryRuleList: this.$services.ruleService.pkgRuleMapRestController.query,
                    queryModelRuleScore: this.$services.ruleService.modelRuleScoreRestController.query,
                },
                rulesTableData: [],
                modelRuleScoreTableData: [],
                columns: [
                    { type: 'index', align: 'center', width: 50 },
                    { title: '规则名称', align: 'center', key: 'ruleName' }
                   ],
                columnsR: [
                    { type: 'index', align: 'center', width: 50 },
                    { title: '规则名称', align: 'center', key: 'ruleName' },
                    { title: '最大阈值', align: 'center', key: 'maxValue' },
                    { title: '最小阈值', align: 'center', key: 'minValue' },
                    { title: '分值', align: 'center', key: 'score' },
                    { title: '备注', align: 'center', key: 'remark' },
                    { title: '操作', align: 'center', key: 'action', width: 120, handler: [
                            {action: 'edit'},
                            {action: 'delete'}
                        ]
                    }],
                rulesParams:{},
                modelRuleScoreParams:{},
                modelRuleScoreTable:[],
                rulesTable:[],
                modelId:'',
                scoreModel:false,
                ruleId:'',
                ruleName:'',
                editForm:{
                    minValue:'',
                    maxValue:'',
                    score:'',
                    remark:''
                }
            }
        },
        mounted() {
            this.init();
        },
        methods: {
            remove(data, index) {
                this.$net.send({
                    server: this.$services.ruleService.modelRuleScoreRestController.remove,
                    append: data.id
                }).then((data) => {
                    if (data.success) {
                    this.$Message.success(data.msg);
                    this.$refs.rulesTable.refresh();
                } else {
                    this.$Message.error(data.msg);
                }
            });
            },
            rowClick(row,index){
                this.selectedRow = row;
                this.modelRuleScoreParams = {__EQS_modelId : this.modelId,__EQS_ruleId : row.ruleId};
                this.editForm.ruleId=row.ruleId;
                this.ruleId=row.ruleId;
                this.editForm.ruleName=row.ruleName;
                this.ruleName=row.ruleName;
            },
            init(){
               this.rulesParams = {__EQS_pkgId: this.$route.query.pkgId};
               this.modelId = this.$route.query.modelId;
               this.$net.send({
                    server:this.$services.ruleService.pkgRuleMapRestController.query
                })
            },
            //新增
            addItem(){
                this.editForm={};
                this.editForm.ruleId=this.ruleId;
                this.editForm.ruleName=this.ruleName;
                this.editForm.minValue='';
                this.editForm.maxValue='';
                this.editForm.score='';
                this.editForm.remark='';
                this.scoreModel = true;
            },
            //修改
            editItem(row){
                this.scoreModel = true;
                this.editForm = row;
            },
            /*保存*/
            btnSave(name) {
                this.$refs[name].validate((valid) => { // 数据校验
                    if (!valid) {
                    return
                }
                this.editForm.modelId=this.modelId;

                this.$net.send({
                    server: this.$services.ruleService.modelRuleScoreRestController.save,
                    data: this.editForm
                    }).then((data) => {
                        if (data.success) {
                        this.$Message.success(data.msg);
                        this.scoreModel=false;
                        this.$refs.modelRuleScoreTable.refresh();
                        // this.btnBack();
                    } else {
                        this.$Message.error(data.msg);
                    }
                 });

                });
            },
            btnBack(){
                this.$router.go(-1);
                this.$store.commit('removeTag', 'modelRuleScoreList');
                this.$store.commit('closePage', 'modelRuleScoreList');
            },
            closeModal(){
                // this.$refs.scoreModel.close();
                this.btnBack();
            }
        }
    }
</script>
