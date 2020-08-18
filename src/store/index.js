import Vue from 'vue';
import Vuex from 'vuex';

// 导入子功能
import {mutations} from '@/store/mutations';
import {actions} from '@/store/actions';
import {getters} from '@/store/getters';

// 导入子模块
import app from './modules/app';
import {cache} from './modules/cache';
import notify from './modules/notify';

Vue.use(Vuex);

const store = new Vuex.Store({
    state: {
        userToken: '',
        user: {},
        apiData: {},
        serviceData: {},
        serviceNames: {},
        controllerNames: {},
        methodInfos: {},
        definations: {},
        routerInfos: {},
        apiStatistics: {},
        // 获取到的有调用链数据的服务名称
        services: ['all'],
        // 跟给定的服务相关的调用链span
        spans: ['all'], 
        sortOrders: []
    },
    modules: {
        cache,
        app,
        notify
    },
    mutations,
    actions,
    getters
});

export default store;
