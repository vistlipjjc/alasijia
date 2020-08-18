export default [

    //仪表盘数据提供源
    {
        path: '/dataProviderDetail',
        name: 'dataProviderDetail',
        title: '仪表盘数据提供源',
        component: () => import('@/views/system/dashboardConfig/dataProviderDetail.vue')
    }
]