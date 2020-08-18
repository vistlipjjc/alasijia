import { RTYPE } from '@/util/common'
import app from '@/config/app';

const SERVICE = app.services.system;
const CONTROLLER = 'dashLayout';

export let dashLayoutRestController = {
    $setting: {
        menuCode: 'sys.dashboard.dashLayout',
        tenantRequired: false
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

    /**
     * 保存一个角色类型
     */
    save: {
        service: SERVICE,
        controller: CONTROLLER,
        action: 'save',
        type: RTYPE.POST
    },

    /**
     * 删除一个角色类型
     */
    remove: {
        service: SERVICE,
        controller: CONTROLLER,
        action: 'remove',
        type: RTYPE.POST
    },
    /**
     * 验证编码的唯一性
     */
    check: {
        service: SERVICE,
        controller: CONTROLLER,
        action: 'check',
        type: RTYPE.GET
    }
}