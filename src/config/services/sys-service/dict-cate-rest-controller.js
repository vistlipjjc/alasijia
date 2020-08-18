import { RTYPE } from '@/util/common'
import app from '@/config/app';

const SERVICE = app.services.system;
const CONTROLLER = 'dictCate';

export let dictCateRestController = {
    /**
     * 异步获取字典类别树
     */
    load: {
        service: SERVICE,
        controller: CONTROLLER,
        action: 'load',
        type: RTYPE.GET
    },
    /**
     * 获取字典类别树
     */
    treeNode: {
        service: SERVICE,
        controller: CONTROLLER,
        action: 'treeNode',
        type: RTYPE.GET
    },

    /**
     * 保存字典类型
     */
    updateNode: {
        service: SERVICE,
        controller: CONTROLLER,
        action: 'updateNode',
        type: RTYPE.POST
    },
    /**
     * 移除字典类型
     */
    remove: {
        service: SERVICE,
        controller: CONTROLLER,
        action: 'removeNode',
        type: RTYPE.POST
    }
}
