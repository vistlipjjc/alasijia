import { RTYPE } from '@/util/common'
import app from '@/config/app';

const SERVICE = app.services.rule;
const CONTROLLER = 'functions';

export let functionsRestController = {
    $setting: {
        menuCode: 'rul.functions',
        tenantRequired: false
    },
    /**
     *分页查询函数库信息
     */
    query: {
        service: SERVICE,
        controller: CONTROLLER,
        action: 'query',
        type: RTYPE.GET
    },

    /**
     * 保存一个函数库信息
     */
    save: {
        service: SERVICE,
        controller: CONTROLLER,
        action: 'add',
        type: RTYPE.POST
    },

    /**
     * 删除一个函数库信息
     */
    remove: {
        service: SERVICE,
        controller: CONTROLLER,
        action: 'remove',
        type: RTYPE.DELETE
    },

    /**
     * 验证编码的唯一性
     */
    check: {
        service: SERVICE,
        controller: CONTROLLER,
        action: 'check',
        type: RTYPE.POST
    }
}