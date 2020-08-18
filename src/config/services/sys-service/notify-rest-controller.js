import { RTYPE } from '@/util/common';
import app from '@/config/app';

const SERVICE = app.services.system;
const CONTROLLER = 'notify';

export let notifyRestController = {
    /**
     *分页查询公告信息
     */
    queryNotify: {
        service: SERVICE,
        controller: CONTROLLER,
        action: 'queryNotify',
        type: RTYPE.GET
    },
    /**
     * 发公告
     */
    saveAnnounce: {
        service: SERVICE,
        controller: CONTROLLER,
        action: 'saveAnnounce',
        type: RTYPE.PUT
    },
    saveAnnounceDraft: {
        service: SERVICE,
        controller: CONTROLLER,
        action: 'saveAnnounceDraft',
        type: RTYPE.PUT
    },
    view: {
        service: SERVICE,
        controller: CONTROLLER,
        action: 'view',
        type: RTYPE.GET
    },
    /**
     * 根据ids批量删除公告
     */
    remove: {
        service: SERVICE,
        controller: CONTROLLER,
        action: 'remove',
        type: RTYPE.DELETE
    },
    /**
     * 保存私信
     */
    saveMessage: {
        service: SERVICE,
        controller: CONTROLLER,
        action: 'saveMessage',
        type: RTYPE.PUT
    },
    /**
     * 保存私信草稿
     */
    saveMessageDraft: {
        service: SERVICE,
        controller: CONTROLLER,
        action: 'saveMessageDraft',
        type: RTYPE.PUT
},
    /**
     * 逻辑删除
     */
    deleteFlag: {
        service: SERVICE,
        controller: CONTROLLER,
        action: 'deleteFlag',
        type: RTYPE.POST
    },
    /**
     * 同步草稿箱数量
     */
    synch: {
        service: SERVICE,
        controller: CONTROLLER,
        action: 'synch',
        type: RTYPE.GET
    },
    /**
     * 公告预览获取收件人
     */
    previewReceiver: {
        service: SERVICE,
        controller: CONTROLLER,
        action: 'previewReceiver',
        type: RTYPE.GET
    }
}
