<template>
    <div class="calendarCtnr">
        <Card>
            <j-table ref="calendarTable" pagination auto-search :input-col="5"
                     :queryForm="queryForm"
                     :server="server.query"
                     :columns-list="columns" v-model="tableData"
                     @on-delete="remove"
                     @on-row-click="rowClick">
                <Col span="8" slot="input-col">
                    <FormItem label="日历编码" :labelWidth="70" prop="__LIKES_code" style="width: 100%">
                        <Input v-model="queryForm.__LIKES_code" placeholder="日历编码"></Input>
                    </FormItem>
                </Col>
                <Col span="8" offset="1" slot="input-col">
                    <FormItem label="日历名称" :labelWidth="70" prop="__LIKES_name" style="width: 100%">
                        <Input v-model="queryForm.__LIKES_name" placeholder="日历名称"></Input>
                    </FormItem>
                </Col>
                <template slot="toolbar">
                    <router-link to="/calendarEdit/add"><Button type="primary">新增</Button></router-link>
                    <Button type="primary" @click="calendarSet" >设置</Button>
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
                    query: this.$services.schService.calendarRestController.query
                },
                queryForm: {
                    __LIKES_code: '',
                    __LIKES_name: ''
                },
                tableData: [],
                columns: [
                    { type: 'index', align: 'center', width: 50 },
                    { title: '日历编码', align: 'center', key: 'code' },
                    { title: '日历名称', align: 'center', key: 'name' },
                    { title: '备注', align: 'center', key: 'remark' },
                    { title: '操作', align: 'center', key: 'action', width: 120, handler: [
                            {action: 'edit', path: '/calendarEdit/edit'},
                            {action: 'view', path: '/calendarView'},
                            {action: 'delete'}
                        ]
                    }],
                selectedRow: {}
            }
        },
        beforeRouteEnter(to, from, next){
            next(vm=>{
                vm.$refs.calendarTable.handleQuery();
            })
        },
        methods: {
            rowClick(row, index){
                this.selectedRow = row;
            },
            calendarSet() {
                /* 设置 */
                if(!this.selectedRow.code)
                {
                    this.$Message.info({duration: 5, content: '请选择一条数据进行设置'});
                    return;
                }
                else
                {
                    this.$router.push({
                        path:'/calendarDetail',
                        query: {row: this.selectedRow}
                    });
                }
            },
            remove(data) {
                this.$net.send({
                    server: this.$services.schService.calendarRestController.remove,
                    data: {},
                    append: data.code
                }).then((data) => {
                    if (data.success) {
                        this.$Message.success(data.msg);
                        this.$refs.calendarTable.refresh();
                    } else {
                        this.$Message.error(data.msg);
                    }
                });
            }
        }
    }
</script>
