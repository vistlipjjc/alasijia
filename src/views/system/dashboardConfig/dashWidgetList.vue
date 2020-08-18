<template>
    <div>
        <Card>
            <j-table ref="dashWidgetTable" pagination autoSearch
                     :queryForm="queryForm"
                     :server="server.query"
                     :columns-list="columns" v-model="tableData"
                     :input-col="6"
                     @on-delete="remove"
                     @on-row-click="selectRow">
                <template slot="input-col">
                    <Col span="6">
                    <FormItem label="组件编码" prop="__LIKES_code">
                        <Input v-model="queryForm.__LIKES_code" placeholder="标准组件编码"></Input>
                    </FormItem>
                    </Col>
                    <Col span="6">
                    <FormItem label="组件名称" prop="__LIKES_name">
                        <Input v-model="queryForm.__LIKES_name" placeholder="标准组件名称"></Input>
                    </FormItem>
                    </Col>
                </template>
                <template slot="toolbar">
                    <router-link to="/dashWidgetEdit/add">
                        <Button type="primary">新增</Button>
                    </router-link>
                    <router-link :to="{path:'/dashWidgetDatasource',query: {code: codeValue,value: name,dashWidgetType: dashWidgetType}}">
                        <Button :disabled="source" type="primary">绑定数据源</Button>
                    </router-link>
                    <Button :disabled="design" @click="designOperaTion" type="primary">设计</Button>
                    <!--<router-link :to="{path:'/dashWidgetDesignChart',query: {code: codeValue,value: name}}"><Button :disabled="design" @cilck="designOperaTion" type="primary">设计</Button></router-link>-->
                    <Button type="primary" :disabled="disable" @click="blockDash">停用</Button>
                    <Button type="primary" :disabled="enable" @click="startUsing">启用</Button>
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
                dashWidgetType: '',
                name: '',
                server: {
                    query: this.$services.sysService.dashWidgetRestController.query
                },
                queryForm: {
                    __LIKES_code: '',
                    __LIKES_name: ''
                },
                tableData: [],
                columns: [
                    {title: '序号', type: 'index', align: 'center', width: 60},
                    {title: '组件编码', align: 'center', key: 'code'},
                    {title: '组件名称', align: 'center', key: 'name'},
                    {title: '组件类型', align: 'center', key: 'type', formatter: "fixedDict:DashWidgetType@system"},
                    {title: '状态', align: 'center', key: 'status', formatter: "fixedDict:Status@system"},
                    {title: '组件描述', align: 'center', key: 'desc', ellipsis: true},
                    {
                        title: '操作', align: 'center', key: 'action', width: 120, handler: [
                            {action: 'edit', path: '/dashWidgetEdit/edit', visible: 'status=[DRAFT]' },
                            {action: 'view', path: '/dashWidgetView'},
                            {action: 'delete', visible: 'status=[DRAFT]'}
                        ]
                    }],
                source: true,
                design: false,
                disable: true,
                enable: true
            }
        },
        methods: {
            remove(data, index) {
                this.$net.send({
                    server: this.$services.sysService.dashWidgetRestController.remove,
                    append: data.code
                }).then((data) => {
                    if (data.success) {
                        this.$Message.success(data.msg);
                        this.$refs.dashWidgetTable.refresh();
                    } else {
                        this.$Message.error(data.msg);
                    }
                });
            },
            selectRow(data, index) {
                if (data.status == "ENABLED") {
                    this.enable = true;
                    this.disable = false;
                    this.source = true;
                } else {
                    this.disable = true;
                    this.enable = false;
                    this.source = false;
                }
                this.codeValue = data.code;
                this.name = data.name;
                this.dashWidgetType = data.type;
            },
            blockDash() {
                this.$net.send({
                    server: this.$services.sysService.dashWidgetRestController.disable,
                    append: this.codeValue
                }).then((data) => {
                    if (data.success) {
                        this.$Message.success(data.msg);
                        this.$refs.dashWidgetTable.refresh();
                    } else {
                        this.$Message.error(data.msg);
                    }
                });
            },

            startUsing() {
                this.$net.send({
                    server: this.$services.sysService.dashWidgetRestController.canEnable,
                    append: this.codeValue
                }).then((data) => {
                    if (data.success) {
                        this.$net.send({
                            server: this.$services.sysService.dashWidgetRestController.enable,
                            append: this.codeValue
                        }).then((data) => {
                            if (data.success) {
                                this.$Message.success(data.msg);
                                this.$refs.dashWidgetTable.refresh();
                            } else {
                                this.$Message.error(data.msg);
                            }
                        });
                    } else {
                        this.$Message.error("组件启动验证不通过，请重新设计组件。");
                    }

                });


            },
            designOperaTion() {
                this.$net.send({
                    server: this.$services.sysService.dashWidgetProviderRestController.verifyForDashWidgetProvider,
                    append: this.codeValue
                }).then((data) => {
                    // console.log(data)
                    if (data.success) {
                        this.$net.send({
                            server: this.$services.sysService.dashWidgetRestController.design,
                            append: this.codeValue
                        }).then((data) => {
                            if(data.page=="/dashWidgetDesignChart"){
                                this.$router.push(data.page+"?provierId="+data.dashWidgetProvider.provierId
                                    +"&providerName="+data.dashWidgetProvider.providerName+"&name="+data.dashWidget.name
                                    +"&code="+data.dashWidget.code);
                            }else{
                                this.$router.push(data.page+"?code="+data.dashWidget.code+"&name="+data.dashWidget.name);
                            }

                        });
                    } else {
                        this.$Message.error("请先绑定数据源");
                    }
                });
            }
        }
    }
</script>
