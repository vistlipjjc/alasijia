import net from '@/util/net'
import storage from '@/util/storage'
import { services } from '@/config/services/index'
import { router } from '@/router/index';
import lazyLoading from "../libs/lazyLoading";
import Main from '@/views/Main.vue';
import md5 from 'md5';

export const actions = {

    /**
     * 更新用户菜单
     * @param state
     * @param commit
     * @param getters
     * @param dispatch
     * @returns {Promise<void>}
     */
    async updateUserMenu({ state, commit, getters, dispatch }) {
        if (!(getters.userToken)) {
            return
        }

        if (!storage.getItem('menus')) {
            throw new Error('用户菜单初始化异常')
        }

        //生成菜单路由
        const constRoutes = [];
        await dispatch('initRouterNode', [constRoutes, storage.getItem('menus')]);

        // 404路由需要和动态路由一起注入
        const otherRoutes = [];
        const otherRouter = [{
            path: '/*',
            name: 'error-404',
            meta: {
                title: '404-页面不存在'
            },
            component: 'error-page/404'
        }];
        await dispatch('initRouterNode', [otherRoutes,otherRouter]);

        // 添加全局路由
        commit('updateDefaultRouter', otherRoutes);

        // 添加菜单路由
        commit('updateAppRouter', constRoutes);
        // 刷新菜单界面
        commit('updateMenulist', constRoutes);

        //更新标签页
        await dispatch('updateTabs');
        console.log("aaa");
        // 添加默认跳转，第一个非空子项
        // if (window.location.pathname === '/' || window.location.pathname === '/login') {
        if (window.location.hash === '#/login') {
            router.push('/home');
        }
    },

    /**
     * 生成路由节点
     * @param dispatch
     * @param routers
     * @param data
     */
    initRouterNode ({dispatch}, [routers, data]) {
        for (let item of data) {

            // 获取图标
            let iconSrc = item.icon
            if (item.icon && item.icon.indexOf('icon') > -1) {
                iconSrc = require('../images/' + item.icon + '.png')
            }

            let tmp = {
                path: '/' + item.path,
                name: item.path,
                title: item.name,
                // icon: item.icon,
                icon: iconSrc,
                code: item.id,
                component: item.target,
                meta: {
                    keepAlive: true
                }
            };

            let menu = Object.assign({}, tmp);
            menu.component = lazyLoading(menu.component);

            // 一级菜单没有子菜单，点击跳页
            if (!item.parentId && item.children && item.children.length === 0) {
              let actionRouter = {
                path: '/',
                name: 'actionRouter',
                redirect: '/home',
                title: item.name,
                component: Main,
                children: [menu]
              }
              routers.push(actionRouter)

            // 正常菜单，一级菜单有子菜单
            } else {
              if (item.children && item.children.length > 0) {
                  menu.children = [];
                  dispatch('initRouterNode', [menu.children, item.children]);
              }
              routers.push(menu);
            }
        }
    },

    /**
     * 更新标签页
     */
    updateTabs({state, commit }) {
        let tagsList = [];
        state.app.routers.map((item) => {
            if (!item.children) {
                tagsList.push(item);
            } else {
                item.children.map((obj) => {
                    if (obj.children) {
                        tagsList.push(...obj.children);
                    }else{
                        tagsList.push(obj);
                    }
                });
            }
        });
        commit('setTagsList', tagsList);
    },

    /**
     * 用户登录
     * @param {*} param
     * @param {*} autoLogin
     */
    userLogin({ state, commit, getters, dispatch }, { username, password}) {
        console.log("userLogin function...");
        console.log("userName：", username);
        let data = 'username=' + username + '&password=' + password;

        return net.send({
            server: services.commonService.login,
            data: data,
            headers: {
                'Content-Type':'application/x-www-form-urlencoded'
            } 
        }).then(
            // 登录成功
            async(data) => {

                console.log('登录', data);
                if (!data.success) return data.msg;

              // 清除 localStorage 中用户信息
              localStorage.clear();
              commit('clearAllTags');

                // 存储用户会话信息
                storage.setItem('user', data.user, storage.type.local);
                storage.setItem('menus', data.menus, storage.type.local);

                // 更新 store 登录信息：userToken/user
                commit('updateUserInfo', data);

                // 生成用户菜单
                dispatch('updateUserMenu');

            }, ({ reason }) => {
                // 登录失败
                return reason;
            }
        );
    },

    /**
     * 用户注销
     * @param {*} param
     */
    userLogout({ state, commit, getters }, redirect) {

        // 恢复默认样式
        let themeLink = document.querySelector('link[name="theme"]');
        themeLink.setAttribute('href', '');
        // 清空打开的页面等数据，但是保存主题数据
        let theme = '';
        if (localStorage.theme) {
            theme = localStorage.theme;
        }
        localStorage.clear();
        if (theme) {
            localStorage.theme = theme;
        }

        commit('clearOpenedSubmenu');

        // 清除 storage 中用户信息
        storage.removeItem('userToken', storage.type.session);
        storage.removeItem('user', storage.type.local);
        storage.removeItem('menus', storage.type.local);

        // 跳转到登录页面
        if (redirect)
            router.go('login');
        else
            commit('clearUserInfo'); // 清除store中用户信息
    },

    // API文档相关处理函数
    getAllServiceName({ state, commit, getters, dispatch }) {
        net.ajax({
            url: "http://localhost:9000/api/monitor/apiservice/service/getAllServices",
            type: "GET"
        }).then( (response) => {
            // 将响应的结果提交给mutation中的processApiResponse()函数进行处理
            commit("processApiResponse", response);
        }).catch( (error) => {
            console.error("处理数据出现异常：", error);
        })
    },
    // 从服务器获取指定的服务中的所有controller的名称
    getAllControllerNames({ state, commit, getters, dispatch }, serviceName) {
        net.ajax({
            url: "http://localhost:9000/api/monitor/apiservice/service/getAllControllerNames/" + serviceName,
            type: "GET"
        }).then((response) => {
            commit("processControllerNames", {serviceName, response});
        }).catch( (error) => {
            console.error("数据处理出现异常：", error);
        })
    },
    // 从服务器中获取给定的controller中的所有路径以及相关数据
    getAllPaths({ state, commit, getters, dispatch }, {serviceName, controllerName}) {
        net.ajax({
            url: "http://localhost:9000/api/monitor/apiservice/service/getPaths/" + serviceName + "/" + controllerName,
            type: "GET"
        }).then((response) => {
            commit("processPaths", {serviceName, controllerName, response});
        }).catch((error) => {
            console.error("数据处理出现异常：", error);
        })
    },
    addServiceData({ state, commit, getters, dispatch }, serviceName) {
        setTimeout(function() {
            commit("processAdd", serviceName);
        }, 3000);
    },
    getDefination({state, commit, getters, dispatch}, {serviceName, refName}) {
        net.ajax({
            url: "http://localhost:9000/api/monitor/apiservice/service/getDefination/" + serviceName + "/" + refName,
            type: "GET"
        }).then((response) => {
            commit("processDefination", {serviceName, refName, response});
        }).catch((error) => {
            console.error("数据处理出现异常：", error);
        })
    },
    getZuulData({state, commit, getters, dispatch}, response) {
        net.ajax({
            url: "http://localhost:9000/api/monitor/apiservice/service/getZuulData",
            type: "GET"
        }).then((response) => {
            commit("processZuulData", response);
        }).catch((error) => {
            console.error("数据处理出现异常：", error);
        })
    },
    getApiStatistics({state, commit, getters, dispatch}) {
        net.ajax({
            url: "http://localhost:9000/api/monitor/apiservice/service/getStatistics",
            type: "GET"
        }).then((response) => {
            commit("processApiStatistics", response);
        }).catch((error) => {
            console.error("数据处理出现异常：", error);
        })
    },
    getInvocationChainServices(context) {
        net.ajax({
            url: "http://localhost:9000/api/monitor/apiservice/ic/services",
            type: "GET"
        }).then((response) => {
            context.commit("processInvocationChainServices", response);
        }).catch((error) => {
            console.error("数据处理出现异常：", error);
        })
    },
    getSpanNames(context, serviceName) {
        net.ajax({
            url: "http://localhost:9000/api/monitor/apiservice/ic/" + serviceName + "/spans",
            type: "GET"
        }).then((response) => {
            context.commit("processSpans", response);
        }).catch((error) => {
            console.error("数据处理出现异常: ", error);
        })
    },
    getAllSortOrders(context) {
        net.ajax({
            url: "http://localhost:9000/api/monitor/apiservice/ic/sortOrders",
            type: "GET"
        }).then((response) => {
            context.commit("processSortOrders", response);
        }).catch ((error) => {
            console.error("数据处理出现异常：", error);
        })
    }
}