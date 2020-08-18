import { RTYPE } from '@/util/common'
import app from '@/config/app';

const SERVICE = app.services.wf;
const CONTROLLER = 'bizModule';

export let bizModuleRestController = {
    $setting: { //如果当前Controller配置了菜单，则需要配置 $setting，否则不需要配置。
        menuCode: 'workflow.base.bizModule', //对应的菜单编码（sys_menu 表中的 menu_code_ 值）
        tenantRequired: false //是否有租户要求，业务级别菜单设置为 true。
    },
    /**
     *初始化加载数据
     */
    treeNode: {
        service: SERVICE,
        controller: CONTROLLER,
        action: 'treeNode',
        type: RTYPE.GET
    },
    /**
     *保存或更新
     */
    updateNode: {
        service: SERVICE,
        controller: CONTROLLER,
        action: 'updateNode',
        type: RTYPE.POST
    },
    /**
     *删除节点
     */
    removeNode: {
        service: SERVICE,
        controller: CONTROLLER,
        action: 'removeNode',
        type: RTYPE.DELETE
    },
    /**
     *删除节点
     */
    check: {
        service: SERVICE,
        controller: CONTROLLER,
        action: 'check',
        type: RTYPE.GET
    },
};
