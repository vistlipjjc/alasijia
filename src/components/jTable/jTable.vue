<style lang="less" scoped>
    @import './jTable.less';
</style>

<style>
    .j-table-header .ivu-form-inline .ivu-form-item {
        width: 32%;
        margin-bottom: 10px;
    }
    .j-table-header .ivu-form-label-left .ivu-form-item-label {
        text-align: right;
    }
</style>

<template>
    <div class="j-table">
        <slot name="RadioGroup"></slot>
        <Row>
            <div class="j-table-header" v-if="!hiddenForm">
                <!-- 自定义查询表单 -->
                <Form ref="j-table-form" :model="queryForm" :rules="rules" :inline="true"
                    :show-message="true" :label-position="labelPosition" :label-width="labelWidth" class="j-table-form">
                    <!-- 输入区域-START -->
                    <slot name="input"></slot>
                    <!-- 输入区域-END -->

                    <!-- 按钮区域-START -->
                    <!-- <slot name="button"></slot> -->
                    <!-- 按钮区域-END -->
                </Form>
            </div>
            <div class="j-table-toolbar j-table-search" v-if="isShowQuery">
                <div class="toolbar-right" v-if="isShowReset">
                    <Button @click="btnReset" type="ghost" icon="reply">重置</Button>
                </div>

                <div class="toolbar-right">
                    <Button @click="btnQuery" type="primary" icon="search">查询</Button>
                </div>
            </div>
            <div class="j-table-toolbar">
                <!-- 工具条区域-START -->
                <!-- <div class="toolbar-right" v-if="isShowColumn">
                    <Dropdown trigger="click" placement="left-start">
                        <Button type="ghost"><Icon type="grid"></Icon></Button>
                        <DropdownMenu slot="list" v-for="(item, index) in columnsList" :key="index">
                            <DropdownItem v-if="item.title"><Checkbox></Checkbox>{{item.title}}</DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </div> -->

                <!-- <div class="toolbar-right" v-if="isShowRefresh">
                    <Button type="ghost" @click="refresh"><Icon type="refresh"></Icon></Button>
                </div> -->

                <!-- <div class="toolbar-right" v-if="isShowExport">
                    <Dropdown trigger="click" @on-click="exportBtn">
                        <Button type="ghost">导出<Icon type="arrow-down-b"></Icon></Button>
                        <DropdownMenu slot="list">
                            <DropdownItem name="csv">CSV</DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </div> -->

                <div class="toolbar-right" v-if="isShowExport">
                    <Button @click="exportBtn($event)" type="primary" icon="ios-cloud-download-outline">导出</Button>
                </div>

                <div class="toolbar-right" v-if="isShowImport">
                    <Button @click="importBtn($event)" type="primary" icon="ios-cloud-upload-outline">导入</Button>
                </div>

                <div class="toolbar-right" v-if="isShowAdd">
                    <Button @click="addBtn($event)" type="primary" icon="plus-round">新增</Button>
                </div>

                <div class="toolbar-right">
                    <!-- 功能按钮区域-START -->
                    <slot name="toolbar"></slot>
                    <!-- 功能按钮区域-END -->
                </div>
                <!-- 工具条区域-END -->
            </div>

            <div class="j-table-data">
                <!-- 数据区-START -->
                <Table
                    ref="table"
                    :loading="loading"
                    :height="height" :width="width" size="small"
                    :columns="columnsList" :data="tableData"
                    @on-current-change="emitCurrentChange"
                    @on-select="emitSelect"
                    @on-select-cancel="emitSelectCancel"
                    @on-select-all="emitSelectAll"
                    @on-selection-change="emitSelectChange"
                    @on-sort-change="emitSortChange"
                    @on-row-click="emitRowClick"
                    @on-row-dblclick="emitRowDbclick"
                    @on-expand="emitExpand"
                    border highlight-row>
                </Table>
                <!-- 数据区-END -->
            </div>

            <div class="j-table-footer" v-if="isShowPagination" v-show="showPagination">
                <div class="j-table-footer-toolbar">
                    <div class="toolbar-left" v-if="isShowSelectAll">
                        <div @click="handleSelectAll()"><Checkbox v-model="checkedSingle" style="width: 70px; height: 31px; text-align: center; border: 1px #cccccc solid;padding-top: 7px;border-radius:4px;">全选</Checkbox></div>
                    </div>
                    <div class="toolbar-left" v-if="isShowToggleSelect">
                        <div @click="handleToggleSelect()"><Checkbox v-model="toggleSingle" style="width: 70px; height: 31px; text-align: center; border: 1px #cccccc solid;padding-top: 7px;border-radius:4px;">反选</Checkbox></div>
                    </div>
                    <div class="toolbar-left" v-if="isShowBatchAudit">
                        <Button @click="batchAuditBtn($event)" type="ghost">批量审核</Button>
                    </div>
                </div>

                <!-- 分页区-START -->
                <div class="j-table-pagination">
                    <Page :size="pageSizeType" :total="total" :current="currentPage" :page-size="pageSize" placement="top" @on-page-size-change="pageSizeChange" @on-change="changePage" show-sizer show-total></Page>
                </div>
                <!-- 分页区-END -->
            </div>
        </Row>
    </div>
</template>

<script>
import { viewButton, deleteButton, editButton, otherskipButton, otherhandleButton, retractButton, setTopButton, setHomeButton, enrollButton } from './jTable.js';
import net from '@/util/net';
import {services} from '@/config/services/index';

const PARAMS_CACHE_KEY = '__qc'
export default {
    name: 'jTable',
    props: {
        columnsList: Array, //表格列名
        value: Array, //表格数据
        queryForm: Object, // 请求参数
        rules: Object, // 查询表单数据校验规则
        autoSearch: Boolean, // 是否开启自动查询
        autoCache: Boolean, // 是否开启参数缓存，开启后需要将:queryForm改成:queryForm.sync
        server: Object, // 请求服务接口
        defaultParams: Object, // 默认搜索参数
        height: [Number,String], //表格固定高度
        width: [Number,String], //表格固定宽度
        labelWidth: {type: Number, default: 100}, // 搜索框文字的宽度
        labelPosition: {type: String, default: 'right'}, //搜索框文字的显示位置，可选值：left、right
        inputCol: {type: Number, default: 10}, //搜索按钮所占的列宽
        jtotal: { //显示分页
            type: Number,
            default: 0
        },
        hiddenForm: { // 是否隐藏表单
            type: Boolean,
            default: false
        },
        append: { //追加数据项
            type: [String, Array]
        },
        showColumn: { //显示列表头按钮
            type: Boolean,
            default: false
        },
        showRefresh: { //显示刷新按钮
            type: Boolean,
            default: false
        },
        showAdd: { // 显示添加按钮
            type: Boolean,
            default: false
        },
        showExport: { //显示导出按钮
            type: Boolean,
            default: false
        },
        showImport: { // 显示导入按钮
            type: Boolean,
            default: false,
        },
        showSelectAll: { // 显示全选按钮
            type: Boolean,
            default: false,
        },
        showToggleSelect: { // 显示反选按钮
            type: Boolean,
            default: false,
        },
        showBatchAudit: { // 显示反选按钮
            type: Boolean,
            default: false,
        },
        pagination: { //显示分页
            type: Boolean,
            default: false
        },
        showReset: { //显示重置按钮
            type: Boolean,
            default: true
        },
        showQuery: { //显示搜索按钮
            type: Boolean,
            default: true
        },
        pageSizeType: String, //分页控件大小，可选择为空、small
        defaultSelectRow: { //默认选中第一条
            type: Boolean,
            default: true
        }
    },
    data () {
        return {
            loading: true,
            isShowColumn: this.showColumn,
            isShowRefresh: this.showRefresh,
            isShowAdd: this.showAdd,
            isShowExport: this.showExport,
            isShowImport: this.showImport,
            isShowSelectAll: this.showSelectAll,
            isShowToggleSelect: this.showToggleSelect,
            isShowBatchAudit: this.showBatchAudit,
            isShowPagination: this.pagination,
            isShowReset: this.showReset, // 是否显示重置
            isShowQuery: this.showQuery, // 是否显示搜索
            total: this.jtotal,
            currentPage: 1, //当前页码
            pageSize: 10, //每页条数
            pageSizeChangeFlag: 0, //标记首次非手动更改分页条数
            columns: [],
            tableData: [],
            selectedRow: [], //选中行的数据
            checkedSingle: false, // 全选按钮的check
            toggleSingle: false // 反选按钮的check
        };
    },
    created () {
        this.cacheDict();
    },
    beforeMount (){
        this.init();
        this.restoreParams();
        this.restorePage();
    },
    updated () {
        this.isShowAdd = this.showAdd
    },
    computed: {
        showPagination() {
            return this.total > 0
        },
    },
    methods: {
        cacheDict(){
            if(this.columnsList) {
                this.columnsList.forEach(item => {
                    if(item.formatter) //处理列的 formatter
                    {
                        let $formatter = item.formatter;
                        if(typeof $formatter === 'string')
                        {
                            if(/^fixedDict\:(\w+)/g.test($formatter)) //fixedDict
                            {
                                /^fixedDict\:(\w+)@(\w+)/g.test($formatter);
                                var $class = RegExp.$1;
                                var $service = RegExp.$2;
                                this.$set(item, 'class', $class);
                                this.$store.dispatch('cache/cacheDict', {type: 'fixedDict', url: $class, service: $service});
                            }
                            else if(/^dict\:(\w+)/g.test($formatter)) //dict
                            {
                                /^dict\:(\w+)@(\w+)/g.test($formatter);
                                var $class = RegExp.$1;
                                var $service = RegExp.$2;
                                this.$set(item, 'class', $class);
                                this.$store.dispatch('cache/cacheDict', {type: 'dict', url: $class, service: $service});
                            }
                            else if(/^custom\:(.+)/g.test($formatter)) //自定义
                            {
                                /^custom\:([\w\/]*)@(\w+)/g.test($formatter);
                                var $class = RegExp.$1;
                                var $service = RegExp.$2;
                                this.$set(item, 'class', $class);
                                this.$store.dispatch('cache/cacheDict', {type: 'custom', url: $class, service: $service});
                            }
                        }
                    }
                })
            }
        },
        init () {
            // 设置操作列
            if(this.columnsList){
                this.columnsList.forEach(item => {
                    if (item.handler) //处理[操作]列
                    {
                        item.render = (h, param) => {
                            let currentRowData = this.tableData[param.index];
                            let children = [];
                            item.handler.forEach(item => {
                                if (item.action === 'edit')
                                {
                                    if(item.visible && typeof item.visible === 'string')
                                    {
                                        /^(\w+)\=\[(.*?)\]/g.test(item.visible);
                                        var $code = RegExp.$1;
                                        var $arrayVal = RegExp.$2;
                                        if($arrayVal && $arrayVal.indexOf(currentRowData[$code]) != -1){
                                            children.push(editButton(this, h, currentRowData, param.index, item.path));
                                        }
                                    }else{
                                        children.push(editButton(this, h, currentRowData, param.index, item.path));
                                    }
                                } else if (item.action === 'delete') {
                                    if(item.visible && typeof item.visible === 'string')
                                    {
                                        /^(\w+)\=\[(.*?)\]/g.test(item.visible);
                                        var $code = RegExp.$1;
                                        var $arrayVal = RegExp.$2;
                                        if($arrayVal && $arrayVal.indexOf(currentRowData[$code]) != -1){
                                            children.push(deleteButton(this, h, currentRowData, param.index));
                                        }
                                    }else{
                                        children.push(deleteButton(this, h, currentRowData, param.index));
                                    }
                                } else if (item.action === 'view') {
                                    children.push(viewButton(this, h, currentRowData, param.index, item.path));
                                } else if (item.action === 'otherskip') {
                                    children.push(otherskipButton(this, h, currentRowData, param.index, item.path,item.icon,item.content,item.envent));
                                } else if (item.action === 'otherhandle') {
                                  children.push(otherhandleButton(this, h, currentRowData, param.index,item.envent,item.icon,item.content,item.prompt));
                                } else if (item.action === 'retract') {
                                    children.push(retractButton(this, h, currentRowData, param.index));
                                } else if (item.action === 'setTop') {
                                    children.push(setTopButton(this, h, currentRowData, param.index));
                                } else if (item.action === 'setHome') {
                                    children.push(setHomeButton(this, h, currentRowData, param.index));
                                } else if (item.action === 'enroll') {
                                  children.push(enrollButton(this, h, currentRowData, param.index));
                                }
                            });
                            return h('div', children);
                        };
                    }
                    if(item.formatter) //处理列的 formatter
                    {
                        let $formatter = item.formatter;
                        if(typeof $formatter === 'string')
                        {
                            item.render = (h, param) => {
                                let _value = this.$store.getters['cache/getCacheDictName'](item.class, param.row[item.key]);
                                return h('div', _value);
                            }
                        }
                    }
                });
            }
        },
        // 还原参数缓存
        restoreParams() {
            if (this.autoCache === false) {
                return
            }

            const route = {...this.$router.currentRoute}
            if (route.query && route.query[PARAMS_CACHE_KEY]) {
                try {
                    const cipherText = route.query[PARAMS_CACHE_KEY]
                    const plainText = window.atob ? window.atob(cipherText) : cipherText
                    const queryForm = JSON.parse(window.decodeURIComponent(plainText))
                    this.$emit('update:queryForm', queryForm)
                } catch (error) {
                    route.query[PARAMS_CACHE_KEY] = null  // 解析记录查询参数出错，删除缓存字段
                    this.$router.replace(route.query)
                }
            }
        },
        // 记录参数缓存
        storeParams(params) {
            if (this.autoCache === false) {
                return
            }

            // 筛选非空的参数
            const queryList = Object.entries(params).filter(item => item[1] !== '')
            const route = {...this.$router.currentRoute}

            if (queryList.length > 0) { // 记录查询参数
                const queryForm = queryList.reduce((obj, [key, value]) => (obj[key] = value, obj), {})
                const plainText = window.encodeURIComponent(JSON.stringify(queryForm))
                const cipherText = window.btoa ? window.btoa(plainText) : plainText
                route.query = {...route.query, [PARAMS_CACHE_KEY]: cipherText}  // 添加过滤参数
                this.$router.replace(route)
            } else if (route.query[PARAMS_CACHE_KEY]) { // 没有查询参数（重置），删除参数缓存
                route.query[PARAMS_CACHE_KEY] = null
                this.$router.replace(route.query)
            }
        },
        // 还原页码
        restorePage() {
           if (this.isShowPagination === false) {
                return
            }

            const route = this.$router.currentRoute

            if (route.query) {
                // 还原当前页码
                const page = parseInt(route.query.page)
                if (page > 0) {
                    this.currentPage = page
                }
                // 还原当前页面条目
                const size = parseInt(route.query.size)
                if (size > 0) {
                    this.pageSize = size
                }
            }
        },
        /**
         * 记录页码
         * @param page 当前页面
         * @param size 每页数量
         */
        storePage(page, size) {
            if (this.isShowPagination === false) {
                return
            }

            const route = {...this.$router.currentRoute}
            route.query = {...route.query, page, size}  // 添加页码
            this.$router.replace(route)
        },
        // table event API
        emitCurrentChange(newData, oldData){
            //在单选模式下有效，改变选中行时触发
            // newData: 当前高亮行的数据
            // oldData: 上一次高亮行的数据
            this.selectedRow[0] = newData;
            this.$emit('on-current-change', newData, oldData);
        },
        emitSelect(selection, row){
            //在多选模式下有效，，选中某行时触发
            // selection: 已选项数据
            // row: 刚选择的项数据
            this.selectedRow = selection;
            this.$emit('on-select', selection, row);
        },
        emitSelectCancel(selection, row){
            // 在多选模式下有效，取消选中某一项时触发
            // selection: 已选项数据
            // row: 取消选择的项数据
            this.selectedRow = selection;
            this.$emit('on-select-cancel', selection, row);
        },
        emitSelectAll(selection){
            // 在多选模式下有效，点击全选时触发
            // selection: 已选项数据
            this.selectedRow = selection;
            this.$emit('on-select-all', selection);
        },
        emitSelectChange(selection){
            // 在多选模式下有效，只要选中项发生变化时就会触发
            // selection: 已选项数据
            this.selectedRow = selection;
            this.$emit('on-selection-change', selection);
        },
        emitSortChange(column, key, order){
            // 排序时有效，当点击排序时触发
            // column：当前列数据
            // key：排序依据的指标
            // order：排序的顺序，值为 asc 或 desc
            this.$emit('on-sort-change', column, key, order);
        },
        emitRowClick(row, index){
            // 单击某一行时触发
            // row: 当前行的数据
            // index
            this.$emit('on-row-click', row, index);
        },
        emitRowDbclick(row, index){
            // 双击某一行时触发
            // row: 当前行的数据
            // index
            this.$emit('on-row-dblclick', row, index);
        },
        emitExpand(row, status){
            // 展开或收起某一行时触发
            // row: 当前行的数据
            // status：当前的状态
            this.$emit('on-expand', row, status);
        },

        /* 处理数据请求 */
        handleQuery(){
            this.loading = true;
            // 获取传递参数
            let params = Object.assign({}, this.defaultParams || {}, this.queryForm || {});
            // 获取分页设置
            let pageConfig = this.isShowPagination ? {

                pageSize: this.pageSize,
                pageNumber: this.currentPage
            } : {};

            
            this.storeParams(params); // 记录查询参数
            this.storePage(this.currentPage, this.pageSize); // 记录分页参数

            // this.$refs['j-table-form'].validate((valid) => {
            //     // 数据校验
            //     if (!valid) return;

                //更新查询数据
                net.send({
                    server: this.server,
                    data: {
                        ...params,
                        ...pageConfig
                    },
                    append: this.append
                }).then((data) => {
                    this.loading = false;

                    data.rows.forEach(item => {
                        item._checked = false;
                        item._disabled = false;
                        item._highlight = false;
                    });
                    // 更新数据信息
                    this.tableData = data.rows || [];

                    // 更新分页信息
                    this.total = data.total;

                    // 设置默认选择项
                    if(this.tableData.length > 0)
                    {
                        if(this.defaultSelectRow) {
                            this.tableData[0]._highlight = true;//默认高亮第一行
                            this.emitCurrentChange(this.tableData[0], null); //触发高亮行改变事件
                            this.emitRowClick(this.tableData[0], 0); //触发单击行事件
                        }
                    }
                    else
                    {
                        this.emitCurrentChange({}, null); //触发高亮行改变事件
                        this.emitRowClick({}, null); //触发单击行事件
                    }

                    // 请求成功事件
                    this.$emit('requestSuccess', this.tableData);
                }, err => {
                    this.loading = false;
                    this.$Message.error(err.reason);
                });

            // }, () => {
            //     console.log('error')
            // })
        },

        /* 搜索 */
        btnQuery () {
            this.currentPage = 1;
            this.handleQuery();
        },
        /* 重置 */
        btnReset () {
            this.$emit('btnReset');
            this.queryForm = {}
            this.currentPage = 1;
            this.$refs['j-table-form'].resetFields();
            this.handleQuery();
        },
        // 改变每页条数
        pageSizeChange(val) {
            this.pageSize = val
            //解决重复请求服务的问题
            // if(++this.pageSizeChangeFlag != 1)
            {
                this.handleQuery()
            }
            this.$emit('on-page-size-change', val, this.tableData);
        },
        // 翻页
        changePage (val) {
            this.currentPage = val;
            this.handleQuery();
            this.$emit('on-page-change', val, this.tableData);
        },
        /* jTable 提供可调用的方法 */
        // 刷新
        refresh(){
            this.currentPage = 1
            this.handleQuery()
        },
        // 添加
        addBtn (e) {
            this.$emit('add-btn', window.event || e)
        },
        // 导出
        exportBtn (e) {
            this.$emit('export-btn', window.event || e)
        },
        // 导入
        importBtn (e) {
            this.$emit('import-btn', window.event || e)
        },
        batchAuditBtn (e) {
            this.$emit('batchAudit-btn', window.event || e)
        },
        // 开启 highlight-row 后的单选模式下有效，返回选中行数据
        getSelectedRow(){
            return this.selectedRow[0];
        },
        //多选时，返回选中行数据。
        getSelections(){
            return this.selectedRow;
        },
        // 获取列表当前页面所有数据
        getTableData(){
            return this.tableData;
        },
        /**
         * 是否全选按钮时触发，勾选table所有数据
         * checkedSingle 为是否全选
         */
        handleSelectAll (){
          // this.$refs.table.selectAll(!this.checkedSingle);
          this.toggleSingle = false
          let TableData = this.getTableData()
          TableData.forEach(item =>{
            item._checked = !this.checkedSingle
          })
        },
        /**
         * 反选按钮时触发，勾选table所有数据
         * _checked取反
         */
        handleToggleSelect(){
          this.checkedSingle = false
          let TableData = this.getTableData()
          TableData.forEach(item =>{
            item._checked = !item._checked
          })
        },
        /**
         * 多选模式下，勾选框触发状态
         * @param index
         */
        toggleSelect(index){
          this.$refs.table.toggleSelect(index);
        }
    },
    watch: {
        value (data) {
            // 根据外部数据更新
            this.loading = true;
            this.tableData = data || [];
            this.loading = false;
        },
        defaultParams() {
            this.handleQuery()
        },
        jtotal(val){
            this.total = val;
        }
    },
    mounted() {
        if(this.autoSearch){
            if (this.autoCache) { // 还原参数缓存，数据更新事件需要等待父组件处理
                this.$nextTick(() => this.handleQuery());
            } else {
                this.handleQuery()
            }
        }
    }
};
</script>
