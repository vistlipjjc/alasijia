import { RTYPE } from '@/util/common'
import app from '@/config/app';

const SERVICE = app.services.system;
const CONTROLLER = 'menu';

export let menuRestController = {
    $setting: {
        menuCode: '',
        tenantRequired: false
    },

    /**
     * 加载菜单
     */
    load: {
        service: SERVICE,
        controller: CONTROLLER,
        action: 'treeNode',
        type: RTYPE.GET
    },

    /**
     * 保存
     */
    save: {
        service: SERVICE,
        controller: CONTROLLER,
        action: 'save',
        type: RTYPE.POST
    },

    /**
     * 移除
     */
    remove: {
        service: SERVICE,
        controller: CONTROLLER,
        action: 'removeNode',
        type: RTYPE.POST
    },

    /**
     * 移除
     */
    getTree: {
        service: SERVICE,
        controller: CONTROLLER,
        action: 'getTree',
        type: RTYPE.GET
    }
}
