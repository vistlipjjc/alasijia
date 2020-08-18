import { RTYPE } from '@/util/common'
import app from '@/config/app';

const SERVICE = app.services.system;
const CONTROLLER = 'bizType';

export let bizTypeRestController = {

    $setting: {
        menuCode: '',
        tenantRequired: true
    },

    /**
     * 异步加载
     */
    treeNode: {
        service: SERVICE,
        controller: CONTROLLER,
        action: 'treeNode',
        type: RTYPE.GET
    },

    /**
     * 加载全部
     */
    load: {
        service: SERVICE,
        controller: CONTROLLER,
        action: 'load',
        type: RTYPE.GET
    }
}