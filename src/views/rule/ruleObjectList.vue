<template>
    <div>
        <Card>
                <j-table ref="ruleObjectTable" pagination autoSearch
                     :queryForm="queryForm"
                     :server="server.query"
                     :columns-list="columns" v-model="tableData"
                     :label-width="60" :input-col="5"
                     @on-delete="remove">
                <template slot="input-col">
                    <Col span="8">
                    <FormItem label="英文名称" prop="__LIKES_code">
                        <Input v-model="queryForm.__LIKES_code" placeholder="英文名称"></Input>
                    </FormItem>
                    </Col>
                    <Col span="8">
                    <FormItem label="中文名称" prop="__LIKES_name">
                        <Input v-model="queryForm.__LIKES_name" placeholder="中文名称"></Input>
                    </FormItem>
                    </Col>
                </template>
                <template slot="toolbar">
                    <router-link to="/ruleObjectEdit/add"><Button type="primary">新增</Button></router-link>
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
                    query: this.$services.ruleService.objectsRestController.query
                },
                queryForm: {
                    __LIKES_code: '',
                    __LIKES_name: ''
                },
                tableData: [],
                columns: [
                    { type: 'index', align: 'center', width: 50 },
                    { title: '英文名称', align: 'center', key: 'code' },
                    { title: '中文名称', align: 'center', key: 'name' },
                    { title: '数据类型', align: 'center', key: 'dataType' },
                    { title: '传递方向', align: 'center', key: 'inOut' },
                    { title: '分组', align: 'center', key: 'group' },
                    { title: '描述', align: 'center', key: 'remark' },
                    { title: '操作', align: 'center', key: 'action', width: 120, handler: [
                    {action: 'edit', path: '/ruleObjectEdit/edit'},
                    {action: 'view', path: '/ruleObjectView'},
                    {action: 'delete'}
                    ]
                   }],
            }
        },
        beforeRouteEnter(to, from, next){
            next(vm=>{
                vm.$refs.ruleObjectTable.handleQuery();
            })
        },
        methods: {
            remove(data, index) {
                this.$net.send({
                    server: this.$services.ruleService.objectsRestController.remove,
                    append: data.id
                }).then((data) => {
                    if (data.success) {
                        this.$Message.success(data.msg);
                        this.$refs.ruleObjectTable.refresh();
                    } else {
                        this.$Message.error(data.msg);
                    }
                });
            }
        }
    }
</script>
