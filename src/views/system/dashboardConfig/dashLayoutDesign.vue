<style lang="less">
    @import '../../../styles/common.less';
    @import 'draggable-list.less';
</style>

<template>
    <div>
        <Card :title="this.$route.query.code+'_布局设计'">
            <template slot="extra">
                <div class="demo_line_05" @click="disPlay()">
                    <span id="button" style="cursor: Pointer;"><Icon type="ios-arrow-up" size="24"/></span>
                </div>
            </template>
            <div>


                <div style="width: 100%;overflow-y:visible;overflow: auto;border: 1px solid #dddee1" v-show="flag">
                    <div id="div" style="width: 100%;height:136px;height: auto;overflow-y:visible;">
                        <div style="height:136px;width:100%;overflow: auto;overflow-y:visible" class="menu">
                            <ul id="all" class="iview-admin-draggable-list" style="height:136px;">
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <Row class="margin-top-10">
                <Col span="24">
                <div style="width: 100%;height:auto;overflow-y:visible;overflow: auto">
                    <div id="divWidth" style="width: 100%;min-height:385.64px;height: auto;overflow-y:visible;">

                        <div style="float: left;min-height:385.64px;height: auto;width: 382px;border: 1px dashed rgb(206, 194, 194);"
                             v-for="col in Cols" :key="col">
                            <Icon type="close-round"
                                  style="float: right;border: 1px solid  rgb(206, 194, 194);opacity: 0.5;"
                                  @click="remove('column'+col)"></Icon>
                            <ul :id="'column'+col" class="iview-admin-draggable-list"
                                style="min-height:340px;height: auto;width: 380px;overflow-x:visible">

                            </ul>
                        </div>
                        <div id="buttonDiv" align="right"
                             style="width: 24px;float: left;margin-top: 160px;margin-left: 10px">
                            <Button @click="add()" icon="android-add" style="margin-right: 15px"></Button>
                        </div>
                    </div>
                </div>

                </Col>
                <!--<Col span="2">-->
                <!--<div align="center" style="margin-top: 150px;">-->
                <!--<Button @click="add()" icon="android-add"></Button>-->
                <!--</div>-->
                <!--</Col>-->
                <Col span="24">
                <div align="center" style="margin-top: 10px;">
                    <Button @click="btnSave('editForm')" type="primary">保存</Button>
                    <Button @click="btnBack" type="primary" style="margin-left: 20px;">返回</Button>
                </div>
                </Col>
            </Row>

        </Card>


    </div>
</template>
<script>
    import Sortable from 'sortablejs';
    import {
        _addWidget2Column,
    } from './dashLayoutDesign.js';

    export default {
        name: 'draggable-list',
        data() {
            return {
                flag: true,
                Cols: 3,
                index: 3,
                config: Object,
                version: "",
                designType: "",
                width: 1166,
                divWidth: 1267,
                codes: ""
            };
        },
        mounted() {
            this.init();
        },
        methods: {
            init() {
                document.body.ondrop = function (event) {
                    event.preventDefault();
                    event.stopPropagation();
                };
                let vm = this;
                //回显数据
                this.$net.send({
                    server: this.$services.sysService.dashLayoutConfigRestController.getLayoutConfigData,
                    append: this.$route.query.code
                }).then((data) => {
                    if (data.success && data.config) {
                        this.config = data.config;
                        this.version = data.version;
                        this.designType = data.designType;
                        this.Cols = data.config.columns.length;
                        this.index = this.Cols;
                        this.width = this.width + 382 * (this.Cols - 3) + 23;
                        document.getElementById('divWidth').setAttribute("style", "width :" + this.width + "px");
                        var _container = $(document.body);
                        var _columns = $('<div id="columns"></div>').appendTo(_container);
                        for (let i = 1; i <= this.Cols; i++) {
                            let column = document.getElementById('column' + i);
                            Sortable.create(column, {
                                group: {
                                    name: 'list',
                                    pull: true
                                },
                                animation: 120,
                                ghostClass: 'placeholder-style',
                                fallbackClass: 'iview-admin-cloned-item',
                                onRemove(event) {
                                    let width = $("#all li").length * 152;
                                    if (width > 1267) {
                                        document.getElementById('div').setAttribute("style", "width: 100%;height:136px;height: auto;overflow-y:visible;width :" + width + "px");
                                    }else{
                                        document.getElementById('div').setAttribute("style", "width: 100%;height:136px;height: auto;overflow-y:visible;width :1267px");
                                    }
                                }
                            });

                            var _cc = data.config.columns[i - 1];
                            var _column = $('<ul class="column" id="' + _cc.id + '"></ul>').appendTo(_columns);
                            for (var j = 0; j < _cc.widgets.length; j++) {
                                var _cw = _cc.widgets[j];
                                this.codes += _cw.code;
                                _addWidget2Column(_cc.id, _cw);
                            }
                        }
                        this.initCharts();
                    }
                    else {
                        this.width = this.width;
                        let divWidth = document.getElementById('divWidth').setAttribute("style", "width :" + this.width + "px");
                        this.designType = 'NORMAL';
                        this.config = $.parseJSON('{"columns":[{"id":"column1","width":380,"widgets":[]},{"id":"column2","width":380,"widgets":[]},{"id":"column3","width":380,"widgets":[]}]}');
                        for (let i = 1; i <= 3; i++) {
                            let column = document.getElementById('column' + i);
                            Sortable.create(column, {
                                group: {
                                    name: 'list',
                                    pull: true
                                },
                                animation: 120,
                                ghostClass: 'placeholder-style',
                                fallbackClass: 'iview-admin-cloned-item',
                                onRemove(event) {
                                    let width = $("#all li").length * 152;
                                    if (width > 1267) {
                                        document.getElementById('div').setAttribute("style", "width: 100%;height:136px;height: auto;overflow-y:visible;width :" + width + "px");
                                    }else{
                                        document.getElementById('div').setAttribute("style", "width: 100%;height:136px;height: auto;overflow-y:visible;width :1267px");
                                    }
                                }
                            });
                        }
                        this.initCharts();
                    }
                });
            },
            initCharts() {

                let column = document.getElementById('all');
                Sortable.create(column, {
                    group: {
                        name: 'list',
                        pull: true
                    },
                    animation: 120,
                    ghostClass: 'placeholder-style',
                    fallbackClass: 'iview-admin-cloned-item',
                    onRemove(event) {
                        let width = $("#all li").length * 152;
                        if (width > 1267) {
                            document.getElementById('div').setAttribute("style", "width: 100%;height:136px;height: auto;overflow-y:visible;width :" + width + "px");
                        }else{
                            document.getElementById('div').setAttribute("style", "width: 100%;height:136px;height: auto;overflow-y:visible;width :1267px");
                        }
                    }
                });
                this.$net.send({
                    server: this.$services.sysService.dashLayoutDesignRestController.getAllSelectWidget,
                }).then((data) => {
                    let width = 0;
                    for (var j = 0; j < data.length; j++) {
                        var _cw = {
                            "id": "widget_" + data[j].value,
                            "code": data[j].value,
                            "title": data[j].name,
                            "height": "300px"
                        };

                        if (this.codes.indexOf(data[j].value) != -1) {
                            continue;
                        }
                        width += 152;
                        _addWidget2Column("all", _cw);
                    }
                    if (this.divWidth < width) {
                        document.getElementById('div').setAttribute("style", "width: 100%;height:136px;height: auto;overflow-y:visible;width :" + width + "px");
                    }
                });
            },
            add() {
                this.index++;
                this.width = this.width + 382;
                let divWidth = document.getElementById('divWidth');
                divWidth.setAttribute("style", "width :" + this.width + "px");
                let html = $("<div style=\"float: left;min-height:385.64px;height: auto;width: 382px;border: 1px dashed rgb(206, 194, 194);\">\n" +
                    "                            <Icon id='icon" + this.index + "' class='ivu-icon ivu-icon-close-round' type=\"close-round\" style=\"float: right;border: 1px solid  rgb(206, 194, 194);opacity: 0.5;\" ></Icon>\n" +
                    "                            <ul id=\"column" + this.index + "\" class=\"iview-admin-draggable-list\"\n" +
                    "                                style=\"min-height:340px;height: auto;width: 380px;overflow-x:visible\">\n" +
                    "                            </ul>\n" +
                    "                        </div>");
                $('#buttonDiv').before(html);
                $("#icon" + this.index).bind("click", function (e) {
                    let id = this.id.replace("icon", "column");
                    if (document.getElementById("divWidth").getElementsByTagName("ul").length <= 1) {
                        return
                    }
                    let child = document.getElementById(id);
                    if (child.getElementsByTagName("li").length > 0) {
                        return
                    }
                    child.parentNode.remove();
                })
                let todoList = document.getElementById('column' + this.index);
                Sortable.create(todoList, {
                    group: {
                        name: 'list',
                        pull: true
                    },
                    animation: 120,
                    ghostClass: 'placeholder-style',
                    fallbackClass: 'iview-admin-cloned-item',
                    onRemove(event) {
                        let width = $("#all li").length * 152;
                        if (width > 1267) {
                            document.getElementById('div').setAttribute("style", "width: 100%;height:136px;height: auto;overflow-y:visible;width :" + width + "px");
                        }else{
                            document.getElementById('div').setAttribute("style", "width: 100%;height:136px;height: auto;overflow-y:visible;width :1267px");
                        }
                    }
                });
            },
            remove(id) {
                // this.Cols--;

                if (document.getElementById("divWidth").getElementsByTagName("ul").length <= 1) {
                    this.$Message.error("至少保持一列");
                    return
                }

                let child = document.getElementById(id);
                if (child.getElementsByTagName("li").length > 0) {
                    this.$Message.error("请先移除组件在删除列");
                    return
                }
                this.width = this.width - 382;
                let divWidth = document.getElementById('divWidth');
                divWidth.setAttribute("style", "width :" + this.width + "px");
                child.parentNode.remove();

            },
            /*保存*/
            btnSave(name) {

                let columns = [];
                let config = {"columns": columns};
                let content = document.getElementById("divWidth");
                let ul = content.getElementsByTagName("ul");
                for (let i = 0; i < ul.length; i++) {
                    let column = {"width": 382, "id": ul[i].id, "widgets": []};
                    columns.push(column)
                    let lis = ul[i].childNodes;
                    for (let j = 0; j < lis.length; j++) {
                        let id = lis[j].id;
                        let code = lis[j].id.replace("widget_", "");
                        let title = $(lis[j].getElementsByTagName("div")[0].getElementsByTagName("div")[0].getElementsByTagName("div")[0]).html();
                        let widget = {"id": id, "code": code, "title": title, "height": 300};
                        columns[i].widgets.push(widget);
                    }
                }
                this.$net.send({
                    server: this.$services.sysService.dashLayoutConfigRestController.save,
                    data: {
                        "layoutCode": this.$route.query.code,
                        "config": JSON.stringify(config),
                        "version": 1
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
                this.$store.commit('removeTag', 'dashLayoutDesign');
                this.$store.commit('closePage', 'dashLayoutDesign');
            },
            disPlay() {
                if (this.flag) {
                    $("#button").html("<i class=\"ivu-icon ivu-icon-ios-arrow-down\" style=\"font-size: 24px;\"></i>");
                } else {
                    $("#button").html("<i class=\"ivu-icon ivu-icon-ios-arrow-up\" style=\"font-size: 24px;\"></i>");
                }
                this.flag = !this.flag;
            }
        }
    };
</script>
<style>
    div.menu ul {
        list-style: none; /* 去掉ul前面的符号 */
        margin: 0px; /* 与外界元素的距离为0 */
        padding: 0px; /* 与内部元素的距离为0 */
        width: auto; /* 宽度根据元素内容调整 */
    }

    /* 所有class为menu的div中的ul中的li样式 */
    div.menu ul li {
        float: left; /* 向左漂移，将竖排变为横排 */
        width: 150px;
        height: 125px;
    }

    div.menu table tr:nth-child(n+6) {
        display: none;
    }

    div.menu table tr td:nth-child(n+4) {
        display: none;
    }

    div.menu table tr th:nth-child(n+4) {
        display: none;
    }

    div.menu a {
        display: none;
    }

    div.menu div.chart {
        display: none;
    }

    div.menu div.panel-heading {
        display: none;
    }

    /* 所有class为menu的div中的ul中的li样式 */
    div#divWidth li + div {
        /*width: 369px;*/
        /*height: 336px;*/
    }

    div#divWidth div.img {
        display: none;
    }

    div#divWidth div.chart {
        display: block;
    }

    .widget-table {
        border: 1px #b9d5f6 solid;
        border-collapse: collapse;
        border-spacing: 0;
    }

    .widget-table th {
        height: 22px;
        color: #032C7B;
        font-size: 12px;
        font-weight: normal;
        border: 1px #b9d5f6 solid;
        padding: 0;
        white-space: nowrap;
        text-align: center;
    }

    .widget-table tr {
        height: 22px;
        background: #fff;
        border: 1px #b9d5f6 solid;
        padding: 2px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .widget-table tr td {
        height: 22px;
        background: #fff;
        border: 1px #b9d5f6 solid;
        padding: 2px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        padding-left: 5px;
    }

    .widget-table A:link {
        color: #2A5994;
        text-decoration: none;
    }

    .widget-table A:visited {
        color: #07519A;
        text-decoration: none;
    }

    .widget-table A:hover {
        color: #FF6600;
        text-decoration: none;
    }

    .widget-content .more {
        border: solid 1px #b9d5f6;
        border-top: none;
        height: 22px;
        /*background: url('../img/dwbg_more.gif') repeat-x;*/
    }

    .widget-content .more A {
        float: right;
        margin: 3px 5px 0 0;
    }

    nav-tabs {
        border-bottom: 1px solid #ddd;
    }

    .nav-tabs > li {
        float: left;
        margin-bottom: -1px;
    }

    .nav-tabs > li > a {
        margin-right: 2px;
        line-height: 1.42857143;
        border: 1px solid transparent;
        border-radius: 4px 4px 0 0;
    }

    .nav-tabs > li > a:hover {
        border-color: #eee #eee #ddd;
    }

    .nav-tabs > li.active > a,
    .nav-tabs > li.active > a:hover,
    .nav-tabs > li.active > a:focus {
        color: #555;
        cursor: default;
        background-color: #fff;
        border: 1px solid #ddd;
        border-bottom-color: transparent;
    }

    .demo_line_05 {
        letter-spacing: 0px;
        color: #ddd;
        width: 100%;
        /*margin-top: -12px;*/
    }

    .demo_line_05 span {
        letter-spacing: 0;
        color: #222;
        margin: 0 20px;
    }

    ::-webkit-scrollbar-track-piece {
        background-color: #f5f5f5;
        border-left: 1px solid #d2d2d2;
    }

    ::-webkit-scrollbar {
        width: 13px;
        height: 10px;
    }

    ::-webkit-scrollbar-thumb {
        background-color: #f9f9f9;
        background-clip: padding-box;
        border: 1px solid #979797;
        min-height: 28px;
    }

    ::-webkit-scrollbar-thumb:hover {
        border: 1px solid #636363;
        background-color: #929292;
    }

</style>
