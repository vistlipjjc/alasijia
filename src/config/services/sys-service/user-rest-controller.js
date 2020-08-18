import { RTYPE } from '@/util/common'
import app from '@/config/app';

const SERVICE = app.services.system;
const CONTROLLER = 'user';

export let userRestController = {
    checkOldPass: {
        service: SERVICE,
        controller: CONTROLLER,
        action: 'checkOldPass',
        type: RTYPE.GET
    },
    savePass: {
        service: SERVICE,
        controller: CONTROLLER,
        action: 'savePass',
        type: RTYPE.POST
    },

    // 重置密码
    resetPass: {
        service: SERVICE,
        controller: CONTROLLER,
        action: 'resetPass',
        type: RTYPE.POST
    },
}
