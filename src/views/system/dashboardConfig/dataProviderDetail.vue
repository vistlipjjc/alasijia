<template>
    <Card>
        <Row class="preview">
            <Col span="10">
                <j-label name="查询id" value="queryId"></j-label>
            </Col>
            <Col span="10">
                <j-label name="元数据id" value="tableId"></j-label>
            </Col>
        </Row>
        <Row class="preview">
            <Col span="10">
                <j-label name="查询名称" value="queryName"></j-label>
            </Col>
            <Col span="10">
                <j-label name="查询类型" value="fixedDict:MetaQueryType.queryType@system"></j-label>
            </Col>
        </Row>
        <Row class="preview">
            <Col span="10">
                <j-label name="机构编码" value="unitCode"></j-label>
            </Col>
            <Col span="10">
                <j-label name="机构名称" value="unitName"></j-label>
            </Col>
        </Row>
        <Row class="preview">
            <Col span="10">
                <j-label name="部门编码" value="deptCode"></j-label>
            </Col>
            <Col span="10">
                <j-label name="部门名称" value="deptName"></j-label>
            </Col>
        </Row>
        <Row class="preview">
            <Col span="10">
                <j-label name="用户账号" value="staffCode"></j-label>
            </Col>
            <Col span="10">
                <j-label name="用户名称" value="staffName"></j-label>
            </Col>
        </Row>
        <Row class="preview">
            <Col span="10">
                <j-label name="状态" value="fixedDict:MetaQueryStatus.status@system"></j-label>
            </Col>
        </Row>
        <Row style="text-align: center;" class="margin-top-10">
            <Button type="ghost" @click="btnBack">返回</Button>
        </Row>
    </Card>
</template>

<script>
    export default {
        name: "dataProviderDetail",

        methods: {

          btnBack(){
              this.$router.go(-1);
              this.$store.commit('removeTag', 'dataProviderDetail');
              this.$store.commit('closePage', 'dataProviderDetail');
          },
        },
    }
</script>

<style scoped>

</style>