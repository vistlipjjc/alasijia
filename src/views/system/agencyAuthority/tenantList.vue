<template>
    <div>
        <Card>
            <j-table ref="tenantTable" pagination autoSearch
                     :queryForm="queryForm"
                     :server="server.query"
                     :columns-list="columns" v-model="tableData"
                     :input-col="6"
                     @on-delete="remove"
                     @on-row-click="rowClick">
                <template slot="input-col">
                    <Col span="6">
                    <FormItem label="租户编码" prop="__LIKES_code">
                        <Input v-model="queryForm.__LIKES_code" placeholder="租户编码"></Input>
                    </FormItem>
                    </Col>
                    <Col span="6">
                    <FormItem label="租户名称" prop="__LIKES_name">
                        <Input v-model="queryForm.__LIKES_name" placeholder="租户名称"></Input>
                    </FormItem>
                    </Col>
                </template>
                <template slot="toolbar">
                    <router-link to="/tenantEdit/add"><Button type="primary">新增</Button></router-link>
                    <Button :disabled="start" type="ghost" @click="btnStart" >启动</Button>
                    <Button :disabled="stop" type="ghost" @click="btnStop">停止</Button>
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
                    query: this.$services.sysService.tenantRestController.query
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
                    { title: '状态', align: 'center', key: 'status', formatter: 'fixedDict:Status@system' },
                    { title: '备注', align: 'center', key: 'remark' },
                    { title: '操作', align: 'center', key: 'action', width: 120, handler: [
                            {action: 'edit', path: '/tenantEdit/edit', visible: 'status=[DRAFT]'},
                            {action: 'view', path: '/tenantView'},
                            {action: 'delete',visible: 'status=[DRAFT]'}
                        ]
                    }],
                start:false,
                stop:false,
                code:false
            }
        },
        methods: {
            rowClick(row, index){
                this.status = {__EQS_status: row.status};
                if(row.status == "ENABLED"){
                    this.start = true;
                    this.stop = false;
                }else{
                    this.start = false;
                    this.stop = true;
                }
                 this.code=row.id;
            },
            btnStart(data, index) {
                this.$net.send({
                    server: this.$services.sysService.tenantRestController.start,
                    append: this.code
                }).then((data) => {
                    if (data.success) {
                        this.$Message.success(data.msg);
                        this.$refs.tenantTable.refresh();
                    } else {
                        this.$Message.error(data.msg);
                    }
                });
            },
            btnStop(data, index) {
                this.$net.send({
                    server: this.$services.sysService.tenantRestController.stop,
                    append: this.code
                }).then((data) => {
                    if (data.success) {
                        this.$Message.success(data.msg);
                        this.$refs.tenantTable.refresh();
                    } else {
                        this.$Message.error(data.msg);
                    }
                });
            },
            remove(data, index) {
                this.$net.send({
                    server: this.$services.sysService.tenantRestController.remove,
                    append: data.id
                }).then((data) => {
                    if (data.success) {
                        this.$Message.success(data.msg);
                        this.$refs.tenantTable.refresh();
                    } else {
                        this.$Message.error(data.msg);
                    }
                });
            }
        }
    }
</script>