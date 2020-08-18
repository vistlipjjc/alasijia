<style lang="less">

</style>

<template>
    <div>
        <Table :ref="refs" :columns="columnsList" :data="tableData" border disabled-hover size="small"></Table>
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
                    let data = currentRow.period;
                    let time = [];
                    data.forEach((item, index) => {
                        let array = item.split(':');
                        time.push(array[0]);
                        time.push(array[1]);
                    });
                    vm.$emit('on-delete-time', time, vm.tableData);
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
    const saveIncellEditBtn = (vm, h, param) => {
        return h('Button', {
            props: {
                type: 'text',
                icon: 'checkmark'
            },
            on: {
                click: (event) => {
                    let data = vm.edittingStore[param.index][param.column.key];
                    if(data.length > 0 )
                    {
                        let start = data[0].split(':')[0] + data[0].split(':')[1];
                        let end = data[1].split(':')[0] + data[1].split(':')[1];
                        if(Number(start) >= Number(end))
                        {
                            vm.$Message.info({duration: 5, content: '结束时间必须大于开始时间！'});
                        }
                        else
                        {
                            vm.edittingStore[param.index].edittingCell[param.column.key] = false;
                            vm.tableData = JSON.parse(JSON.stringify(vm.edittingStore));

                            let time = [];
                            data.forEach((item, index) => {
                                let array = item.split(':');
                                time.push(array[0]);
                                time.push(array[1]);
                            });
                            vm.$emit('on-save-time', time);
                        }
                    }
                    else
                    {
                        vm.$Message.info({duration: 5, content: '时间段不能为空！'});
                    }
                }
            }
        });
    };
    const cellTimePicker  = (vm, h, param, item) => {
        return h('TimePicker', {
            props: {
                type: 'timerange',
                format: 'HH:mm',
                placement: 'bottom-end',
                transfer: true
            },
            on: {
                'on-change' (data) {
                    let key = item.key;
                    vm.edittingStore[param.index][key] = data;
                }
            }
        });
    };
    export default {
        name: 'exclusionPeriodTable',
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
                currentTime:[]
            };
        },
        created () {
            this.init();
        },
        methods: {
            init () {
                let result = true;
                this.tableData.forEach(item => {
                    if (item.edittingCell) {
                        if (item.edittingCell['period']) {
                            result = false;
                            this.$Message.info({duration: 5, content: '还有时间段未保存！'});
                            return;
                        }
                    }
                });
                if(!result) return;

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
                // res = cloneData.map((item, index) => {
                //     let isEditting = false;
                //     if (this.value[index]) {
                //         if (this.value[index].editting) { //是否为行编辑
                //             isEditting = true;
                //         }
                //     }
                //     if (isEditting) {
                //         let edittingCell = {};
                //         editableCell.forEach(item => {
                //             edittingCell[item.key] = true;
                //         });
                //         this.$set(item, 'edittingCell', edittingCell);
                //         return item;
                //     } else {
                //         this.$set(item, 'editting', false);
                //         let edittingCell = {};
                //         editableCell.forEach(item => {
                //             edittingCell[item.key] = false;
                //         });
                //         this.$set(item, 'edittingCell', edittingCell);
                //         return item;
                //     }
                // });

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
                                            !currentRow.edittingCell[param.column.key] ? h('span', currentRow[item.key][0]+ ' - '+currentRow[item.key][1]) : cellTimePicker(this, h, param, item)
                                            ,currentRow.edittingCell[param.column.key] ? saveIncellEditBtn(this, h, param) : ''
                                        ])
                                    ]);
                            } else {

                                return h('span', currentRow[item.key][0]+ ' - '+currentRow[item.key][1]);
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
            }
        },
        watch: {
            value (data) {
                this.init();
            }
        }
    };
</script>
