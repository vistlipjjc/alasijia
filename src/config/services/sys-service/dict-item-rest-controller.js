import { RTYPE } from '@/util/common'
import app from '@/config/app';

const SERVICE = app.services.system;
const CONTROLLER = 'dictItem';

export let dictItemRestController = {
    /**
     *分页字典项信息
     */
    query: {
        service: SERVICE,
        controller: CONTROLLER,
        action: 'query',
        type: RTYPE.GET
    },
    /**
     * 保存一个字典项信息
     */
    save: {
        service: SERVICE,
        controller: CONTROLLER,
        action: 'save',
        type: RTYPE.POST
    },
    /**
     * 删除一个字典信息
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
     * 验证编码的唯一性
     */
    getDictItems: {
        service: SERVICE,
        controller: CONTROLLER,
        action: 'getDictItems',
        type: RTYPE.GET
    }
}
