<template>
    <div class="dashWidgetproviderCtnr">
        <Card>
            <Form ref="editForm" :model="editForm" :rules="editRules" :label-width="180">
                <Row type="flex" justify="space-between" class="code-row-bg">
                    <Col span="10">
                    <FormItem label="组件编码" prop="widgetCode">
                        <Input v-model="editForm.widgetCode" disabled></Input>
                    </FormItem>
                    </Col>
                    <Col span="10">
                    <FormItem label="组件名称" prop="name">
                        <Input v-model="this.$route.query.value" disabled></Input>
                    </FormItem>
                    </Col>
                </Row>
                <Row type="flex" justify="space-between" class="code-row-bg">
                    <Col span="10">
                    <FormItem label="提供程序名称" prop="providerName">
                        <Input v-model="editForm.providerName"></Input>
                    </FormItem>
                    </Col>
                    <Col span="10">
                    <FormItem label="数据提供程序" prop="providerCode">
                        <j-select v-model="editForm.providerCode" url="custom:dataProvider/getDataProvider@system"
                                  @on-change="selectChange($event, 'providerCode')">
                        </j-select>
                    </FormItem>
                    </Col>
                </Row>
                <Row type="flex" justify="space-between" class="code-row-bg">
                    <Col span="10">

                    <FormItem label="数据提供程序参数" prop="providerParams" required>
                        <Input v-model="editForm.providerParams" type="textarea" placeholder="参数为JSON格式，如：{id:'123'}"></Input>
                    </FormItem>

                    </Col>

                    <Col span="10">
                    <div align="center">

                        <Button @click="btnSave('editForm')" type="primary" style="margin:0 11px;">保存</Button>
                        <Button type="ghost" @click="btnBack">返回</Button>
                    </div>
                    </Col>
                </Row>
            </Form>

            <j-table ref="dashWidgetProviderTable" pagination hiddenForm autoSearch
                     :server="query"
                     :defaultParams="queryParam"
                     :columns-list="columns" v-model="tableData"
                     @on-delete="remove"
                     @on-row-click="selectRow">

                <template slot="toolbar">
                    <Button @click="edit" type="primary" style="margin:0 11px;">编辑</Button>
                </template>
            </j-table>


        </Card>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                formData: '',
                query: this.$services.sysService.dashWidgetProviderRestController.query,
                editForm: {
                    widgetCode: this.$route.query.code,
                    providerCode: '',
                    providerName: '',
                    providerParams: '',
                    provierId: String,
                    name: ''
                },
                editRules: {
                    providerName: [
                        {required: true, message: '必填项', trigger: 'blur'}
                    ],
                    providerCode: [
                        {required: true, message: '必填项', trigger: 'blur'}
                    ],
                    providerParams: [
                        {required: true, message: '必填项', trigger: 'blur'},
                        {type:'string', pattern:/^\{[\s*"|'\w+"|':"|'\w+"|',*\s*]+\}$/, message:"请输入正确的JSON数据参数,如：{id:'123'}", trigger:'blur'}
                    ]
                },
                tableData: [],
                columns: [
                    {type: 'index', align: 'center', width: 50},
                    {title: '组件编码', align: 'center', key: 'widgetCode'},
                    {
                        title: '数据提供程序编码',
                        align: 'center',
                        key: 'providerCode',
                        formatter: "custom:dataProvider/getDataProvider@system"
                    },
                    {title: '数据提供程序名称', align: 'center', key: 'providerName'},
                    {title: '数据提供程序参数', align: 'center', key: 'providerParams'},
                    {title: '是否被引用', align: 'center', key: 'beenUsed', formatter: "fixedDict:YesNo@system"},
                    {
                        title: '操作', align: 'center', key: 'action', width: 120, handler: [
                            {action: 'edit', path: '/dashWidgetDatasource'},
                            {action: 'delete'}
                        ]
                    }],
                queryParam:{},
                dashWidgetType: this.$route.query.dashWidgetType,
            }
        },
        created(){
            this.queryParam = {__EQS_widgetCode: this.$route.query.code};
        },
        methods: {
            // init(){
            //     console.info('this.$route.query.code:' , this.$route.query.code);
            //     this.queryParam = {__EQS_widgetCode: this.$route.query.code};
            // },
            remove(data, index) {
                this.$net.send({
                    server: this.$services.sysService.dashWidgetProviderRestController.remove,
                    append: data.provierId
                }).then((data) => {
                    if (data.success) {
                        this.$Message.success(data.msg);
                        this.$refs.dashWidgetProviderTable.refresh();
                    } else {
                        this.$Message.error(data.msg);
                    }
                });
            },
            selectRow(data, index) {
                this.formData=data;
            },
            edit(){
                if(this.formData.widgetCode){
                    this.editForm = this.formData;
                }
            },
            /*保存*/
            btnSave(name) {
                this.$refs[name].validate((valid) => { // 数据校验
                    if (!valid) {
                        return
                    }

                    if(this.dashWidgetType == 'CHART' && this.$refs.dashWidgetProviderTable.getTableData().length > 0 &&
                        (!this.editForm.provierId || this.editForm.provierId == '' || !(typeof this.editForm.provierId === "string") )){
                        this.$Message.info('数据组件只能包含一个数据提供程序。');
                        return;
                    }
                    if(!this.isJsonString(this.editForm.providerParams)){
                        this.$Message.info('数据提供程序参数格式为json格式。');
                        return;
                    }
                    this.$net.send({
                        server: this.$services.sysService.dashWidgetProviderRestController.save,
                        data: this.editForm
                    }).then((data) => {
                        if (data.success) {
                            this.$Message.success(data.msg);
                            this.$refs.dashWidgetProviderTable.refresh();
                        } else {
                            this.$Message.error(data.msg);
                        }
                    });

                });
            },
            isJsonString(str) {
                try {
                    jQuery.parseJSON(str);
                } catch (e) {
                    return false;
                }
                return true;
            },
            selectChange(val, name) {
                this.editForm[name] = val;
            },

            /*返回*/
            btnBack() {
                this.$router.go(-1);
                this.$store.commit('removeTag', 'dashWidgetEdit');
                this.$store.commit('closePage', 'dashWidgetEdit');
            }

        }
    }


</script>