import { RTYPE } from '@/util/common'
import app from '@/config/app';

const SERVICE = app.services.rule;
const CONTROLLER = 'objects';

export let objectsRestController = {

    $setting: {
        menuCode: 'rul.objects',
        tenantRequired: false
    },
    /**
     *分页查询对象库信息
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
     * 验证编码的唯一性
     */
    check: {
        service: SERVICE,
        controller: CONTROLLER,
        action: 'check',
        type: RTYPE.POST
    }
}