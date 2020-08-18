export default [

    //业务数据查看
    {
        path: '/wfMetadata',
        name: 'wfMetadata',
        title: '业务数据查看',
        component: () => import('@/views/workflow/monitor/wfMetadata.vue')
    },
    //启动一只流程
    {
        path: '/wfStart',
        name: 'wfStart',
        title: '流程启动',
        component: () => import('@/views/workflow/process/processTask.vue')
    },
    //查看业务流程
    {
        path: '/processView',
        name: 'processView',
        title: '查看业务流程',
        component: () => import('@/views/workflow/process/processView.vue')
    },
    //处理
    {
        path: '/taskProcess',
        name: 'taskProcess',
        title: '处理',
        component: () => import('@/views/workflow/process/taskProcess.vue')
    },


    //流程模板管理
    {
        path: '/procTemplateAdd',
        name: 'procTemplateAdd',
        title: '模板新增',
        component: () => import('@/views/workflow/base/procTemplateAdd.vue')
    },

    {
        path: '/procTemplateUpload',
        name: 'procTemplateUpload',
        title: '上传',
        component: () => import('@/views/workflow/base/procTemplateUpload.vue')
    },
    //编辑业务流程
    {
        path: '/procDefEdit/:opt',
        name: 'procDefEdit',
        title: '编辑业务流程',
        component: () => import('@/views/workflow/base/procDefEdit.vue')
    },
    //查看业务流程
    {
        path: '/procDefView',
        name: 'procDefView',
        title: '业务流程详情',
        component: () => import('@/views/workflow/base/procDefView.vue')
    },
    //设计业务流程
    {
        path: '/procDefDesign',
        name: 'procDefDesign',
        title: '业务流程设计',
        component: () => import('@/views/workflow/base/procDefDesign.vue')
    },
   //我的审批


    //表单管理
    //新增表单
    {
        path: '/formDefEdit/:opt',
        name: 'formDefEdit',
        title: '编辑表单',
        component: () => import('@/views/workflow/base/formDefEdit.vue')
    },
    //设计表单
    {
        path: '/formPropList',
        name: 'formPropList',
        title: '设计表单',
        component: () => import('@/views/workflow/base/formPropList.vue')
    },
    //查看表单属性
    {
        path: '/formPropView',
        name: 'formPropView',
        title: '查看表单属性',
        component: () => import('@/views/workflow/base/formPropView.vue')
    },

    //审批托管
    //新增
    {
        path: '/procAutoTransferEdit/:opt',
        name: 'procAutoTransferEdit',
        title: '编辑信息',
        component: () => import('@/views/workflow/procAutoTransferEdit.vue')
    },
    //查看
    {
        path: '/procAutoTransferView',
        name: 'procAutoTransferView',
        title: '查看信息',
        component: () => import('@/views/workflow/procAutoTransferView.vue')
    },


    //我的流程-未提交
    //编辑业务数据
    {
        path: '/procInstEdit',
        name: 'procInstEdit',
        title: '编辑业务数据',
        component: () => import('@/views/workflow/process/procInstEdit.vue')
    },
    {
        path: '/procInstView',
        name: 'procInstView',
        title: '查看业务数据',
        component: () => import('@/views/workflow/process/procInstView.vue')
    },
]
