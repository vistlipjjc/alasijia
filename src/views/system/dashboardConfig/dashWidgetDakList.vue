<template>
    <div>
        <Card>
            <Tabs value="name1" @on-click="refreshTable('ROLE')">
                <TabPane label="角色授权" name="name1">

                    <Row :guter="10">
                        <Col span="8">
                        <j-table ref="roleTable" pagination autoSearch hiddenForm
                                 page-size-type="small"
                                 :server="server.queryRole" :width="300"
                                 :columns-list="columns" :value="roleTable"
                                 @on-row-click="selectRoleRow">
                            <template slot="toolbar">
                                <Button type="primary" @click="save('ROLE')">设置</Button>
                            </template>
                        </j-table>
                        </Col>
                        <Col span="8">
                        <j-table ref="dashWidgetTable" pagination hiddenForm
                                 :default-select-row="false"
                                 :server="server.queryDashWidget" :width="300"

                                 :columns-list="columnsR" :value="dashWidget"
                                 @on-row-click="selectDashWidgetRow">
                        </j-table>
                        </Col>
                        <Col span="8">
                        <j-table ref="permitSetTable" pagination hiddenForm
                                 :server="server.queryPermitSet" :width="300"
                                 :columns-list="permitSetColumns" :value="permitSet"

                                 @on-row-click="selectPermitSetRow">
                        </j-table>
                        </Col>
                    </Row>

                </TabPane>
                <TabPane label="角色组授权" name="name2">
                    <Row :guter="10">
                        <Col span="8">
                        <j-table ref="roleGroupTable" pagination autoSearch hiddenForm
                                 :server="server.queryRoleGroup" :width="300"
                                 :columns-list="columnsGroup" v-model="roleGroupTable"
                                 @on-row-click="selectRoleGroupRow">
                            <template slot="toolbar">
                                <Button type="primary" @click="save('ROLEGROUP')">设置</Button>
                            </template>
                        </j-table>
                        </Col>
                        <Col span="8">
                        <j-table ref="dashWidgetTableGp" pagination hiddenForm
                                 :server="server.queryDashWidget" :width="300"
                                 :columns-list="columnsR1" :value="dashWidgetGp"
                                 @on-row-click="selectDashWidgetGpRow"
                        >
                        </j-table>
                        </Col>
                        <Col span="8">
                        <j-table ref="permitSetTable1" pagination hiddenForm
                                 :server="server.queryPermitSet" :width="300"
                                 :columns-list="permitSetColumns1" :value="permitSetGp"
                                 @on-row-click="selectPermitSetRow">
                        </j-table>
                        </Col>
                    </Row>

                </TabPane>
            </Tabs>

        </Card>


    </div>


</template>

<script>
    export default {
        data() {
            return {
                dakId: null,
                dakCode: '',
                widgetCode: '',
                dakMapType: '',
                dakUsingCode: '',
                server: {
                    queryDashWidget: this.$services.sysService.dashWidgetRestController.query,
                    queryPermitSet: this.$services.sysService.dashWidgetDakRestController.permitTypes,
                    queryRoleGroup: this.$services.sysService.roleGroupRestController.query,
                    queryRole: this.$services.sysService.roleRestController.query
                },
                roleTable: [],
                roleGroupTable: [],
                dashWidget: [],
                dashWidgetTmp: [],
                dashWidgetGp: [],
                permitSet: [],
                permitSetTmp: [],
                permitSetGp: [],
                columns: [
                    {
                        type: 'index',
                        align: 'center', title: ' ', key: '',
                        // render: (h, params) => {
                        //     return h('div', [
                        //         h('Radio', {
                        //             props: {
                        //                 vmodel: 'param',
                        //                 value: '',
                        //                 trueValue: 'Y',
                        //                 falseValue: 'N'
                        //             },
                        //             on: {
                        //                 'on-change': (val) => {
                        //                     checkOption();
                        //                     console.log(params);
                        //                 }
                        //             }
                        //         },)
                        //     ]);
                        // }
                    },
                    {title: '角色编码', align: 'center', key: 'roleCode'},
                    {title: '角色名称', align: 'center', key: 'roleName'},
                ],
                columnsGroup: [
                    {type: 'index', align: 'center'},
                    {title: '角色组编码', align: 'center', key: 'roleGroupCode'},
                    {title: '角色组名称', align: 'center', key: 'roleGroupName'}
                ],
                permitSetColumns: [
                    {type: 'index', align: 'center', width: 50},
                    {title: '数据权限代码', align: 'center', key: 'value'},
                    {title: '数据权限名称', align: 'center', key: 'name'},
                ],
                columnsR: [
                    {type: 'index', align: 'center', width: 50},
                    {title: '组件编码', align: 'center', key: 'code'},
                    {title: '组件名称', align: 'center', key: 'name'}
                ]
                ,
                permitSetColumns1: [
                    {type: 'index', align: 'center', width: 50},
                    {title: '数据权限代码', align: 'center', key: 'value'},
                    {title: '数据权限名称', align: 'center', key: 'name'},
                ],
                columnsR1: [
                    {type: 'index', align: 'center', width: 50},
                    {title: '组件编码', align: 'center', key: 'code'},
                    {title: '组件名称', align: 'center', key: 'name'}
                ]

            }
        },
        mounted() {
            this.init();
        },
        methods: {
            init() {
                this.$net.send({
                    server: this.server.queryDashWidget,
                    data: {__LIKES_status: 'ENABLED'}
                }).then((data) => {
                    this.dashWidgetTmp = data.rows;
                });

                this.$net.send({
                    server: this.server.queryPermitSet,
                }).then((data) => {
                    this.permitSetTmp = data.rows;
                });
            },
            selectDashWidgetRow(val, index) {
                this.widgetCode = val.code;
                this.$net.send({
                    server: this.$services.sysService.dashWidgetDakRestController.getPermitData,
                    data: {
                        dakUsingCode: this.dakUsingCode,
                        widgetCode: val.code,
                        dakMapType: 'ROLE'
                    }
                }).then((data) => {
                    // console.log(data)
                    if (data.dakId != '') {
                        this.dakId = data.dakId;
                    }

                    if (data.permitType.length > 0) {
                        this.permitSetTmp.forEach((item, index) => {
                            if (item.value == data.permitType[0].value) {
                                this.permitSetTmp[index]._highlight = true;
                            }
                        });
                    }
                    else {
                        this.permitSetTmp.forEach((item, index) => {
                            if (item._highlight) {
                                delete item._highlight;
                                delete this.permitSetTmp[index]._highlight;
                            }
                        });
                    }
                    this.permitSet = this.permitSetTmp;
                });
            },

            selectDashWidgetGpRow(val, index) {
                this.widgetCode = val.code;
                this.$net.send({
                    server: this.$services.sysService.dashWidgetDakRestController.getPermitData,
                    data: {
                        dakUsingCode: this.dakUsingCode,
                        widgetCode: val.code,
                        dakMapType: 'ROLEGROUP'
                    }
                }).then((data) => {
                    console.log(data)
                    if (data.dakId != '') {
                        this.dakId = data.dakId;
                    }

                    if (data.permitType.length > 0) {
                        this.permitSetTmp.forEach((item, index) => {
                            if (item.value == data.permitType[0].value) {
                                this.permitSetTmp[index]._highlight = true;
                            }
                        });
                    }
                    else {
                        this.permitSetTmp.forEach((item, index) => {
                            if (item._highlight) {
                                delete item._highlight;
                                delete this.permitSetTmp[index]._highlight;
                            }
                        });
                    }
                    this.permitSetGp = this.permitSetTmp;
                });
            },
            getTableData(data) {
                this.dashWidget = data;
            },
            gettPermitSetTableData(data) {
                this.PermitSet = data;
            },
            selectRoleRow(data, index) {
                this.dashWidget = [];
                this.permitSet = [];
                this.dakUsingCode = data.roleCode;
                this.$net.send({
                    server: this.$services.sysService.dashWidgetDakRestController.getWidgetData,
                    data: {
                        dakUsingCode: data.roleCode,
                        dakMapType: 'ROLE'
                    }
                }).then((data) => {
                    console.log(data)
                    if (data.length > 0) {
                        this.dashWidgetTmp.forEach((item, index) => {
                            if (item.code == data[0].code) {
                                this.dashWidgetTmp[index]._highlight = true;
                            }
                        });
                        this.selectDashWidgetRow(data[0], null);
                    }
                    else {
                        this.dashWidgetTmp.forEach((item, index) => {
                            if (item._highlight) {
                                delete item._highlight;
                                delete this.dashWidgetTmp[index]._highlight;
                            }
                        });
                        this.permitSetTmp.forEach((item, index) => {
                            if (item._highlight) {
                                delete item._highlight;
                                delete this.permitSetTmp[index]._highlight;
                            }
                        });
                        this.permitSet = this.permitSetTmp;
                    }
                    this.dashWidget = this.dashWidgetTmp;
                });

            },

            selectRoleGroupRow(data, index) {
                this.dashWidgetGp = [];
                this.permitSetGp = [];
                this.dakUsingCode = data.roleGroupCode;
                this.$net.send({
                    server: this.$services.sysService.dashWidgetDakRestController.getWidgetData,
                    data: {
                        dakUsingCode: data.roleGroupCode,
                        dakMapType: 'ROLEGROUP'
                    }
                }).then((data) => {
                    console.log(data)
                    if (data.length > 0) {
                        this.dashWidgetTmp.forEach((item, index) => {
                            if (item.code == data[0].code) {
                                this.dashWidgetTmp[index]._highlight = true;
                            }
                        });
                        this.selectDashWidgetGpRow(data[0], null);
                    }
                    else {
                        this.dashWidgetTmp.forEach((item, index) => {
                            if (item._highlight) {
                                delete item._highlight;
                                delete this.dashWidgetTmp[index]._highlight;
                            }
                        });
                        this.permitSetTmp.forEach((item, index) => {
                            if (item._highlight) {
                                delete item._highlight;
                                delete this.permitSetTmp[index]._highlight;
                            }
                        });
                        this.permitSetGp = this.permitSetTmp;
                    }
                    this.dashWidgetGp = this.dashWidgetTmp;

                });

            },


            selectPermitSetRow(data, index) {
                this.dakCode = data.value;
            },
            save(name) {
                this.$net.send({
                    server: this.$services.sysService.dashWidgetDakRestController.save,
                    data: {
                        dakId: this.dakId,
                        dakCode: this.dakCode,
                        widgetCode: this.widgetCode,
                        dakMapType: name,
                        dakUsingCode: this.dakUsingCode,
                    }
                }).then((data) => {
                    if (data.success) {
                        this.$Message.success(data.msg);
                    } else {
                        this.$Message.error(data.msg);
                    }
                });

                this.dakId = null;
                this.dakCode = '';
                this.widgetCode = '';
                this.dakUsingCode = '';

            },

            cancel() {

            },
            refreshTable(val) {
                this.$refs.dashWidgetTableGp.refresh();
                this.$refs.permitSetTable1.refresh();
            }
        }

    }
</script>

<style scoped>

</style>