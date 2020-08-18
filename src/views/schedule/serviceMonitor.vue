<template>
    <div>
        <Card>
            <Collapse v-model="collapseValue">
                <Panel name="1">
                    服务端
                        <Row slot="content">
                            <Col span="8" v-for="(item,index,key) in serviceList" :key="index" style="margin-top: 10px;">
                                <server-oil-map :serviceId=item.serviceId :instanceId=item.instanceId style="width: 100%">
                                </server-oil-map>
                            </Col>
                        </Row>
                </Panel>
                <Panel name="2">
                    客户端
                        <Row slot="content" v-for="(item, key,index) in clientList" :key="index">
                            <Card style="margin-top: 5px">
                                <p slot="title" style="margin-top: -5px;margin-bottom: -5px">{{key}}</p>
                                <Row style="margin-top: -5px;margin-left: -10px">
                                    <Col span="8" v-for="(client, index,key) in item" :key="index" style="margin-top: 10px;">
                                        <client-oil-map :serviceId=client.serviceId :instanceId=client.instanceId style="width: 100%">
                                        </client-oil-map>
                                    </Col>
                                </Row>
                            </Card>
                        </Row>
                </Panel>
            </Collapse>
        </Card>
    </div>
</template>

<script>
    import ServerOilMap from "./component/serverOilMap";
    import ClientOilMap from "./component/clientOilMap";
    export default {
        name: "serviceMonitor",
        components: {ServerOilMap,ClientOilMap},
        data() {
            return {
                //服务端数据的列表
                serviceList: [],
                //客户端数据的列表
                clientList: [],

                collapseValue: ['1','2']
            }
        },


        created() {
            //20分钟刷新一次
            setInterval(this.init,200000)
        },

        mounted() {
            this.init();
        },


        methods: {


            init() {
                this.$net.send({
                    server: this.$services.schService.scheduleRestController.getServers,
                }).then((data) => {
                    this.serviceList = data.servers
                });
                this.$net.send({
                    server: this.$services.schService.scheduleRestController.getClients,
                }).then((data) => {
                    this.clientList = data.clients
                });


            },

        }
    }
</script>

<style>
    .tagTitle {
        background-color: #2d8cf0;

        height: 50px;
        line-height: 50px;
        border-radius: 3px;
        font-size: 24px;
        vertical-align: center;
        cursor: pointer;
    }
</style>

