import { RTYPE } from '@/util/common'
import app from '@/config/app';

const SERVICE = app.services.wf;
const CONTROLLER = 'procAutoTransfer';

export let procAutoTransferRestController = {
    $setting: { //如果当前Controller配置了菜单，则需要配置 $setting，否则不需要配置。
        menuCode: 'workflow.procAutoTransfer', //对应的菜单编码（sys_menu 表中的 menu_code_ 值）
        tenantRequired: false //是否有租户要求，业务级别菜单设置为 true。
    },
    /**
     *列表查询
     */
    query: {
        service: SERVICE,
        controller: CONTROLLER,
        action: 'query',
        type: RTYPE.GET
    },
    /**
     *保存
     */
    save: {
        service: SERVICE,
        controller: CONTROLLER,
        action: 'save',
        type: RTYPE.PUT
    },
    /**
     *保存
     */
    isTransfered: {
        service: SERVICE,
        controller: CONTROLLER,
        action: 'isTransfered',
        type: RTYPE.POST
    },
    /**
     *删除
     */
    remove: {
        service: SERVICE,
        controller: CONTROLLER,
        action: 'remove',
        type: RTYPE.DELETE
    },
};
