<template>
    <Layout class="staffListBox">
        <Sider width="230">
            <Tree :data="unitTree" @on-select-change="clickNode" style="max-height: 500px; overflow-y: auto;"></Tree>
        </Sider>
        <Content>
            <Card>
                <j-table ref="staffTable" pagination autoSearch
                         :queryForm.sync="queryForm" :jtotal="total"
                         :server="server.query"
                         :default-params="unitCodeParam"
                         :columns-list="columns" v-model="tableData"
                         :inputCol="5"
                         :autoCache="true"
                         @on-row-click="rowClick"
                         @on-view="viewDetails"
                         @on-edit="editDetails"
                         @on-delete="remove"
                         @resetPassword="resetPassword">
                    <template slot="input">
                        <Col span="6">
                           <FormItem label="用户账号" prop="__LIKES_staffCode" style="width: 100%;">
                               <Input v-model="queryForm.__LIKES_staffCode"></Input>
                           </FormItem>
                       </Col>
                       <Col span="6">
                           <FormItem label="用户名称" prop="__LIKES_staffName" style="width: 100%;">
                               <Input v-model="queryForm.__LIKES_staffName"></Input>
                           </FormItem>
                       </Col>
                    </template>
                    <template slot="toolbar" v-if="unitCodeParam.unitCode">
                        <Button type="primary" icon="plus-round" @click="add">新增</Button>
                        <!--<Button type="ghost" @click="staffSetRole">设定角色</Button>-->
                        <!-- <Button type="ghost" @click="staffSetRoleGroup">设定角色组</Button>
                        <Button type="ghost" @click="staffSetGroup">加入用户组</Button>
                        <Button type="ghost"  @click="staffProxyLogList">借调</Button> -->
                    </template>
                </j-table>
            </Card>
        </Content>
    </Layout>
</template>

<script>
  export default {
    name: "staffRest",
    data() {
      return {
        unitTree: [],
        server: {
          query: this.$services.sysService.staffRestController.queryByUnitCode
        },

        total: 0,
        queryForm: {
          __LIKES_staffCode: '',
          __LIKES_staffName: ''
        },
        tableData: [],
        columns: [
          {title: '序号', type: 'index', align: 'center', width: 65},
          {title: '用户账号', align: 'center', key: 'staffCode', width: 95},
          {title: '用户名称', align: 'center', key: 'staffName', width: 90},
          {title: '角色名称', align: 'center', key: 'roleName', ellipsis: false},
          // {title: '用户组', align: 'center', key: 'staffGroupName'},
          {title: '移动电话', align: 'center', key: 'mobile', width: 115},
          {title: '状态', align: 'center', key: 'status', width: 63,formatter: 'fixedDict:StaffStatus@system'},
          // {title: '借调', align: 'center', key: 'isProxy', width: 64,formatter: 'fixedDict:YesNo@system'},
          {title: '操作', align: 'center', key: 'action', width: 160, handler: [
            {action: 'edit'},
            {action: 'view'},
            {action: 'otherskip', icon: 'trash-a', content: '删除', envent:'on-delete'},
            {action: 'otherskip', icon: 'ios-unlocked', content: '重置密码', envent:'resetPassword'}
          ]
          }],
        staffCode: '',
        unitCodeParam:{},
        unitCode: '',
        unitName: '',
        staffGroupCode: ''
      }
    },

    mounted() {
      this.init()
    },
    methods: {
      init() {
        this.$net.send({
          server: this.$services.sysService.staffRestController.load
        }).then(
          (data) => {
            this.unitTree = data
          });
      },

      rowClick(row, index){
        //  this.staffParam = {__EQS_staffCode: row.staffCode};
        this.staffCode = row.staffCode;
        this.staffGroupCode = row.staffGroupCode;
        this.selectedRow = row;
        // console.log(row)
        this.unitCode = row.deptCode || this.unitCode;
      },

      clickNode(data) {
        this.queryForm = {
          __LIKES_staffCode: '',
          __LIKES_staffName: ''
        };
        if (data.length > 0)
        {
          this.dept = data[0];
          this.unitCode = this.dept.id;
          this.unitName = this.dept.title;
          this.unitCodeParam = {unitCode: this.dept.id};
        }else {
          this.unitCodeParam = {unitCode: ''};
        }

        // 发起请求
        this.$net.send({
          server: this.server.query,
          data: this.unitCodeParam
        }).then(
          (data) => {
            this.tableData = data.rows;
            this.total = data.total;
            if (this.tableData[0]) {
              this.tableData[0]._highlight = true;
            }
          });
      },

      // 跳转编辑页面
      editDetails (row) {
        this.$router.push({
          path: '/staffEdit/edit',
          query: {
            staffCode: row.staffCode
          }
        })
      },

      // 跳转查看页面
      viewDetails (row) {
        this.$router.push({
          path: '/staffView',
          query: {
            staffCode: row.staffCode
          }
        })
      },

      // 删除用户
      remove(data, index) {
        let vm = this

        if (data.staffCode === 'jepAdmin') {
          vm.$Message.warning('不能删除超级管理员的账号')
          return false
        }

        vm.$Modal.confirm({
          title: '提示',
          content: '您确定要删除这条数据吗?',
          onOk: () => {
            vm.$net.send({
              server: vm.$services.sysService.staffRestController.remove,
              append: data.staffCode
            }).then((data) => {
              if (data.success) {
                vm.$Message.success(data.msg);
                vm.$refs.staffTable.refresh();
              } else {
                vm.$Message.error(data.msg);
              }
            });
          }
        })
      },
      //新增
      add(){
        this.$net.send({
          server: this.$services.sysService.unitRestController.isOrg,
          append: this.unitCode
        }).then(
          (data) => {
            this.$router.push({path: '/staffEdit/add',query:{unitCode: this.unitCode,unitName: this.unitName}})
          });

      },
      //设置角色
      staffSetRole(){
        if(this.staffCode){

          this.$router.push({path: '/staffSetRole',query:{unitCode: this.unitCode,staffCode: this.staffCode}})
        }else{
          this.$Message.warning('请选择一个用户');
        }
      },

      // 重置密码
      resetPassword (item) {
        let vm = this
        vm.$Modal.confirm({
          title: '提示',
          content: '是否确定执行重置密码操作？',
          onOk: () => {
            vm.$net.send({
              server: vm.$services.sysService.userRestController.resetPass,
              data: [item.staffCode]
            }).then((data) => {
              if (data.success) {
                vm.$Message.success('重置密码成功，密码默认为123456，用户可自行登录修改')
              } else {
                vm.$Message.error(data.message)
              }
            })
          }
        });
      }

      /* //设置角色组
      staffSetRoleGroup(){
          if(this.staffCode){
              this.$router.push({path: '/staffSetRoleGroup', query:{staffCode: this.staffCode,unitCode: this.unitCode}})
          }else{
              this.$Message.warning('请选择一个用户');
          }
      },
      //添加用户组
      staffSetGroup(){
          if(this.staffCode){
              this.$router.push({path: '/staffSetGroup', query:{staffCode: this.staffCode}});
          }else{
              this.$Message.warning('请选择一个用户');
          }
      },
      //借调列表
      staffProxyLogList(){
          if(this.staffCode){
              this.$router.push({path: '/staffProxyLogList', query:{staffCode: this.staffCode}});
          }else{
              this.$Message.warning('请选择一个用户');
          }
      } */
    }
  }
</script>

<style>
    .staffListBox {
        background-color: #fff;
        padding: 10px;
    }
    .staffListBox .ivu-layout-sider {
        background-color: #fff;
    }
    .staffListBox .j-table-form {
        overflow: hidden;
    }
    .staffListBox .j-table-form .ivu-form-item-content {
        margin-left: 80px !important;
    }
    .staffListBox .j-table-form .ivu-form-item-label {
        width: 80px !important;
    }
</style>