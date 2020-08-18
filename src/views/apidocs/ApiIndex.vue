<template>
  <div >
      <Tabs value="first">
        <TabPane label="接口详情" name="first">
          <!-- 将数据从api-index中传递给api-detail模块 -->
          <api-details :serviceName="sN" :controllerName="cN" :methodIndex="mI"></api-details>
        </TabPane>
        <TabPane label="接口测试" name="second">
          <api-test  :serviceName="sN" :controllerName="cN" :methodIndex="mI"></api-test>
        </TabPane>
      </Tabs>
  </div>
</template>
<script>
import ApiTest from "./ApiTest.vue";
import ApiDetails from "./ApiDetails.vue";
export default {
    name: 'apiIndex',
    props: {
        serviceName: String,        // 服务名
        controllerName: String,     // Controller名称
        methodIndex: Number
    },
    data() {
        return {
            tabPosition: 'top',
            sN: this.serviceName,
            cN: this.controllerName,
            mI: this.methodIndex
        };
    },
    components: {
        ApiTest, ApiDetails
    },
    watch:{
        serviceName: function(serviceName) {
            this.sN = serviceName;
        },
        controllerName: function(controllerName) {
            this.cN = controllerName;
        },
        methodIndex: function(methodIndex) {
            this.mI = methodIndex;
        }
    }
};
</script>
