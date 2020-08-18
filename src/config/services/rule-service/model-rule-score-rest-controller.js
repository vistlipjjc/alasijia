import { RTYPE } from '@/util/common'
import app from '@/config/app';

const SERVICE = app.services.rule;
const CONTROLLER = 'modelRuleScore';

export let modelRuleScoreRestController = {

    /**
     *分页查询规则集信息
     */
    query: {
        service: SERVICE,
        controller: CONTROLLER,
        action: 'query',
        type: RTYPE.GET
    },

    /**
     * 保存一个规则集信息
     */
    save: {
        service: SERVICE,
        controller: CONTROLLER,
        action: 'save',
        type: RTYPE.POST
    },

    /**
     * 删除一个规则集信息
     */
    remove: {
        service: SERVICE,
        controller: CONTROLLER,
        action: 'remove',
        type: RTYPE.DELETE
    }
}