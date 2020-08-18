<style lang="less" scoped>
    @import './ApiDetail.css';
</style>
<template>
  <Card>
      <div class="api-search" >
          <!-- 这里是顶部的自动补全搜索框 -->
          <!-- <AutoComplete v-model="searchPath" :filter-method="filterMethod" :data="paths" icon="ios-search" size="large"
                        placeholder="请输入API检索" style="width: 45%;text-align: left"  @on-select="selectResult">
              <div style="height: 200px;overflow: auto">
                  <Option v-for="(option,key) in paths" :value="option.path + '@' + option.tags +'@'+ option.service" :key="key" >
                      <span>{{ option.path}}</span>
                      <span class="search-controller">{{ option.tags[0] }}</span>
                  </Option>
              </div>
          </AutoComplete> -->
      </div>
      <div style="overflow: hidden">
          <div class="api-menu">
              <Menu ref="left_menu" :theme="theme2" @on-open-change="openChange" @on-select="itemClick" style="width: 100%;z-index: 0" :accordion="true">
                  <Submenu :name="'s_' + key" v-for="(value, key) in serviceNames" :key="key">
                      <template slot="title">
                          <h3>{{key}}</h3>
                          ({{value['description']}})
                      </template>
                      <Submenu :name="'c_' + key + '_' + cname" v-for="cname in controllers[key]" :key="cname">
                          <template slot="title">
                              <h4>{{cname}}</h4>
                          </template>
                          <MenuItem :name="'m_' + key + '_' + cname + '_' + mname" v-for="(mvalue, mname) in methodInfos[key + '_' + cname]" :key="'m_' + key + '_' + cname + '_' + mname">
                              <span :class="'method ' + mvalue['requestMethod']">{{mvalue['requestMethod'].toUpperCase()}}</span>
                              <span>{{mvalue['methodName']}}</span>
                          </MenuItem>
                      </Submenu>
                  </Submenu>
              </Menu>
          </div>
          <div class="api-detail">
              <Api-Index name="apiIndex" v-model="apiData" :serviceName="apiData.serviceName" :controllerName="apiData.controllerName" :methodIndex="apiData.methodIndex"></Api-Index>
          </div>

      </div>
</Card>

</template>
<script type="text/javascript">
    import ApiIndex from "./ApiIndex.vue";
    export default {
        data() {
            return {
                apiData:{
                    serviceName:'',
                    controllerName:'',
                    methodIndex:0
                },
                theme2: 'light',
                accordion:true,
                activeName:'',
                openNames:[],
                searchPath:''
            };
        },
        components: {
            ApiIndex
        },
        computed:{
           serviceNames: function() {
               return this.$store.state.serviceNames;
           }, 
           controllers: function() {
                return this.$store.state.controllerNames;
           },
           methodInfos: function() {
               return this.$store.state.methodInfos;
           }
        },
        created: function() {
            // 在创建的时候首先支取获取所有的服务名称，然后在点击的时候再去后端获取需要的数据
            this.$store.dispatch("getAllServiceName");
            // 获取配置在zuul中的路由数据
            this.$store.dispatch("getZuulData");
        },
        methods: {
            itemClick(name) {
                let names = name.split('_');
                this.apiData.serviceName = names[1];
                this.apiData.controllerName = names[2];
                this.apiData.methodIndex = parseInt(names[3]);
            },
            openChange(arr) {
                // this.$store.dispatch("addServiceData", "testService");
                // 传入的长度为0，说明是对菜单进行收缩，不进行任何操作
                // 长度是1 说明是服务项
                if(arr.length == 1) {
                    let names = arr[0].split("_");
                    // 如果names的长度是2，说明点击的是服务项
                    // if(names.length == 2) {
                        let serviceName = names[1];
                        // 对服务名进行判断，看是否已经有了
                        let controllerNames = this.$store.state.controllerNames;
                        if (controllerNames[serviceName] === undefined) {
                            // 得到服务名，然后直接dispatch一个请求就ok了
                            this.$store.dispatch("getAllControllerNames", serviceName);
                        }
                    // } else {
                    // }
                } else {
                    // 长度为2，说明是点击的controller
                    let names = arr[1].split("_");
                    let serviceName = names[1];
                    let controllerName = names[2];
                    let methodInfos = this.$store.state.methodInfos;
                    // 判断methodInfos中有没有
                    if (methodInfos[serviceName + '_' + controllerName] === undefined) { 
                        this.$store.dispatch("getAllPaths", {serviceName: serviceName, controllerName: controllerName});
                    } 
                }
                // this.$store.dispatch("addServiceData", "testService");
                // 传入的长度为0，说明是对菜单进行收缩，不进行任何操作
                // if(arr.length == 1) {
                //     let names = arr[0].split("_");
                //     // 如果names的长度是2，说明点击的是服务项
                //     if(names.length == 2) {
                //         let serviceName = names[1];
                //         // 对服务名进行判断，看是否已经有了
                //         let controllerNames = this.$store.state.controllerNames;
                //         if (controllerNames[serviceName] === undefined) {
                //             // 得到服务名，然后直接dispatch一个请求就ok了
                //             this.$store.dispatch("getAllControllerNames", serviceName);
                //         }
                //     } else {
                //         let serviceName = names[1];
                //         let controllerName = names[2];
                //         let methodInfos = this.$store.state.methodInfos;
                //         // 判断methodInfos中有没有
                //         if (methodInfos[serviceName + '_' + controllerName] === undefined) { 
                //             this.$store.dispatch("getAllPaths", {serviceName: serviceName, controllerName: controllerName});
                //         }
                //     }
                // }
            }
        }
    }
</script>