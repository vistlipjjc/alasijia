<template xmlns:v-contextmenu="http://www.w3.org/1999/xhtml">
    <div class="dashWidgetDesignData">
        <Card title="数据组件_组件设计">
            <Tabs type="card" v-model="tabsName" ref="tabsName" @on-click="selectTabs()" :closable="flag"
                  @on-tab-remove="handleTabRemove">
               <!-- <TabPane v-for="tab in tabs" :key="tab" :label="'标签' + tab" :name="'tab'+tab" :ref="'tab'+tab">-->
                <TabPane v-for="tab in tabs" :key="tab" :label="data.tabs[tab-1].title" :name="'tab'+tab" :ref="'tab'+tab">
                    <Form ref="data" :label-width="180">
                        <Row type="flex" justify="space-between" class="code-row-bg">
                            <Col span="8">
                            <FormItem label="标题" prop="title">
                                <Input v-model="title" placeholder="标题" @on-change="changeTitle($event, tab)"></Input>
                            </FormItem>
                            </Col>
                            <Col span="8">
                            <FormItem label="数据提供程序" prop="providerCode">
                                <j-select v-model="providerCode" :ref="'select'+tab"
                                          url="custom:dashWidgetProvider/getWidgetProvidersByWidgetCode@system"
                                          :param="providerParam"
                                          @on-change="selectChange($event)">
                                </j-select>
                            </FormItem>
                            </Col>
                        </Row>
                    </Form>
                    <Card>
                        <Row type="flex" justify="center" class="code-row-bg">
                            <Col span="20">
                            <div class="charData" :id="'charData'+tab"
                                 style="height: 65px;width:860px; margin: 3 2 0 3; overflow-x: auto; overflow-y: hidden; position: relative;right : -100px;">

                                <Col :span="24/Cols" v-for="col in Cols" :key="col">
                                <!-- <v-contextmenu class="propMenu"> // TODO 右键菜单
                                     <v-contextmenu-item @click="preColumn">在之前插入列</v-contextmenu-item>
                                     <v-contextmenu-item @click="sufColumn">在之后插入列</v-contextmenu-item>
                                     <v-contextmenu-item @click="removeColumn">删除列</v-contextmenu-item>
                                 </v-contextmenu>
                                 <div v-contextmenu:contextmenu>-->
                                <div align="center" class="column">
                                    <table style="float: left; text-align: center; padding: 0px; width: 215px;">
                                        <tr>
                                            <td :id="'header'+col" class="header cellBorder"
                                                @click="refreshForm('header'+col)"
                                            >
                                                {{data.tabs[tab-1].table.header.cells[col-1]?data.tabs[tab-1].table.header.cells[col-1].title:""}}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td :id="'detail'+col" class="detail cellBorder"
                                                @click="refreshForm('detail'+col)"
                                                style="width: 215px; font-size: 13px; text-align: center;">
                                                <dash-widget-design-data-expr @on-value="editExpr"
                                                                              :value="data.tabs[tab-1].table.detail.cells[col-1]?data.tabs[tab-1].table.detail.cells[col-1].expr:''"
                                                                              :widgetProvierId="providerCode">
                                                </dash-widget-design-data-expr>
                                            </td>
                                        </tr>
                                    </table>
                                </div>
                                </Col>
                            </div>
                            </Col>
                            <Col span="4">
                            <a @click="openUrl()">链接...</a> </Col>
                        </Row>
                    </Card>

                    <Collapse value="1">
                        <Panel name="1" style="font-size: 12px;">
                            通用
                            <p slot="content">

                            <Form ref="editForm" :model="editForm" :label-width="180">
                                <Row type="flex" justify="space-between" class="code-row-bg">
                                    <Col span="8" v-show="showTitle">
                                    <FormItem label="标题" prop="title">
                                        <Input v-model="editForm.title" @on-change="changeStyle()"/>
                                    </FormItem>
                                    </Col>
                                    <Col span="8">
                                    <FormItem label="粗体" prop="fontBold">
                                        <RadioGroup v-model="editForm.fontBold" @on-change="changeStyle();">
                                            <Radio label="true">
                                                <span>是</span>
                                            </Radio>
                                            <Radio label="false">
                                                <span>否</span>
                                            </Radio>
                                        </RadioGroup>
                                    </FormItem>
                                    </Col>
                                    <Col span="8">
                                    <FormItem label="字体大小" prop="fontSize">
                                        <Input align="center" v-model="editForm.fontSize" @on-change="changeStyle();"/>
                                    </FormItem>
                                    </Col>
                                    <Col span="8">
                                    <FormItem label="字体颜色" prop="color">
                                        <Input align="center" v-model="editForm.color" @on-change="changeStyle();"/>
                                    </FormItem>
                                    </Col>
                                    <Col span="8">
                                    <FormItem label="背景颜色" prop="backgroundColor">
                                        <Input align="center" v-model="editForm.backgroundColor"
                                               @on-change="changeStyle();"/>
                                    </FormItem>
                                    </Col>
                                    <Col span="8">
                                    <FormItem label="斜体" prop="italic">
                                        <RadioGroup v-model="editForm.italic" @on-change="changeStyle();">
                                            <Radio label="true">
                                                <span>是</span>
                                            </Radio>
                                            <Radio label="false">
                                                <span>否</span>
                                            </Radio>
                                        </RadioGroup>
                                    </FormItem>
                                    </Col>


                                    <Col span="8">
                                    <FormItem label="下划线" prop="underline">
                                        <RadioGroup v-model="editForm.underline" @on-change="changeStyle();">
                                            <Radio label="true">
                                                <span>是</span>
                                            </Radio>
                                            <Radio label="false">
                                                <span>否</span>
                                            </Radio>
                                        </RadioGroup>
                                    </FormItem>
                                    </Col>
                                    <Col span="8">
                                    <FormItem label="走向线" prop="strikeline">
                                        <RadioGroup v-model="editForm.strikeline" @on-change="changeStyle();">
                                            <Radio label="true">
                                                <span>是</span>
                                            </Radio>
                                            <Radio label="false">
                                                <span>否</span>
                                            </Radio>
                                        </RadioGroup>
                                    </FormItem>
                                    </Col>
                                    <Col span="8">
                                    <FormItem label="框类型" prop="display">
                                        <Select v-model="editForm.display" @on-change="changeStyle();">
                                            <Option value="block">block</Option>
                                            <Option value="none">none</Option>
                                        </Select>
                                    </FormItem>
                                    </Col>
                                </Row>
                            </Form>
                            </p>
                        </Panel>
                        <Panel name="2" style="font-size: 12px;">
                            对齐方式
                            <p slot="content">

                            <Form ref="editForm" :model="editForm" :label-width="180">
                                <Row type="flex" justify="space-between" class="code-row-bg">
                                    <Col span="8">
                                    <FormItem label="垂直对齐" prop="verticalAlign">
                                        <Select v-model="editForm.verticalAlign" @on-change="changeStyle();">
                                            <Option value="top">top</Option>
                                            <Option value="middle">middle</Option>
                                            <Option value="bottom">bottom</Option>
                                        </Select>
                                    </FormItem>
                                    </Col>

                                    <Col span="8">
                                    <FormItem label="文本对齐方式" prop="textAlign">
                                        <Select v-model="editForm.textAlign" @on-change="changeStyle();">
                                            <Option value="left">left</Option>
                                            <Option value="center">center</Option>
                                            <Option value="right">right</Option>
                                        </Select>
                                    </FormItem>
                                    </Col>
                                </Row>
                            </Form>
                            </p>
                        </Panel>
                        <Panel name="3" style="font-size: 12px;">
                            内间距
                            <p slot="content">

                            <Form ref="editForm" :model="editForm" :label-width="180">
                                <Row type="flex" justify="space-between" class="code-row-bg">
                                    <Col span="10">
                                    <FormItem label="上内间距" prop="paddingTop">
                                        <InputNumber :max="999" :min="0" v-model="editForm.paddingTop"
                                                     @on-change="changeStyle();"></InputNumber>
                                    </FormItem>
                                    </Col>

                                    <Col span="10">
                                    <FormItem label="下内间距" prop="paddingBottom">
                                        <InputNumber :max="999" :min="0" v-model="editForm.paddingBottom"
                                                     @on-change="changeStyle();"></InputNumber>
                                    </FormItem>
                                    </Col>
                                    <Col span="10">
                                    <FormItem label="左内间距" prop="paddingLeft">
                                        <InputNumber :max="999" :min="0" v-model="editForm.paddingLeft"
                                                     @on-change="changeStyle();"></InputNumber>
                                    </FormItem>
                                    </Col>

                                    <Col span="10">
                                    <FormItem label="左内间距" prop="paddingRight">
                                        <InputNumber :max="999" :min="0" v-model="editForm.paddingRight"
                                                     @on-change="changeStyle();"></InputNumber>
                                    </FormItem>
                                    </Col>
                                </Row>
                            </Form>
                            </p>
                        </Panel>

                        <Panel name="4" style="font-size: 12px;">
                            外间距
                            <p slot="content">
                            <Form ref="editForm" :model="editForm" :label-width="180">
                                <Row type="flex" justify="space-between" class="code-row-bg">
                                    <Col span="10">
                                    <FormItem label="上外间距" prop="marginTop">
                                        <InputNumber :max="999" :min="0" v-model="editForm.marginTop"
                                                     @on-change="changeStyle();"></InputNumber>
                                    </FormItem>
                                    </Col>

                                    <Col span="10">
                                    <FormItem label="下外间距" prop="marginBottom">
                                        <InputNumber :max="999" :min="0" v-model="editForm.marginBottom"
                                                     @on-change="changeStyle();"></InputNumber>
                                    </FormItem>
                                    </Col>
                                    <Col span="10">
                                    <FormItem label="左外间距" prop="marginLeft">
                                        <InputNumber :max="999" :min="0" v-model="editForm.marginLeft"
                                                     @on-change="changeStyle();"></InputNumber>
                                    </FormItem>
                                    </Col>

                                    <Col span="10">
                                    <FormItem label="左外间距" prop="marginRight">
                                        <InputNumber :max="999" :min="0" v-model="editForm.marginRight"
                                                     @on-change="changeStyle();"></InputNumber>
                                    </FormItem>
                                    </Col>
                                </Row>
                            </Form>
                            </p>
                        </Panel>
                    </Collapse>

                </TabPane>
                <Button type="ghost" @click="handleTabsAdd" size="small" slot="extra">增加</Button>
            </Tabs>
            <div align="center" style="margin-top: 50px;">
                <Button @click="btnSave('editForm')" type="primary">保存</Button>
                <Button @click="btnBack" type="primary">返回</Button>
            </div>
        </Card>

        <Modal
                v-model="model"
                title="设置链接"
                @on-ok="saveHyperlink('hyperlink')"
                @on-cancel="cancel">
            <Row>
                <Form ref="hyperlink" :model="hyperlink" :label-width="180">
                    <FormItem label="是否显示" prop="show">
                        <RadioGroup v-model="hyperlink.show" @on-change="changeStyle();">
                            <Radio label="true">
                                <span>是</span>
                            </Radio>
                            <Radio label="false">
                                <span>否</span>
                            </Radio>
                        </RadioGroup>
                    </FormItem>

                    <FormItem label="标题" prop="title">
                        <Input v-model="hyperlink.title"></Input>
                    </FormItem>
                    <FormItem label="显示文本" prop="text">
                        <Input v-model="hyperlink.text"></Input>
                    </FormItem>
                    <FormItem label="访问路径" prop="url">
                        <Input v-model="hyperlink.url"></Input>
                    </FormItem>
                </Form>
            </Row>
        </Modal>


    </div>
</template>

<script>
    import dashWidgetDesignDataExpr from './components/dashWidgetDesignDataExpr.vue';

    export default {
        components: {
            dashWidgetDesignDataExpr
        },
        data() {
            return {
                tabs: 1,
                //tabs:[],
                Cols: 24,
                index: 0,
                name: 'header1',
                tabsName: 'tab1',
                showTitle: false,
                flag: false,
                model: false,
                title: "",
                providerCode: "",
                editForm: {
                    title: "",
                    fontBold: "true",
                    fontSize: "12",
                    color: "",
                    backgroundColor: "",
                    italic: "",
                    underline: "",
                    strikeline: "",
                    display: "",
                    verticalAlign: "",
                    textAlign: "",
                    paddingTop: 0,
                    paddingBottom: 0,
                    paddingLeft: 0,
                    paddingRight: 0,
                    marginTop: 0,
                    marginBottom: 0,
                    marginLeft: 0,
                    marginRight: 0,
                },
                hyperlink: {
                    show: "false",
                    title: "",
                    text: "更多...",
                    url: "#"
                },
                data: {
                    "title": "数据组件",
                    tabs: [{
                        title: "",
                        provider: "",
                        hyperlink: {
                            show: "false",
                            title: "",
                            text: "更多...",
                            url: "#"
                        },
                        table: {
                            header: {
                                "cells": [{
                                    fontBold: "true",
                                    fontSize: "12",
                                    color: "",
                                    backgroundColor: "",
                                    italic: "false",
                                    underline: "false",
                                    strikeline: "false",
                                    display: "block",
                                    verticalAlign: "top",
                                    textAlign: "center",
                                    paddingTop: 0,
                                    paddingBottom: 0,
                                    paddingLeft: 0,
                                    paddingRight: 0,
                                    marginTop: 0,
                                    marginBottom: 0,
                                    marginLeft: 0,
                                    marginRight: 0,
                                }, {
                                    fontBold: "true",
                                    fontSize: "12",
                                    color: "",
                                    backgroundColor: "",
                                    italic: "false",
                                    underline: "false",
                                    strikeline: "false",
                                    display: "block",
                                    verticalAlign: "top",
                                    textAlign: "center",
                                    paddingTop: 0,
                                    paddingBottom: 0,
                                    paddingLeft: 0,
                                    paddingRight: 0,
                                    marginTop: 0,
                                    marginBottom: 0,
                                    marginLeft: 0,
                                    marginRight: 0,
                                }, {
                                    fontBold: "true",
                                    fontSize: "12",
                                    color: "",
                                    backgroundColor: "",
                                    italic: "false",
                                    underline: "false",
                                    strikeline: "false",
                                    display: "block",
                                    verticalAlign: "top",
                                    textAlign: "center",
                                    paddingTop: 0,
                                    paddingBottom: 0,
                                    paddingLeft: 0,
                                    paddingRight: 0,
                                    marginTop: 0,
                                    marginBottom: 0,
                                    marginLeft: 0,
                                    marginRight: 0,
                                }, {
                                    fontBold: "true",
                                    fontSize: "12",
                                    color: "",
                                    backgroundColor: "",
                                    italic: "false",
                                    underline: "false",
                                    strikeline: "false",
                                    display: "block",
                                    verticalAlign: "top",
                                    textAlign: "center",
                                    paddingTop: 0,
                                    paddingBottom: 0,
                                    paddingLeft: 0,
                                    paddingRight: 0,
                                    marginTop: 0,
                                    marginBottom: 0,
                                    marginLeft: 0,
                                    marginRight: 0,
                                }]
                            },
                            detail: {
                                "cells": [{
                                    expr: "",
                                    "width": "20px",
                                    fontBold: "true",
                                    fontSize: "12",
                                    color: "",
                                    backgroundColor: "",
                                    italic: "false",
                                    underline: "false",
                                    strikeline: "false",
                                    display: "block",
                                    verticalAlign: "top",
                                    textAlign: "center",
                                    paddingTop: 0,
                                    paddingBottom: 0,
                                    paddingLeft: 0,
                                    paddingRight: 0,
                                    marginTop: 0,
                                    marginBottom: 0,
                                    marginLeft: 0,
                                    marginRight: 0,
                                }, {
                                    expr: "", "width": "20px", fontBold: "true",
                                    fontSize: "12",
                                    color: "",
                                    backgroundColor: "",
                                    italic: "false",
                                    underline: "false",
                                    strikeline: "false",
                                    display: "block",
                                    verticalAlign: "top",
                                    textAlign: "center",
                                    paddingTop: 0,
                                    paddingBottom: 0,
                                    paddingLeft: 0,
                                    paddingRight: 0,
                                    marginTop: 0,
                                    marginBottom: 0,
                                    marginLeft: 0,
                                    marginRight: 0,
                                }, {
                                    expr: "",
                                    "width": "20px",
                                    fontBold: "true",
                                    fontSize: "12",
                                    color: "",
                                    backgroundColor: "",
                                    italic: "false",
                                    underline: "false",
                                    strikeline: "false",
                                    display: "block",
                                    verticalAlign: "top",
                                    textAlign: "center",
                                    paddingTop: 0,
                                    paddingBottom: 0,
                                    paddingLeft: 0,
                                    paddingRight: 0,
                                    marginTop: 0,
                                    marginBottom: 0,
                                    marginLeft: 0,
                                    marginRight: 0,
                                }, {
                                    expr: "", "width": "20px", fontBold: "true",
                                    fontSize: "12",
                                    color: "",
                                    backgroundColor: "",
                                    italic: "false",
                                    underline: "false",
                                    strikeline: "false",
                                    display: "block",
                                    verticalAlign: "top",
                                    textAlign: "center",
                                    paddingTop: 0,
                                    paddingBottom: 0,
                                    paddingLeft: 0,
                                    paddingRight: 0,
                                    marginTop: 0,
                                    marginBottom: 0,
                                    marginLeft: 0,
                                    marginRight: 0,
                                }]
                            }
                        }
                    }]
                },
                providerParam: {}
            }
        },
        mounted() {
            this.init()
        },
        methods: {
            preColumn() {
            },
            sufColumn() {
            },
            removeColumn() {
                this.$Message.info('test');
            },
            init() {

                this.providerParam = {'widgetCode': this.$route.query.code};

                this.$net.send({
                    server: this.$services.sysService.dashWidgetConfigRestController.getWidgetConfigByWidgetCode,
                    append: this.$route.query.code
                }).then((data) => {
                    if (data.success && data.dashWidgetConfig.config) {
                        var dashWidgetConfig = JSON.parse(data.dashWidgetConfig.config);
                        this.tabs = dashWidgetConfig.tabs.length;
                        this.Cols = dashWidgetConfig.tabs[0].table.header.cells.length;
                        // if (this.tabs > 1) {
                        //     this.flag = true;
                        // }
                        this.editForm = dashWidgetConfig.tabs[0].table.header.cells[0];
                        this.title = dashWidgetConfig.tabs[0].title;
                        this.providerCode = dashWidgetConfig.tabs[0].provider;
                        this.data = dashWidgetConfig;
                        for (var j = 0; j < dashWidgetConfig.tabs.length; j++) {
                            for (var i = 0; i < dashWidgetConfig.tabs[j].table.header.cells.length; i++) {
                                this.initStyle(j + 1, i + 1, "header", dashWidgetConfig.tabs[j].table.header.cells[i]);
                                this.initStyle(j + 1, i + 1, "detail", dashWidgetConfig.tabs[j].table.detail.cells[i]);
                            }
                        }
                        this.changeStyle();
                    } else {
                        this.tabs = 1;
                        this.Cols = 4
                        this.editForm = this.data.tabs[0].table.header.cells[0];
                    }
                })
            },
            handleTabsAdd() {
                this.data.tabs[this.data.tabs.length] = {
                    title: "",
                    provider: this.providerCode,
                    hyperlink: {
                        show: "false",
                        title: "",
                        text: "更多...",
                        url: "#"
                    },
                    table: {
                        header: {
                            "cells": [{
                                fontBold: "true",
                                fontSize: "12",
                                color: "",
                                backgroundColor: "",
                                italic: "false",
                                underline: "false",
                                strikeline: "false",
                                display: "block",
                                verticalAlign: "top",
                                textAlign: "center",
                                paddingTop: 0,
                                paddingBottom: 0,
                                paddingLeft: 0,
                                paddingRight: 0,
                                marginTop: 0,
                                marginBottom: 0,
                                marginLeft: 0,
                                marginRight: 0,
                            }, {
                                fontBold: "true",
                                fontSize: "12",
                                color: "",
                                backgroundColor: "",
                                italic: "false",
                                underline: "false",
                                strikeline: "false",
                                display: "block",
                                verticalAlign: "top",
                                textAlign: "center",
                                paddingTop: 0,
                                paddingBottom: 0,
                                paddingLeft: 0,
                                paddingRight: 0,
                                marginTop: 0,
                                marginBottom: 0,
                                marginLeft: 0,
                                marginRight: 0,
                            }, {
                                fontBold: "true",
                                fontSize: "12",
                                color: "",
                                backgroundColor: "",
                                italic: "false",
                                underline: "false",
                                strikeline: "false",
                                display: "block",
                                verticalAlign: "top",
                                textAlign: "center",
                                paddingTop: 0,
                                paddingBottom: 0,
                                paddingLeft: 0,
                                paddingRight: 0,
                                marginTop: 0,
                                marginBottom: 0,
                                marginLeft: 0,
                                marginRight: 0,
                            }, {
                                fontBold: "true",
                                fontSize: "12",
                                color: "",
                                backgroundColor: "",
                                italic: "false",
                                underline: "false",
                                strikeline: "false",
                                display: "block",
                                verticalAlign: "top",
                                textAlign: "center",
                                paddingTop: 0,
                                paddingBottom: 0,
                                paddingLeft: 0,
                                paddingRight: 0,
                                marginTop: 0,
                                marginBottom: 0,
                                marginLeft: 0,
                                marginRight: 0,
                            }]
                        },
                        detail: {
                            "cells": [{
                                expr: "",
                                "width": "20px",
                                fontBold: "true",
                                fontSize: "12",
                                color: "",
                                backgroundColor: "",
                                italic: "false",
                                underline: "false",
                                strikeline: "false",
                                display: "block",
                                verticalAlign: "top",
                                textAlign: "center",
                                paddingTop: 0,
                                paddingBottom: 0,
                                paddingLeft: 0,
                                paddingRight: 0,
                                marginTop: 0,
                                marginBottom: 0,
                                marginLeft: 0,
                                marginRight: 0,
                            }, {
                                expr: "", "width": "20px", fontBold: "true",
                                fontSize: "12",
                                color: "",
                                backgroundColor: "",
                                italic: "false",
                                underline: "false",
                                strikeline: "false",
                                display: "block",
                                verticalAlign: "top",
                                textAlign: "center",
                                paddingTop: 0,
                                paddingBottom: 0,
                                paddingLeft: 0,
                                paddingRight: 0,
                                marginTop: 0,
                                marginBottom: 0,
                                marginLeft: 0,
                                marginRight: 0,
                            }, {
                                expr: "",
                                "width": "20px",
                                fontBold: "true",
                                fontSize: "12",
                                color: "",
                                backgroundColor: "",
                                italic: "false",
                                underline: "false",
                                strikeline: "false",
                                display: "block",
                                verticalAlign: "top",
                                textAlign: "center",
                                paddingTop: 0,
                                paddingBottom: 0,
                                paddingLeft: 0,
                                paddingRight: 0,
                                marginTop: 0,
                                marginBottom: 0,
                                marginLeft: 0,
                                marginRight: 0,
                            }, {
                                expr: "", "width": "20px", fontBold: "true",
                                fontSize: "12",
                                color: "",
                                backgroundColor: "",
                                italic: "false",
                                underline: "false",
                                strikeline: "false",
                                display: "block",
                                verticalAlign: "top",
                                textAlign: "center",
                                paddingTop: 0,
                                paddingBottom: 0,
                                paddingLeft: 0,
                                paddingRight: 0,
                                marginTop: 0,
                                marginBottom: 0,
                                marginLeft: 0,
                                marginRight: 0,
                            }]
                        }
                    }
                };
                this.tabs=this.data.tabs.length;
                if (this.tabs > 1) {
                    this.flag = true;
                }
                this.flag = false;
            },
            selectTabs() {

                var j = this.tabsName.replace("tab", '') - 1;
                if (this.tabs == j + 1&&this.tabs!=1) {
                    this.flag = true;
                } else {
                    this.flag = false;
                }
                this.Cols = this.data.tabs[j].table.header.cells.length;
                this.title = this.data.tabs[j].title;
                if (this.data.tabs[j].provider) {
                    this.providerCode = this.data.tabs[j].provider;
                }
                for (let i = 0; i < this.data.tabs[j].table.header.cells.length; i++) {
                    $("#charData" + (j + 1)).find("#header" + (i + 1)).html(this.data.tabs[j].table.header.cells[i].title);
                    this.initStyle(j + 1, i + 1, "header", this.data.tabs[j].table.header.cells[i]);
                    this.initStyle(j + 1, i + 1, "detail", this.data.tabs[j].table.detail.cells[i]);
                }

            },
            refreshForm(name) {
                $("td").removeClass("cellSelected");
                $("#"+name).addClass("cellSelected");
                var j = this.tabsName.replace("tab", '') - 1;
                var i;
                if (name.indexOf("header") != -1) {
                    this.showTitle = true;
                    i = name.replace("header", '') - 1;
                    if (this.index != i) {
                        if (this.name.indexOf("header") != -1) {
                            this.data.tabs[j].table.header.cells[this.index] = this.editForm;
                        } else {
                            this.data.tabs[j].table.detail.cells[this.index] = this.editForm;
                        }
                    }
                    this.editForm = this.data.tabs[j].table.header.cells[i];
                } else {
                    this.showTitle = false;
                    i = name.replace("detail", '') - 1;
                    if (this.index != i) {
                        if (this.name.indexOf("header") != -1) {
                            this.data.tabs[j].table.header.cells[this.index] = this.editForm;
                        } else {
                            this.data.tabs[j].table.detail.cells[this.index] = this.editForm;
                        }
                    }
                    this.editForm = this.data.tabs[j].table.detail.cells[i];
                }
                this.index = i;
                this.name = name;
            },
            initStyle(tabIndex, liindex, type, data) {
                var props = "width:100%;";

                if (data.underline == "true") {
                    props += 'text-decoration: underline; ';
                }
                if (data.italic == "true") {
                    props += 'font-style:italic; ';
                }
                if (data.strikeline == "true") {
                    props += 'text-decoration: line-through; ';
                }
                if (data.fontBold == "true") {
                    props += 'font-weight:bold; ';
                }
                props += "color" + ':  ' + data.color + '; ';
                props += "background-color" + ':  ' + data.backgroundColor + '; ';

                props += 'text-align' + ':  ' + data.textAlign + '; ';

                props += 'vertical-align' + ':  ' + data.verticalAlign + '; ';

                props += 'display' + ':  ' + data.display + '; ';
                props += 'font-size' + ':  ' + data.fontSize + 'px; ';
                props += 'padding-top' + ':  ' + data.paddingTop + 'px; ';
                props += 'padding-bottom' + ':  ' + data.paddingBottom + 'px; ';
                props += 'padding-left' + ':  ' + data.paddingLeft + 'px; ';
                props += 'padding-right' + ':  ' + data.paddingRight + 'px; ';

                props += 'margin-top' + ':  ' + data.marginTop + 'px; ';
                props += 'margin-bottom' + ':  ' + data.marginBottom + 'px; ';
                props += 'margin-left' + ':  ' + data.marginLeft + 'px; ';
                props += 'margin-right' + ':  ' + data.marginRight + 'px; ';

                if (type == "detail") {

                    $("#charData" + tabIndex).find('#detail' + liindex).eq(0).find("input").attr("style", props);
                } else {
                    $("#charData" + tabIndex).find('#header' + liindex).eq(0).attr("style", props);
                    // $("#charData" + index).find('#' + this.name).eq(0).html(this.editForm.title);
                }

            },
            changeStyle() {

                var props = "width:100%;";

                if (this.editForm.underline == "true") {
                    props += 'text-decoration: underline; ';
                }
                if (this.editForm.italic == "true") {
                    props += 'font-style:italic; ';
                }
                if (this.editForm.strikeline == "true") {
                    props += 'text-decoration: line-through; ';
                }
                if (this.editForm.fontBold == "true") {
                    props += 'font-weight:bold; ';
                }
                props += "color" + ':  ' + this.editForm.color + '; ';
                props += "background-color" + ':  ' + this.editForm.backgroundColor + '; ';

                props += 'text-align' + ':  ' + this.editForm.textAlign + '; ';

                props += 'vertical-align' + ':  ' + this.editForm.verticalAlign + '; ';

                props += 'display' + ':  ' + this.editForm.display + '; ';
                props += 'font-size' + ':  ' + this.editForm.fontSize + 'px; ';
                props += 'padding-top' + ':  ' + this.editForm.paddingTop + 'px; ';
                props += 'padding-bottom' + ':  ' + this.editForm.paddingBottom + 'px; ';
                props += 'padding-left' + ':  ' + this.editForm.paddingLeft + 'px; ';
                props += 'padding-right' + ':  ' + this.editForm.paddingRight + 'px; ';

                props += 'margin-top' + ':  ' + this.editForm.marginTop + 'px; ';
                props += 'margin-bottom' + ':  ' + this.editForm.marginBottom + 'px; ';
                props += 'margin-left' + ':  ' + this.editForm.marginLeft + 'px; ';
                props += 'margin-right' + ':  ' + this.editForm.marginRight + 'px; ';

                var index = this.tabsName.replace("tab", "");
                if (this.name.indexOf("detail") != -1) {
                    $("#charData" + index).find('#' + this.name).eq(0).attr("style", "display:" + this.editForm.display + '; ');
                    $("#charData" + index).find('#' + this.name).eq(0).find("input").attr("style", props);
                } else {
                    $("#charData" + index).find('#' + this.name).eq(0).attr("style", props);
                    $("#charData" + index).find('#' + this.name).eq(0).html(this.editForm.title);
                }

            },
            openUrl() {
                this.model = true;
                var j = this.tabsName.replace("tab", '') - 1;
                this.hyperlink = this.data.tabs[j].hyperlink;
            },
            saveHyperlink() {
                var j = this.tabsName.replace("tab", '') - 1;
                this.data.tabs[j].hyperlink = this.hyperlink;
            },
            selectChange(value) {
                var j = this.tabsName.replace("tab", '') - 1;
                this.data.tabs[j].provider = value;
                this.providerCode = value;
            },
            changeTitle(val, index) {
                this.data.tabs[index-1].title = this.title;
            },

            /*保存*/
            btnSave(name) {
                // console.log(this.data)
                var isBind = false;
                var tabs = this.data.tabs;
                $.each(tabs, function (i, tab) {
                    var provider = tab.provider;
                    if (!provider || provider == '') {
                        isBind = true;
                        return false;
                    }
                });

                if (isBind) {
                    this.$Message.error('存在页面未选择数据绑定程序，请选择。');
                    return;
                }
                this.$net.send({
                    server: this.$services.sysService.dashWidgetConfigRestController.save,
                    data: {
                        "widgetCode": this.$route.query.code,
                        "config": JSON.stringify(this.data)
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
                this.$store.commit('removeTag', 'dashWidgetDesignData');
                this.$store.commit('closePage', 'dashWidgetDesignData');
            },
            cancel() {
            },
            handleTabRemove(name) {
                this.tabs--;
                var index = name.replace("tab", "") - 1;
                this.data.tabs.splice(index, 1);
                if (this.data.tabs.length == 1) {
                    this.flag = false;
                }
                console.log(this.data.tabs)
            },
            editExpr(val) {
                var index = this.tabsName.replace("tab", "") - 1;
                var i = this.name.replace("detail", "") - 1;
                this.data.tabs[index].table.detail.cells[i].expr = val;
            }
        }
    }
</script>

<style>
    .column {
        float: left;
        /*border: dashed 1px #b9d5f6;*/
    }

    .column-edge {
        float: right;
        width: 1px;
        background-color: #edf0f3;
        text-indent: -9999em;
        cursor: w-resize;
        min-height: 54px;
        height: auto !important;
        height: 54px;
    }

    .cellBorder {
        border: #ccc 1px solid;
    }

    .cellSelected {
        border: #95B8E7 1px dashed;
    }

    .header {
        height: 27px;
        list-style-type: none;
        line-height: 27px;
        overflow: hidden;
    }

    .detail {
        height: 27px;
        list-style-type: none;
        line-height: 27px;
        overflow: hidden;
    }

    .document-class {
        width: 150px;
        border: 1px solid #CCCCCC;
        position: absolute;
        display: none;
        background: #ffffff;
        z-index: 9999;
    }

    .document-class ul {
        padding: 0px;
        margin: 0px;
        list-style: none;
    }

    .document-class ul li {
        line-height: 30px;
        text-indent: 20px;
    }

    .document-class ul li a {
        color: #000000;
        text-decoration: none;
    }

    #dataWidgetIbox {
        font-size: 13px;
    }

    .propMenu {
        font-size: 12px;
        color: #495060;
    }
    .cellSelected{
        border:#95B8E7 1px dashed;
    }

</style>