<template>
    <div>
        <Card>
                <j-table ref="rulePackagesTable" pagination autoSearch
                     :queryForm="queryForm"
                     :server="server.query"
                     :columns-list="columns" v-model="tableData"
                     :label-width="80" :input-col="7"
                     @on-delete="remove"
                     @on-row-click="rowClick">
                <template slot="input-col">
                    <Col span="8">
                    <FormItem label="中文名称" prop="__LIKES_name">
                        <Input v-model="queryForm.__LIKES_name" placeholder="名称"></Input>
                    </FormItem>
                    </Col>
                </template>
                <template slot="toolbar">
                    <router-link to="/packagesEdit/add"><Button type="primary">新增</Button></router-link>
                    <Button type="primary" @click="pkgRuleMap" >管理规则</Button>
                    <Button type="primary" @click="deploy">部署</Button>
                    <Button type="primary" @click="unDeploy">反部署</Button>
                    <!--Todo-->
                    <router-link to="/packagesEdit/add"><Button type="primary" hidden>测试</Button></router-link>
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
                    query: this.$services.ruleService.packagesRestController.query
                },
                queryForm: {
                    __LIKES_name: ''
                },
                tableData: [],
                columns: [
                    { type: 'index', align: 'center', width: 50 },
                    { title: '英文名称', align: 'center', key: 'code' },
                    { title: '中文名称', align: 'center', key: 'name' },
                    { title: '是否评分', align: 'center', key: 'type',formatter: 'fixedDict:YesNo@system' },
                    { title: '状态', align: 'center', key: 'state' },
                    { title: '操作', align: 'center', key: 'action', width: 120, handler: [
                    {action: 'edit', path: '/packagesEdit/edit'},
                    {action: 'view', path: '/packagesView'},
                    {action: 'delete'}
                    ]
                   }],
            }
        },
        beforeRouteEnter(to, from, next){
            next(vm=>{
                vm.$refs.rulePackagesTable.handleQuery();
            })
        },
        methods: {
            remove(data, index) {
                this.$net.send({
                    server: this.$services.ruleService.packagesRestController.remove,
                    append: data.id
                }).then((data) => {
                    if (data.success) {
                        this.$Message.success(data.msg);
                        this.$refs.rulePackagesTable.handleQuery();
                    } else {
                        this.$Message.error(data.msg);
                    }
                });
            },
            rowClick(row,index){
                this.selectedRow = {__EQS_pkgId: row.id};
                this.packagesId=row.id;
                this.state=row.state;
            },
            pkgRuleMap(){
                this.$router.push({path: '/pkgRuleMap', query:this.selectedRow});
            },
            //部署规则模型
            deploy(){
                if(!this.packagesId){
                    this.$Message.error('请选择要部署的模型');
                    return;
                }
                this.$net.send({
                    server: this.$services.ruleService.packagesRestController.deploy,
                    append: this.packagesId
                }).then((data) => {
                    if (data.success) {
                        this.$Message.success(data.msg);
                        this.$refs.rulePackagesTable.handleQuery();
                    } else {
                        this.$Message.error(data.msg);
                    }
                });

            },
            //反部署规则模型
            unDeploy(){
                if(!this.packagesId){
                    this.$Message.error('请选择要反部署的模型');
                    return;
                }
                if((this.state)!='DEPLOY'){
                    this.$Message.info('请选择已经部署的模型');
                    return;
                }
                this.$net.send({
                    server: this.$services.ruleService.packagesRestController.unDeploy,
                    append: this.packagesId
                }).then((data) => {
                    if (data.success) {
                        this.$Message.success(data.msg);
                        this.$refs.rulePackagesTable.handleQuery();
                    } else {
                        this.$Message.error(data.msg);
                    }
                });
            },
            //测试规则模型
            test(){

            }
        }
    }
</script>
