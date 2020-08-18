<template>
    <div class="custManger">
        <Card>
            <p slot="title" class="fontsize18">客户经理基本信息</p>
            <Form :model="editForm" :label-width="100">
                <Row>
                    <Col span="8">
                    <FormItem label="编号: ">
                        <div>{{ editForm.managerNo }}</div>
                    </FormItem>
                    </Col>
                    <Col span="8">
                    <FormItem label="姓名: ">
                        <div>{{ editForm.realName }}</div>
                    </FormItem>
                    </Col>
                    <Col span="8">
                    <FormItem label="手机号码: ">
                        <div>{{ editForm.phone }}</div>
                    </FormItem>
                    </Col>
                </Row>

                <Row>
                    <Col span="8">
                    <FormItem label="证件类型: ">
                        <div>{{ editForm.certificateTypeName }}</div>
                    </FormItem>
                    </Col>
                    <Col span="8">
                    <FormItem label="证件号码: ">
                        <div>{{ editForm.certificateNo }}</div>
                    </FormItem>
                    </Col>
                    <Col span="8">
                    <FormItem label="性别: ">
                        <div>{{ editForm.genderName }}</div>
                    </FormItem>
                    </Col>
                </Row>

                <Row>
                    <Col span="8">
                    <FormItem label="状态: ">
                        <div>{{ editForm.stsName }}</div>
                    </FormItem>
                    </Col>
                    <Col span="8">
                    <FormItem label="所属机构: ">
                        <div>{{ editForm.agencyName }}</div>
                    </FormItem>
                    </Col>
                    <Col span="8">
                    <FormItem label="行内编号: ">
                        <div>{{ editForm.bankNo }}</div>
                    </FormItem>
                    </Col>
                </Row>

                <Row>
                    <Col span="8">
                    <FormItem label="是否黑名单: ">
                        <div>{{ editForm.isBlack }}</div>
                    </FormItem>
                    </Col>
                    <Col span="8">
                    <FormItem label="创建时间: ">
                        <div>{{ editForm.createdTime }}</div>
                    </FormItem>
                    </Col>
                </Row>
            </Form>
        </Card>

        <Card>
            <p slot="title" class="fontsize18">受理业务信息</p>
            <div class="total">
                <span>总单数：{{ editForm.allOrderNum }}</span>
                &nbsp;
                <span>（自主领单数：{{ editForm.getOrderNum }}</span>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <span>系统派单数：{{ editForm.autoOrderNum }}</span>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <span>指派工单数：{{ editForm.asginedOrderNum }}</span>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <span>转让工单数：{{ editForm.transferOrderNum }}）</span>
            </div>
            <Table :columns="totalColumns" :data="totalTableData" border></Table>

            <Row>
                <div style="text-align: center; margin-top: 10px;">
                    <Button @click="btnBack" type="ghost" style="margin:0 11px; height: 40px; width: 100px;">返回</Button>
                </div>
            </Row>
        </Card>
    </div>
</template>

<script>
  import moment from 'moment'
  import orgSelectTree from './orgSelectTree.vue'
  export default {
    components: { orgSelectTree },
    data () {
      return {
        editForm: {
          managerNo: '',
          realName: '',
          phone: '',
          gender: '',
          genderName: '',
          sts: '',
          stsName: '',
          agencyId: '',
          agencyName: '',
          certificateType: '',
          certificateTypeName: '',
          certificateNo: '',
          bankNo: '',
          isBlack: '',
          num: '0'
        },
        resData: {},

        sexList: [], // 性别列表
        userStatusList: [], // 状态列表
        certificateTypeList: [], // 证件类型

        organizationObject: {},
        organizationJson: [], // 机构树

        // 统计数的表格展示
        totalColumns: [
          { title: '待受理', align: 'center',
            children: [{ title: '待受理', key: 'waitingOrderNum', align: 'center' }]
          },
          { title: '受理中', align: 'center',
            children: [
              { title: '待收集资料', key: 'noInfoOrderNum', align: 'center'},
              { title: '待审核', key: 'waiteOrderNum', align: 'center'},
              { title: '待放款', key: 'unpayOrderNum', align: 'center'},
              { title: '暂无人接听', key: 'unCommuniteOrderNum', align: 'center'}
            ]
          },
          { title: '已办结', align: 'center',
            children: [
              { title: '已放款', key: 'payOrderNum', align: 'center'},
              { title: '审核不通过', key: 'unpassOrderNum', align: 'center'},
              { title: '客户取消', key: 'abolishOrderNum', align: 'center'},
              { title: '无法联系', key: 'uncontactOrderNum', align: 'center'},
              { title: '号码无效', key: 'unphoneOrderNum', align: 'center'},
              { title: '其他', key: 'otherOrderNum', align: 'center'},
              { title: '无效工单', key: 'invalidOrderNum', align: 'center'}
            ]
          },
        ],
        totalTableData: []
      }
    },

    created () {
      this.getOrganization()
    },

    /*mounted () {
      this.init()
    },*/

    methods: {
      init () {
        let vm = this

        // 性别的字典查询
        vm.$store.dispatch('cache/cacheDict', {type: 'dict', url: 'sex', service: 'sys'})
          .then(data => {
            vm.sexList = data;
          });

        // 状态的字典查询
        vm.$store.dispatch('cache/cacheDict', {type: 'dict', url: 'userStatus', service: 'sys'})
          .then(data => {
            vm.userStatusList = data;
          });

        // 状态的字典查询
        vm.$store.dispatch('cache/cacheDict', {type: 'dict', url: 'certificateType', service: 'sys'})
          .then(data => {
            vm.certificateTypeList = data;
          });

        let id = {managerId: vm.$route.query ? vm.$route.query.id : ''}
        vm.$net.send({
          server: vm.$services.backendService.custManagerRestController.view,
          data: id
        }).then(data =>{
          // console.log(data)
          vm.resData = data.data
          vm.resData.agencyName = ''
          vm.getParentName(vm.resData.agencyId)

          // 性别的转换
          vm.sexList.forEach(item => {
            if (item.value === vm.resData.gender) {
              vm.resData.genderName = item.name
            }
          })

          // 状态的转换
          vm.userStatusList.forEach(item => {
            if (item.value === vm.resData.sts) {
              vm.resData.stsName = item.name
            }
          })

          // 证件类型的转换
          vm.certificateTypeList.forEach(item => {
            if (item.value === vm.resData.certificateType) {
              vm.resData.certificateTypeName = item.name
            }
          })

          vm.resData.isBlack = vm.resData.isBlack === 'N' ? '否' : '是'
          vm.resData.createdTime = vm.resData.createdTime ? moment(vm.resData.createdTime).format('YYYY-MM-DD') : ''
          // 表格数据
          let tableItem = {
            waitingOrderNum: vm.resData.waitingOrderNum,
            noInfoOrderNum: vm.resData.noInfoOrderNum,
            waiteOrderNum: vm.resData.waiteOrderNum,
            unpayOrderNum: vm.resData.unpayOrderNum,
            unCommuniteOrderNum: vm.resData.unCommuniteOrderNum,
            payOrderNum: vm.resData.payOrderNum,
            unpassOrderNum: vm.resData.unpassOrderNum,
            abolishOrderNum: vm.resData.abolishOrderNum,
            uncontactOrderNum: vm.resData.uncontactOrderNum,
            unphoneOrderNum: vm.resData.unphoneOrderNum,
            otherOrderNum: vm.resData.otherOrderNum,
            invalidOrderNum: vm.resData.invalidOrderNum
          }
          vm.totalTableData.push(tableItem)
          vm.editForm = vm.resData
        })
      },

      // 获取下拉树
      getOrganization () {
        let vm = this
        vm.$net.send({
          server: vm.$services.backendService.organizationRestController.getOrganizationTree,
        }).then((data) => {
          if (data.success) {
            let organizationJson = JSON.stringify(data.data)
            organizationJson = organizationJson.replace(/orgNo/g, 'value').replace(/title/g, 'label')
            organizationJson = JSON.parse(organizationJson)
            vm.organizationJson = organizationJson
            vm.changeArrayToObject(organizationJson)
            vm.init()
          } else {
            vm.$Message.error({duration: 5, content: data.msg})
          }
        })
      },

      // 遍历把数组改成key、value的对象
      changeArrayToObject (array) {
        let vm = this
        array.forEach(item => {
          vm.organizationObject[item.value] = item
          if (item.children && item.children.length > 0) {
            vm.changeArrayToObject(item.children)
          }
        })
      },

      // 根据受理机构编号，查询上级机构
      getParentName (agencyId) {
        let vm = this
        if (vm.organizationObject[agencyId] && vm.organizationObject[agencyId].parentId) {
          let newOrgName = vm.organizationObject[agencyId] ? vm.organizationObject[agencyId].label : ''
          let oldOrgName = vm.resData.agencyName
          vm.resData.agencyName = oldOrgName ? `${newOrgName} ${oldOrgName}` : newOrgName
          vm.getParentName(vm.organizationObject[agencyId].parentId)
        }
      },

      // 下拉框选择
      onSelect(value, name) {
        let obj = this.$refs[value].getSelect();
        this.editForm[name] = obj.value;
      },

      // 所属机构选择后回调
      casSelected (selectedData) {
        // console.log('selectedData', selectedData)
        let len = selectedData.length
        let agencyName = ''
        selectedData.forEach(item => {
          agencyName += item.label
        })
        this.editForm.agencyId = len ? selectedData[len - 1].value : ''
        this.editForm.agencyName = len ? agencyName : ''
      },

      // 返回
      btnBack() {
        this.$router.go(-1)
        this.$store.commit('removeTag', 'custManagerView')
        this.$store.commit('closePage', 'custManagerView')
      },

    }
  }
</script>
<style>
    .custManger .ivu-form-item {
        margin-bottom: 0;
    }
    .custManger .ivu-table th {
        color: #1c2438;
        font-weight: 700;
    }
    .custManger .ivu-table th {
        background-color: #ffffff;
    }
    .custManger .ivu-table-header thead tr:nth-child(2) th {
        color: #333;
        font-weight: inherit;
    }
    .custManger .total {
        color: #1c2438;
        font-weight: 700;
        margin-bottom: 10px;
    }
</style>