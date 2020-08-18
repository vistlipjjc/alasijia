export default [

    //对象库
    {
        path: '/ruleObjectEdit/:opt',
        name: 'ruleObjectEdit',
        title: '编辑对象库',
        component: () => import('@/views/rule/ruleObjectEdit.vue')
    },
    {
        path: '/ruleObjectView',
        name: 'ruleObjectView',
        title: '查看对象库',
        component: () => import('@/views/rule/ruleObjectView.vue')
    },
    //函数库
    {
        path: '/ruleFunctionEdit/:opt',
        name:
            'ruleFunctionEdit',
        title:
            '编辑函数库',
        component:
            () => import('@/views/rule/ruleFunctionEdit.vue')
    }
    ,
    {
        path: '/ruleFunctionView',
        name:
            'ruleFunctionView',
        title:
            '查看函数库',
        component:
            () => import('@/views/rule/ruleFunctionView.vue')
    },


    //规则库
    {
        path: '/rulesView',
        name: 'rulesView',
        title:
            '查看规则库',
        component:
            () => import('@/views/rule/rulesView.vue')
    },
    {
        path: '/rulesEdit/:opt',
        name: 'rulesEdit',
        title: '编辑规则库',
        component:
            () => import('@/views/rule/rulesEdit.vue')
    },
    {
        path: '/rulesDesign',
        name: 'rulesDesign',
        title: '维护内容',
        component:
            () => import('@/views/rule/rulesDesign.vue')
    },

    //规则集
    {
        path: '/packagesEdit/:opt',
        name: 'packagesEdit',
        title:'编辑规则集',
        component:
            () => import('@/views/rule/rulePackagesEdit.vue')
    },
    {
        path: '/pkgRuleMap',
        name:'pkgRuleMap',
        title:'规则映射',
        component:
            () => import('@/views/rule/pkgRuleMapList.vue')
    },
    {
        path: '/pkgRuleMapView',
        name: 'pkgRuleMapView',
        title: '规则库详情',
        component: () => import('@/views/rule/pkgRuleMapView')
    },

    {
        path: '/packagesView',
        name: 'packagesView',
        title: '规则集详情',
        component: () => import('@/views/rule/rulePackagesView.vue')
    },
    //模型库
    {
        path: '/scoreModelEdit/:opt',
        name: 'scoreModelEdit',
        title: '编辑模型库',
        component: () => import('@/views/rule/scoreModelEdit.vue')
    },
    {
        path: '/scoreModelView',
        name: 'scoreModelView',
        title: '编辑模型库',
        component: () => import('@/views/rule/scoreModelView.vue')
    },
    //型规则评分表
    {
        path: '/modelRuleScoreList',
        name: 'modelRuleScoreList',
        title: '编辑模型库',
        component: () => import('@/views/rule/modelRuleScoreList.vue')
    }
]