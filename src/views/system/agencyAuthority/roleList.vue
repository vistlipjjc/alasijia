<template>
    <div class="roleListBox">
        <Card>
            <p slot="title">角色管理</p>
            <j-table ref="roleTable" pagination autoSearch
                     :queryForm.sync="queryForm"
                     :server="server.query"
                     :columns-list="columns"
                     :input-col="6"
                     :autoCache="true"
                     :showAdd="true"
                     v-model="roleTable"
                     @on-row-click="rowClick"
                     @add-btn="$router.push({path: '/roleEdit/add'})"
                     @on-view="viewDetails"
                     @on-edit="editDetails"
                     @on-delete="remove">
                <template slot="input">
                  <Row>
                    <FormItem label="角色编码" prop="__LIKES_roleCode">
                        <Input v-model="queryForm.__LIKES_roleCode" placeholder="角色编码"></Input>
                    </FormItem>
                    <FormItem label="角色名称" prop="__LIKES_roleName">
                        <Input v-model="queryForm.__LIKES_roleName" placeholder="角色名称"></Input>
                    </FormItem>
                  </Row>
                </template>
            </j-table>

             <!-- 目前用不到角色组，先隐藏 -->
            <!-- <j-table ref="staffTable" pagination hiddenForm
                     :server="server.queryStaff"
                     :default-params="indexCode"
                     :showQuery="false"
                     :showReset="false"
                     :columns-list="columnsR" v-model="staffTable">
            </j-table> -->
        </Card>
    </div>
</template>

<script>
  export default {
    data() {
      return {
        server: {
          query: this.$services.sysService.roleRestController.query,
          queryStaff: this.$services.sysService.roleRestController.queryRoleStaff,
        },
        queryForm: {
          __LIKES_roleCode: '',
          __LIKES_roleName: '',
          __EQS_delflag: 'N'
        },
        roleTable: [],
        columns: [
          { type: 'index', title: '序号', align: 'center', width: 80 },
          { title: '角色编码', align: 'center', key: 'roleCode' },
          { title: '角色名称', align: 'center', key: 'roleName' },
          { title: '角色描述', align: 'center', key: 'roleDesc' },
          /* { title: '角色类型', align: 'center', key: 'roleStdCode', formatter: 'custom:roleStd/queryAll@system'}, */
          { title: '状态', align: 'center', key: 'status', formatter: 'fixedDict:RoleStatus@system'},
          { title: '操作', align: 'center', key: 'action', width: 120, handler: [
            {action: 'edit'},
            {action: 'view'},
            {action: 'delete'}
          ]
          }],
        staffTable: [],
        columnsR: [
          { type: 'index', align: 'center', width: 80 },
          { title: '部门', align: 'center', key: 'unitName' },
          { title: '用户账号', align: 'center', key: 'staffCode' },
          { title: '用户名称', align: 'center', key: 'staffName' },

        ],
        indexCode: {}
      }
    },
    methods:{
      rowClick(row, index){
        this.indexCode = {__EQS_roleCode: row.roleCode};
      },

      // 编辑页面
      editDetails (row) {
        this.$router.push({
          path: '/roleEdit/edit',
          query: {
            roleCode: row.roleCode
          }
        })
      },

      // 查看页面
      viewDetails (row) {
        this.$router.push({
          path: '/roleView',
          query: {
            roleCode: row.roleCode
          }
        })
      },

      // 删除角色
      remove(data){
        this.$net.send({
          server: this.$services.sysService.roleRestController.remove,
          append: data.roleCode
        }).then((data) => {
          if (data.success) {
            this.$Message.success(data.msg);
            this.$refs.roleTable.refresh();
          } else {
            this.$Message.error(data.msg);
          }
        });
      }
    }
  }
</script>