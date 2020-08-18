import { RTYPE } from '@/util/common'
import app from '@/config/app';

const SERVICE = app.services.system;
const CONTROLLER = 'staffGroupRoleGroupMap';

export let staffGroupRoleGroupMapRestController = {
    /**
     *用户组关联角色组保存
     */
    saveRoleGroup: {
        service: SERVICE,
        controller: CONTROLLER,
        action: 'saveRoleGroup',
        type: RTYPE.POST
    },
}