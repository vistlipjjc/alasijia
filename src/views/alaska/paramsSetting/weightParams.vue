<template>
  <div class="wpBox">
    <div class="wpLeft">
      <div class="wpLeftTitle">已配置机构权重区域：</div>
      <div class="wpLeftSearchBox">
        <Input class="wpLeftSearchInputOne" clearable v-model.trim="searchValue" @on-keypress="gotoSearchWeight"></Input>
        <Button icon="ios-search" type="ghost" @click="searchWeight">搜索</Button>
      </div>
      <div class="wpLeftTreeBox">
        <Tree :data="treeJson" @on-select-change="selectNode"></Tree>
      </div>
      <div class="wpLeftBtnBox">
        <Button class="wpLeftBtnItem" type="primary" icon="plus-round" @click="addNewRegion">新增</Button>
        <Button class="wpLeftBtnItem" type="error" icon="android-delete" @click="deleteRegion">删除</Button>
      </div>
    </div>

    <div class="wpRight">
      <Form class="wpRightItem" ref="editForm" label-position="top" :model="editForm" :rules="editFormRules">
        <FormItem label="工单区域：" prop="areaValue">
          <Cascader class="wpRightItemSelect"
            style="margin-left: 12px;"
            :data="areaJson"
            :disabled="selectedNode.length > 0"
            v-model="editForm.areaValue"
            @on-change="changeRegion">
          </Cascader>
        </FormItem>
      </Form>

      <div class="wpRightItem">
        <div class="wpRightItemTitle">派单机构：</div>
        <div class="wpRightOrganizationBox">
          <div class="wpRightOrganizationItem"
            v-for="(item, index) in orderOrganizationData">
            <div class="wpRightItemRedStar">
              <template v-if="index === 0">*</template>
            </div>
            <Cascader class="wpRightItemSelect"
              change-on-select
              :class="item.organizationValue.length === 0 ? item.noSelectClass : ''"
              :data="item.organizationJson"
              v-model="item.organizationValue"
              @on-change="(value, selectedData) => { changeOrganization(item, index, value, selectedData) }"
              @on-visible-change="show => { judgeShowOrHide(item, index, show) }">
            </Cascader>
            <div class="wpRightOrganizationText">权重</div>
            <Input class="wpLeftSearchInputTwo"
              :class="!item.weight ? item.noInputClass : ''"
              v-model.trim="item.weight"
              @on-change="changeInput(item, index)"
              @on-blur="changeFilled(item, index)">
            </Input>
            <div class="wpRightOrganizationText">%</div>
            <Button class="wpRightOrganizationBtn"
              type="error" shape="circle" icon="close-round"
              v-if="index !== 0"
              @click="deleteWeight(item, index)">
            </Button>
            <span class="wpRightRedTips1"
              v-if="item.organizationValue.length === 0 && item.noSelectClass">
              请选择派单机构
            </span>
            <span class="wpRightRedTips1 wpRightRedTips2"
              v-if="!item.weight && item.noInputClass">
              请填写派单权重
            </span>
          </div>
        </div>
        <div class="wpRightAddBtnBox">
          <Button type="primary" icon="plus-round" @click="addNewLine">增加行</Button>
        </div>
        <div class="wpRightOtherBtnBox">
          <Button class="wpRightOtherBtn" type="primary" @click="saveWeightRegion">保存</Button>
          <Button class="wpRightOtherBtn" type="ghost" @click="addNewRegion()">取消</Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const areaJson = require('@/util/area.json')

export default {
  data () {
    return {
      searchValue: '', // 权重区域搜索
      treeJson: [], // 区域树数据
      organizationJson: [], // 机构树数据
      areaJson: areaJson, // 省市区级联数据
      areaData: [], // 选择的省市区的值，包括value、label
      orderOrganizationData: [], // 派单机构
      selectedNode: [], // 选中的节点

      editForm: {
        areaValue: []
      },

      editFormRules: {
        areaValue: [
          { required: true, type: 'array', min: 1, message: '请选择工单区域', trigger: 'change' }
        ]
      },

      treeObject: {}, // 区域树（省市区）的对象，用于根据子级向上搜索父级
      orderOrganizationObject: {}, // 机构数据的对象，用于根据子级向上搜索父级

      regionServer: this.$services.backendService.sysRegionRestController, // 区域服务地址
      organizationServer: this.$services.backendService.organizationRestController // 机构服务地址
    }
  },

  created () {
    this.init()
  },

  methods: {
    init () {
      let vm = this
      vm.orderOrganizationData = [{
        organizationJson: [], // 机构源数据
        organizationValue: [], // 选择的机构的value
        organizationData: [], // 选择的机构的值，包括value、label
        weight: '' // 权重
      }, {
        organizationJson: [], // 机构源数据
        organizationValue: [], // 选择的机构的value
        organizationData: [], // 选择的机构的值，包括value、label
        weight: '' // 权重
      }]
      vm.getAllRegionTree()
      vm.getOrganizationTree()
    },

    // 获取区域树数据
    getAllRegionTree () {
      let vm = this
      vm.$net.send({
        server: vm.regionServer.getAllRegionTree
      }).then(data => {
        if (data.code === 200) {
          vm.treeJson = data.data
          vm.arrayToObject(vm.treeJson, vm.treeObject, 'regionNo')
        } else {
          vm.$Message.error(`${data.code}:${data.message}`)
        }
      }).catch(error => {
        vm.$Message.error(error.reason)
      })
    },

    // 获取机构数据
    getOrganizationTree () {
      let vm = this
      vm.$net.send({
        server: vm.organizationServer.getOrganizationTree
      }).then(data => {
        if (data.code === 200) {
          let organizationJson = JSON.stringify(data.data)
          organizationJson = organizationJson.replace(/orgNo/g, 'value').replace(/title/g, 'label')
          organizationJson = JSON.parse(organizationJson)

          organizationJson.forEach(item => {
            if (item.value === 'ZJF') {
              vm.organizationJson = item.children
            }
          })

          vm.orderOrganizationData[0].organizationJson = [ ...vm.organizationJson ]
          vm.orderOrganizationData[1].organizationJson = [ ...vm.organizationJson ]
          vm.arrayToObject(organizationJson, vm.orderOrganizationObject, 'value')
        } else {
          vm.$Message.error(`${data.code}:${data.message}`)
        }
      }).catch(error => {
        vm.$Message.error(error.reason)
      })
    },

    // 辅助函数，数组转变对象
    arrayToObject (array, object, key) {
      array.forEach(item => {
        object[item[key]] = item
        if (item.children && item.children.length > 0) {
          this.arrayToObject(item.children, object, key)
        }
      })
    },

    // 根据区域编号获取权重数据
    getDispatchParams (regionNo) {
      let vm = this
      vm.$net.send({
        server: vm.regionServer.getDispatchParams,
        data: {
          regionNo: regionNo
        }
      }).then(data => {
        if (data.code === 200) {
          let dispatchData = data.data

          // 如果没有权重数据，则显示新增时的样式
          if (dispatchData.length === 0) {
            vm.addNewRegion(true)
            return false
          }

          // 有数据，遍历获取对应数据
          dispatchData.forEach((item, index) => {
            vm.orderOrganizationData.push({
              organizationJson: [ ...vm.organizationJson ],
              organizationData: [],
              organizationValue: [],
              weight: item.weight
            })
            vm.getParentOrderOrganizationByChild(index, item.orgNo)
          })
        } else {
          vm.$Message.error(`${data.code}:${data.message}`)
        }
      }).catch(error => {
        console.log('error', error)
        vm.$Message.error(error.reason)
      })
    },

    // 根据子级机构code，获取父级机构的code和name
    getParentOrderOrganizationByChild (index, childNode) {
      let vm = this
      if (vm.orderOrganizationObject[childNode]) {
        let data = { value: childNode, label: vm.orderOrganizationObject[childNode].label }

        vm.orderOrganizationData[index].organizationData.unshift(data)
        vm.orderOrganizationData[index].organizationValue.unshift(childNode)

        if (vm.orderOrganizationObject[childNode].parentId) {
          vm.getParentOrderOrganizationByChild(index, vm.orderOrganizationObject[childNode].parentId)
        }
      }
    },

    // 选择区域树节点
    selectNode (node) {
      let vm = this
      vm.selectedNode = node

      // 取消选中，显示新增状态
      if (node.length === 0) {
        vm.addNewRegion()

      // 选择，则获取该节点的权重数据
      } else {
        vm.areaData = []
        vm.editForm.areaValue = []
        vm.orderOrganizationData = []
        vm.getParentRegionByChild(node[0].regionNo)
        vm.getDispatchParams(node[0].regionNo)
      }
    },

    // 根据区域的code查找父级省市的code和name
    getParentRegionByChild (regionNo) {
      let vm = this
      let data = { value: regionNo, label: vm.treeObject[regionNo].title }

      vm.editForm.areaValue.unshift(regionNo * 1)
      vm.areaData.unshift(data)

      if (vm.treeObject[regionNo].parentId) {
        vm.getParentRegionByChild(vm.treeObject[regionNo].parentId)
      }
    },

    // 点击确定，键盘弹起进行搜索
    gotoSearchWeight (event) {
      if (event.keyCode === 13) {
        this.searchWeight()
      }
    },

    // 已配机构权重搜索
    searchWeight () {
      let vm = this

      // 没有输入内容，搜索全部
      if (!vm.searchValue) {
        vm.treeJson = []
        vm.getAllRegionTree()
        return false
      }

      vm.treeJson = []
      vm.$nextTick(() => {
        // 遍历对象查找跟查询条件相关的节点项
        for (let index in vm.treeObject) {
          if (vm.treeObject[index].title.indexOf(vm.searchValue) > -1) {
            vm.getTopLevelNode(vm.treeObject[index], vm.treeObject[index].regionNo)
          }
        }
      })
    },

    // 获取节点项最上级的区域
    getTopLevelNode (node, regionNo) {
      let vm = this
      if (node.parentId) {
        vm.getTopLevelNode(vm.treeObject[node.parentId], regionNo)
      } else {
        let treeJsonRegionNos = vm.treeJson.map(item => {
          return item.regionNo
        })
        if (!treeJsonRegionNos.includes(node.regionNo)) {
          vm.treeJson.push(node)
          vm.showParentNode(vm.treeJson, regionNo)
        }
      }
    },

    // 展开搜索内容所在的节点的父节点
    showParentNode(nodeList, regionNo) {
      let vm = this
      for (let item of nodeList) {
        if (item.regionNo === regionNo) {
          break
          return
        }

        item.expand = true
        if (item.children && item.children.length > 0) {
          vm.showParentNode(item.children, regionNo)
        }
      }
    },

    // 选择区域
    changeRegion (value, selectedData) {
      this.areaData = selectedData
    },

    // 选择机构
    changeOrganization (item, index, value, selectedData) {
      item.organizationData = selectedData
      item.organizationValue = value

      // 只有在点击删除按钮清空数据时，在change事件校验必填
      if (item.organizationValue.length === 0) {
        this.changeFilled(item, index)
      }
    },

    // 机构显示、隐藏事件，隐藏的时候判断选择的机构是否已经添加
    judgeShowOrHide (item, index, show) {
      let vm = this
      if (!show) {
        let selectedOrg = item.organizationValue.join('')
        vm.orderOrganizationData.forEach((organization, orgIndex) => {
          let orgNoString = organization.organizationValue.join('')
          if (selectedOrg && selectedOrg === orgNoString && index !== orgIndex) {
            item.organizationData = []
            item.organizationValue = []
            vm.$Message.warning('该机构已添加')
          }
        })

        vm.changeFilled(item, index)
      }
    },

    // 新增机构区域，清空右边的数据，hadSelectedNode:是否有选中节点
    addNewRegion (hadSelectedNode) {
      let vm = this
      vm.areaData = []
      vm.editForm.areaValue = []
      vm.orderOrganizationData = [{
        organizationJson: [ ...vm.organizationJson ], // 机构源数据
        organizationValue: [], // 选择的机构的value
        organizationData: [], // 选择的机构的值，包括value、label
        weight: '' // 权重
      }, {
        organizationJson: [ ...vm.organizationJson ], // 机构源数据
        organizationValue: [], // 选择的机构的value
        organizationData: [], // 选择的机构的值，包括value、label
        weight: '' // 权重
      }]

      // 如果不是点击省市时，由于没有重置清空右边的数据时，取消选中清空，并将已选数组清空
      // 点击省市时，由于没有重置清空右边的数据时，如果取消选中，就会让人以为选不来，所以区分开来
      if (vm.selectedNode.length > 0 && hadSelectedNode !== true) {
        vm.cancelSelected(vm.treeJson)
        vm.selectedNode = []
      }
    },

    // 递归判断取消选中
    cancelSelected (array) {
      let vm = this
      array.forEach(item => {
        if (item.regionNo === vm.selectedNode[0].regionNo) {
          item.selected = false
        }

        if (item.children && item.children.length > 0) {
          vm.cancelSelected(item.children)
        }
      })
    },

    // 删除机构区域
    deleteRegion () {
      let vm = this

      if (vm.selectedNode.length === 0) {
        vm.$Message.warning('请选择要删除的区域')
        return false
      }

      vm.$Modal.confirm({
        title: '删除提示',
        content: '是否确定删除该工单区域的系统派单?',
        loading: true,
        onOk: () => {
          vm.$net.send({
            server: vm.regionServer.deleteRegion,
            data: {
              regionNo: vm.selectedNode[0].regionNo
            }
          }).then(data => {
            if (data.code === 200) {
              vm.$Modal.remove()
              if (data.code === 200) {
                vm.$Message.success('删除功能')
                vm.getAllRegionTree()
                vm.addNewRegion()
              } else {
                vm.$Message.error(data.message)
              }
            } else {
              vm.$Message.error(`${data.code}:${data.message}`)
            }
          }).catch(error => {
            vm.$Message.error(error.reason)
          })
        }
      })
    },

    // 增加行
    addNewLine () {
      let vm = this
      let newLine = { ...vm.orderOrganizationData[0] }
      newLine.organizationValue = []
      newLine.organizationData = []
      newLine.weight = ''
      vm.orderOrganizationData.push(newLine)
    },

    // 删除权重
    deleteWeight (item, index) {
      let vm = this
      let orderOrganizationData = vm.orderOrganizationData.filter((orderOrganization, orderOrganizationIndex) => {
        return orderOrganizationIndex !== index
      })

      // 直接赋值下拉级联的选中值没有清除，所以先清空，在下次渲染再赋值
      vm.orderOrganizationData = []
      vm.$nextTick(() => {
        vm.orderOrganizationData = [ ...orderOrganizationData ]
      })
    },

    // 保存权重
    saveWeightRegion () {
      let vm = this

      vm.$refs.editForm.validate((valid) => { // 数据校验
        // 第一个派单机构和权重必填，其他的派单机构和权重，要么都不填，要么都填才能保存
        let filled = true
        let orderOrganizationData = [ ...vm.orderOrganizationData ]

        orderOrganizationData.forEach((item, index) => {
          item.noInputClass = ''
          item.noSelectClass = ''

          // 机构下拉不为空，输入框为空
          if (item.organizationValue.length > 0 && !item.weight) {
            filled = false
            item.noInputClass = 'wpInputBorderRed'
          }

          // 机构下拉为空，输入框不为空
          if (item.organizationValue.length === 0 && item.weight) {
            filled = false
            item.noSelectClass = 'wpInputBorderRed'
          }

          // 第一个:机构下拉为空，输入框为空
          if (item.organizationValue.length === 0 && !item.weight) {
            filled = false
            item.noInputClass = 'wpInputBorderRed'
            item.noSelectClass = 'wpInputBorderRed'
          }
        })

        vm.orderOrganizationData = [ ...orderOrganizationData ]

        if (valid && !filled) {
          return false
        }

        if (!valid) {
          return false
        }

        let params = {}
        let server = ''

        // 构造区域参数
        let sysRegions = vm.areaData.map((item, index) => {
          let region = {
            regionNo: item.value,
            title: item.label
          }
          if (index !== 0) {
            region.parentId = vm.areaData[index -1].value
          }
          return region
        })

        // 构造机构权重参数
        let sysDispatchParams = vm.orderOrganizationData.map(item => {
          let dispatch = {
            regionNo: vm.editForm.areaValue[vm.editForm.areaValue.length - 1],
            orgNo: item.organizationValue[item.organizationValue.length - 1],
            weight: item.weight
          }
          return dispatch
        })

        // 新增
        if (vm.selectedNode.length === 0) {
          server = vm.regionServer.addRegion
          params.sysRegions = sysRegions
          params.sysDispatchParams = sysDispatchParams

        // 修改
        } else {
          server = vm.regionServer.updateSysDispatchParam
          params = [ ...sysDispatchParams ]
        }

        vm.$net.send({
          server: server,
          data: params
        }).then(async data => {
          if (data.code === 200) {
            vm.$Message.success('保存成功')
            if (vm.selectedNode.length === 0) {
              await vm.getAllRegionTree()
              let treeJson = [ ...vm.treeJson ]
              vm.treeJson = []
              vm.expandTree(treeJson, vm.editForm.areaValue)

              setTimeout(() => {
                vm.treeJson = [ ...treeJson ]
              }, 500)
            }
          } else {
            let tips = data.code === 422 ? data.message : `错误码：${data.code}，错误信息：${data.message}`
            vm.$Message.error(tips)
          }
        }).catch(error => {
          vm.$Message.error(error.reason)
        })
      })
    },

    // 左边展开新添加的的省市区
    expandTree (array, selectedTreeValue) {
      let vm = this
      array.forEach(item => {
        if (selectedTreeValue.includes(item.regionNo)) {
          item.expand = true

          // 如果是选择的省市区的最后一个，在省市区的树上选中该节点
          if (item.regionNo === selectedTreeValue[selectedTreeValue.length - 1]) {
            item.selected = true
            vm.selectNode([item])
          }

          if (item.children && item.children.length > 0) {
            vm.expandTree(item.children, selectedTreeValue)
          }
        }
      })
    },

    // 校验数字
    changeInput (item, index) {
      let vm = this
      let value = item.weight

      item.noInputClass = ''
      value = value.replace(/[^\d|.]/g, '') // 先去掉非数字非小数点的字符串
      let valueArray = value.split('.')

      // 去除后面输入的小数点，只留最前面的小数点
      if (valueArray.length > 2) {
        let lastIndex = value.lastIndexOf('.')
        value = value.substring(0, lastIndex)
      }

      // 保留两位小数
      if (valueArray.length === 2 && valueArray[1].length > 2) {
        value = `${valueArray[0]}.${valueArray[1].substring(0, 2)}`
      }

      vm.$nextTick(() => {
        item.weight = value
      })
    },

    // 判断机构、权重是否已填
    changeFilled (item, index) {
      let vm = this
      item.noInputClass = ''
      item.noSelectClass = ''

      // 机构下拉不为空，输入框为空
      if (item.organizationValue.length > 0 && !item.weight) {
        item.noInputClass = 'wpInputBorderRed'
      }

      // 机构下拉为空，输入框不为空
      if (item.organizationValue.length === 0 && item.weight) {
        item.noSelectClass = 'wpInputBorderRed'
      }

      // 第一个:机构下拉为空，输入框为空
      if (item.organizationValue.length === 0 && !item.weight && index === 0) {
        item.noInputClass = 'wpInputBorderRed'
        item.noSelectClass = 'wpInputBorderRed'
      }

      let orderOrganizationData = [ ...vm.orderOrganizationData ]
      vm.orderOrganizationData = []
      vm.$nextTick(() => {
        vm.orderOrganizationData = [ ...orderOrganizationData ]
      })
    }
  }
}
</script>

<style scoped>
.wpBox {
  display: flex;
}

.wpLeft {
  width: 300px;
  margin-right: 20px;
  padding: 20px;
  border: 1px solid #ccc;
}
.wpLeftTitle {
  font-weight: 500;
}
.wpLeftSearchBox {
  margin: 20px 0;
}
.wpLeftSearchInputOne {
  margin-right: 10px;
}
.wpLeftSearchBox {
  display: flex;
  justify-content: space-between;
}
.wpLeftTreeBox {
  padding: 5px;
  border: 1px solid #ccc;
}
.wpLeftBtnBox {
  margin-top: 20px;
  text-align: center;
}
.wpLeftBtnItem {
  margin: 0 7px;
}

.wpRight {
  flex-grow: 1;
  padding: 20px;
  border: 1px solid #ccc;
}
.wpRightItem {
  margin-top: 20px;
}
.wpRightItem:first-child {
  margin-top: 0;
}
.wpRightItemRedStar {
  width: 7px;
  margin: 6px 6px 0 0;
  font-size: 20px;
  color: #ed3f14;
}
.wpRightItemSelectBox {
  display: flex;
  align-content: center;
  margin-top: 5px;
}
.wpRightItemSelect {
  width: 430px;
  margin-right: 30px;
}
.wpRightOrganizationBox {
  margin-top: 5px;
}
.wpRightOrganizationItem {
  position: relative;
  display: flex;
  align-items: center;
  margin-bottom: 25px;
}
.wpLeftSearchInputTwo {
  width: 100px;
  margin: 0 10px 0 5px;
}
.wpRightOrganizationBtn {
  width: 26px;
  height: 26px;
  margin-left: 20px;
}
.wpRightRedTips1 {
  position: absolute;
  bottom: -18px;
  left: 12px;
  font-size: 12px;
  color: #ed3f14;
}
.wpRightRedTips2 {
  left: 375px;
}

.wpRightAddBtnBox {
  margin-left: 13px;
}
.wpRightOtherBtnBox {
  margin: 20px 0 0 130px;
}
.wpRightOtherBtn {
  width: 75px;
  margin: 0 10px;
}
</style>

<style>
.wpInputBorderRed .ivu-input {
  border: 1px solid #ed3f14;
}
.wpRight label {
  margin-bottom: 0;
  font-weight: normal;
}
</style>
