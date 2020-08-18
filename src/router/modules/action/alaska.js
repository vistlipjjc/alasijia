export default [

  /* 客户经理新增修改页面 */
  {
    path: '/custManagerEdit/:opt',
    name: 'custManagerEdit',
    title: '客户经理编辑页面',
    component: () => import('@/views/alaska/custManager/custManagerEdit.vue'),
    meta: {
      ifLeave: true
    }
  },

  /* 客户经理查看页面 */
  {
    path: '/custManagerView',
    name: 'custManagerView',
    title: '客户经理查看页面',
    component: () => import('@/views/alaska/custManager/custManagerView.vue')
  },

  /* 借款意向统计报表-查看图表 */
  {
    path: '/reportChartIndex',
    name: 'reportChartIndex',
    title: '借款意向统计报表-查看图表',
    component: () => import('@/views/alaska/statisticsReport/reportChartIndex.vue')
  },

  /* 借款意向管理-查看详情 */
  {
    path: '/loanIntentionView',
    name: 'loanIntentionView',
    title: '借款意向管理-详情',
    component: () => import('@/views/alaska/loanIntention/loanIntentionView.vue')
  },

  /* 通知消息管理-查看详情 */
  {
    path: '/noticesDetails',
    name: 'noticesDetails',
    title: '通知消息详情',
    component: () => import('@/views/alaska/noticesManage/noticesDetails.vue')
  },

  /* 通知消息管理-通知规则管理-新增修改页面 */
  {
    path: '/noticesRegionEdit/:opt',
    name: 'noticesRegionEdit',
    title: '通知消息详情',
    component: () => import('@/views/alaska/noticesManage/noticesRegionEdit.vue')
  },

  /* 通知消息管理-通知规则管理-通知配置 */
  {
    path: '/noticesDeploy',
    name: 'noticesDeploy',
    title: '推送配置',
    component: () => import('@/views/alaska/noticesManage/noticesDeploy.vue')
  },

  /* 通知消息管理-通知规则管理-内容知配置 */
  {
    path: '/templateManage',
    name: 'templateManage',
    title: '内容配置',
    component: () => import('@/views/alaska/noticesManage/templateManage.vue')
  },

  /* 团队管理-团队编辑 */
  {
    path: '/teamEdit/:opt',
    name: 'teamEdit',
    title: '团队编辑',
    component: () => import('@/views/alaska/teamMent/teamEdit.vue')
  },

  /* 团队管理-团队成员管理 */
  {
    path: '/teamMemberList/:opt',
    name: 'teamMemberList',
    title: '团队成员管理',
    component: () => import('@/views/alaska/teamMent/teamMemberList.vue')
  },

  /* 授权管理 */
  {
    path: '/authorizeMent/:opt',
    name: 'authorizeMent',
    title: '权限管理',
    component: () => import('@/views/alaska/authorize/authorizeMent.vue'),
    meta: {
      ifLeave: true
    }
  }
]