<template>
    <div>
        <Card>
                <j-table ref="scoreModelTable" pagination autoSearch
                     :queryForm="queryForm"
                     :server="server.query"
                     :columns-list="columns" v-model="tableData"
                     :label-width="80" :input-col="7"
                     @on-delete="remove"
                     @on-row-click="rowClick">
                <template slot="input-col">
                    <Col span="8">
                    <FormItem label="评分编码" prop="__LIKES_code">
                        <Input v-model="queryForm.__LIKES_code" placeholder="评分编码"></Input>
                    </FormItem>
                    </Col>
                    <Col span="8">
                    <FormItem label="评分名称" prop="__LIKES_name">
                        <Input v-model="queryForm.__LIKES_name" placeholder="评分名称"></Input>
                    </FormItem>
                    </Col>
                </template>
                <template slot="toolbar">
                    <router-link to="/scoreModelEdit/add"><Button type="primary">新增</Button></router-link>
                    <Button type="ghost" @click="modelRuleScoreList" >评分项设置</Button>

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
                    query: this.$services.ruleService.scoreModelRestController.query
                },
                queryForm: {
                    __LIKES_code: '',
                    __LIKES_name: ''
                },
                tableData: [],
                columns: [
                    { type: 'index', align: 'center', width: 50 },
                    { title: '评分编码', align: 'center', key: 'code' },
                    { title: '评分名称', align: 'center', key: 'name' },
                    { title: '规则集名称', align: 'center', key: 'rulPkgName' },
                    { title: '评分算法', align: 'center', key: 'algorithm' },
                    { title: '备注', align: 'center', key: 'remark' },
                    { title: '操作', align: 'center', key: 'action', width: 120, handler: [
                    {action: 'edit', path: '/scoreModelEdit/edit'},
                    {action: 'view', path: '/scoreModelView'},
                    {action: 'delete'}
                    ]
                   }],
            }
        },
        beforeRouteEnter(to, from, next){
            next(vm=>{
                vm.$refs.scoreModelTable.handleQuery();
            })
        },
        methods: {
            remove(data, index) {
                this.$net.send({
                    server: this.$services.ruleService.scoreModelRestController.remove,
                    append: data.id
                }).then((data) => {
                    if (data.success) {
                        this.$Message.success(data.msg);
                        this.$refs.scoreModelTable.refresh();
                    } else {
                        this.$Message.error(data.msg);
                    }
                });
            },
            rowClick(row,index){
                this.selectedRow = {__EQS_pkgId: row.id};
                this.modelId=row.id;
                this.pkgId=row.rulPkgId;
            },
            modelRuleScoreList(){
                this.$router.push({path: '/modelRuleScoreList', query:{pkgId: this.pkgId,modelId:this.modelId}});
            }
        }
    }
</script>
