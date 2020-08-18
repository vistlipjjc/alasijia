import { RTYPE } from '@/util/common'
import app from '@/config/app';

const SERVICE = app.services.system;
const CONTROLLER = 'staffGroupMap';

export let staffGroupMapRestController = {

    /**
     *根据用户组编码获取用户列表信息
     */
    queryStaff: {
        service: SERVICE,
        controller: CONTROLLER,
        action: 'queryStaff',
        type: RTYPE.GET
    },
    /**
     *保存，用户组设定的用户
     */
    saveStaffMap:{
        service: SERVICE,
        controller: CONTROLLER,
        action: 'saveStaffMap',
        type: RTYPE.POST
    },
    /**
     *用户加入用户组
     */
    saveStaffGroup:{
        service: SERVICE,
        controller: CONTROLLER,
        action: 'saveStaffGroup',
        type: RTYPE.POST
    },
    /**
     * 根据用户编码查询用户组
     */
    selectStaffGroupByStaffCode: {
        service: SERVICE,
        controller: CONTROLLER,
        action: 'selectStaffGroupByStaffCode',
        type: RTYPE.GET
    }

}