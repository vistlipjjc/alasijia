<template>
  <Row>
      <Input v-model="staffNames" @on-focus="open" icon="ios-search" :disabled="disabled" :placeholder="placeholder"></Input>
      <Modal v-model="visible" title="选择用户" @on-ok="ok" @on-cancel="cancel" :mask-closable="false" width="700" :transfer="staffTransfer">
        <Row style="height: 300px;">
          <Col span="6">
            <Tree :data="treeNode" @on-select-change="getNode" style="height: 300px; overflow: auto;"></Tree>
          </Col>
          <Col span="17" offset="1">
            <Table v-if="multiple" ref="multipleTable" border
                   @on-select-all="selectionRow" @on-selection-change="selectionRow"
                   :columns="columnsMultiPle" :data="staffData" height="280" size="small"></Table>
            <Table v-else border highlight-row @on-row-click="selectSingleRow" :columns="columns" :data="staffData" height="280" size="small"></Table>
            <Page v-show="showPagination" style="margin-top: 5px; padding-left: 220px;"
                  :total="total" :current="currentPage"
                  :page-size="pageSize" placement="top"
                  @on-page-size-change="pageSizeChange" @on-change="changePage"
                  show-sizer show-total size="small"></Page>
          </Col>
        </Row>
      </Modal>
  </Row>

</template>

<script>
  export default {
    name: 'jStaff',
      props:{
        value: [String, Number, Array], //数据
        placeholder: String,  //默认提示文字
        multiple: {
        type: Boolean,
        default: false
        },
      staffTransfer: { //是否将弹层放置于 body 内
          type: Boolean,
          default: true
      },
          disabled: {
              type: Boolean,
              default: false
          }
      },
    data () {
      return {
        staff:'',
        staffNames: this.value,
        visible: false,
        treeNode: [],
        columns: [
          {title: '用户编码', key: 'staffCode'},
          {title: '用户名称', key: 'staffName'}
        ],
        columnsMultiPle: [
            {type: 'selection', width: 60},
            {title: '用户编码', key: 'staffCode'},
            {title: '用户名称', key: 'staffName'}
        ],
        staffData: [],
        total: 0,
        currentPage: 1,
        pageSize: 10,
        deptCode: '',
        selection: []
      }
    },
      computed: {
          showPagination(){
              return !this.multiple && this.total > 0;
          }
      },
    methods: {
        open(){
            this.visible = true;

            // 打开 lookup 时加载机构树, 并展开第一个根节点且选中
            if(this.treeNode.length == 0)
            {
                this.$net.send({
                    server: this.$services.sysService.unitRestController.load
                }).then((data)=>{
                    if (data.length > 0) {
                        data[0].expand = true;
                        data[0].selected = true;
                        this.deptCode = data[0].id;
                        this.queryStaff()
                    }
                    this.treeNode = data;
                });
            }
        },
        ok () {
            this.$emit('on-select', this.staff); //多选有效
        },
        cancel () {
            this.clearTable();
            this.staff = '';
            this.staffNames = '';
            //刷新树
            this.$net.send({
                server: this.$services.sysService.unitRestController.load
            }).then((data)=>{
                if (data.length > 0) {
                    data[0].expand = true;
                    data[0].selected = true;
                  this.deptCode = data[0].id;
                  this.queryStaff()
                }
                this.treeNode = data;
            });
            this.$emit('on-select', {staffName: '', staffCode: ''});
        },
        getNode(node){
            if (node.length == 1)
            {
                this.deptCode = node[0].id;
                this.pageSize = this.multiple ? 10 : 999999;
                this.currentPage = 1;
                this.queryStaff();
            }
            else
            {
                this.clearTable();
            }
        },
        clearTable (){
            this.deptCode = '';
            this.staffData = [];
            this.total = 0;
        },
        queryStaff(){
            /*加载对应的用户*/
          let params = {}
            
            /*if (this.deptCode === '04') {
              params = {__EQS_unitCode: this.deptCode}
            } else {
              params = {__LIKES_deptCode: 'user_'}
            }*/
            params = {__EQS_unitCode: this.deptCode}
            let pageConfig = this.multiple ? {
                pageSize: 999999,
                pageNumber: this.currentPage
            } : {
                pageSize: this.pageSize,
                pageNumber: this.currentPage
            };

            this.$net.send({
                server: this.$services.sysService.staffRestController.query,
                data: {
                    ...params,
                    ...pageConfig
                }
            }).then((data)=>{
                this.staffData = data.rows;
                this.total = data.total;
            });
        },
        // 改变每页条数
        pageSizeChange(val) {
            this.pageSize = val;
            this.queryStaff();
        },
        changePage(val){
            this.currentPage = val;
            this.queryStaff();
        },
        selectSingleRow(row, index){
            this.staffNames = row.staffName; //显示到输入框中
            this.staff = { // 组装返回的 staff 对象
                staffCode: row.staffCode,
                staffName: row.staffName
            };
        },
        selectionRow(selection){
            this.selection = selection;
            let nameTmp = [], codeTmp = [];
            this.selection.forEach(item => {
                nameTmp.push(item.staffName);
                codeTmp.push(item.staffCode);
            });
            this.staffNames = nameTmp.join(','); //显示到输入框中
            this.staff = { // 组装返回的 staff 对象
                staffName: this.staffNames,
                staffCode: codeTmp.join(',')
            };
        }
    },
    watch: {
      value(val){
          this.staffNames = val;
      }
    }
  }
</script>
