export default [
    {
        path: '/suppliersEdit/:opt',
            name: 'suppliersEdit',
        title: '资产信息编辑',
        component: () => import('@/views/demo/suppliersEdit.vue')
    },
    {
        path: '/suppliersView',
            name: 'suppliersView',
        title: '资产信息详情',
        component: () => import('@/views/demo/suppliersView.vue')
    }
]