export default [

    //角色类型
    {
        path: '/roleStdEdit/:opt',
        name: 'roleStdEdit',
        title: '角色类型编辑',
        component: () => import('@/views/system/sysConfig/roleStdEdit.vue'),
        meta: {
          ifLeave: true
        }
    },
    {
        path: '/roleStdView',
        name: 'roleStdView',
        title: '角色类型详情',
        component: () => import('@/views/system/sysConfig/roleStdView.vue')
    },

    //附件类型
    {
        path: '/attachmentTypeEdit/:opt',
        name: 'attachmentTypeEdit',
        title: '附件类型编辑',
        component: () => import('@/views/system/sysConfig/attachmentTypeEdit.vue'),
        meta: {
          ifLeave: true
        }
    },
    {
        path: '/attachmentTypeView',
        name: 'attachmentTypeView',
        title: '附件类型详情',
        component: () => import('@/views/system/sysConfig/attachmentTypeView.vue')
    },

    //用户管理
    {
        path: '/staffView',
        name: 'staffView',
        title: '查看用户信息',
        component: () => import('@/views/system/agencyAuthority/staffView.vue')
    },
    {
        path: '/staffEdit/:opt',
        name: 'staffEdit',
        title: '编辑用户信息',
        component: () => import('@/views/system/agencyAuthority/staffEdit.vue'),
        meta: {
          ifLeave: true
        }
    },
    {
        path: '/staffSetRole',
        name: 'staffSetRole',
        title: '设定角色',
        component: () => import('@/views/system/agencyAuthority/staffSetRole.vue')
    },
    {
        path: '/staffSetRoleGroup',
        name: 'staffSetRoleGroup',
        title: '设定角色组',
        component: () => import('@/views/system/agencyAuthority/staffSetRoleGroup.vue')
    },
    {
        path: '/staffSetGroup',
        name: 'staffSetGroup',
        title: '加入用户组',
        component: () => import('@/views/system/agencyAuthority/staffSetGroup.vue')
    },
    {
        path: '/staffProxyLogList',
        name: 'staffProxyLogList',
        title: '借调列表',
        component: () => import('@/views/system/agencyAuthority/staffProxyLogList.vue')
    },
    {
        path: '/staffProxyLogEdit',
        name: 'staffProxyLogEdit',
        title: '借调操作页面',
        component: () => import('@/views/system/agencyAuthority/staffProxyLogEdit.vue')
    },
    //组件管理
    {
        path: '/dashWidgetEdit/:opt',
        name: 'dashWidgetEdit',
        title: '组件编辑',
        component: () => import('@/views/system/dashboardConfig/dashWidgetEdit.vue'),
        meta: {
          ifLeave: true
        }
    },
    {
        path: '/dashWidgetView',
        name: 'dashWidgetView',
        title: '组件详情',
        component: () => import('@/views/system/dashboardConfig/dashWidgetView.vue')
    },
    {
        path: '/dashWidgetDatasource',
        name: 'dashWidgetDatasource',
        title: '绑定数据源_数据组件',
        component: () => import('@/views/system/dashboardConfig/dashWidgetDatasource.vue')
    },
    {
        path: '/dashWidgetDesignChart',
        name: 'dashWidgetDesignChart',
        title: '图表组件_组件设计',
        component: () => import('@/views/system/dashboardConfig/dashWidgetDesignChart.vue')
    },
    {
        path: '/dashWidgetDesignData',
        name: 'dashWidgetDesignData',
        title: '数据组件_组件设计',
        component: () => import('@/views/system/dashboardConfig/dashWidgetDesignData.vue')
    },

//用户组管理
    {
        path: '/staffGroupEdit/:opt',
        name: 'staffGroupEdit',
        title: '用户组编辑',
        component: () => import('@/views/system/agencyAuthority/staffGroupEdit.vue'),
        meta: {
          ifLeave: true
        }
    },
    {
        path: '/staffGroupView',
        name: 'staffGroupView',
        title: '用户组管理详情',
        component: () => import('@/views/system/agencyAuthority/staffGroupView.vue')
    },
    {
        path: '/staffGroupSetStaff',
        name: 'staffGroupSetStaff',
        title: '用户组添加用户',
        component: () => import('@/views/system/agencyAuthority/staffGroupSetStaff.vue')
    },
    {
        path: '/staffGroupSetRole',
        name: 'staffGroupSetRole',
        title: '用户组关联角色',
        component: () => import('@/views/system/agencyAuthority/staffGroupSetRole.vue')
    },
    {
        path: '/staffGroupSetRoleGroup',
        name: 'staffGroupSetRoleGroup',
        title: '用户组关联角色组',
        component: () => import('@/views/system/agencyAuthority/staffGroupSetRoleGroup.vue')
    },
    //角色管理
    {
        path: '/roleEdit/:opt',
        name: 'roleEdit',
        title: '编辑角色信息',
        component: () => import('@/views/system/agencyAuthority/roleEdit.vue'),
        meta: {
          ifLeave: true
        }
    },
    {
        path: '/roleView',
        name: 'roleView',
        title: '角色详情',
        component: () => import('@/views/system/agencyAuthority/roleView.vue')
    },
    //角色组管理
    {
        path: '/roleGroupEdit/:opt',
        name: 'roleGroupEdit',
        title: '编辑角色组信息',
        component: () => import('@/views/system/agencyAuthority/roleGroupEdit.vue'),
        meta: {
          ifLeave: true
        }
    },
    {
        path: '/roleGroupView',
        name: 'roleGroupView',
        title: '角色组详情',
        component: () => import('@/views/system/agencyAuthority/roleGroupView.vue')
    },
    {
        path: '/roleGroupSetRole',
        name: 'roleGroupSetRole',
        title: '角色组设置包含的角色',
        component: () => import('@/views/system/agencyAuthority/roleGroupSetRole.vue')
    },
// 上报管理
    {
        path: '/bizDeptReportEdit/:opt',
        name: 'bizDeptReportEdit',
        title: '编辑上报管理',
        component: () => import('@/views/system/agencyAuthority/bizDeptReportEdit.vue'),
        meta: {
          ifLeave: true
        }
    },
    {
        path: '/bizDeptReportView',
        name: 'bizDeptReportView',
        title: '查看上报管理',
        component: () => import('@/views/system/agencyAuthority/bizDeptReportView.vue')
    },

    // 布局管理
    {
        path: '/dashLayoutEdit/:opt',
        name: 'dashLayoutEdit',
        title: '布局编辑',
        component: () => import('@/views/system/dashboardConfig/dashLayoutEdit.vue')
    },
    {
        path: '/dashLayoutView',
        name: 'dashLayoutView',
        title: '布局详情',
        component: () => import('@/views/system/dashboardConfig/dashLayoutView.vue')
    },
    {
        path: '/dashLayoutDesign',
        name: 'dashLayoutDesign',
        title: '布局设计',
        component: () => import('@/views/system/dashboardConfig/dashLayoutDesign.vue')
    },
    //代管管理
    {
        path: '/bizDeptProxyEdit/:opt',
        name: 'bizDeptProxyEdit',
        title: '编辑代管管理',
        component: () => import('@/views/system/agencyAuthority/bizDeptProxyEdit.vue'),
        meta: {
          ifLeave: true
        }
    },
    {
        path: '/bizDeptProxyView',
        name: 'bizDeptProxyView',
        title: '查看代管管理',
        component: () => import('@/views/system/agencyAuthority/bizDeptProxyView.vue')
    },
    //租户管理
    {
        path: '/tenantEdit/:opt',
        name: 'tenantEdit',
        title: '编辑租户管理',
        component: () => import('@/views/system/agencyAuthority/tenantEdit.vue'),
        meta: {
          ifLeave: true
        }
    },
    {
        path: '/tenantView',
        name: 'tenantView',
        title: '查看租户管理',
        component: () => import('@/views/system/agencyAuthority/tenantView.vue')
    },

    // 布局授权
    {
        path: '/dashRoleGroupView',
        name: 'dashRoleGroupView',
        title: '查看角色组授权',
        component: () => import('@/views/system/dashboardConfig/dashLayoutRoleGroupView.vue')
    },
    {
        path: '/dashRoleView',
        name: 'dashRoleView',
        title: '查看角色授权',
        component: () => import('@/views/system/dashboardConfig/dashLayoutRoleView.vue')
    },

    //授权管理
    {
        path: '/authorizeSet',
        name: 'authorizeSet',
        title: '授权设置',
        component: () => import('@/views/system/agencyAuthority/authorizationSettings.vue')
    },

    //系统公告（默认配置）
    {
        path: '/announceEdit',
        name: 'announceEdit',
        title: '基础配置',
        component: () => import('@/views/system/notifyCenter/announceEdit.vue')
    },
    //系统公告（发公告）
    {
        path: '/notifyAnnounce/:opt',
        name: 'notifyAnnounce',
        title: '公告编辑',
        component: () => import('@/views/system/notifyCenter/notifyAnnounce.vue'),
        meta: {
          ifLeave: true
        }
    },
    //系统公告（预览）
    {
        path: '/announcePreview',
        name: 'announcePreview',
        title: '公告预览',
        component: () => import('@/views/system/notifyCenter/announcePreview.vue')
    },
    //消息中心（配置）
    {
        path: '/staffNotifyEdit',
        name: 'staffNotifyEdit',
        title: '配置',
        component: () => import('@/views/system/notifyCenter/staffNotifyEdit.vue')
    },

    //消息中心（发私信）
    {
        path: '/notifyMessage/:opt',
        name: 'notifyMessage',
        title: '发私信',
        component: () => import('@/views/system/notifyCenter/notifyMessage.vue'),
        meta: {
          ifLeave: true
        }
    },
    //消息中心（收件箱详情）
    {
        path: '/staffNotifyView',
        name: 'staffNotifyView',
        title: '消息中心详情',
        component: () => import('@/views/system/notifyCenter/staffNotifyView.vue')
    },
    //消息中心（发件箱详情）
    {
        path: '/notifyView',
        name: 'notifyView',
        title: '消息中心详情',
        component: () => import('@/views/system/notifyCenter/notifyView.vue')
    },
    //消息中心（预览）
    {
        path: '/notifyPreview',
        name: 'notifyPreview',
        title: '消息中心预览',
        component: () => import('@/views/system/notifyCenter/notifyPreview.vue')
    }
]
