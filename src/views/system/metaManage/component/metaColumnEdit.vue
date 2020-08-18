<template>
    <div>
        <Table :ref="refs" :columns="columnsList" :data="tableData" border disabled-hover size="small"
               @on-selection-change="emitSelectChange" style="margin-top: 5px; border-radius: 4px;"></Table>
        <Modal
                v-model="foreignModel" title="选择外键"  :mask-closable="false"  width="85" height = "650"
                ok-text="确定" cancel-text="关闭"
                @on-ok="foreignTableSelect"
                @on-cancel="cancel">
            <Card>
                <Row>
                    <Col span="6">
                        <Card>
                            <j-tree ref="dataTree" :data="dataTree" style="height: 500px"
                                    :queryServer="queryServer"
                                    @on-select-node="loadTable">
                            </j-tree>
                        </Card>
                    </Col>
                    <Col span="9">
                        <Card>
                            <j-table ref="metaTable" hiddenForm :showColumn="false" :showRefresh="false" pagination
                                     :queryForm="queryTableForm" :jtotal="total"
                                     :server="server.metaTableQuery"
                                     :columns-list="columns" v-model="metaTableData"
                                     @on-row-click="rowClick"
                                     >
                            </j-table>
                        </Card>
                    </Col>
                    <Col span="9">
                        <Card>
                           <j-table ref="metaColumn" hiddenForm :showColumn="false" :showRefresh="false" pagination
                                    :queryForm="queryColumnForm" :jtotal="colTotal"
                                    :server="server.metaColumnQuery"
                                    :columns-list="colColumns" v-model="columnData"
                                    @on-row-click="columnClick">

                            </j-table>
                        </Card>
                    </Col>
                </Row>
            </Card>
        </Modal>
    </div>
</template>

<script>
    const deleteButton = (vm, h, currentRow, index) => {
        return h('Poptip', {
            props: {
                confirm: true,
                title: '您确定要删除这条数据吗?',
                transfer: true
            },
            on: {
                'on-ok': () => {
                    vm.tableData.splice(index, 1);
                    vm.$emit('on-change', vm.handleBackdata(vm.tableData), vm.tableData, index);
                }
            }
        }, [
            h('Button', {
                style: {
                    margin: '0 1px'
                },
                props: {
                    type: 'ghost',
                    placement: 'top',
                    icon: 'trash-a',
                    shape: 'circle',
                    size: 'small'
                }
            })
        ]);
    };
    const incellEditBtn = (vm, h, param) => {
        return h('Button', {
            props: {
                type: 'text',
                icon: 'edit'
            },
            on: {
                click: (event) => {
                    vm.edittingStore[param.index].edittingCell[param.column.key] = true;
                    vm.tableData = JSON.parse(JSON.stringify(vm.edittingStore));
                    vm.$emit('on-change', vm.handleBackdata(vm.tableData), vm.tableData, param.index);
                }
            }
        });
    };
    const saveIncellEditBtn = (vm, h, param) => {
        return h('Button', {
            props: {
                type: 'text',
                icon: 'checkmark'
            },
            on: {
                click: (event) => {
                    saveEditData(vm, param);
                }
            }
        });
    };
    const saveEditData = (vm, param) =>{
        if(param.column.key == 'prop')
        {
            let tempData = JSON.parse(JSON.stringify(vm.edittingStore));
            let isDuplication = false;
            let i = -1;
            let code = tempData[param.index][param.column.key];
            tempData.splice(param.index, 1);
            tempData.forEach((item, index) => {
                if(code == item[param.column.key]){
                    isDuplication = true;
                    i = index;
                    return;
                }
            });

            if(isDuplication){
                if(i > param.index){
                    i++;
                }
                vm.edittingStore[param.index].edittingCell[param.column.key] = false;
                vm.tableData = JSON.parse(JSON.stringify(vm.edittingStore));
                vm.tableData[i][param.column.key] = 'N';
                vm.$emit('on-change', vm.handleBackdata(vm.tableData), vm.tableData, param.index);
            }else{
                vm.edittingStore[param.index].edittingCell[param.column.key] = false;
                vm.tableData = JSON.parse(JSON.stringify(vm.edittingStore));
                vm.$emit('on-change', vm.handleBackdata(vm.tableData), vm.tableData, param.index);
            }
        }else {
            vm.edittingStore[param.index].edittingCell[param.column.key] = false;
            vm.tableData = JSON.parse(JSON.stringify(vm.edittingStore));
            vm.$emit('on-change', vm.handleBackdata(vm.tableData), vm.tableData, param.index);
        }
    };
    const cellSelect = (vm, h, param, item) => {
        return h('Select', {
            props: {
                transfer: true,
                value: vm.edittingStore[param.index][item.key]
            },
            on: {
                'on-change' (value) {
                    let key = item.key;
                    if(value == 'Y'){
                        vm.foreignModel = true;
                        vm.currentRow = vm.edittingStore[param.index];
                        vm.currentParam = param;
                    }
                    else{
                        vm.edittingStore[param.index][key] = value;
                        vm.edittingStore[param.index]['masterTableId'] = '';
                        vm.edittingStore[param.index]['masterTableCode'] = '';
                        vm.edittingStore[param.index]['masterColumnCode'] = '';
                        vm.edittingStore[param.index]['masterTableDisplayName'] = '';
                        saveEditData(vm, param);
                    }
                }
            }
        },vm.foreignKeys.map((item) => {
            return  h('Option', {props: {value: item.value}}, item.name);
        }));
    };

    const cellPropSelect = (vm, h, param, item) => {
        return h('Select', {
            props: {
                transfer: true,
                value: vm.edittingStore[param.index][item.key]
            },
            on: {
                'on-change' (value) {
                    let key = item.key;
                    vm.edittingStore[param.index][key] = value;
                    saveEditData(vm, param);
                }
            }
        },vm.columnProps.map((item) => {
            return  h('Option', {props: {value: item.value}}, item.name);
        }));
    };

    const cellInput = (vm, h, param, item) => {
        return h('Input', {
            props: {
                type: 'text',
                value: vm.edittingStore[param.index][item.key]
            },
            on: {
                'on-change' (event) {
                    let key = item.key;
                    vm.edittingStore[param.index][key] = event.target.value;
                }
            }
        });
    };
    const cellType = (vm, h, param, item) => {
        if(item.key == 'isForeignKey'){
            return cellSelect(vm, h, param, item);
        }
        else if(item.key == 'prop'){
            return cellPropSelect(vm, h, param, item);
        }
        else
        {
            return cellInput(vm, h, param, item);
        }
    };

    const overflowHidden = (h, params, code) =>{
        return h('div', [
            h('span', {
                style: {
                    display: 'inline-block',
                    width: '100%',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                },
                domProps: {
                    title: params.row[code]
                }
            }, params.row[code])
        ]);
    }

    export default {
        name: 'MetaColumnEdit',
        props: {
            refs: String,
            columnsList: Array,
            value: Array,
            tableId: String
        },
        data () {
            return {
                columns: [],
                tableData: this.value,
                edittingStore: [],
                foreignKeys: [],
                columnProps: [],
                foreignModel: false,
                queryServer: this.$services.sysService.metaRegionRestController.treeNode,
                server: {
                    metaTableQuery: this.$services.sysService.metaTableRestController.queryMetatableExclude,
                    metaColumnQuery: this.$services.sysService.metaColumnRestController.query
                },
                dataTree: [],
                queryTableForm: {},
                total: 0,
                metaTableData: [],
                columns: [
                    { title: '表模式', align: 'center', key: 'schema', width: 80 },
                    { title: '表名', align: 'center', key: 'tableCode' ,  render: (h, params) => {
                            return  overflowHidden(h, params, 'tableCode');
                        }},
                    { title: '表中文名', align: 'center', key: 'tableName', render: (h, params) => {
                            return  overflowHidden(h, params, 'tableName');
                        }}
                ],
                colColumns: [
                    { type: 'index', align: 'center', width: 40 },
                    { title: '列名', align: 'center', key: 'columnCode' , render: (h, params) => {
                            return  overflowHidden(h, params, 'columnCode');
                        }},
                    { title: '列中文名', align: 'center', key: 'columnName', render: (h, params) => {
                            return  overflowHidden(h, params, 'columnName');
                        }}
                ],
                columnData: [],
                queryColumnForm: {},
                colTotal: 0,
                foreiginRow: '',
                foreiginTable: '',
                currentRow: '',
                currentParam: ''

            };
        },
        created () {
            this.init();
        },
        methods: {
            init () {
                let vm = this;
                /* 筛选需要编辑的列 */
                let editableCell = this.columnsList.filter(item => {
                    if (item.editable) {
                        if (item.editable === true) {
                            return item;
                        }
                    }
                });

                this.$store.dispatch('cache/cacheDict', {type: 'fixedDict', url: 'YesNo', service: 'sys'})
                    .then(data => {
                        this.foreignKeys = data;
                    });

                this.$store.dispatch('cache/cacheDict', {type: 'fixedDict', url: 'ColumnAttribute', service: 'sys'})
                    .then(data => {
                        this.columnProps = data;
                    })
                /* 克隆表数据，并设置编辑属性值（edittingCell） */
                let cloneData = JSON.parse(JSON.stringify(this.value));
                let res = [];
                res = cloneData.map((item, index) => {
                    if (this.value[index]) {
                        if (!this.value[index].editting) {
                            this.$set(item, 'editting', true);
                            let edittingCell = {};
                            editableCell.forEach(item => {
                                edittingCell[item.key] = false;
                            });
                            this.$set(item, 'edittingCell', edittingCell);
                            return item;
                        }else{
                            return this.value[index];
                        }
                    }
                });

                this.tableData = res;
                this.edittingStore = JSON.parse(JSON.stringify(this.tableData));

                /* 设置列控件，列操作 */
                this.columnsList.forEach(item => {
                    if (item.editable) {
                        item.render = (h, param) => {
                            let currentRow = this.tableData[param.index];
                            if (currentRow.editting) {
                                return h('Row', {
                                    props: {
                                        type: 'flex',
                                        align: 'middle',
                                        justify: 'center'
                                    }
                                }, [
                                    h('Col', {
                                        props: {
                                            span: '22'
                                        }
                                    }, [

                                        item.key == 'isForeignKey' ?
                                            (!currentRow.edittingCell[param.column.key] ? h('span', this.$store.getters['cache/getCacheDictName']('YesNo', param.row[item.key])) : cellType(this, h, param, item)) :
                                            (item.key == 'prop' ? (!currentRow.edittingCell[param.column.key] ? h('span', this.$store.getters['cache/getCacheDictName']('ColumnAttribute', param.row[item.key])) : cellType(this, h, param, item)) :
                                                !currentRow.edittingCell[param.column.key] ? h('div', [
                                                    h('span', {
                                                        style: {
                                                            display: 'inline-block',
                                                            width: '100%',
                                                            overflow: 'hidden',
                                                            textOverflow: 'ellipsis',
                                                            whiteSpace: 'nowrap'
                                                        },
                                                        domProps: {
                                                            title: currentRow[item.key]
                                                        }
                                                    }, currentRow[item.key])
                                                ]) : cellType(this, h, param, item))

                                    ]),
                                    h('Col', {
                                        props: {
                                            span: '2'
                                        }
                                    }, [
                                        currentRow.edittingCell[param.column.key] ? saveIncellEditBtn(this, h, param) : incellEditBtn(this, h, param)
                                    ])
                                ]);
                            } else {
                                return h('span', currentRow[item.key]);
                            }
                        };
                    }
                    if (item.handler) {
                        item.render = (h, param) => {
                            let currentRowData = this.tableData[param.index];
                            let children = [];
                            item.handler.forEach(item => {
                                if (item === 'delete') {
                                    children.push(deleteButton(this, h, currentRowData, param.index));
                                }
                            });
                            return h('div', children);
                        };
                    }
                });
            },
            handleBackdata (data) {
                let clonedData = JSON.parse(JSON.stringify(data));
                clonedData.forEach(item => {
                    delete item.editting;
                    delete item.edittingCell;
                    delete item.saving;
                });
                return clonedData;
            },
            emitSelectChange(selection){
                // 在多选模式下有效，只要选中项发生变化时就会触发
                // selection: 已选项数据
                this.$emit('on-selection-change', selection);
            },
            foreignTableSelect(){
                if(this.foreiginRow.columnId){
                    this.currentRow['isForeignKey'] = 'Y';
                    this.currentRow['masterTableId'] = this.foreiginRow.tableId;
                    this.currentRow['masterTableCode'] = this.foreiginRow.tableCode;
                    this.currentRow['masterColumnCode'] = this.foreiginRow.columnCode;
                    this.currentRow['masterTableDisplayName'] = this.foreiginTable.tableName;
                    saveEditData(this, this.currentParam);
                }
            },
            //取消选择外键，则需要把外键设置为否
            cancel(){
                this.currentRow['isForeignKey'] = 'N';
                saveEditData(this, this.currentParam);
            },
            loadTable(data){
                debugger;
               // let userToken = sessionStorage.getItem('userToken');
                console.info(this.tableId);
                if( !(data && data.length > 0)) return;
                let region = data[data.length - 1];
                this.foreiginRow = '';
                this.foreiginTable = '';
                this.queryTableForm = {
                                        __EQS_regionId: region.id,
                                        __NES_tableId: this.tableId,
                                    };
                this.$net.send({
                    server : this.server.metaTableQuery,
                    data: this.queryTableForm
                }).then(
                    (data) =>{
                        this.metaTableData = data.rows;
                        this.total = data.total;
                        this.metaTableData[0]._highlight = true;
                    }
                );
            },
            rowClick(row, index){
                this.foreiginRow = '';
                this.foreiginTable = row;
                this.queryColumnForm = {__EQS_tableId: row.tableId}
                this.$net.send({
                    server: this.server.metaColumnQuery,
                    data: this.queryColumnForm
                }).then(
                    (data) => {
                        this.columnData = data.rows;
                        this.colTotal = data.total;
                    }
                );
            },
            columnClick(row, index){
                this.foreiginRow = row;
            }
        },
        watch: {
            value (data) {
                this.init();
            }
        }
    };
</script>
