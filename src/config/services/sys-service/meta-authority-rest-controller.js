import { RTYPE } from '@/util/common'
import app from '@/config/app';

const SERVICE = app.services.system;
const CONTROLLER = 'metaAuthority';

export let metaAuthorityRestController = {
    $setting: {
        menuCode: 'sys.meta.metaAuthority',
        tenantRequired: false
    },
    /**
     * 初始化查询
     */
    query: {
        service: SERVICE,
        controller:CONTROLLER,
        action: 'query',
        type: RTYPE.GET
    },

    //获取数据权限列表，右边table
    permitTypes: {
        service: SERVICE,
        controller:CONTROLLER,
        action: 'permitTypes',
        type: RTYPE.POST
    },

    //保存数据权限到这个角色
    saveAuthorityBelongDAK: {
        service: SERVICE,
        controller:CONTROLLER,
        action: 'saveAuthorityBelongDAK',
        type: RTYPE.POST
    },

    //保存区域权限
    saveRegionAuth: {
        service: SERVICE,
        controller:CONTROLLER,
        action: 'saveRegionAuth',
        type: RTYPE.POST
    },
    //保存表权限
    saveTableAuth: {
        service: SERVICE,
        controller:CONTROLLER,
        action: 'saveTableAuth',
        type: RTYPE.POST
    },


}