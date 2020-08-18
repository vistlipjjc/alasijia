import {RTYPE} from '@/util/common'
import app from '@/config/app';

const SERVICE = app.services.system;
const CONTROLLER = 'dashLayoutMap';

export let dashLayoutMapRestController = {
    $setting: {
        menuCode: 'sys.dashboard.dashLayoutMap',
        tenantRequired: false
    },
    /**
     *分页查询角色组信息
     */
    searchDashLayoutRoleGroupMap: {
        service: SERVICE,
        controller: CONTROLLER,
        action: 'searchDashLayoutRoleGroupMap',
        type: RTYPE.GET
    },


    /**
     *分页查询角色信息
     */
    searchDashLayoutRoleMap: {
        service: SERVICE,
        controller: CONTROLLER,
        action: 'searchDashLayoutRoleMap',
        type: RTYPE.GET
    },
    /**
     * 保存一个角色类型
     */
    roleGroupSave: {
        service: SERVICE,
        controller: CONTROLLER,
        action: 'roleGroupSave',
        type: RTYPE.POST
    },
    /**
     * 保存
     */
    roleLayoutMapSave: {
        service: SERVICE,
        controller: CONTROLLER,
        action: 'roleLayoutMapSave',
        type: RTYPE.POST
    },

    /**
     * 删除一个角色类型
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
    }
}