import { RTYPE } from '@/util/common'
import app from '@/config/app';

const SERVICE = app.services.system;
const CONTROLLER = 'staffGroupRoleMap';

export let staffGroupRoleMapRestController = {
    /**
     *用户组关联角色保存
     */
    saveRole: {
        service: SERVICE,
        controller: CONTROLLER,
        action: 'saveRole',
        type: RTYPE.POST
    },
}