import { RTYPE } from '@/util/common'
import app from '@/config/app';

const SERVICE = app.services.schedule;
const CONTROLLER = 'jobGroup';

export let jobGroupRestController = {

    $setting: {
        menuCode: 'sch.jobGroup',
        tenantRequired: false
    },

    /**
     * 查询任务类型
     */
    query: {
        service: SERVICE,
        controller: CONTROLLER,
        action: 'query',
        type: RTYPE.GET
    },

    /**
     * 根据编码获取数据
     */
    get: {
        service: SERVICE,
        controller: CONTROLLER,
        action: 'getJobGroup',
        type: RTYPE.GET
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
     * 保存任务类型
     */
    save: {
        service: SERVICE,
        controller: CONTROLLER,
        action: 'save',
        type: RTYPE.POST
    },

    /**
     * 删除
     */
    remove: {
        service: SERVICE,
        controller: CONTROLLER,
        action: 'remove',
        type: RTYPE.POST
    }
}