import { RTYPE } from '@/util/common'
import app from '@/config/app';

const SERVICE = app.services.system;
const CONTROLLER = 'duty';

export let dutyRestController = {
    /**
     *保存，用户设定的角色
     */
    saveRoleStaff: {
        service: SERVICE,
        controller: CONTROLLER,
        action: 'saveRoleStaff',
        type: RTYPE.POST
    },
    /**
     * 保存，用户设定的角色组
     */
    saveRoleGroupStaff: {
        service: SERVICE,
        controller: CONTROLLER,
        action: 'saveRoleGroupStaff',
        type: RTYPE.POST
    }

}
