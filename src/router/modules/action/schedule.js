export default [

    //任务类型
    {
        path: '/jobGroupEdit/:opt',
        name: 'jobGroupEdit',
        title: '任务类型编辑',
        component: () => import('@/views/schedule/jobGroupEdit.vue')
    },
    {
        path: '/jobGroupView',
        name: 'jobGroupView',
        title: '任务类型详情',
        component: () => import('@/views/schedule/jobGroupView.vue')
    },

    //日历管理
    {
        path: '/calendarEdit/:opt',
        name: 'calendarEdit',
        title: '日历编辑',
        component: () => import('@/views/schedule/calendarEdit.vue')
    },
    {
        path: '/calendarView',
        name: 'calendarView',
        title: '日历详情',
        component: () => import('@/views/schedule/calendarView.vue')
    },
    {
        path: '/calendarDetail',
        name: 'calendarDetail',
        title: '日历设置',
        component: () => import('@/views/schedule/calendarDetail.vue')
    },

    //任务调度
    {
        path: '/jobEntityEdit/:opt',
        name: 'jobEntityEdit',
        title: '任务调度编辑',
        component: () => import('@/views/schedule/jobEntityEdit.vue')
    },
    {
        path: '/jobEntityView',
        name: 'jobEntityView',
        title: '任务调度详情',
        component: () => import('@/views/schedule/jobEntityView.vue')
    }
]