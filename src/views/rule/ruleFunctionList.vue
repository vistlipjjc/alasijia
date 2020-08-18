<template>
    <div>
        <Card>
                <j-table ref="ruleFunctionTable" pagination autoSearch
                     :queryForm="queryForm"
                     :server="server.query"
                     :columns-list="columns" v-model="tableData"
                     :label-width="50" :input-col="5"
                     @on-delete="remove">
                <template slot="input-col">
                    <Col span="8">
                    <FormItem label="编码" prop="__LIKES_code">
                        <Input v-model="queryForm.__LIKES_code" placeholder="编码"></Input>
                    </FormItem>
                    </Col>
                    <Col span="8">
                    <FormItem label="名称" prop="__LIKES_name">
                        <Input v-model="queryForm.__LIKES_name" placeholder="名称"></Input>
                    </FormItem>
                    </Col>
                </template>
                <template slot="toolbar">
                    <router-link to="/ruleFunctionEdit/add"><Button type="primary">新增</Button></router-link>
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
                    query: this.$services.ruleService.functionsRestController.query
                },
                queryForm: {
                    __LIKES_code: '',
                    __LIKES_name: ''
                },
                tableData: [],
                columns: [
                    { type: 'index', align: 'center', width: 50 },
                    { title: '编码', align: 'center', key: 'code' },
                    { title: '名称', align: 'center', key: 'name' },
                    { title: '描述', align: 'center', key: 'remark' },
                    { title: '操作', align: 'center', key: 'action', width: 120, handler: [
                    {action: 'edit', path: '/ruleFunctionEdit/edit'},
                    {action: 'view', path: '/ruleFunctionView'},
                    {action: 'delete'}
                    ]
                   }],
            }
        },
        beforeRouteEnter(to, from, next){
            next(vm=>{
                vm.$refs.ruleFunctionTable.handleQuery();
            })
        },
        methods: {
            remove(data, index) {
                this.$net.send({
                    server: this.$services.ruleService.functionsRestController.remove,
                    append: data.id
                }).then((data) => {
                    if (data.success) {
                        this.$Message.success(data.msg);
                        this.$refs.ruleFunctionTable.refresh();
                    } else {
                        this.$Message.error(data.msg);
                    }
                });
            }
        }
    }
</script>
