import { RTYPE } from '@/util/common'
import app from '@/config/app';

const SERVICE = app.services.schedule;
const CONTROLLER = 'jobInst';

export let jobInstRestController = {

    $setting: {
        menuCode: 'sch.schMonitor',
        tenantRequired: false
    },

    /**
     * 获取统计数据
     */
    getData: {
        service: SERVICE,
        controller: CONTROLLER,
        action: 'getStatisticalData',
        type: RTYPE.GET
    },

    /**
     * 获取服务
     */
    getService: {
        service: SERVICE,
        controller: CONTROLLER,
        action: 'getService',
        type: RTYPE.GET
    }

}