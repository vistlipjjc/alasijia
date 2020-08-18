import { RTYPE } from '@/util/common'
import app from '@/config/app';

const SERVICE = app.services.system;
const CONTROLLER = 'dashLayoutConfig';

export let dashLayoutConfigRestController = {
    /**
     *分页查询信息
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
    },
    /**
     * 请求布局的配置信息
     */
    getLayoutConfigData: {
        service: SERVICE,
        controller: CONTROLLER,
        action: 'getLayoutConfigData',
        type: RTYPE.GET
    }
}