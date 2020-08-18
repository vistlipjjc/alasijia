import Vue from 'vue';
import storage from '@/util/storage'

export const mutations = {

    /**
     * 更新用户基础信息
     * @param {*} info
     */
    updateUserInfo (state, data) {
        state.userToken = data.token;
        state.user = data.user;
        storage.setItem('userToken', data.token, storage.type.session);
    },

    /**
     * 清除用户信息
     * @param {*} state
     */
    clearUserInfo (state) {
        state.userToken = '';
        state.user = {};
        storage.removeItem('userToken', storage.type.session);
    },

    /**
     * 初始化API数据
     * @param state
     * @param system
     */
    /*initApiData (state) {
        net.ajax({
            url: 'http://localhost:9000/api/monitor/apiservice/service/findInstance',
            type: 'get'
        }).then(function (response) {
            state.apiData = getApiData(response);
            state.apiPath = getAllpaths(response);
            state.apiModel = getDefinitions(response);
        }).catch(function (err) {
            console.error("不能从接口中获取数据", err);
        });
    },*/
    processApiResponse (state, response) {
        if (response !== undefined) {
            for (let key in response) {
                let value = response[key];
                Vue.set(state.serviceNames, key, value);
            }
        }
    },
    processControllerNames (state, {serviceName, response}) {
        if (serviceName !== undefined && response !== undefined) {
            Vue.set(state.controllerNames, serviceName, response);
        }
    },
    processPaths (state, {serviceName, controllerName, response}) {
        if (serviceName !== undefined && response !== undefined) {
            // response是一个object，里面的key是方法名
            let methodInfos = [];
            for (let key in response) {
                // methodDetail是请求方法:请求详细
                let methodDetail = response[key];
                for (let detail in methodDetail) {
                    // detail实际上就是请求地址
                    let methods = methodDetail[detail];
                    for (let method in methods) {
                        let methodInfo = {};
                        methodInfo['methodName'] = detail;
                        methodInfo['requestMethod'] = method;
                        methodInfo['requestDetail'] = methods[method];
                        methodInfos.push(methodInfo);
                    }
                }
            }
            Vue.set(state.methodInfos, (serviceName + '_' + controllerName), methodInfos);
        }
    },
    // 处理从后台获取到的defination数据
    processDefination (state, {serviceName, refName, response}) {
        if (serviceName !== undefined && response !== undefined) {
            let properties = response['properties'];
            // 将properties设置给
            Vue.set(state.definations, (serviceName + '_' + refName), properties);
        }
    },
    processZuulData (state, response) {
        if (response !== undefined) {
            for (let key in response) {
                Vue.set(state.routerInfos, key, response[key]);
            }
        }
    },
    processApiStatistics (state, response) {
        if (response !== undefined) {
            // 将数据添加给state
            for (let key in response) {
                Vue.set(state.apiStatistics, key, response[key]);
            }
        }
    },
    processInvocationChainServices (state, response) {
        // 直接将所有的服务添加进services中就可以
        let basic = ['all'];
        if (response !== undefined) {
            // 将response这个数组中的所有数据push进basic中
            state.services = basic.concat(response);
        } else {
            state.services = basic;
        }
    },
    processSpans (state, response) {
        let basic = ['all'];
        if (response !== undefined) {
            state.spans = basic.concat(response);
        } else {
            state.spans = basic;
        }
    },
    processSortOrders (state, response) {
        if (response === undefined) {
            state.sortOrders = [];
        } else {
            state.sortOrders = response;
        }
    }
};
/**
 * 处理API数据
 * @param apiData
 * @returns {*}
 */
function getApiData (apiData) {
    let apiArr = [];
    for (let idx = 0; idx < apiData.length; idx++) {
        let api = apiData[idx];
        let tagsArry = api.tags;
        let pathArry = getPathsForController(api.paths);
        if (!tagsArry) return false;
        if (!pathArry) return false;
        for (let i = 0; i < tagsArry.length; i++) { // 遍历标签
            let name = tagsArry[i].name;
            let tag = tagsArry[i];
            tag.paths = [];
            for (let i = 0; i < pathArry.length; i++) { // 遍历paths查找对应的详情数据
                if (pathArry[i].tags[0].indexOf(name) >= 0) {
                    tag.paths.push(pathArry[i]);
                }
            }
        }
        apiArr.push(api);
    }
    return apiArr;
}

/**
 * 获取Controller的路径
 */
function getPathsForController (paths) {
    let friendlyPaths = [];
    if (!paths) return false;
    // 遍历第一层
    for (let key in paths) {
        let friendlyPath = {};
        friendlyPath.path = key;
        let tem = paths[key];
        // 遍历第二层
        for (let key in tem) {
            friendlyPath.sendWay = key;
            let tem2 = tem[key];
            friendlyPath.tags = tem2.tags;
            friendlyPath.summary = tem2.summary;
            friendlyPath.description = tem2.description;
            friendlyPath.operationId = tem2.operationId;
            friendlyPath.consumes = tem2.consumes;
            friendlyPath.produces = tem2.produces;
            friendlyPath.parameters = tem2.parameters;
            friendlyPath.responses = tem2.responses;
        }
        friendlyPaths.push(friendlyPath);
    }
    return friendlyPaths;
}

/**
 * 获取所有的路径
 * @param apiData
 * @returns {*}
 */
function getAllpaths (apiData) {
    let friendlyPaths = [];
    for (let idx = 0; idx < apiData.length; idx++) {
        let paths = apiData[idx].paths;
        if (!paths) return false;
        // 遍历第一层
        for (let key in paths) {
            let friendlyPath = {};
            friendlyPath.path = key;
            friendlyPath.service = apiData[idx].info.title;
            let tem = paths[key];
            // 遍历第二层
            for (let key in tem) {
                friendlyPath.sendWay = key;
                let tem2 = tem[key];
                friendlyPath.tags = tem2.tags;
                friendlyPath.summary = tem2.summary;
                friendlyPath.description = tem2.description;
                friendlyPath.operationId = tem2.operationId;
                friendlyPath.consumes = tem2.consumes;
                friendlyPath.produces = tem2.produces;
                friendlyPath.parameters = tem2.parameters;
                friendlyPath.responses = tem2.responses;
            }
            friendlyPaths.push(friendlyPath);
        }
    }
    return friendlyPaths;
}

/**
 * 获取模型定义
 * @param apiData
 * @returns {Array}
 */
function getDefinitions (apiData) {
    var arr = {};
    for (let i = 0; i < apiData.length; i++) {
        if (!apiData[i].definitions) {
            continue;
        }
        for (let key in apiData[i].definitions) {
            arr[key] = apiData[i].definitions[key];
        }
    }
    return arr;
}
