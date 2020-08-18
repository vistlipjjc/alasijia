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
                    vm.edittingStore[param.index].edittingCell[param.column.key] = false;
                    vm.tableData = JSON.parse(JSON.stringify(vm.edittingStore));
                    vm.$emit('on-change', vm.handleBackdata(vm.tableData), vm.tableData, param.index);
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
                    vm.edittingStore[param.index].propCode = '';
                    vm.edittingStore[param.index][item.key] = event;

                    //联动
                    if (event === 'RULE') {
                        vm.tableData = JSON.parse(JSON.stringify(vm.edittingStore));
                    }
                    else {
                        vm.tableData = JSON.parse(JSON.stringify(vm.edittingStore));
                    }
                }
            }
        },vm.varSources.map((item) => {
            return  h('Option', {props: {value: item.value}}, item.name);
        }));
    };

    const cellFormSelect = (vm, h, param, item, prop) => {
        return h('Select', {
            props: {
                transfer: true,
                value: vm.edittingStore[param.index][item.key],
                labelInValue: true
            },
            on: {
                'on-change' (event) {
                    if (event) vm.edittingStore[param.index][item.key] = event.value;
                }
            }
        },
        prop.map((item) => {
            return  h('Option', {props: {value: item.value}}, item.name);
        })
        );
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
    const cellType = (vm, h, param, item, prop) => {
        if(item.key == 'varSource'){
            return cellSelect(vm, h, param, item);
        }
        else if(item.key == 'propCode'){
            return cellFormSelect(vm, h, param, item, prop);
        }
        else{
            return cellInput(vm, h, param, item);
        }
    };

    const getName = (vm, h, param, item) => {
        let dict = [];
        if (vm.varSourceArr[param.index] === 'RULE'){
            dict = vm.ruleProps.find((prop) => {
                return param.row[item.key] === prop.value
            });
        }else{
            dict = vm.formProps.find((prop) => {
                return param.row[item.key] === prop.value
            });
        }

        if (dict){
            return dict.name;
        }else{
            return '';
        }
    };

    export default {
        name: 'procDefTable',
        props: {
            refs: String,
            columnsList: Array,
            value: Array,
            url: String,
            formProps: Array,
            ruleProps: Array
        },
        data () {
            return {
                columns: [],
                tableData: this.value,
                edittingStore: [],
                variableProps: [],
                varSources: [],
                varSourceArr: []
            };
        },
        created () {
            this.init();
        },
        methods: {
            init () {
                /* 获取列枚举数据、后端查询数据，并缓存 */
                this.$store.dispatch('cache/cacheDict', {type: 'fixedDict', url: 'VarSources', service: 'wf'})
                    .then(data => {
                    this.varSources = data;
                });
                let vm = this;
                /* 筛选需要编辑的列 */
                let editableCell = this.columnsList.filter(item => {
                    if (item.editable) {
                        if (item.editable === true) {
                            return item;
                        }
                    }
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
                                            item.key != 'propCode' ?
                                                (!currentRow.edittingCell[param.column.key] ? h('span', this.$store.getters['cache/getCacheDictName']('VarSources', param.row[item.key])) : cellType(this, h, param, item)) :
                                                (!currentRow.edittingCell[param.column.key] ? h('span', getName(this, h, param, item) ) : cellType(this, h, param, item, (param.row['varSource']!=='RULE'?this.formProps:this.ruleProps)))
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
                data.forEach((item, index) => {
                    this.varSourceArr[index] = item['varSource'];
                });
                this.init();
            }
        }
    };
</script>
