<template>
    <Row>
        <Col span="24">
        <Card>
            <Row>
                <Col span="14">
                <Tabs value="name1"  ref="tabs" @on-click="selectTabs($event)">
                    <TabPane label="数据编辑" name="name1">
                        <Card>
                            <Row>
                                <Form ref="editForm" :model="editForm" :rules="editRules" :label-width="180">
                                    <Col span="18">
                                    <FormItem label="图表类型" prop="chartType">
                                        <j-select v-model="editForm.chartType" url="fixedDict:DashChartType@system"
                                                  id="chartType" ref="chartType"
                                                  @on-change="selectChange($event,'chartType')">
                                        </j-select>
                                    </FormItem>
                                    </Col>
                                    <Col span="18" id="categoryDefGrp">
                                    <FormItem label="种类系列" prop="categoryDef">
                                        <Input v-model="editForm.categoryDef" disabled ref="categoryDef"
                                               id="categoryDef"/>
                                    </FormItem>
                                    </Col>
                                    <Col span="4">
                                    <dash-widget-expr type="primary" :disabled="categoryDef" @on-value="editCategoryDef"
                                                      style="margin-left: 20px;" icon="edit"
                                                      :widgetProvierId="this.$route.query.provierId"
                                                      :value="editForm.categoryDef">
                                    </dash-widget-expr>
                                    </Col>
                                    <Col span="20">
                                    <FormItem label="系列值1">

                                    </FormItem>
                                    </Col>
                                    <Col span="18">
                                    <FormItem label="统计项" prop="seriesName1">
                                        <j-select v-model="editForm.seriesName1" :option-list="seriesNameOpt1"
                                                  id="seriesName1" ref="seriesName1" style="width:220px"
                                                  @on-change="onSeriesNameChange($event,'x')">

                                        </j-select>
                                    </FormItem>
                                    </Col>
                                    <Col span="2">
                                    <Button @click="addSeries('seriesName1')" style="margin-left: 20px;"
                                            icon="android-add"></Button>
                                    </Col>
                                    <Col span="2">
                                    <Button @click="delSeries('seriesName1')" style="margin-left: 20px;"
                                            icon="ios-trash-outline"></Button>
                                    </Col>
                                    <Col span="9">
                                    <FormItem label="表达式" prop="exprType1">
                                        <j-select v-model="editForm.exprType1" url="fixedDict:DashGroupType@system"
                                                  id="exprType1" style="width: 220px"
                                                  @on-change="onExprTypeChange($event, 'seriesName1', 'exprVal1')"
                                        ></j-select>
                                    </FormItem>
                                    </Col>

                                    <Col span="11">
                                    <FormItem prop="exprVal1">
                                        <Input v-model="editForm.exprVal1" ref="exprVal1" disabled></Input>
                                    </FormItem>
                                    </Col>
                                    <Col span="1">
                                    <dash-widget-expr type="primary" :disabled="editExpr1" @on-value="editExprVal1"
                                                      style="margin-left: 20px;" icon="edit"
                                                      :widgetProvierId="this.$route.query.provierId"
                                                      :value="editForm.exprVal1"></dash-widget-expr>
                                    </Col>
                                </Form>
                            </Row>

                            <Row id="seriesGrp2" class="seriesGrp2">
                                <Form ref="editForm" :model="editForm" :rules="editRules" :label-width="180">
                                    <Col span="20">
                                    <FormItem label="系列值2">
                                        <Checkbox v-model="editForm.seriesCheck" true-value="true"
                                                  @on-change="seriesCheckChange($event)"
                                                  false-value="false"></Checkbox>
                                    </FormItem>
                                    </Col>

                                    <Col span="18">
                                    <FormItem label="类型" prop="chartType2">
                                        <j-select v-model="editForm.chartType2" :option-list="chartTypeOpt2" :disabled="typeDisabled"
                                                  ref="chartType2" style="width:220px"
                                                  @on-change="onSeriesChartTypeChange($event, 'seriesName2', 'exprVal2')">

                                        </j-select>
                                    </FormItem>
                                    </Col>
                                    <Col span="18">
                                    <FormItem label="统计项" prop="seriesName2">
                                        <j-select v-model="editForm.seriesName2" :option-list="seriesNameOpt2"
                                                  :disabled="seriesDisabled" ref="seriesName2" style="width:220px"
                                                  @on-change="onSeriesNameChange($event,'y')">

                                        </j-select>
                                    </FormItem>
                                    </Col>
                                    <Col span="2">
                                    <Button @click="addSeries('seriesName2')" type="primary" :disabled="addSeries2"
                                            style="margin-left: 20px;" icon="android-add">

                                    </Button>
                                    </Col>
                                    <Col span="2">
                                    <Button @click="delSeries('seriesName2')" type="primary" :disabled="delSeries2"
                                            style="margin-left: 20px;" icon="ios-trash-outline">

                                    </Button>
                                    </Col>

                                    <Col span="9">
                                    <FormItem label="表达式" prop="exprType2">
                                        <j-select v-model="editForm.exprType2" url="fixedDict:DashGroupType@system"
                                                  ref="exprType2" style="width:220px"  :disabled="exprDisabled"
                                                  @on-change="onExprTypeChange($event, 'seriesName2', 'exprVal2')"
                                        ></j-select>
                                    </FormItem>
                                    </Col>

                                    <Col span="11">
                                    <FormItem prop="exprVal2">
                                        <Input v-model="editForm.exprVal2" id="exprVal2" disabled></Input>
                                    </FormItem>
                                    </Col>
                                    <Col span="1">
                                    <dash-widget-expr type="primary" :disabled="editExpr2" @on-value="editExpr"
                                                      style="margin-left: 20px;" icon="edit"
                                                      :widgetProvierId="this.$route.query.provierId"
                                                      :value="editForm.exprVal2"></dash-widget-expr>
                                    </Col>
                                </Form>
                            </Row>
                        </Card>
                    </TabPane>

                    <TabPane label="参数调整" name="name2" ref="name2">
                        <Scroll :height="550">
                            <jDashWidgetParam  ref="jDashWidgetParam" ></jDashWidgetParam>
                        </Scroll>
                    </TabPane>
                </Tabs>
                </Col>
                <Col span="10">
                <Card style="margin-top: 50px">
                    <div id="container" style="width:100%; height:400px;" class="col-xs"></div>
                </Card>

                <div align="center" style="margin-top: 50px;">
                    <Button @click="btnSave('editForm')" type="primary">保存</Button>
                    <Button @click="btnBack" type="primary">返回</Button>
                </div>
                </Col>
            </Row>
        </Card>
        </Col>
        <Col span="24">
        <Card>
            <j-table ref="dashWidgetTable" pagination hiddenForm
                     :columns-list="columns" v-model="tableData"
            >
            </j-table>
        </Card>
        </Col>
    </Row>


</template>

<script>

    import {
        showWidgetConfig,
        initChartOptions,
        chartTypeChange,
        initChart,
        seriesChartTypeChange,
        exprTypeChange,
        removeAttrWidgetConfig,
        seriesNameChange,
        showSeriesName,
        updateSeries,
        updateSeriesDef,
        currOption,
        verifyWidgetConfig
    } from './dashWidgetChart.js';
    import {
        setCurrOption,
        setEcharts,
    } from './jDashWidgetParam.js';

    import dashWidgetExpr from './components/dashWidgetExpr.vue';
    import jDashWidgetParam from './jDashWidgetParam.vue';
    import echarts from 'echarts';

    export default {
        components: {
            dashWidgetExpr,
            jDashWidgetParam
        },
        name: "dashwidgetDesign",
        data() {
            return {
                expressionModal: true,
                provider: [],
                menuData: [],
                tabs: '',

                //定义三个jselect属性是否可选
                typeDisabled: false,
                seriesDisabled: false,
                exprDisabled: false,

                editForm: {
                    chartType: 'line',
                    chartType2: '',
                    categoryDef: '',
                    seriesName1: '',
                    menuName: '',
                    exprType1: "Sum",
                    exprType2: "Sum",
                    menuImage: '',
                    displayOrder: 10,
                    enabled: 'Y',
                    seriesCheck: 'false',
                    seriesName2: '',
                    exprVal1: '',
                    exprVal2: '',
                    staff: '',

                },

                chartTypeOpt2: [],
                seriesNameOpt1: [],
                seriesNameOpt2: [],
                tableData: [],
                columns: [],
                editRules: {},
                widgetConfig: Object,
                dashWidgetInit: 'init',
                chartType2Data: [],
                categoryDef: false,
                editExpr1: false,
                editExpr2: true,
                addSeries2: true,
                delSeries2: true,

            }
        },
        mounted() {
            this.init();
        },
        methods: {
            init() {
                this.$net.send({
                    server: this.$services.sysService.dashWidgetRestController.initProvider,
                    append: this.$route.query.code
                }).then((data) => {
                    if (data.success) {
                        /* 初始化数据源数据 */
                        if (data.columns) {
                            let c = data.columns.length;
                            for (let i = 0; i < c; i++) {
                                let column = {
                                    key: data.columns[i].columnCode,
                                    title: (data.columns[i].columnName) ? data.columns[i].columnName : data.columns[i].columnCode,
                                    align: "center",
                                    width: 100
                                };
                                this.columns.push(column);
                            }

                            this.$net.send({
                                server: this.$services.sysService.dashWidgetRestController.getDataByPage,
                                data: {sql: data.sql}
                            }).then((data) => {
                                this.tableData = data.rows;
                            });
                        }
                        /* 判断组件是否已存在配置 */
                        if (null != data.widgetConfig && data.widgetConfig != '') {
                            /* 设置组件配置 */
                            // this.widgetConfig = data.widgetConfig;
                            this.widgetConfig = JSON.parse(data.widgetConfig);
                            this.initSeries(this.widgetConfig['chart-type']);
                            this.editForm.chartType = this.widgetConfig['chart-type'];
                            this.showData();
                            /* 回显数据 */
                            showWidgetConfig(this.widgetConfig, this.$route.query.code, this.editForm.chartType, true, this.$route.query.provierId);

                            /* 初始化Chart配置 */
                            //initChartOptions(this.widgetConfig,TABS_CHART);
                            let val = initChart(this.editForm.chartType, this.$route.query.provierId);

                        }
                        else {
                            this.typeDisabled= true;
                            this.seriesDisabled = true;
                            this.exprDisabled= true;
                            this.editExpr2 = true;
                            this.initSeries(this.editForm.chartType);
                            let val = initChart(this.editForm.chartType, this.$route.query.provierId);
                            this.widgetConfig = val;
                            // this.widgetConfig['category-def'] = [{"expr": 'dataRow["NAME_"]'}];
                        }
                        setCurrOption(currOption);
                        setEcharts(echarts);

                    }


                });
            },
            initSeries(chartTypeVal) {

                console.log(chartTypeVal)

                let array = [];
                /*清空Y轴图表类型缓存数据*/
                this.chartTypeOpt2 = [];

                /* 图表类型为：折线图、柱形图、面积图时，
                 * 1. 显示系列值2，
                 * 2. 更改Y轴图表类型可选项*/
                if (chartTypeVal == "line") {
                    $('#seriesGrp2').show();

                    /*设置系列值2的图表类型值*/
                    // $('#chartType2').append('<option value="line">折线图</option>');
                    // $('#chartType2').append('<option value="stack">面积图</option>');
                    array.push({value: "line", name: "折线图"});
                    this.chartType2Data.push({id: "line", text: "折线图"})

                }
                else if (chartTypeVal == "bar") //柱状图
                {
                    $('#seriesGrp2').show();
                    array.push({value: "bar", name: "柱形图"});
                    var typeObj = {id: "bar", text: "柱形图"};
                    this.chartType2Data.push(typeObj);
                    // $('#chartType2').append('<option value="bar">柱形图</option>');
                }
                else if (chartTypeVal == "stack")
                {
                    $('#seriesGrp2').show();
                    array.push({value: "stack", name: "面积图"});
                    this.chartType2Data.push({id: "stack", text: "面积图"})
                }

                /* 图表类型为：饼图、雷达图、油量图时，隐藏系列值2 */
                else {
                    $('#seriesGrp2').hide();
                    if (chartTypeVal == "gauge") {
                        $('#categoryDefGrp').hide();
                    }
                }
                this.chartTypeOpt2 = array;
                if (array.length > 0)
                    this.editForm.chartType2 = array[0].value;
            },
            addSeries(name) {
                if (name == 'seriesName1') {
                    this.seriesNameOpt1 = this.addSeriesItem(name, this.seriesNameOpt1);
                } else {
                    this.seriesNameOpt2 = this.addSeriesItem(name, this.seriesNameOpt2);
                }

            },
            addSeriesItem(name, val) {

                if (!val) {
                    val = [];
                }
                /*添加一个统计项*/
                var seriesIndex = this.calculateSeriesIndex(); //获取当前统计项最大值
                // $('#' + name).append('<option value="series' + seriesIndex + '">统计项' + seriesIndex + '</option>');
                val.push({value: "series" + seriesIndex, name: "统计项" + seriesIndex});
                // $('#' + name).val('series' + seriesIndex);

                /*清空表达式值*/
                var _length = name.substr(name.length - 1, 1);
                $('#exprType' + _length).val('Sum').trigger('change');

                /*更新widgetConfig脚本*/
                var seriesDef = this.widgetConfig['series-def'];
                var seriesName = 'series' + seriesIndex;
                var axis = 'x'; //设置当前数据为x轴

                if (name == 'seriesName1') //判断是[系列值1]或是[系列值2]
                {
                    /*添加 seriesDef 数组*/
                    var params = {
                        name: seriesName,
                        expr: "",
                        group: 'Sum',
                        type: this.editForm.chartType
                    };
                    seriesDef.splice(seriesIndex, 0, params);
                    axis = 'x';
                }
                else {
                    if (this.chartType2Data) //判断y轴图表类型是否存在
                    {
                        var params = {
                            name: seriesName,
                            expr: "",
                            group: 'Sum',
                            yAxisIndex: 1,
                            type: this.chartType2Data[0].id
                        };
                        seriesDef.splice(seriesIndex, 0, params);
                        axis = 'y';
                    }
                    else {
                        this.$Message.error('【系列值2】图表类型加载出错');
                        return;
                    }
                }
                updateSeries(seriesDef, params, axis, seriesIndex, this.widgetConfig, val);
                return val;
            },
            calculateSeriesIndex() {
                var length = 0;
                var arr = [];
                var options1 = [];
                var options2 = [];
                if (this.seriesNameOpt1) {
                    options1 = this.seriesNameOpt1;
                }
                if (this.seriesNameOpt2) {
                    options2 = this.seriesNameOpt2;
                }
                arr = $.merge(arr, options1);
                arr = $.merge(arr, options2);

                for (let i = 0; i < arr.length; i++) {
                    var _length = arr[i].value.substr(6);
                    if (Number(_length) > Number(length)) {
                        length = Number(_length);
                    }
                }
                return length + 1;
            },
            delSeries(name) {
                var value = '';
                if (name == 'seriesName1') {
                    if (this.seriesNameOpt1.length < 2) {
                        this.$Message.error("至少保留一个统计项");
                        return
                    }
                    value = this.editForm.seriesName1;
                    var arr = this.seriesNameOpt1;
                    $.each(arr, function (i, v) {
                        if (value == v.value) {
                            arr.splice(i, 1);
                            return false;
                        }
                    });
                    this.seriesNameOpt1 = arr;
                    this.onSeriesNameChange(arr[0].value, 'x')
                } else {
                    if (this.seriesNameOpt2.length < 2) {
                        this.$Message.error("至少保留一个统计项");
                        return
                    }
                    value = this.editForm.seriesName2;
                    var arr = this.seriesNameOpt2;
                    $.each(arr, function (i, v) {
                        if (value == v.value) {
                            arr.splice(i, 1);
                            return false;
                        }
                    });
                    this.seriesNameOpt2 = arr;
                    this.onSeriesNameChange(arr[0].value, 'y')
                    // this.editForm.seriesName2=arr[0].value;
                }
                var seriesDef = this.widgetConfig['series-def'];
                var series = this.widgetConfig["series"];

                $.each(seriesDef, function (i, v) {
                    if (value == v.name) {
                        seriesDef.splice(i, 1);
                        series.splice(i, 1);
                        return false;
                    }
                });
                initChartOptions(this.widgetConfig, this.$route.query.code, this.editForm.chartType, "container");
            },
            initTable(metaColumns, sql) {
                let c = metaColumns.length;
                for (let i = 0; i < c; i++) {
                    let column = {
                        field: metaColumns[i].columnCode,
                        title: (metaColumns[i].columnName) ? metaColumns[i].columnName : metaColumns[i].columnCode,
                        align: "center",
                        width: 100
                    };
                    this.columns.push(column);
                }
            },
            /*改变下拉框选中值*/
            selectChange(value, name) {
                this.editForm[name] = value;
                this.initSeries(value);
                this.editForm.chartType = value;
                this.$refs.jDashWidgetParam.editForm.seriesTypeValue = value;
                this.widgetConfig = chartTypeChange(value, this.widgetConfig, this.$route.query.code, this.$route.query.provierId);
                this.showData();
                setCurrOption(currOption);

            },
            showData() {
                if (this.widgetConfig) {
                    // if (this.widgetConfig['chart-type'] == "bar") this.dashWidgetInit = 'false';
                    var categoryDef = this.widgetConfig['category-def'];
                    if (categoryDef) {
                        if (categoryDef.length > 0) {
                            this.editForm.categoryDef = categoryDef[0].expr;
                        }
                        else {
                            this.editForm.categoryDef = '';
                        }
                    }

                    var seriesDef = this.widgetConfig['series-def'];
                    this.seriesNameOpt1 = showSeriesName(seriesDef, '', '', 'xAdd', status, this.seriesNameOpt1);
                    if (this.seriesNameOpt1.length > 0) {
                        let value = this.seriesNameOpt1[0].value;
                        this.editForm.seriesName1 = value;
                        var thisSeriesDef = null;
                        $.each(seriesDef, function (i, v) {
                            if (v.name == value) {
                                thisSeriesDef = v;
                                return false;
                            }
                        });
                        this.editForm.exprType1 = thisSeriesDef.group;
                        this.editForm.exprVal1 = thisSeriesDef.expr;
                    }else {
                        this.editForm.exprVal1 = "";
                        this.editForm.seriesName1="";
                        this.$refs.seriesName1.clear();
                        // $('#seriesName1').find("span").eq(0).html("")
                    }
                    this.seriesNameOpt2 = showSeriesName(seriesDef, '', '', 'yAdd', status, this.seriesNameOpt2);
                    if (this.seriesNameOpt2.length > 0) {
                        this.editForm.seriesCheck = 'true';
                        this.seriesCheckChange("true");
                        var value = this.seriesNameOpt2[0].value;
                        this.editForm.seriesName2 = value;

                        $.each(seriesDef, function (i, v) {
                            if (v.name == value) {
                                thisSeriesDef = v;
                                return false;
                            }
                        });
                        this.editForm.exprType2 = thisSeriesDef.group;
                        this.editForm.exprVal2 = thisSeriesDef.expr;
                    } else {
                        this.editForm.exprVal2 = "";
                        this.editForm.seriesCheck = 'false';
                        this.seriesCheckChange("false");
                    }
                }
            },
            seriesCheckChange(data) {
                if (data == "true") {
                    this.typeDisabled = false;
                    this.seriesDisabled = false;
                    this.addSeries2 = false;
                    this.delSeries2 = false;
                    this.exprDisabled = false;
                    this.editExpr2 = false;

                    /*设置第二根Y轴的show为true*/
                    if (this.widgetConfig['yAxis']) {
                        this.widgetConfig['yAxis'][1]['show'] = true;
                    }

                }
                else //未选中系列值2，禁用组件
                {
                    this.typeDisabled = true;
                    this.seriesDisabled = true;
                    this.addSeries2 = true;
                    this.delSeries2 = true;
                    this.exprDisabled = true;
                    this.editExpr2 = true;
                    // $('#exprVal2').val('');
                    // $('#exprType2').val("Sum").trigger('change');
                    // if (this.chartType2Data.length > 0) {
                    //     $('#chartType2').val(chartType2Data[0].id).trigger('change');
                    // }

                    /*设置第二根Y轴的show为false*/
                    if (this.widgetConfig['yAxis'] && this.widgetConfig['yAxis'][1]) {
                        this.widgetConfig['yAxis'][1]['show'] = false;
                    }

                    /*清除widgetConfig对象中的Y轴数据*/
                    if (removeAttrWidgetConfig(this.widgetConfig)) {
                        /*重新加载图表*/
                        initChartOptions(this.widgetConfig, this.$route.query.code, this.editForm.chartType, "container");
                    }
                }
            },
            onExprTypeChange(val, seriesName, exprTextId) {
                if (exprTextId == 'exprVal2') {
                    this.widgetConfig = exprTypeChange(val, this.editForm.seriesName2, this.editForm.exprVal2, this.widgetConfig, this.$route.query.code, this.editForm.chartType2);
                } else {
                    this.widgetConfig = exprTypeChange(val, this.editForm.seriesName1, this.editForm.exprVal1, this.widgetConfig, this.$route.query.code, this.editForm.chartType);
                }

            },
            onSeriesChartTypeChange(val, seriesName, exprId) {
                if (exprId == 'exprVal2') {
                    seriesChartTypeChange(val, this.editForm.seriesName2, this.editForm.exprVal2, this.widgetConfig, this.$route.query.code, this.editForm.chartType2);
                } else {
                    seriesChartTypeChange(val, this.editForm.seriesName1, this.editForm.exprVal1, this.widgetConfig, this.$route.query.code, this.editForm.chartType);
                }
            },
            onSeriesNameChange(value, axis) {
                /* 【系列值1】【系列值2】*/
                let seriesDef = this.widgetConfig['series-def'];
                let thisSeriesDef = this.querySeriesDef(seriesDef, value);
                if(thisSeriesDef){
                    if (axis == 'x') {
                        this.editForm.exprType1 = thisSeriesDef.group;
                        this.editForm.exprVal1 = thisSeriesDef.expr;
                        this.editForm.seriesName1 = value;
                    }
                    else {
                        this.editForm.seriesName2 = value;
                        this.editForm.exprType2 = thisSeriesDef.group;
                        this.editForm.exprVal2 = thisSeriesDef.expr;
                        this.editForm.chartType2 = thisSeriesDef.type;
                    }
                }

            },
            querySeriesDef(seriesDef, value) {
                var thisSeriesDef = null;

                /*value为空，直接返回*/
                if (!value) return thisSeriesDef;

                /*循环找对应的 seriesDef 对象，并返回*/
                $.each(seriesDef, function (i, v) {
                    if (v.name == value) {
                        thisSeriesDef = v;
                        return false;
                    }
                });
                return thisSeriesDef;
            },
            /*保存*/
            btnSave(name) {
                let msg = verifyWidgetConfig(this.widgetConfig,this.editForm.chartType);
                if (msg) {
                    this.$Message.error(msg);
                    return;
                }
                /* 更新 widgetConfig */
                this.$refs.jDashWidgetParam.updateWidgetConfig(this.widgetConfig);
                this.widgetConfig = this.$refs.jDashWidgetParam.widgetConfig;
                this.$net.send({
                    server: this.$services.sysService.dashWidgetConfigRestController.save,
                    data: {
                        "widgetCode": this.$route.query.code,
                        "config": JSON.stringify(this.widgetConfig)
                    }
                }).then((data) => {
                    if (data.success) {
                        this.$Message.success(data.msg);

                    } else {
                        this.$Message.error(data.msg);
                    }
                });

            },
            /*返回*/
            btnBack() {
                this.$router.go(-1);
                this.$store.commit('removeTag', 'dashWidgetDesignChart');
                this.$store.commit('closePage', 'dashWidgetDesignChart');
            },
            editExpr(value) {
                var seriesDef = this.widgetConfig['series-def'];
                this.editForm.exprVal2 = value;
                let parameter = {
                    name: this.editForm.seriesName2,
                    expr: value,
                    group: this.editForm.exprType2
                };
                this.widgetConfig = updateSeriesDef(seriesDef, parameter, null, this.widgetConfig, this.$route.query.code, this.editForm.chartType2);
            },
            editExprVal1(value) {
                var seriesDef = this.widgetConfig['series-def'];
                this.editForm.exprVal1 = value;
                let parameter = {
                    name: this.editForm.seriesName1,
                    expr: value,
                    group: this.editForm.exprType1
                };
                this.widgetConfig = updateSeriesDef(seriesDef, parameter, null, this.widgetConfig, this.$route.query.code, this.editForm.chartType);
            },
            editCategoryDef(value) {
                this.editForm.categoryDef = value;
                let obj = {
                    expr: value
                };
                this.widgetConfig['category-def'][0] = obj;
                initChartOptions(this.widgetConfig, this.$route.query.code, this.editForm.chartType, "container");
            },
            selectTabs(name){
                if(name == 'name2'){
                    let msg = verifyWidgetConfig(this.widgetConfig,this.editForm.chartType);
                    if (msg) {
                        this.$Message.error(msg);
                        this.$refs.tabs.activeKey = "name1";
                    }
                }
            }
        }
    }
</script>

<style scoped>
    .layout {
        background-color: #fff;
        padding: 10px;
    }

    .ivu-layout-sider {
        background-color: #fff;
    }
</style>

