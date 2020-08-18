<template>
    <Layout class="layout" >
        <Sider style="min-height: 450px; ">
            <template>
				<j-tree ref="dataTree" :data="dataTree" editable :showNewLevel='false' :showNewNextLevel='false' :remove-this-node="removeThisNode"
					:queryServer="queryServer"
					expend-key="id"
					@on-select-node="loadTable">
				</j-tree>
            </template>
        </Sider>
        <Layout>
	        <Content style="min-height: 100%; ">
				<template>
				    <Tabs ref="tabs" type="card" v-model="currentTabsName" @on-click="selectTab" @on-tab-remove="removeTab" closable>
				        <TabPane :ref="'tab' + tab" v-for="tab in tabs" :key="tab + new Date().getTime()" :label="labelData[tab]" :name="'T_' + tab" v-if="!showTabPane['T_' + tab]">
	        	        	<template >
								<Button type="primary" ref="columnButton" @click="changeColumnStyle(tab)"  style="margin-left: 10px">{{columnButtonData[tab]}}</Button>
								<Button type="primary" @click="query(1)">查询</Button>
								<Button type="primary" @click="openSetButtonModal">设置</Button>
								<Dropdown  @on-click="selectTableCallback($event, tab)" >
									<Button type="primary">
										关联表
										<Icon type="ios-arrow-down"></Icon>
									</Button>
									<DropdownMenu slot="list" >
										<DropdownItem  v-for="(item, index) in relationalTables[tab]" :key="index" :name="item">{{item}}</DropdownItem>
									</DropdownMenu>
								</Dropdown>
								<Button type="primary" @click="viewSql">查看SQL</Button>
								<!--<Button type="primary" @click="exportData()">导出</Button>-->
								<Button type="primary" @click="openSaveModal" :disabled="disableSave">保存</Button>
								<Button type="primary" @click="openSaveOtherModal">另存为</Button>
								<Button type="primary" @click="openViewModal">另存为视图</Button>
							</template>
					        <template v-if="!columnStyle[tab]">
							    <Table style="margin-top: 5px; overflow-x: auto; overflow-y: auto" :columns="columns[tab]" :data="data1[tab]" ref="exportTable" :highlight-row = "true" @on-row-click="selectCurrentRow"></Table>
								<Page :total="totalCount[tab]"
									  size="small"
									  show-sizer
									  @on-change="pageChange"
									  @on-page-size-change="pageSizeChange"
									  :page-size-opts="sizeOption"
									  :page-size="pageSize[tab]"
									  :current="currentPage[tab]"></Page>
							</template>
							<template v-if="columnStyle[tab]">
								<template style="margin-top: 5px;">
									<Page :total="columnStyleTotal[tab]" style="margin-top: 5px; "
										  :page-size="columnStylePageSize"
										  size="small" :current = 'columnNo[tab]'
										  @on-change="columnStylePageChange"></Page>
								</template>
								<!--	<Button type="primary" @click="showAll()">显示全部列</Button>-->
								<Table style="margin-top: 5px;" :columns="columnStyleColumns" :data="columnStyleData[tab]" ></Table>
								<template >
									<Page :total="totalCount[tab]"  style="margin-top: 5px; text-align: right;border: 1px dotted black;"
										  size="small"
										  show-sizer
										  @on-change="pageChange"
										  @on-page-size-change="pageSizeChange"
										  :page-size-opts="sizeOption"
										  :page-size="pageSize[tab]"
										  :current="currentPage[tab]"></Page>
								</template>
							</template>
				        </TabPane>
						<!--**********************************************设置按钮Modal********************************************************-->
						<main-set-page ref="mainSetPage"  :array2String="array2String" @closeSetModal="closeSetModal"></main-set-page>
				    </Tabs>
				</template>

				<!--********************查看SQLModal***********************-->
				<template>
					<Modal 	width="60%"
							  v-model="sqlModal"
							  title="查看SQL"
							  @on-ok="ok"
							  @on-cancel="cancel">
						<template>
							<p>{{sql}}</p>
						</template>
					</Modal>
				</template>

				<!--********************保存Modal***********************-->
				<template>
					<Modal 	width="40%" ref="saveModal"
							  v-model="saveModal"
							  title="保存"
							  @on-ok="save"
							  @on-cancel="cancel"
							  ok-text="保存">
						<Row>
							<Col span="5">
								查询名称
							</Col>
							<Col span="12">
								<Input v-model="queryName"  style="width: 300px"></Input>
							</Col>
						</Row>
						<Row style="margin-top: 10px;">
							<Col span="5">
								模式
							</Col>
							<Col span="12">
								<Select v-model="queryType" style="width:300px">
									<Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
								</Select>
							</Col>
						</Row>
					</Modal>
				</template>

				<!--********************另存为视图Modal***********************-->
				<template>
					<Modal 	width="40%"
							  v-model="viewModal"
							  title="另存为视图"
							  @on-ok="saveView"
							  @on-cancel="cancel"
							  ok-text="保存">
						<Form ref="viewForm" :model="viewForm" :rules="viewValidate" :label-width="80">
							<FormItem prop="tableCode">
								<Row>
									<Col span="5">
										视图名称
									</Col>
									<Col span="12">
										<Input v-model="tableCode"  style="width: 300px"></Input>
									</Col>
								</Row>
							</FormItem>

							<FormItem prop="tableName">
								<Row>
									<Col span="5">
										中文名
									</Col>
									<Col span="12">
										<Input v-model="tableName"  style="width: 300px"></Input>
									</Col>
								</Row>
							</FormItem>

							<FormItem prop="schema">
								<Row>
									<Col span="5">
										查询类型
									</Col>
									<Col span="12">
									<Select v-model="schema" style="width:300px">
										<Option v-for="item in schemaList" :value="item.value" :key="item.value">{{ item.name }}</Option>
									</Select>
									</Col>
								</Row>
							</FormItem>

							<FormItem prop="regionName">
								<Row>
									<Col span="5">
										数据区域
									</Col>
									<Col span="14">
										<Input v-model="regionName"  readonly = readonly></Input>
									</Col>
									<Col span="4">
										<Button type="ghost" shape="circle" size = "small" icon="ios-color-wand-outline" @click="openRegionModal"></Button>
									</Col>
								</Row>
							</FormItem>
						</Form>
						<Button type="error" size="small"  @click="checkTableCode">重复检测</Button>
					</Modal>
				</template>

				<!--********************数据区域Modal***********************-->
				<template>
					<Modal 	width="40%"
							  v-model="regionModal"
							  title="数据区域"
							  @on-ok="ok"
							  @on-cancel="cancelRegion"
							  ok-text="保存">
						<Row>
							<Tree :data="metaTree"
								  ref="regionTree"
								  @on-select-change="selectNode"></Tree>
						</Row>
					</Modal>
				</template>

			</Content>
        </Layout>

    </Layout>
</template>

<script>
    import Collapse from "iview/src/components/collapse/collapse";
    import MainSetPage from "./dataAnalysisSet/mainSetPage";
    export default {
        components: {Collapse,
				MainSetPage },
        name: "dataAnalysis",

        data() {
            return {
            	dataTree: [],
            	tabs: 0,
                labelData: {},
                treeNode: [],  //treeNode节点的数据
                regionId: '',  //地区的id
       			currentTabsName: '',
				script: {},
				metaQuery: {},
                columnStyle: {},//列模式 ，默认false
                columnButtonData: {}, //默认
				showTabPane: {}, //判断是否显示对应的tab页

                //关联表数据
                joinTables: {},
                masterTables : {},

				//存放查询的类型
				queryTypes: {},

				//关联表数据
				relationalTables: {},

				//关联表详情
                relationalTableDetails:{},

                //关联表类型
                relationalTableTypes:{},

                columnNo: {}, //行模式时设置当前表格的页码


				sql: '',//查询
                viewForm: {},

				/*保存*/
				queryName: '',
                queryType: '',
                cityList: [
                    {
                        value: 'PUBLIC',
                        label: '公有查询'
                    },
                    {
                        value: 'PRIVATE',
                        label: '私有查询'
                    },
                ],

				/*另存为视图*/
                tableCode: '',
				tableName: '',
                schemaList: [],
                schema: '',
                regionName: '',

                //jtree
                queryServer: this.$services.sysService.dataAnalysisRestController.queryTableTree,
                metaTree: [],

                regionQueryServer: this.$services.sysService.dataAnalysisRestController.queryTableTree,


                columns: {},//行模式列
				data1: {},//行模式数据
				result: {},//列模式字段
                columnStyleData: {},//列模式数据

                disableSave: false, //禁用保存按钮

				//用于记录table查询计数
				tableQueryCount: {},

				//用于记录query对应的数据， 通过该记录来判断对应的查询是否已经打开
				queryRecord: {},

				/*分页*/
                columnStyleTotal: {},//列模式数据总数
                columnStylePageSize: 10,//列模式每页条数
                totalCount: {},
                sizeOption: [5,10,15,20],
                pageSize: {},
                currentPage: {},
				currentRow:null,//当前列数据


                //查询的字段
                queryColumnsData: {},

                sqlModal: false,//sql查询
                saveModal: false,//保存
                viewModal: false,//视图
                regionModal: false,//数据区域
                defaultShowColumnCount: 5, //默认显示5列
				currentTabIndex: 0,//当前tab页的索引
                columnStyleColumns: [
                    {
                        title: '列编码',
                        key: 'code'
                    },
                    {
                        title: '列名',
                        key: 'name'
                    },
                    {
                        title: '值',
                        key: 'value'
                    },
                    {
                        title: '操作',
                        key: 'child'
                    }
                ],
				//另存为视图表单验证
                viewValidate: {
                    tableCode: [
                        { required: true, message: '必填项', trigger: 'blur' }
                    ],
                    tableName: [
                        { required: true, message: '必填项', trigger: 'blur' }
                    ],
                    schema: [
                        { required: true, message: '必选项', trigger: 'blur' }
                    ],
                    regionName: [
                        { required: true, message: '必选项', trigger: 'blur' }
                    ]
				},
				defaultShowCount: 6
            }
        },

        mounted(){
        },

        methods:{
            /*格式化数组字段和数据库对应*/
            formatColumns(cols){
                var newCols = [];
                cols.forEach(function(col, i){
                    var data = {
                        columnCode: col.code,
                        columnName: col.name,
                        columnType: col.type,
                        expr:       col.expr

                    };
                    newCols.push(data);
                });

                return newCols;
            },

            /* 比较两个数组，去掉第一个数组中的第二个数组中存在的对象 */
            arr_dive(aArr,bArr){
                if(bArr.length == 0)
                {
                    return aArr;
                }
                var result = [];
                aArr.forEach(function(a, aIndex){
                    var isHave = false;
                    bArr.forEach(function(b, bIndex){
                        if(a.expr == b.expr)
                        {
                            isHave = true;
                            bArr[bIndex] = a;
                        }
                    });
                    if(!isHave){
                        result.push(a);
                    }
                });
                return result;
			},

            loadTable(selectedList){
                let node = selectedList[selectedList.length - 1] // 获取当前点击的节点
                if(!node) return;
                /*点击的时候，如果没有展开其子节点，就展开其子节点*/
                if(!node.expand) {
                    this.$refs.dataTree.loadData(node, (response) => {
                        if (!response) return        // 没有子节点则返回
                        let array = []
                        response.forEach((item) => { // 遍历子节点，然后在各子节点上递归调用请求下一层后代
                            array.push(item)
                        })
                        node.children = array // 挂载子节点
                        node.expand = true    // 展开子节点树
                    })
                }
                let type = node.type;
                if(type == 'T' || type == 'V'){
                   this.loadRealTable(node, this.$services.sysService.metaQueryRestController.get, false);
                }
                else if( type == 'Q' || type == 'P'){
                    this.loadRealTable(node, this.$services.sysService.metaQueryRestController.edit, true);
				}

            },
			loadRealTable(node, server, isQuery){
                let tabKey = this.queryRecord[node.id];
                if(isQuery && tabKey){
                    if(this.showTabPane[tabKey]){
                        if(this.getTabCount() >= this.defaultShowCount){
                            this.$Message.info('你打开的tab页太多了，请关闭一些。');
                            return;
                        }
                        this.showTab(tabKey);
					}
					this.currentTabsName = tabKey;
                    this.selectTab(tabKey);
                }
				else{
                    if(this.getTabCount() >= this.defaultShowCount){
                        this.$Message.info('你打开的tab页太多了，请关闭一些。');
                        return;
                    }
                    this.tabs ++;
                    this.currentTabIndex = this.tabs;
                    this.currentRow = null;
                    this.queryTypes[this.tabs] = isQuery;
                    if(isQuery){
                        this.currentTabsName = 'T_' + this.tabs;
                        let title = node.parentName + '-('+(node.name) + ')';
                        this.labelData[this.tabs] = title;
                        this.queryRecord[node.id] = "T_" + this.tabs;
                    }
					else{
                        this.currentTabsName = 'T_' + this.tabs;
                        let number = this.getCurrentTableCount (node.name);
                        let title = node.name + '-查询' + number;
                        this.labelData[this.tabs] = title;
                    }
					this.$net.send({
						server: server,
						data: {regionTableId: node.id}
					}).then((data) => {
						/*设置当前数据的结果*/
						this.result[this.tabs] = data.result;

						/*设置当前的显示*/
						this.showData(data.result, this.tabs, false);
						this.pageSize[this.tabs] = 10;
						this.currentPage[this.tabs] = 1;

						//设置当前数据
						this.data1[this.tabs]  = JSON.parse(data.resultData);

						//设置当前查询
						this.metaQuery[this.tabs]  = data.metaQuery;

						//设置当前查询的脚本
						this.script[this.tabs]  = JSON.parse(data.metaQuery.script);

						//设置当前数量
						this.totalCount[this.tabs] = this.script[this.tabs].total;

						//设置列模式的数据
						this.queryColumnsData[this.tabs] = this.$options.methods.formatColumns(this.script[this.tabs].columns);

						// 设置当前模式为行模式
                        this.resetObject(this.columnButtonData, this.tabs, "行模式");
						this.columnStyle[this.tabs] = false;

						/*初始化关联数据*/
						this.joinTables[this.tabs] = data.joinTable;
						this.masterTables[this.tabs] = data.masterTable;

						/*设置关联表数据*/
						this.setRelationalTables(this.tabs, data.masterTable, data.joinTable)
						/*判断当前查询是否是自己保存， 如果是，保存按钮就能点击，  如果不是，保存按钮就不为禁用状态 */
                        let staff = this.getCurrentStaff();
                        /* 验证是不是自己创建的 */
                        if(this.metaQuery[this.tabs].staffCode != staff.staffCode && isQuery)
                        {
                           this.disableSave = true;
                        }
                        else{
                            this.disableSave = false;
						}

					});
                }
			},
			showAll(){
                this.showData(this.result[this.currentTabIndex], true);
			},
			showData(data, tab, showAll){
                let count = data.columns.length;
                let width = 0;
                this.columns[tab] = [];
                if(count > 5){
                    width = 150;
				}
                for(var i = 0; i < count ; i ++) {
                    var column = {
                        key: data.columns[i].columnCode,
                        title: data.columns[i].displayName,
						width: width
                    };
                    this.columns[tab].push(column);
                }
			},

			array2String(array, prop){
                let str = '';
                if(array && array instanceof Array && array.length > 0){
                    array.forEach((v, i) =>{
                        if(prop){
                            if(str == ''){
                                str = v[prop];
							}
							else {
                                str += "," + v[prop];
							}

						}
						else{
                            if(str == ''){
                                str = v;
                            }
                            else{
                                str += "," + v;
							}
						}
					})
					return str;
                }
                else{
			        return str;
				}
            },

			/*列模式*/
            changeColumnStyle(tab){
                this.resetObject(this.columnStyle, tab, !this.columnStyle[tab]);
                this.setSolumnStyleData(tab);
			},

            columnStylePageChange(current){
                /*组装列模式数据*/
                let dt = [];
                let colData = [];
                let obj = this.data1[this.currentTabIndex][current-1];
                this.currentRow = obj;
                for (i in obj){
                    dt.push(obj[i]);
                }
                let c = this.result[this.currentTabIndex].columns.length;
                for(var i = 0; i < c ; i ++)
                {
                    let column = {
                        code: this.result[this.currentTabIndex].columns[i].columnCode,
                        name: this.result[this.currentTabIndex].columns[i].columnName,
                        value: dt[i],
                        child: this.result[this.currentTabIndex].columns[i].columnType
                    };
                    colData.push(column);
                }
                this.$set(this.columnStyleData, this.currentTabIndex, colData);
                this.resetObject(this.columnNo, this.currentTabIndex, current);
			},
            query(pageNo){
                this.currentPage[this.currentTabIndex] = pageNo;
                this.script[this.currentTabIndex].limit = this.pageSize[this.currentTabIndex];
                this.script[this.currentTabIndex].pageNo = pageNo;
                this.columnNo[this.currentTabIndex] = 1;
                this.$net.send({
                    server: this.$services.sysService.metaQueryRestController.queryResult,
                    data: {'script' : JSON.stringify(this.script[this.currentTabIndex])}
                }).then((data) => {
					//设置行模式显示数据
                    this.resetObject(this.data1, this.currentTabIndex, JSON.parse(data.resultData));
                    //设置行模式显示数量
                    this.resetObject(this.totalCount, this.currentTabIndex, JSON.parse(data.query.script).total);

                    //设置当前查询
                     this.metaQuery[this.currentTabIndex].script  = data.query.script;
                    //设置当前查询的脚本
                    this.script[this.currentTabIndex]  = JSON.parse(data.query.script);
                    //设置数据结构
                    this.result[this.currentTabIndex] = data.result;

                    /*获取当前查询一共存在几列，如果超过5列，就设置每列宽度*/
                    let count = data.result.columns.length;
                    let width = 0;
                    if(count > 5){
                        width = 150;
                    }
					let col = []; //用于组装表头
                    for(var i = 0; i < count ; i ++) {
                        var column = {
                            key: data.result.columns[i].columnCode,
                            title: data.result.columns[i].displayName,
                            width: width
                        };
                        col.push(column);
                    }
                    this.resetObject(this.columns, this.currentTabIndex, col);
                    if(this.columnStyle[this.currentTabIndex]) {
                        this.setSolumnStyleData(this.currentTabIndex, 1);
                    }
                });
			},

            pageChange(current){
                this.query(current);
			},
            pageSizeChange(p){
                this.pageSize[this.currentTabIndex] = p;
                this.query(1);
			},
			/*查看sql*/
            viewSql(){
                this.sqlModal = true;
				console.log(this.result[this.currentTabIndex].sql)
				let sql = this.result[this.currentTabIndex].sql;
                sql = encodeURI(encodeURI(sql))
                this.$net.send({
                    server: this.$services.sysService.dataAnalysisRestController.viewSql,
                    data: {querySql:sql }
                }).then((data) => {
                    console.log(data)
					this.sql =  data.sql;

                });
			},
			/*导出*/
            exportData () {
                this.$refs.exportTable.exportCsv({
                    filename: 'The original data'
                });
            },
			/*打开保存Modal*/
			openSaveModal(){
			    if(this.queryTypes[this.currentTabIndex]){

                    /* 验证公共查询只能自己才能保存 */
                    if(this.metaQuery[this.currentTabIndex].queryType == 'PUBLIC')
                    {
                        let staff = this.getCurrentStaff();
                        /* 验证是不是自己创建的 */
                        if(this.metaQuery[this.currentTabIndex].staffCode != staff.staffCode)
                        {
                            this.$Message.info('只能保存自己创建的查询。');
                            return;
                        }
                    }
                    /*queryId存在，直接保存*/
                    let data = {
                        queryId: this.metaQuery[this.currentTabIndex].queryId,
                        script: JSON.stringify(this.script[this.currentTabIndex])
                    };

                    this.$net.send({
						server : this.$services.sysService.metaQueryRestController.save,
						data
					}).then((data) =>{
                        this.$Message.info(data.msg);
					});
				}
				else {
                    this.openSaveOtherModal();
                }
			},

			/*打开另存为Modal*/
			openSaveOtherModal(){
                this.saveModal = true;
			},
			/*保存*/
			save(){
			    if(this.queryName && this.queryType){
					let data = {
						/*queryId: '',*/
						tableId: this.metaQuery[this.currentTabIndex].tableId,
						queryName: this.queryName,
						queryType: this.queryType,
						script: JSON.stringify(this.script[this.currentTabIndex])
					};
					let $this = this;
					this.$net.send({
						server: this.$services.sysService.metaQueryRestController.save,
						data: data
					}).then((data) => {
						this.$Message.info(data.msg);
						if(data.success){
							let type = this.queryType == 'PUBLIC' ? 'P' : 'Q';
							let treeData = $this.$refs.dataTree.getTree();
                            let  parent = $this.$refs.dataTree.getNode(treeData, this.metaQuery[this.currentTabIndex].tableId);
                            let node = {
                                id : data.queryId,
                                title : this.queryName,
                                name: this.queryName,
                                pid :  this.metaQuery[this.currentTabIndex].tableId,
                                parentName: parent.title,
                                selected : false,
                                isParent : false,
                                expand: false,
                                type
                            };
                            if(parent.children){
								parent.children.push(node);
							}
							else {
								parent.children = [node];
							}

                            /*关闭原来的查询菜单*/
                            let tabKey = "T_" + this.currentTabIndex;
                            this.removeTab(tabKey);

                            /*打开对应的子菜单*/
                            this.loadRealTable(node, this.$services.sysService.metaQueryRestController.edit, true);
						}
					});
			    }
			    else{
			        this.$Message.info('请填写查询名称或者选择查询类型。');
                    this.$refs.saveModal.visible = true;
                    this.saveModal = true;
				}
			},
			//视图
            openViewModal(){
			    this.viewModal = true;
                this.$net.send({
                    server: this.$services.sysService.metaTableRestController.querySchema,
                }).then((data) => {
					this.schemaList = data ;
                });
			},
			//数据区域
            openRegionModal(){
				this.regionModal = true;
                this.$net.send({
                    server: this.$services.sysService.dataAnalysisRestController.queryTableTree,
                }).then((data) => {
                    console.log(data)
                    this.metaTree = data ;
                });
				console.log(this.metaTree)
			},
			//取消选择，清空数据
            cancelRegion(){
			    this.regionName = '';
			},
			//选择数据区域
            selectNode(selectedList){
                let node  = selectedList[selectedList.length - 1] // 获取当前点击的节点
				this.regionName = node.name;
			    this.regionId = node.id;
			},

            saveView(){
                let dataView = {
                    script: this.metaQuery.script,
                    tableCode: this.tableCode,
                    tableName: this.tableName,
                    schema: this.schema,
                    regionId: this.regionId
                };
                this.$net.send({
                    server: this.$services.sysService.dataAnalysisRestController.checkViewName,
                    data: {tableCode: this.tableCode,schema: this.schema,}
                }).then((data) => {
                    console.log(data)
                    if(data.success) {
                        if (data.tableExists) {
                            this.$Message.info( '视图已存在。');
                            return false;
                        }
                        else {
                            this.$net.send({
                                server: this.$services.sysService.metaQueryRestController.saveView,
                                data: dataView
                            }).then((data) => {
                                console.log(data)
                                this.$Message.info(data.msg);
                            });
                        }
                    }
                });
			},
            checkTableCode(){
                this.$net.send({
                    server: this.$services.sysService.dataAnalysisRestController.checkViewName,
                    data: {tableCode: this.tableCode,schema: this.schema,}
                }).then((data) => {
                    if(data.success)
                    {
                        if(data.tableExists)
                        {
                            this.$Message.info( '视图已存在。');
                            return false;
                        }
                        else
                        {
                            this.$Message.info('视图名称可以使用。');
                            return true;
                        }
                    }
				});
			},
            selectTab(name){
			    if(name){
                    this.currentTabIndex = parseInt(name.replace('T_', ''));
                    this.currentRow = null;
                    // this.setSolumnStyleData();
				}
			},
			setSolumnStyleData(tab, currentPage){
			    if(currentPage){
                    this.columnNo[tab] = 1;
				}
				else if(!this.columnNo[tab]){
                    this.columnNo[tab] = 1;
                }
                /*组装列模式数据*/
                let dt = [];
				let  col = [];
                let obj = this.data1[tab][0];
                for (i in obj){
                    dt.push(obj[i]);
                }
                let c = this.result[tab].columns.length;
                this.columnStyleTotal[tab] = c * this.data1[tab].length;
                this.columnStylePageSize = c;
                for(var i = 0; i < c ; i ++)
                {
                    let column = {
                        code: this.result[tab].columns[i].columnCode,
                        name: this.result[tab].columns[i].columnName,
                        value: dt[i],
                        child: this.result[tab].columns[i].columnType
                    };
                    col.push(column);
                }
                this.resetObject(this.columnStyleData, this.currentTabIndex, col);

                if(this.columnStyle[tab]){
                    this.resetObject(this.columnButtonData, tab, "行模式");
                    this.currentRow = this.data1[tab][0];
                }
                if(!this.columnStyle[tab]){
                    this.resetObject(this.columnButtonData, tab, "列模式");
                }
			},

            removeTab(name){
                this.resetObject(this.showTabPane, name, true);
			},

            showTab(name){
                this.resetObject(this.showTabPane, name, false);
            },

			/*获取当前打开的tab页个数*/
			getTabCount(){
			    let tabCount = 0;
				return $(this.$refs.tabs.$el).find('.ivu-tabs-tab').length;
			},
			resetObject(target, key, value){
                this.$delete(target, key);
                this.$set(target, key, value);
			},
			ok(){

			},
			cancel(){

			},
			removeThisNode(node, parent){
			    if(node.type == 'Q' || node.type == 'P'){
                    this.$net.send({
                        server: this.$services.sysService.metaQueryRestController.verify,
                        data: node.id
                    }).then( (data)=>{
                        if (data.success) {
                            this.$Modal.confirm({title : '提示',
								content: '确认删除该查询吗？',
								onOk: ()=> {
									this.$net.send({
										server: this.$services.sysService.metaQueryRestController.remove,
										append: node.id
									}).then(data => {
									    if(data.success){
                                            if (parent)
                                            {
                                                const index = parent.children.indexOf(node);
                                                parent.children.splice(index, 1);
                                            }
                                            else
                                            {
                                                this.dataTree.splice(node.nodeKey, 1);
                                            }

                                            this.$refs.dataTree.clearSelection();
                                            //并关闭对应的查询操作
                                            let tabKey = this.queryRecord[node.id];
                                            this.removeTab(tabKey);
                                            //删除后，默认选中第一个TAB页
                                            this.currentTabsName = 'T_1';
                                            this.currentTabIndex = 1;
                                            this.currentRow = null;
										}
                                        this.$Message.success({duration: 5, content: data.msg});
									});
								}
                            });
                        } else {
                            this.$Message.error({duration: 5, content: data.msg});
                        }
                    });
				}
				else{
			        this.$Message.info('只能删除查询，请重新选择。');
				}
			},

			//获取当前table查询的计数值
            getCurrentTableCount (tableCode){
			    this.tableQueryCount[tableCode] = this.tableQueryCount[tableCode] ? this.tableQueryCount[tableCode] + 1 : 1;
			    return this.tableQueryCount[tableCode];
            },

			// 获取当前登录用户
			getCurrentStaff(){
			    let staffString = localStorage.getItem('user');
			    return staffString ? JSON.parse(staffString) : {};
			},

			//打开设置页面对话框
            openSetButtonModal(){
                this.$refs.mainSetPage.openSetModal(this.script[this.currentTabIndex]);
            },
			//关闭对应的对话框
            closeSetModal(isCancel, data){
				if(!isCancel){
                    this.script[this.currentTabIndex] = data;
                    this.query(1);
				}
			},

			setRelationalTables(index, masterTables, joinTables){
                this.relationalTables[index] = [];
                this.relationalTableDetails[index] = {};
                this.relationalTableTypes[index] = {};
                if(masterTables.length == 0 && joinTables.length == 0) {
                    this.relationalTables[index].push('无');
                    this.relationalTableDetails[index]['无'] = null;
				}
				else{
                    masterTables.forEach((v, i) =>{
                        let title = v.masterTableCode;

                        /* 判断关联是否存在中文名 */
                        if(v.masterTableName && v.masterTableName != '')
                        {
                            title = v.masterTableName;
                        }

                        /* 截取12个字符，以前过长显示不下 */
                        let _title = '(主)' + title  + '(' + v.masterColumnCode + ')' ;
                        this.relationalTables[index].push(_title);
                        this.relationalTableDetails[index][_title] = v;
                        this.relationalTableTypes[index][_title] = 'JOIN'
					});

                    joinTables.forEach((v, i) =>{
                        let title = v.joinTableCode;

                        /* 判断关联是否存在中文名 */
                        if(v.joinTableName && v.joinTableName != '')
                        {
                            title = v.joinTableName;
                        }

                        /* 截取12个字符，以前过长显示不下 */
                        let _title = '(子)' + title  + '(' + v.joinColumnCode + ')' ;
                        this.relationalTables[index].push(_title);
                        this.relationalTableDetails[index][_title] = v;
                        this.relationalTableTypes[index][_title] = 'MASTER'
                    })
				}

			},

            selectCurrentRow(row){
			    this.currentRow = row;
			},

            /*选择关联表回调函数*/
			selectTableCallback(tabNo, title){
				if(!this.relationalTableDetails[title][tabNo]){
				    return;
				}
				if(!this.currentRow){
				    this.$Message.info('当前没有选中要查询的关联数据，请选择一条数据。');
				    return;
				}
                if(this.getTabCount() >= this.defaultShowCount){
                    this.$Message.info('你打开的tab页太多了，请关闭一些。');
                    return;
                }
                this.tabs ++;
                this.currentTabIndex = this.tabs;
                this.queryTypes[this.tabs] = false;
				this.currentTabsName = 'T_' + this.tabs;
				let name = this.relationalTableDetails[title][tabNo].masterTableName + '(' + this.relationalTableDetails[title][tabNo].masterTableCode + ')';
				if(this.relationalTableTypes[title][tabNo] == 'MASTER'){
                    name = this.relationalTableDetails[title][tabNo].joinTableName + '(' + this.relationalTableDetails[title][tabNo].joinTableCode + ')';
				}

				let number = this.getCurrentTableCount (name);
				this.labelData[this.tabs] =name + '-查询' + number;

				let params = {
                    masterTableId : this.relationalTableDetails[title][tabNo].regionTableId,
                    masterColumnCode : this.relationalTableDetails[title][tabNo].masterColumnCode,
                    joinTableId : this.metaQuery[title]['tableId'],
                    joinColumnCode: this.relationalTableDetails[title][tabNo].joinColumnCode,
                    data : JSON.stringify(this.currentRow),
                    relationType : this.relationalTableTypes[title][tabNo],
				};
				this.$net.send({
					server: this.$services.sysService.metaQueryRestController.queryChild,
					data: params
				}).then(data=>{
					/*清空当前选择行*/
                    this.currentRow = null;
                    /*设置当前数据的结果*/
                    this.result[this.tabs] = data.result;

                    /*设置当前的显示*/
                    this.showData(data.result, this.tabs, false);
                    this.pageSize[this.tabs] = 10;
                    this.currentPage[this.tabs] = 1;

                    //设置当前数据
                    this.data1[this.tabs]  = JSON.parse(data.resultData);

                    //设置当前查询
                    this.metaQuery[this.tabs]  = data.query;

                    //设置当前查询的脚本
                    this.script[this.tabs]  = JSON.parse(data.query.script);

                    //设置当前数量
                    this.totalCount[this.tabs] = this.script[this.tabs].total;

                    //设置列模式的数据
                    this.queryColumnsData[this.tabs] = this.$options.methods.formatColumns(this.script[this.tabs].columns);

                    // 设置当前模式为行模式
                    this.resetObject(this.columnButtonData, this.tabs, "行模式");
                    this.columnStyle[this.tabs] = false;

                    /*初始化关联数据*/
                    this.joinTables[this.tabs] = data.joinTable;
                    this.masterTables[this.tabs] = data.masterTable;

                    /*设置关联表数据*/
                    this.setRelationalTables(this.tabs, data.masterTable, data.joinTable)
                    // /*判断当前查询是否是自己保存， 如果是，保存按钮就能点击，  如果不是，保存按钮就不为禁用状态 */
                    this.disableSave = false;
				})

			}

        }
    }
</script>

<style scoped>
    .layout{
        background-color: #fff;
        padding: 10px;
    }
    .ivu-layout-sider{
        background-color: #fff;
    }
</style>