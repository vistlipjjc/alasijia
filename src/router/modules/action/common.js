export default [
    { 
        path: '/home', 
        name: 'home_index', 
        title: {i18n: 'home'}, 
        component: () => import('@/views/home/home.vue') 
    },
    { 
        path: '/ownspace', 
        name: 'ownspace_index', 
        title: '个人中心', 
        component: () => import('@/views/own-space/own-space.vue') 
    },
    { 
        path: '/message', 
        name: 'message_index',
        title: '消息中心',
        component: () => import('@/views/system/notifyCenter/staffNotifyList.vue')
    }
]