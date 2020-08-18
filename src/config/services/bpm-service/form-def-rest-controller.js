import { RTYPE } from '@/util/common'
import app from '@/config/app';

const SERVICE = app.services.wf;
const CONTROLLER = 'formDef';

export let formDefRestController = {
    $setting: { //如果当前Controller配置了菜单，则需要配置 $setting，否则不需要配置。
        menuCode: 'workflow.base.formDef', //对应的菜单编码（sys_menu 表中的 menu_code_ 值）
        tenantRequired: false //是否有租户要求，业务级别菜单设置为 true。
    },
    /**
     *分页查询
     */
    query: {
        service: SERVICE,
        controller: CONTROLLER,
        action: 'query',
        type: RTYPE.GET
    },
    /**
     *启用表单
     */
    enable: {
        service: SERVICE,
        controller: CONTROLLER,
        action: 'enable',
        type: RTYPE.POST
    },
    /**
     *停用表单
     */
    disable: {
        service: SERVICE,
        controller: CONTROLLER,
        action: 'disable',
        type: RTYPE.POST
    },
    /**
     *保存
     */
    save: {
        service: SERVICE,
        controller: CONTROLLER,
        action: 'save',
        type: RTYPE.POST
    },
    remove: {
        service: SERVICE,
        controller: CONTROLLER,
        action: 'remove',
        type: RTYPE.POST
    }
};
