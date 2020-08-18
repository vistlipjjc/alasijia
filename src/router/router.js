import Main from '@/views/Main.vue';
import actionModules from './modules/action/index';

// 非菜单的页面路由
export const actionRouter = {
    path: '/',
    name: 'actionRouter',
    redirect: '/home',
    component: Main,
    children: actionModules
};

// 不作为Main组件的子页面展示的页面单独写，如下
export const loginRouter = {
    path: '/login',
    name: 'login',
    meta: {
        title: 'Login - 登录'
    },
    component: () => import('@/views/login.vue')
};

export const page403 = {
    path: '/403',
    meta: {
        title: '403-权限不足'
    },
    name: 'error-403',
    component: () => import('@//views/error-page/403.vue')
};

export const page500 = {
    path: '/500',
    meta: {
        title: '500-服务端错误'
    },
    name: 'error-500',
    component: () => import('@/views/error-page/500.vue')
};

export const locking = {
    path: '/locking',
    name: 'locking',
    component: () => import('@/views/main-components/lockscreen/components/locking-page.vue')
};

// 所有上面定义的路由都要写在下面 default
export default [
    actionRouter, //功能页面路由
    loginRouter,
    locking,
    page500,
    page403
];
