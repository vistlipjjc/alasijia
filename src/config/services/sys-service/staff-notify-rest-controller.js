import { RTYPE } from '@/util/common'
import app from '@/config/app';

const SERVICE = app.services.system;
const CONTROLLER = 'staffNotify'

export let staffNotifyRestController = {
    /**
     *获取当前登录用户的通知配置
     */
    query: {
        service: SERVICE,
        controller: CONTROLLER,
        action: 'queryNotifyByStaffCode',
        type: RTYPE.GET
    },
    /**
     *标记已读
     */
    markAsRead: {
        service: SERVICE,
        controller: CONTROLLER,
        action: 'markAsRead',
        type: RTYPE.POST
    },
    /**
     *同步状态
     */
    synch: {
        service: SERVICE,
        controller: CONTROLLER,
        action: 'synch',
        type: RTYPE.GET
    },
    /**
     *标记未读
     */
    markAsUnread: {
        service: SERVICE,
        controller: CONTROLLER,
        action: 'markAsUnread',
        type: RTYPE.POST
    },
    /**
     *标记全部已读
     */
    markAllAsRead: {
        service: SERVICE,
        controller: CONTROLLER,
        action: 'markAllAsRead',
        type: RTYPE.POST
    },
    /**
     *逻辑删除
     */
    deleteFlag: {
        service: SERVICE,
        controller: CONTROLLER,
        action: 'deleteFlag',
        type: RTYPE.POST
    },
    /**
     *彻底删除
     */
    deleteCompletely: {
        service: SERVICE,
        controller: CONTROLLER,
        action: 'deleteCompletely',
        type: RTYPE.DELETE
    },
    /**
     *恢复
     */
    recovery: {
        service: SERVICE,
        controller: CONTROLLER,
        action: 'recovery',
        type: RTYPE.POST
    }
}
