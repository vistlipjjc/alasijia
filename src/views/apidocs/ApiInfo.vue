<style lang="less" scoped>
    @import './ApiDetail.css';
</style>
<template>
    <Card>
        <div style="text-align: center">
            <Badge :count="apiStatistics['get']?apiStatistics['get']:'0'" class="item">
                <Button type="success">GET</Button>
            </Badge>
            <Badge :count="apiStatistics['put']?apiStatistics['put']:'0'"  class="item">
                <Button type="warning">PUT</Button>
            </Badge>
            <Badge :count="apiStatistics['post']?apiStatistics['post']:'0'"  class="item">
                <Button type="info">POST</Button>
            </Badge>
            <Badge :count="apiStatistics['delete']?apiStatistics['delete']:'0'"  class="item">
                <Button type="error">DELETE</Button>
            </Badge>
            <Badge :count="apiStatistics['options']?apiStatistics['options']:'0'"  class="item">
                <Button type="ghost">OPTIONS</Button>
            </Badge>
            <Badge :count="apiStatistics['head']?apiStatistics['head']:'0'"  class="item">
                <Button type="dashed">HEAD</Button>
            </Badge>
            <Badge :count="apiStatistics['patch']?apiStatistics['patch']:'0'"  class="item">
                <Button type="text">PATCH</Button>
            </Badge>
            <!-- <Badge :count="this.$store.getters.statisticsHTTP.others ? this.$store.getters.statisticsHTTP.others :'0'"  class="item">
                <Button type="primary">其他</Button>
            </Badge> -->
        </div>

        <table class="table-class" border='1'>
            <tr>
                <th>简介</th>
                <td>文思海辉iJEP微服务开发平台API文档</td>
            </tr>
            <tr>
                <th>作者</th>
                <td>成都研发部</td>
            </tr>
            <tr>
                <th>版本</th>
                <td>6.0.0</td>
            </tr>
            <tr>
                <th>Host</th>
                <td>localhost:8080</td>
            </tr>
            <tr>
                <th>联系方式</th>
                <td>risk@pactera</td>
            </tr>
            <tr>
                <th>服务提供商URL</th>
                <td><a href="#">www.pactera.com</a></td>
            </tr>
        </table>
    </Card>
</template>

<script>
    export default {
        data() {
            return {}
        },
        created () {
            // 从后台加载数据
            this.$store.dispatch('getApiStatistics');
        },
        computed: {
            apiStatistics () {
                let result = this.$store.state.apiStatistics;
                if(!result.hasOwnProperty("get")) {
                    result['post'] = 0;
                    result['put'] = 0;
                    result['delete'] = 0;
                    result['options'] = 0;
                    result['head'] = 0;
                    result['delete'] = 0;
                }
                console.log("result ==> ");
                console.log(result);
                return result;
            }
        }
    }
</script>

