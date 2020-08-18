import { RTYPE } from '@/util/common'
import app from '@/config/app';

const SERVICE = app.services.system;
const CONTROLLER = 'metaRegion';

export let metaRegionRestController = {

    $setting: {
        menuCode: 'sys.meta.metaRegion',
        tenantRequired: false
    },

    /**
     * 初始化查询
     */
    query: {
        service: SERVICE,
        controller:CONTROLLER,
        action: 'query',
        type: RTYPE.GET
    },

    //元数据管理加载树
    treeNode:{
        service: SERVICE,
        controller:CONTROLLER,
        action: 'treeNode',
        type: RTYPE.GET
    },

    treeNodeTwo:{
        service: SERVICE,
        controller:CONTROLLER,
        action: 'treeNode',
        type: RTYPE.GET
    },

    //元数据授权加载树
    getRegionTreeByRoleCode: {
        service: SERVICE,
        controller:CONTROLLER,
        action: 'getRegionTreeByRoleCode',
        type: RTYPE.POST
    },

    //删除树节点
    remove: {
        service: SERVICE,
        controller:CONTROLLER,
        action: 'removeNode',
        type: RTYPE.POST
    },

    //更改元数据区域
    update:{
        service: SERVICE,
        controller:CONTROLLER,
        action: 'updateNode',
        type: RTYPE.POST
    },
}