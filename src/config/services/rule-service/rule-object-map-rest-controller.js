import { RTYPE } from '@/util/common'
import app from '@/config/app';

const SERVICE = app.services.rule;
const CONTROLLER = 'ruleObjectMap';

export let ruleObjectMapRestController = {
    /**
     *分页查询对象库信息
     */
    findObjectsByRuleId: {
        service: SERVICE,
        controller: CONTROLLER,
        action: 'findObjectsByRuleId',
        type: RTYPE.GET
    },

    /**
     * 保存一个对象库信息
     */
    save: {
        service: SERVICE,
        controller: CONTROLLER,
        action: 'add',
        type: RTYPE.POST
    },

    /**
     * 删除一个对象库信息
     */
    remove: {
        service: SERVICE,
        controller: CONTROLLER,
        action: 'remove',
        type: RTYPE.DELETE
    },

    /**
     * 批量删除对象库信息
     */
    batchremove: {
        service: SERVICE,
        controller: CONTROLLER,
        action: 'batchremove',
        type: RTYPE.POST
    },

    /**
     * 验证编码的唯一性
     */
    batchInsert: {
        service: SERVICE,
        controller: CONTROLLER,
        action: 'batchInsert',
        type: RTYPE.POST
    }
}