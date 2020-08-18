import {RTYPE} from '@/util/common'
import app from '@/config/app';

const SERVICE = app.services.system;
const CONTROLLER = 'tenant';

export let tenantRestController = {

    /**
     * 保存租户信息
     */
    save: {
        service: SERVICE,
        controller: CONTROLLER,
        action: 'save',
        type: RTYPE.POST
    },
    /**
     * 查询所有租户
     */
    get: {
        service: SERVICE,
        controller: CONTROLLER,
        action: 'queryList',
        type: RTYPE.POST
    },

    /**
     * 删除
     */
    remove: {
        service: SERVICE,
        controller: CONTROLLER,
        action: 'remove',
        type: RTYPE.DELETE
    },

    /**
     *分页查询租户信息
     */
    query: {
        service: SERVICE,
        controller: CONTROLLER,
        action: 'query',
        type: RTYPE.GET
    },
    check: {
        service: SERVICE,
        controller: CONTROLLER,
        action: 'check',
        type: RTYPE.GET
    },
    start: {
        service: SERVICE,
        controller: CONTROLLER,
        action: 'start',
        type: RTYPE.POST
    },
    stop: {
        service: SERVICE,
        controller: CONTROLLER,
        action: 'stop',
        type: RTYPE.POST
    }
}