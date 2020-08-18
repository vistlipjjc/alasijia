import {RTYPE} from '@/util/common'
import app from '@/config/app';

const SERVICE = app.services.system;
const CONTROLLER = 'dashWidgetDak';

export let dashWidgetDakRestController = {

    $setting: {
        menuCode: 'sys.dashboard.dashWidgetDak',
        tenantRequired: false
    },
    /**
     *分页查询用户信息
     */
    permitTypes: {
        service: SERVICE,
        controller: CONTROLLER,
        action: 'permitTypes',
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
    getWidgetData: {
        service: SERVICE,
        controller: CONTROLLER,
        action: 'getWidgetData',
        type: RTYPE.POST
    },
    /**
     * 启用
     */
    getPermitData: {
        service: SERVICE,
        controller: CONTROLLER,
        action: 'getPermitData',
        type: RTYPE.POST
    },


}