<template>
    <div>
        <Card>
            <p slot="title">定义系统中的附件上传类型</p>
            <j-table ref="attachmentTypeTable" pagination autoSearch
                     :queryForm="queryForm"
                     :server="server.query"
                     :columns-list="columns" v-model="tableData"
                     :label-width="80" :input-col="6"
                     @on-delete="remove">
                <template slot="input-col">
                    <Col span="6">
                        <FormItem label="类型编码" prop="__LIKES_attachTypeCode">
                            <Input v-model="queryForm.__LIKES_attachTypeCode" placeholder="上传类型编码"></Input>
                        </FormItem>
                    </Col>
                    <Col span="6">
                    <FormItem label="类型名称" prop="__LIKES_attachTypeName">
                        <Input v-model="queryForm.__LIKES_attachTypeName" placeholder="上传类型名称"></Input>
                    </FormItem>
                    </Col>
                </template>
                <template slot="toolbar">
                    <router-link to="/attachmentTypeEdit/add"><Button type="primary">新增</Button></router-link>
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
                    query: this.$services.sysService.attachmentTypeRestController.query
                },
                queryForm: {
                    __LIKES_attachTypeCode: '',
                    __LIKES_attachTypeName: ''
                },
                tableData: [],
                columns: [
                    { type: 'index', align: 'center', width: 50 },
                    { title: '类型编码', align: 'center', key: 'attachTypeCode' },
                    { title: '类型名称', align: 'center', key: 'attachTypeName' },
                    { title: '附件格式', align: 'center', key: 'attachFormat' },
                    { title: '上传路径', align: 'center', key: 'attachPath' },
                    { title: '操作', align: 'center', key: 'action', width: 120, handler: [
                            {action: 'edit', path: '/attachmentTypeEdit/edit'},
                            {action: 'view', path: '/attachmentTypeView'},
                            {action: 'delete'}
                        ]
                    }],
            }
        },
        beforeRouteEnter(to, from, next){
            next(vm=>{
                vm.$refs.attachmentTypeTable.handleQuery();
            })
        },
        methods: {
            remove(data, index) {
                this.$net.send({
                    server: this.$services.sysService.attachmentTypeRestController.remove,
                    append: data.attachTypeCode
                }).then((data) => {
                    if (data.success) {
                        this.$Message.success(data.msg);
                        this.$refs.attachmentTypeTable.refresh();
                    } else {
                        this.$Message.error(data.msg);
                    }
                });
            }
        }
    }
</script>
