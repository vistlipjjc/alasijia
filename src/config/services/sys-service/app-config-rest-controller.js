import { RTYPE } from '@/util/common'
import app from '@/config/app';

const SERVICE = app.services.system;
const CONTROLLER = 'appConfig';

export let appConfigRestController = {
    /**
     * 获取系统参数
     */
    sysList: {
        service: SERVICE,
        controller: CONTROLLER,
        action: 'sysList',
        type: RTYPE.GET
    },
    /**
     * 保存系统参数
     */
    save: {
        service: SERVICE,
        controller: CONTROLLER,
        action: 'save',
        type: RTYPE.POST
    },
    /**
     * 获取应用参数
     */
    load: {
        service: SERVICE,
        controller: CONTROLLER,
        action: 'treeNode',
        type: RTYPE.GET
    },
    /**
     * 保存应用参数
     */
    updateNode: {
        service: SERVICE,
        controller: CONTROLLER,
        action: 'updateNode',
        type: RTYPE.POST
    },
    removeNode: {
        service: SERVICE,
        controller: CONTROLLER,
        action: 'removeNode',
        type: RTYPE.POST
    },
}
