import axios from 'axios'
import app from '@/config/app'
import store from '@/store'
import storage from '@/util/storage'
import clone from 'clone'
import {services} from '@/config/services/index';
import { getDateType, dateFormat } from '@/util/common'

// 请求配置
const instance = axios.create({
    baseURL: app.url.server,
    // timeout: app.net.timeout,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

/**
 * 获取请求地址
 * @param {any} { service, controller, action, url }
 * @returns url
 */
export function getServerUrl({ service, controller, action, url }, method, append, data) {
    let dataPostfix = '';
    let appendPostfix = '';
    let postfixMethod = ['GET', 'DELETE'];

    // 生成拼接后缀
    if (method && data && Object.keys(data).length > 0 && postfixMethod.includes(method)) {
        let postfixArray = [];
        for (let [key, value] of Object.entries(data)) {
            if (value !== '' && value !== undefined && !(value instanceof Array)) {
                key = key.replace(/%/g, '.');
                postfixArray.push(key + '=' + encodeURI(value))
            }

            if (value !== '' && value !== undefined && value instanceof Array) {
                value.forEach((x, i) => {
                    if (x !== '') {
                        key = key.replace(/%/g, '.');
                        console.log(key, 'key');
                        if (typeof x === 'object') {
                            x = JSON.parse(x)
                        }
                        postfixArray.push(`${key}` + '=' + encodeURI(x))
                    }
                })
            }
        }
        let postfix = postfixArray.join('&');
        if (postfix.length > 0) {
            dataPostfix = '?' + postfix
        }
    }

    // 生成追加数据
    if (append && append.length) {
      // 兼容ie浏览器参数为中文乱码问题
      let appendDesc
      if (typeof append === 'string') {
        appendDesc = encodeURI(append)
      } else {
        appendDesc = []
        append.forEach(item => {
          appendDesc.push(encodeURI(item))
        })
      }

        appendPostfix = '/' + ((typeof append === 'string') ? appendDesc : appendDesc.join('/'))
    }

    // 自定义url优先级最高
    if (url) return `${url}${appendPostfix}${dataPostfix}`;

    // 进行url拼接
    if (service) {
        return `/${service}${(controller ? '/' + controller : '')}${(action ? '/' + action : '')}${appendPostfix}${dataPostfix}`
    } else {
        this.$Message.error('server 配置异常，请检查对应 server 配置');
        throw new Error('server 配置异常，请检查对应 server 配置')
    }
}

// 设置同一服务请求的时间间隔为 2 秒
let requestArray = [];
function addSendTime(server, data, append) {
    let now = +new Date(); //获取时间毫秒，new Date().getTime() 的简写
    let dataStr = JSON.stringify(data);
    let appendStr = JSON.stringify(append);

    if (requestArray.find(x => x.server === server && x.data === dataStr && x.append === appendStr && now - x.time < 1000)) {
        console.error('阻止重复进行网络通讯', server);
        return;
    } else {
        requestArray.push({
            server,
            data: dataStr,
            append: appendStr,
            time: now
        });
        setTimeout(() => {
            clearSendTime(server, data)
        }, 2000)
    }
}

function clearSendTime(server, data) {
    let dataStr = JSON.stringify(data);
    if (requestArray.find(x => x.server === server && x.data === dataStr)) {
        requestArray = requestArray.filter(x => x.server !== server && x.data !== data)
    }
}

/**
 * 格式化
 */
function dataFormat(data, fmt) {
    if (!data) {
        return
    }

    // 日期转换格式列表
    let dateType = {
        date: 'yyyy-MM-dd',
        datetime: 'yyyy-MM-dd hh:mm:ss'
    }

    // 转换日期类型
    let dateConvert = (key, value, type) => {
        type = type || getDateType(value)
        let formatTemp = dateType[type]
        if (formatTemp) {
            data[key] = dateFormat(value, formatTemp)
        }
        if (value instanceof Array) {
            for (var i = 0; i < value.length; i++) {
                type = type || getDateType(value[i])
                let formatTempArr = dateType[type]
                if (formatTempArr) {
                    value[i] = dateFormat(value[i], dateType['datetime'])
                }
            }
        }
    }

    // 获取格式化数组
    let keys = fmt ? Object.keys(fmt) : []

    // 数据格式化
    for (let [key, value] of Object.entries(data)) {
        // 日期格式化
        if (keys.includes(key) && value.type) {
            dateConvert(key, value, value.type)
        } else {
            dateConvert(key, value)
        }
    }
}

/**
 * 将header还原
 */
function resetHeader() {
    instance.defaults.headers['Content-Type'] = 'application/json';
    instance.defaults.headers['Accept'] = 'application/json';
}

/**
 * 发送请求信息
 * @param {any} { server, data, append, headers}
 * @returns promise
 */
function send({ server = {}, data, append, headers } = {}) {
    // 复制参数
    data = clone(data);

    // 设置自定义请求头
    if (headers) {
        if (headers['Content-Type'] !== undefined) {
            instance.defaults.headers['Content-Type'] = headers['Content-Type'];
        }
        if (headers['Accept'] !== undefined) {
            instance.defaults.headers['Accept'] = headers['Accept'];
        }
    }

    // 仅在登录时设置 token 到请求头
    let userToken = store.getters.userToken;
    if (userToken){
        instance.defaults.headers['x-user-token'] = userToken;
    }

    // 设置请求头，添加菜单编码和多租户
    let isNotLogin = !!(server && server.action !== services.commonService.login.action); // 判断是否为非请求登录方法
    let controller = ['','fixedDict','dict','dictItem'];
    if (isNotLogin && !controller.includes(server.controller)){
        let settings = services[server.service + 'Service'][server.controller + 'RestController'].$setting;
        if (settings){
            instance.defaults.headers['x-menu-code'] = settings.menuCode;
            instance.defaults.headers['x-tenant-required'] = settings.tenantRequired;
        }
    }

    // 对数据进行预格式化
    // dataFormat(data, format);

    // 获取通讯类型
    let { type: method = app.net.type } = server;

    // 获取通讯地址
    let url = getServerUrl(server, method, append, data);

    // 设置请求服务的时间间隔
    addSendTime(server, data, append);

    /**
     * 异步通讯进程，目的是对请求结果进行预处理
     * @type {Promise<any>}
     */
    let promise = new Promise(async function(resolve, reject) {

        let result = await instance
            .request({
                method,
                url,
                data
            })
            .then(response => {
                // 还原 header
                resetHeader();

                //更新token
                let token = response.headers['x-user-token'];
                if(token) {
                    store.commit('updateUserInfo', { token: token });
                    storage.setItem('userToken', token, storage.type.session);
                }

                if (response.data.code === 421) {
                  window.sessionStorage.clear()
                  console.log(`登录地址：${window.location.origin}${window.location.pathname}#/login`)
                  window.location.href = `${window.location.origin}${window.location.pathname}#/login`
                  return false
                }

                return response.data || {}
            })
            .catch(({ response }) => {
                resetHeader(); // 还原 header

                if (response === undefined) {
                  console.log("响应为空!");
                  store.dispatch('userLogout', true);
                  return;
                }

                switch (response.status) {
                  case 401:
                    window.sessionStorage.clear()
                    console.log(`登录地址：${window.location.origin}${window.location.pathname}#/login`)
                    window.location.href = `${window.location.origin}${window.location.pathname}#/login`
                    break;

                  case 403: {
                    // 用户token异常，用户登录状态过期，请重新登录
                    if (isNotLogin) store.dispatch('userLogout', true);
                    break;
                  }
                }

                let errors = {
                  msg: response.status === 500 ? '系统异常' : response.data.msg,
                  error: response.headers['x-pangolin-error']
                };

                // 输出异常
                console.error(url, response.data);
                return {
                  errors: errors,
                  reason: errors.msg,
                  success: false,
                  data: response.data
                }
            });

        // 清除请求时间间隔
        setTimeout(() => {
            clearSendTime(server, data)
        }, 500);

        // 处理返回结果
        if (result && !result.errors) {
            resolve(result)
        } else {
            reject(result)
        }
    });

    return promise
}

/**
 *
 * @param url
 * @param data
 * @returns {Promise}
 */
function ajax({ url, type, data,headers }){
    url = clone(url)
    data = clone(data)

    let { type: method = app.net.type } = type;

    let userToken = store.getters.userToken
    if (userToken) {
        instance.defaults.headers['x-user-token'] = userToken
    }

    if (headers) {
        if (headers['Content-Type'] !== undefined) {
            instance.defaults.headers['Content-Type'] = headers['Content-Type'];
        }
        if (headers['Accept'] !== undefined) {
            instance.defaults.headers['Accept'] = headers['Accept'];
        }
    }

    let promise = new Promise(async function(resolve, reject) {

        let result = await instance
            .request({
                method: type,
                url: url,
                data: data
            })
            .then(response => {
                resetHeader();
                return response.data || {}
            })
            .catch(({ response }) => {
                resetHeader();
                // response是undefined状态可能是因为服务器响应了302，而axios不能够处理302响应，因此就是一个undefined了
                if (response === undefined) {
                    console.log('响应数据为空！');
                    store.dispatch('userLogout', true);
                    return;
                }
                switch (response.status) {
                    case 403:
                    {
                        // Message('用户登录状态过期，请重新登陆')
                        // 用户token异常
                        store.dispatch('userLogout', true);
                        break;
                    }
                }
                let errors = {
                    params: response.headers['x-pangolin-params'],
                    msg: response.status === 500 ? '系统异常' : decodeURI(response.headers['x-ijep-alert']),
                    error: response.headers['x-ijep-error']
                }
                // 输出异常
                console.error(url, response.data)
                return {
                    errors: errors,
                    reason: errors.msg,
                    success: false,
                    data: response.data
                }
            })

        if (result && !result.errors) {
            resolve(result)
        } else {
            reject(result)
        }
    })

    return promise;
}

/**
 * 批量发送请求
 * @param {*} servers
 */
function sendAll(servers) {
    if (servers instanceof Array) {
        let promises = servers.map(x => send(x))
        return Promise.all(promises)
    }
}

export default {
    ajax,
    send, // 发送请求
    sendAll // 批量发送请求
}