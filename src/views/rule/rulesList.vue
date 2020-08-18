<template>
    <div>
        <Card>
            <j-table ref="rulesTable" pagination autoSearch
                     :queryForm="queryForm"
                     :server="server.query"
                     :columns-list="columns" v-model="tableData"
                     :label-width="80" :input-col="5"
                     @on-delete="remove"
                     @on-row-click="selectRow">
                <template slot="input-col">
                    <Col span="7">
                    <FormItem label="规则名称" prop="__LIKES_name">
                        <Input v-model="queryForm.__LIKES_name" placeholder="规则名称"></Input>
                    </FormItem>
                    </Col>
                </template>
                <template slot="toolbar">
                    <router-link to="/rulesEdit/add">
                        <Button type="primary">新增</Button>
                    </router-link>
                    <router-link :to="{path:'/rulesDesign',query: {id: codeValue,name:nameValue,code :code}}">
                        <Button  type="primary">维护内容</Button>
                    </router-link>
                </template>
            </j-table>

        </Card>

    </div>
</template>

<script>
    export default {
        data() {
            return {
                codeValue: '',
                nameValue: '',
                code: '',
                server: {
                    query: this.$services.ruleService.rulesRestController.query
                },
                queryForm: {
                    __LIKES_name: ''
                },
                tableData: [],
                columns: [
                    {type: 'index', align: 'center', width: 50},
                    {title: '规则编码', align: 'center', key: 'code'},
                    {title: '规则名称', align: 'center', key: 'name'},
                    {title: '规则优先级', align: 'center', key: 'priority'},
                    {title: '备注', align: 'center', key: 'remark'},
                    {
                        title: '操作', align: 'center', key: 'action', width: 120, handler: [
                            {action: 'edit', path: '/rulesEdit/edit'},
                            {action: 'view', path: '/rulesView'},
                            {action: 'delete'}
                        ]
                    }],
                configRules:{
                    config: [
                        {required: true, message: '必填项', trigger: 'blur'}
                    ]
                }
            }
        },
        beforeRouteEnter(to, from, next){
            next(vm=>{
                vm.$refs.rulesTable.handleQuery();
            })
        },
        methods: {
            remove(data, index) {
                this.$net.send({
                    server: this.$services.ruleService.rulesRestController.remove,
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
            selectRow(data, index) {
                this.codeValue = data.id;
                this.nameValue = data.name;
                this.code = data.code;
            },

            cancel() {

            },
            /*保存*/
            btnSave(name) {
                this.$refs[name].validate((valid) => { // 数据校验
                    if (!valid) {
                        return
                    }

                    this.$net.send({
                        server: this.$services.ruleService.rulesRestController.save,
                        data: this.editForm
                    }).then((data) => {
                        if (data.success) {
                            this.$Message.success(data.msg);
                        } else {
                            this.$Message.error(data.msg);
                        }
                    });

                });
            },
        }
    }
</script>
