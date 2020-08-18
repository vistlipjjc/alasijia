import { RTYPE } from '@/util/common'
import app from '@/config/app';

const SERVICE = app.services.system;
const CONTROLLER = 'notifyConfig'

export let notifyConfigRestController = {
    /**
     *获取当前登录用户的通知配置
     */
    getNotifyConfigId: {
        service: SERVICE,
        controller: CONTROLLER,
        action: 'getNotifyConfigId',
        type: RTYPE.GET
    },

    /**
     * 保存默认配置
     */
    save: {
        service: SERVICE,
        controller: CONTROLLER,
        action: 'save',
        type: RTYPE.POST
    },    /**
     * 查询指定用户是否在黑名单中
     */
    getBlacklistByStaffCode: {
        service: SERVICE,
        controller: CONTROLLER,
        action: 'getBlacklistByStaffCode',
        type: RTYPE.GET
    },
    /**
     * 添加黑名单
     */
    addBlacklist: {
        service: SERVICE,
        controller: CONTROLLER,
        action: 'addBlacklist',
        type: RTYPE.PUT
    }
}
