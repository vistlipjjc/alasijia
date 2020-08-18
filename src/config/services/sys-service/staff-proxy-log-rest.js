import { RTYPE } from '@/util/common'
import app from '@/config/app';

const SERVICE = app.services.system;
const CONTROLLER = 'staffProxyLog';

export let staffProxyLogRestController = {
    /**
     * 获取用户类别树
     */
    load: {
        service: SERVICE,
        controller: CONTROLLER,
        action: 'load',
        type: RTYPE.GET
    },
    /**
     * 保存借调信息
     */
    save: {
        service: SERVICE,
        controller: CONTROLLER,
        action: 'save',
        type: RTYPE.POST
    },
    /**
     *分页查询用户信息
     */
    query: {
        service: SERVICE,
        controller: CONTROLLER,
        action: 'query',
        type: RTYPE.GET
    },    /**
     *分页查询用户信息
     */
    remove: {
        service: SERVICE,
        controller: CONTROLLER,
        action: 'remove',
        type: RTYPE.DELETE
    }
}