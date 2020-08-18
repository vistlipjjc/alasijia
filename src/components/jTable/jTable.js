// 判断参数是否是其中之一
export function oneOf (value, validList) {
    for (let i = 0; i < validList.length; i++) {
        if (value === validList[i]) {
            return true;
        }
    }
    return false;
}

//表格行【查看】按钮
export const viewButton = (vm, h, currentRow, index, path) => {
    return h('Tooltip', {
        props:{
            content: '查看',
            placement: 'top',
            transfer: true
        }
    },[
        h('Button', {
            props: {
                type: 'ghost',
                icon: 'document-text',
                shape: 'circle',
                size: 'small'
            },
            style: {
                margin: '0 1px'
            },
            on: {
                'click': () => {
                    if (path){
                        vm.$router.push({
                            path: path,
                            query: {row: currentRow}
                        });
                    }else{
                        vm.$emit('on-view', currentRow, index);
                    }
                }
            }
        })
    ]);
};

//表格行【删除】按钮
export const deleteButton = (vm, h, currentRow, index) => {
  if (!currentRow.ifHiddenDelete) {
    return h('Tooltip', {
      props:{
        content: '删除',
        placement: 'top',
        transfer: true
      }
    },[
      h('Button', {
        props: {
          type: 'ghost',
          icon: 'trash-a',
          shape: 'circle',
          size: 'small'
        },
        style: {
          margin: '0 1px'
        },
        on: {
          'click': () => {
            vm.$Modal.confirm({
              title: '删除提示',
              content: '您确定要删除这条数据吗?',
              onOk: () => {
                vm.$emit('on-delete', currentRow, index);
              }
            });
          }
        }
      })
    ]);
  }
    // return h('Poptip', {
    //     props: {
    //         confirm: true,
    //         title: '您确定要删除这条数据吗?',
    //         transfer: true
    //     },
    //     on: {
    //         'on-ok': () => {
    //             vm.$emit('on-delete', currentRow, index);
    //         }
    //     }
    // }, [
    //     h('Button', {
    //         style: {
    //             margin: '0 1px'
    //         },
    //         props: {
    //             type: 'ghost',
    //             placement: 'top',
    //             icon: 'trash-a',
    //             shape: 'circle',
    //             size: 'small'
    //         }
    //     })
    // ]);
};

//表格行【编辑】按钮
export const editButton = (vm, h, currentRow, index, path) => {
  if (!currentRow.ifHiddenEdit) {
    return h('Tooltip', {
      props:{
        content: '编辑',
        placement: 'top',
        transfer: true
      }
    },[
      h('Button', {
        props: {
          type: 'ghost',
          icon: 'edit',
          shape: 'circle',
          size: 'small'
        },
        style: {
          margin: '0 1px'
        },
        on: {
          'click': () => {
            if (path){
              vm.$router.push({
                path: path,
                query: {row: currentRow}
              });
            }else{
              vm.$emit('on-edit', currentRow, index);
            }
          }
        }
      })
    ]);
  }
};

//表单元格【编辑】按钮
export const incellEditBtn = (vm, h, param) => {
    if (vm.hoverShow) {
        return h('div', {
            'class': {
                'show-edit-btn': vm.hoverShow
            }
        }, [
            h('Button', {
                props: {
                    type: 'text',
                    icon: 'edit'
                },
                on: {
                    click: (event) => {
                        vm.edittingStore[param.index].edittingCell[param.column.key] = true;
                        vm.thisTableData = JSON.parse(JSON.stringify(vm.edittingStore));
                    }
                }
            })
        ]);
    } else {
        return h('Button', {
            props: {
                type: 'text',
                icon: 'edit'
            },
            on: {
                click: (event) => {
                    vm.edittingStore[param.index].edittingCell[param.column.key] = true;
                    vm.thisTableData = JSON.parse(JSON.stringify(vm.edittingStore));
                }
            }
        });
    }
};

//表单元格【保存】按钮
export const saveIncellEditBtn = (vm, h, param) => {
    return h('Button', {
        props: {
            type: 'text',
            icon: 'checkmark'
        },
        on: {
            click: (event) => {
                vm.edittingStore[param.index].edittingCell[param.column.key] = false;
                vm.thisTableData = JSON.parse(JSON.stringify(vm.edittingStore));
                vm.$emit('input', vm.handleBackdata(vm.thisTableData));
                vm.$emit('on-cell-change', vm.handleBackdata(vm.thisTableData), param.index, param.column.key);
            }
        }
    });
};

//表单元格【输入框】
export const cellInput = (vm, h, param, item) => {
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

//表格行自定义跳转按钮
export const otherskipButton = (vm, h, currentRow, index, path, icon, content, envent) => {
  if (currentRow.isShowOtherskipIcon !== icon) {
    return h('Tooltip', {
      props:{
        content: content,
        placement: 'top',
        transfer: true
      }
    },[
      h('Button', {
        props: {
          type: 'ghost',
          icon: icon,
          shape: 'circle',
          size: 'small'
        },
        style: {
          margin: '0 1px'
        },
        on: {
          'click': () => {
            if (path){
              vm.$router.push({
                path: path,
                query: {row: currentRow}
              });
            }else{
              vm.$emit(envent, currentRow, index)
            }
          }
        }
      })
    ]);
  }
};

//表格行自定义处理不需要跳转其他页面的事件
export const otherhandleButton = (vm, h, currentRow, index, envent, icon, content,prompt) => {
  if (!currentRow.ifHiddenOtherhandle) {  
    return h('Tooltip', {
      props: {
        content: content,
        transfer: true,
        placement: 'top',
      }
    }, [
      h('Button', {
        style: {
          margin: '0 1px'
        },
        props: {
          type: 'ghost',
          placement: 'top',
          icon: icon,
          shape: 'circle',
          size: 'small'
        },
        on: {
          'click': () => {
            vm.$Modal.confirm({
              title: '提示',
              content: prompt,
              onOk: () => {
                vm.$emit(envent, currentRow, index);
              }
            });
          }
        }
      })
    ]);
  }  
};

// 表单元格【撤回】按钮
export const retractButton = (vm, h, currentRow, index, key = 'status', value = '3') => {
    if (currentRow[key] === value) {
        return h('Tooltip', {
            props:{
                content: '撤回',
                placement: 'top',
                transfer: true
            }
        },[
            h('Button', {
                props: {
                    type: 'ghost',
                    icon: 'reply',
                    shape: 'circle',
                    size: 'small'
                },
                style: {
                    margin: '0 1px'
                },
                on: {
                    'click': () => {
                        vm.$Modal.confirm({
                        title: '撤回提示',
                        content: '您确定要撤回这条数据吗?',
                        onOk: () => {
                            vm.$emit('on-retract', currentRow, index);
                        }
                    });
                    }
                }
            })
        ]);
    }
}

// 表单元格【置顶、取消置顶】按钮
export const setTopButton = (vm, h, currentRow, index, key = 'isTop') => {
    let tips = currentRow[key] === 'Y' ? '取消置顶' : '置顶'
    let content = '您确定要' + (currentRow[key] === 'Y' ? '取消置顶' : '置顶') + '这条数据吗?'
    let icon = currentRow[key] === 'Y' ? 'android-arrow-up' : 'ios-arrow-thin-up'

    if (currentRow.status === '3') {
      return h('Tooltip', {
        props:{
          content: tips,
          placement: 'top',
          transfer: true
        }
      },[
        h('Button', {
          props: {
            type: 'ghost',
            icon: icon,
            shape: 'circle',
            size: 'small'
          },
          style: {
            margin: '0 1px'
          },
          on: {
            'click': () => {
              vm.$Modal.confirm({
                title: tips + '提示',
                content: content,
                onOk: () => {
                  vm.$emit('on-setTop', currentRow, index);
                }
              });
            }
          }
        })
      ]);
    }
}

// 表单元格【置首页、取消置首页】按钮
export const setHomeButton = (vm, h, currentRow, index, key = 'isHomepage' ) => {
    let tips = currentRow[key] === 'Y' ? '取消置首页' : '置首页'
    let content = '您确定要' + (currentRow[key] === 'Y' ? '取消置首页' : '置首页') + '这条数据吗?'
    let icon = currentRow[key] === 'Y' ? 'ios-home' : 'ios-home-outline'

    if (currentRow.status === '3') {
      return h('Tooltip', {
        props:{
          content: tips,
          placement: 'top',
          transfer: true
        }
      },[
        h('Button', {
          props: {
            type: 'ghost',
            icon: icon,
            shape: 'circle',
            size: 'small'
          },
          style: {
            margin: '0 1px'
          },
          on: {
            'click': () => {
              vm.$Modal.confirm({
                title: tips + '提示',
                content: content,
                onOk: () => {
                  vm.$emit('on-setHome', currentRow, index);
                }
              });
            }
          }
        })
      ]);
    }

}

//爱心企业的活动报名表格行“报名”按钮
export const enrollButton = (vm, h, currentRow, index, key = 'status', value = 0) => {
  if (currentRow[key] == value) {
    return h('Tooltip', {
      props:{
        content: '报名',
        placement: 'top',
        transfer: true
      }
    },[
      h('Button', {
        props: {
          type: 'ghost',
          icon: 'edit',
          shape: 'circle',
          size: 'small'
        },
        style: {
          margin: '0 1px'
        },
        on: {
          'click': () => {
            vm.$emit('on-enroll', currentRow, index)
          }
        }
      })
    ]);
  }
};

