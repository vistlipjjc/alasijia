import { RTYPE } from '@/util/common'
import app from '@/config/app';

const SERVICE = app.services.system;
const CONTROLLER = 'authorization';

export let authorizationRestController = {
    $setting: {
        menuCode: 'sys.authorization.authorization',
        tenantRequired: false
    },
    /**
     * 查询权限数据
     */
    query: {
        service: SERVICE,
        controller: CONTROLLER,
        action: 'query',
        type: RTYPE.GET
    },
    /**
     * 保存菜单权限
     */
    save: {
        service: SERVICE,
        controller: CONTROLLER,
        action: 'save',
        type: RTYPE.POST
    },
    /**
     * 保存数据权限
     */
    savePermit: {
        service: SERVICE,
        controller: CONTROLLER,
        action: 'savePermit',
        type: RTYPE.POST
    }
}
