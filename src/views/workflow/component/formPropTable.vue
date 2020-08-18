<template>
    <div>
        <Table :ref="refs" :columns="columnsList" :data="tableData" border disabled-hover size="small"
               @on-selection-change="emitSelectChange" style="margin-top: 5px; border-radius: 4px;"></Table>
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
                    if(param.column.key == 'propCode')
                    {
                        let tempData = JSON.parse(JSON.stringify(vm.edittingStore));
                        let isDuplication = false;
                        let code = tempData[param.index][param.column.key];
                        tempData.splice(param.index, 1);
                        tempData.forEach((item, index) => {
                            if(code == item[param.column.key]){
                                isDuplication = true;
                                return;
                            }
                        });

                        if(isDuplication){
                            vm.$Message.error('已存在编码\''+ code + '\', 请重新输入！');
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
                }
            }
        });
    };

    const cellSelect = (vm, h, param, item) => {
        return h('Select', {
            props: {
                transfer: true,
                value: vm.edittingStore[param.index][item.key]
            },
            on: {
                'on-change' (event) {
                    let key = item.key;
                    vm.edittingStore[param.index][key] = event
                }
            }
        },vm.primaryKeys.map((item) => {
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
        if(item.key == 'primaryKey'){
            return cellSelect(vm, h, param, item);
        }else{
            return cellInput(vm, h, param, item);
        }
    };

    export default {
        name: 'formPropTable',
        props: {
            refs: String,
            columnsList: Array,
            value: Array,
            url: String
        },
        data () {
            return {
                columns: [],
                tableData: this.value,
                edittingStore: [],
                primaryKeys: []
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
                        this.primaryKeys = data;
                    });
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

                                            item.key == 'primaryKey' ?
                                                (!currentRow.edittingCell[param.column.key] ? h('span', this.$store.getters['cache/getCacheDictName']('YesNo', param.row[item.key])) : cellType(this, h, param, item)) :
                                                !currentRow.edittingCell[param.column.key] ? h('span', currentRow[item.key]) : cellType(this, h, param, item)

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
        },
        watch: {
            value (data) {
                this.init();
            }
        }
    };
</script>
