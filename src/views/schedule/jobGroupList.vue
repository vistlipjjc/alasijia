<template>
    <div class="jobGroupCtnr">
        <Card>
            <j-table ref="jobGroupTable" pagination autoSearch :input-col="5"
                     :queryForm="queryForm"
                     :server="server.query"
                     :columns-list="columns" v-model="tableData"
                     @on-delete="remove">
               <!-- <template slot="input">

               </template>-->
                <Col span="8" slot="input-col">
                    <FormItem label="类型编码" :labelWidth="70" prop="__LIKES_code" style="width: 100%">
                        <Input v-model="queryForm.__LIKES_code" placeholder="类型编码"></Input>
                    </FormItem>
                </Col>
                <Col span="8" offset="1" slot="input-col">
                    <FormItem label="类型名称" :labelWidth="70" prop="__LIKES_name" style="width: 100%">
                        <Input v-model="queryForm.__LIKES_name" placeholder="类型名称"></Input>
                    </FormItem>
                </Col>

                <template slot="toolbar">
                    <router-link to="/jobGroupEdit/add"><Button type="primary">新增</Button></router-link>
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
                    query: this.$services.schService.jobGroupRestController.query
                },
                queryForm: {
                    __LIKES_code: '',
                    __LIKES_name: ''
                },
                tableData: [],
                columns: [
                    { type: 'index', align: 'center', width: 50 },
                    { title: '类型编码', align: 'center', key: 'code' },
                    { title: '类型名称', align: 'center', key: 'name' },
                    { title: '描述', align: 'center', key: 'remark' },
                    { title: '操作', align: 'center', key: 'action', width: 120, handler: [
                            {action: 'edit', path: '/jobGroupEdit/edit'},
                            {action: 'view', path: '/jobGroupView'},
                            {action: 'delete'}
                        ]
                }],
            }
        },
        beforeRouteEnter(to, from, next){
            next(vm=>{
                vm.$refs.jobGroupTable.handleQuery();
            })
        },
        methods: {
            remove(data, index) {
                this.$net.send({
                    server: this.$services.schService.jobGroupRestController.remove,
                    data: {},
                    append: data.code
                }).then((data) => {
                    if (data.success) {
                        this.$Message.success(data.msg);
                        this.$refs.jobGroupTable.refresh();
                    } else {
                        this.$Message.error(data.msg);
                    }
                });
            }
        }
    }
</script>
