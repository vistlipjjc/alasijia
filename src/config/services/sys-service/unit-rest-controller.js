import { RTYPE } from '@/util/common'
import app from '@/config/app';

const SERVICE = app.services.system;
const CONTROLLER = 'unit';

export let unitRestController = {

    $setting: {
        menuCode: 'sys.authorization.unit',
        tenantRequired: false
    },

    /**
     * 加载机构
     */
    load: {
        service: SERVICE,
        controller: CONTROLLER,
        action: 'load',
        type: RTYPE.GET
    },
    /**
     * 异步加载机构
     */
    treeNode: {
        service: SERVICE,
        controller: CONTROLLER,
        action: 'treeNode',
        type: RTYPE.GET
    },

    /**
     * 查询当前机构或部门详情
     */
    removeNode: {
        service: SERVICE,
        controller: CONTROLLER,
        action: 'removeNode',
        type: RTYPE.DELETE
    },

    /**
     * 保存机构或部门信息
     */
    updateNode: {
        service: SERVICE,
        controller: CONTROLLER,
        action: 'updateNode',
        type: RTYPE.POST
    },

    /**
     * 验证编码的唯一性
     */
    check: {
        service: SERVICE,
        controller: CONTROLLER,
        action: 'check',
        type: RTYPE.GET
    },
    /**
     * 验证当前机构的机构类型是否为ORG
     */
    isOrg: {
        service: SERVICE,
        controller: CONTROLLER,
        action: 'isOrg',
        type: RTYPE.GET
    }
}