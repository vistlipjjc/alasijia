<template>
    <div class="roleStdListBox">
        <Card>
            <p slot="title">角色类型</p>
            <j-table ref="roleStdTable" pagination autoSearch
                     :queryForm.sync="queryForm"
                     :server="server.query"
                     :columns-list="columns"
                     :label-width="80"
                     :input-col="6"
                     :autoCache="true"
                     v-model="tableData"
                     @on-delete="remove">
                <template slot="input">
                  <Row>
                    <FormItem label="角色编码" prop="__LIKES_roleStdCode">
                        <Input v-model="queryForm.__LIKES_roleStdCode" placeholder="标准角色编码"></Input>
                    </FormItem>
                    <FormItem label="角色名称" prop="__LIKES_roleStdName">
                        <Input v-model="queryForm.__LIKES_roleStdName" placeholder="标准角色名称"></Input>
                    </FormItem>
                  </Row>
                </template>
                <template slot="toolbar">
                    <router-link to="/roleStdEdit/add"><Button type="primary">新增</Button></router-link>
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
                    query: this.$services.sysService.roleStdRestController.query
                },
                queryForm: {
                    __LIKES_roleStdCode: '',
                    __LIKES_roleStdName: ''
                },
                tableData: [],
                columns: [
                    { type: 'index', title: '序号', align: 'center', width: 60 },
                    { title: '角色编码', align: 'center', key: 'roleStdCode' },
                    { title: '角色名称', align: 'center', key: 'roleStdName' },
                    { title: '角色描述', align: 'center', key: 'roleStdDesc' },
                    { title: '操作', align: 'center', key: 'action', width: 120, handler: [
                            {action: 'edit', path: '/roleStdEdit/edit'},
                            {action: 'view', path: '/roleStdView'},
                            {action: 'delete'}
                        ]
                    }],
            }
        },
        methods: {
            remove(data, index) {
                this.$net.send({
                    server: this.$services.sysService.roleStdRestController.remove,
                    append: data.roleStdCode
                }).then((data) => {
                    if (data.success) {
                        this.$Message.success(data.msg);
                        this.$refs.roleStdTable.refresh();
                    } else {
                        this.$Message.error(data.msg);
                    }
                });
            }
        }
    }
</script>

<style>
.roleStdListBox .j-table-toolbar {
  position: absolute;
  top: 0;
  right: 0;
}
</style>
