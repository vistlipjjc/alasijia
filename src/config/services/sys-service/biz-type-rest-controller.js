import { RTYPE } from '@/util/common'
import app from '@/config/app';

const SERVICE = app.services.system;
const CONTROLLER = 'bizType';

export let bizTypeRestController = {

    $setting: {
        bizTypeCode: '',
        tenantRequired: false
    },
    /**
     * 加载数据
     */
    load: {
        service: SERVICE,
        controller: CONTROLLER,
        action: 'load',
        type: RTYPE.GET
    },
    treeNode: {
        service: SERVICE,
        controller: CONTROLLER,
        action: 'treeNode',
        type: RTYPE.GET
    },
    /**
     * 新增节点
     */
    updateNode: {
        service: SERVICE,
        controller: CONTROLLER,
        action: 'updateNode',
        type: RTYPE.POST
    },
    /**
     * 移除业务种类表节点
     */
    remove: {
        service: SERVICE,
        controller: CONTROLLER,
        action: 'removeNode',
        type: RTYPE.POST
    },

}