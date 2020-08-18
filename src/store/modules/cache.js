import net from '@/util/net';
import app from '@/config/app';
import storage from '@/util/storage';
import { RTYPE } from '@/util/common';

export const  cache = {
    namespaced: true,
    actions: {
        cacheDict({},{type, url, service, param}){
            let promise = new Promise((resolve, reject) => {

                /* 缓存中获取字典 */
                let key = 'dict:' + url;
                if(storage.getItem(key))
                {
                    resolve(storage.getItem(key));
                }

                if(!type || !url)
                {
                    reject('请求出错，字典类型或地址存在');
                    return;
                }

                /* 获取请求服务 */
                let server = {};
                let $service = app.services['' + service + ''] ? app.services['' + service + ''] : app.services['default'];

                if (type === 'dict') {
                    server.service = $service;
                    server.controller = 'dictItem';
                    server.action = 'getDictItems' + '/' + url;
                    server.type = RTYPE.GET;
                }
                else if (type === 'fixedDict') {
                    server.service = $service;
                    server.controller = 'fixedDict';
                    server.action = url;
                    server.type = RTYPE.GET;
                }
                else if (type === 'custom') {
                    server.service = $service;
                    server.controller = '';
                    server.action = url;
                    server.type = RTYPE.GET;
                }
                if (server == null)
                {
                    reject('请求出错，请求服务不存在');
                    return;
                }

                /* 发送请求 */
                net.send({
                    server: server,
                    data: param
                }).then((data) => {
                    storage.setItem(key , data);
                    resolve(data);
                }, ({ reason }) => {
                    reject('请求失败，',reason);
                });
            });
            return promise;
        }
    },
    getters: {
        getCacheDictName:(state) => (code, value, nameField, valueField) => {
            if(!code || !value) return;

            let key = 'dict:' + code;
            let _values  = {};
            if(storage.getItem(key))
            {
                _values = storage.getItem(key);
                let _nf = nameField ? nameField : 'name';
                let _vf = valueField ? valueField : 'value';

                let dict = _values.find((item) => {
                    return value === item[_vf];
                });
                if (dict){
                    return dict[_nf];
                }else{
                    return '';
                }
            }
            return;
        }
    }
}