import {RTYPE} from '@/util/common'
import app from '@/config/app';

const SERVICE = app.services.system;
const CONTROLLER = 'bizDeptProxy';

export let bizDeptProxyRestController = {

    /**
     * 保存代管信息
     */
    save: {
        service: SERVICE,
        controller: CONTROLLER,
        action: 'save',
        type: RTYPE.POST
    },

    /**
     * 删除代管信息
     */
    remove: {
        service: SERVICE,
        controller: CONTROLLER,
        action: 'remove',
        type: RTYPE.DELETE
    },

    /**
     *分页查询用户信息
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
        type: RTYPE.POST
    },
    checkRepeat: {
        service: SERVICE,
        controller: CONTROLLER,
        action: 'checkRepeat',
        type: RTYPE.POST
    }
}