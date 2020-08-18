import { RTYPE } from '@/util/common'
import app from '@/config/app';

const SERVICE = app.services.rule;
const CONTROLLER = 'rules';

export let rulesRestController = {
    /**

     *分页查询规则库信息
     */
    query: {
        service: SERVICE,
        controller: CONTROLLER,
        action: 'query',
        type: RTYPE.GET
    },

    /**
     * 保存一个对象库信息
     */
    save: {
        service: SERVICE,
        controller: CONTROLLER,
        action: 'save',
        type: RTYPE.POST
    },

    /**
     * 删除一个对象库信息
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
        type: RTYPE.POST
    },

    /**
     *
     */
    compile: {
        service: SERVICE,
        controller: CONTROLLER,
        action: 'compile',
        type: RTYPE.POST
    },
    /**
     *
     */
    design: {
        service: SERVICE,
        controller: CONTROLLER,
        action: 'design',
        type: RTYPE.GET
    }

}