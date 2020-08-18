<template>
    <div>
        <Card title="规则总体统计">
            <Row :gutter="20" type="flex" justify="space-around">
                <Col :xs="24" :md="8"><rules-log-total head="规则调用量" content="177,222" left-value="5%" right-value="2%"></rules-log-total></Col>
                <Col :xs="24" :md="8"><rules-log-total head="规则平均执行时间" content="10ms" left-value="5%" right-value="2%"></rules-log-total></Col>
                <Col :xs="24" :md="8"><rules-log-total head="规则调用量" content="177,222" left="已部署：" left-value="15" right="编辑中：" right-value="15" unit="个"></rules-log-total></Col>
            </Row>
        </Card>

        <Card title="规则模型分析">
            <Table border :columns="columns" :data="data"></Table>
        </Card>

        <Card title="规则部署情况">
            <div style="width: 100%;height: 300px;margin-bottom: 10px;">
                <rules-log-cart></rules-log-cart>
            </div>
        </Card>
    </div>
</template>

<script>
    import rulesLogCart from './rulesLogCart.vue';
    import rulesLogTotal from './rulesLogTotal.vue';

    export default {
        name: 'rulesLogList',
        components: {
            rulesLogCart,
            rulesLogTotal
        },
        data () {
            return {
                columns: [
                    {
                        title: '编号',
                        key: 'id',
                        align: 'center'
                    },
                    {
                        title: '模型',
                        key: 'model',
                        align: 'center'
                    },
                    {
                        title: '是否评分',
                        key: 'score',
                        align: 'center'
                    },
                    {
                        title: '最大处理时间',
                        key: 'time',
                        align: 'center'
                    },
                    {
                        title: '错误率',
                        key: 'error',
                        align: 'center'
                    },
                    {
                        title: '平均处理时间',
                        key: 'avgTime',
                        align: 'center'
                    },
                    {
                        title: '状态',
                        key: 'status',
                        align: 'center'
                    }
                ],
                data: [
                    {
                        id: '1',
                        model: '分派模型1',
                        score: '否',
                        time: '3s',
                        error: '0.0000%',
                        avgTime: '16ms',
                        status: '正常'
                    },
                    {
                        id: '2',
                        model: '分派模型2',
                        score: '否',
                        time: '3s',
                        error: '0.0000%',
                        avgTime: '16ms',
                        status: '正常'
                    },
                    {
                        id: '3',
                        model: '分派模型3',
                        score: '是',
                        time: '0',
                        error: '0',
                        avgTime: '0',
                        status: '未部署'
                    }
                ]
            };
        }
    };
</script>