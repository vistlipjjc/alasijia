<template>
    <Layout class="layout">
        <Sider>
            <j-tree ref="authRegionTree"  editable
                    :data="regionDataTree"
                    :query-server = "queryTree"
                    :form-item="formItem"
                    :remove-server="removeServer"
                    @on-select-node="selectNode">
            </j-tree>
        </Sider>
        <Content>
            <Card style="margin-left: 5%">
                <Row>
                    <Form ref="metaRegionForm" :model="metaRegion" :rules="metaRegionRules" :label-width="180">
                        <Col span="20">
                            <FormItem label="父菜单名称" prop="name">
                                <Input v-model="metaRegion.parentName" disabled />
                            </FormItem>
                        </Col>
                        <Col span="20">
                            <FormItem label="区域编码" prop="regionCode">
                                <Input v-model="metaRegion.regionCode"  />
                            </FormItem>
                        </Col>
                        <Col span="20">
                            <FormItem label="区域名称" prop="regionName" >
                                <Input v-model="metaRegion.regionName" />
                            </FormItem>
                        </Col>
                        <Col span="10">
                            <FormItem label="状态" prop="status">
                                <j-select v-model="metaRegion.status" url="fixedDict:Status@system"
                                          @on-change="selectChange($event, 'status')">
                                </j-select>
                            </FormItem>
                        </Col>
                        <Col span="10">
                            <FormItem label="显示顺序" prop="disorder">
                                <InputNumber :max="99999" :min="0" v-model="metaRegion.disorder" style="width: 100%;"></InputNumber>
                            </FormItem>
                        </Col>
                        <Col span="20">
                            <FormItem label="区域描述" prop="regionDesc">
                                <Input type="textarea" v-model="metaRegion.regionDesc"/>
                            </FormItem>
                        </Col>
                        <Col span="22">
                            <div align="center">
                                <Button @click="btnSave()" type="primary" style="margin:0 11px;">保存</Button>
                            </div>
                        </Col>
                    </Form>
                </Row>
            </Card>
        </Content>
    </Layout>
</template>

<script>
    export default {
        name: "metaRegion",

        data (){
            return {
                metaRegion: {},
                formItem: {},
                //验证规则
                metaRegionRules: {
                    regionName: [
                        { required: true, message: '必需填写项', trigger: 'blur'}
                    ],

                    disorder: [
                        { required:true, message:'必须填写项', trigger: 'blur'}
                    ],
                },

                //jtree
                regionDataTree: [],
                queryTree: this.$services.sysService.metaRegionRestController.treeNode,
                removeServer: this.$services.sysService.metaRegionRestController.remove,
            }
        },

        methods: {
            //下拉框选择变换函数
            selectChange(value, name){
                this.metaRegion[name] = value;
            },


            //jtree,

            selectNode(treeNode){
                this.metaRegion = treeNode[0];
            },

            //保存数据
            btnSave(){

                    this.$net.send({
                        server: this.$services.sysService.metaRegionRestController.update,
                        data: this.metaRegion
                    }).then((data) => {
                        if (data.success) {
                            this.$Message.success(data.msg);
                            this.$refs.authRegionTree.refresh();
                        } else {
                            this.$Message.error(data.msg);
                        }
                    });

            },
        },
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