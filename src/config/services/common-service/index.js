import { RTYPE } from '@/util/common'
import app from '@/config/app';

/**
 * 服务配置格式
 * elample:
 * {
 *  service:{服务名称}
 *  controller:{controller名称}
 *  action:{action名称}-可选
 *  url:{自定义地址}-可选(填写url时将不会读取service,controll,action)
 *  type:'RTYPE.(GET|PUT|POST|DELETE)'
 * }
 */

// 登录
export const login = {
    service: app.services.system,
    controller: '',
    action: 'doLogin',
    type: RTYPE.POST
};