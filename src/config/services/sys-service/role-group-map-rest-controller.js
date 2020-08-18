import { RTYPE } from '@/util/common'
import app from '@/config/app';

const SERVICE = app.services.system;
const CONTROLLER = 'roleGroupMap';

export let roleGroupMapRestController = {
    /*保存 - 角色组添加的角色*/
    saveRoleMap:{
        service: SERVICE,
        controller: CONTROLLER,
        action: 'saveRoleMap',
        type: RTYPE.POST
    }
}