import {RTYPE} from '@/util/common'
import app from '@/config/app';

const SERVICE = app.services.wf;
const CONTROLLER = 'procDef';

export let procDefRestController = {

    $setting: { //如果当前Controller配置了菜单，则需要配置 $setting，否则不需要配置。
        menuCode: 'workflow.base.procDef', //对应的菜单编码（sys_menu 表中的 menu_code_ 值）
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
     *分页查询
     */
    save: {
        service: SERVICE,
        controller: CONTROLLER,
        action: 'save',
        type: RTYPE.POST
    },
    /**
     * 删除
     */
    remove: {
        service: SERVICE,
        controller: CONTROLLER,
        action: 'remove',
        type: RTYPE.POST
    },

    /**
     *启用
     */
    enable: {
        service: SERVICE,
        controller: CONTROLLER,
        action: 'enable',
        type: RTYPE.POST
    },

    /**
     *停用
     */
    disable: {
        service: SERVICE,
        controller: CONTROLLER,
        action: 'disable',
        type: RTYPE.POST
    },

    /**
     *验证提交的code是否已经存在数据库中
     */
    check: {
        service: SERVICE,
        controller: CONTROLLER,
        action: 'check',
        type: RTYPE.POST
    },
    pointNodeImage: {
        service: SERVICE,
        controller: CONTROLLER,
        action: 'pointNodeImage',
        type: RTYPE.GET
    },
    selectNodes: {
        service: SERVICE,
        controller: CONTROLLER,
        action: 'selectNodes',
        type: RTYPE.POST
    },
    loadBizModule: {
        service: SERVICE,
        controller: CONTROLLER,
        action: 'loadBizModule',
        type: RTYPE.GET
    },
    selectProcVarMap: {
        service: SERVICE,
        controller: CONTROLLER,
        action: 'selectProcVarMap',
        type: RTYPE.GET
    },
    queryFormProp: {
        service: SERVICE,
        controller: CONTROLLER,
        action: 'queryFormProp',
        type: RTYPE.GET
    },
    updateProcVarMap: {
        service: SERVICE,
        controller: CONTROLLER,
        action: 'updateProcVarMap',
        type: RTYPE.POST
    },
    getNodeProcAuth: {
        service: SERVICE,
        controller: CONTROLLER,
        action: 'getNodeProcAuth',
        type: RTYPE.POST
    },

    updateNodeProcAuth: {
        service: SERVICE,
        controller: CONTROLLER,
        action: 'updateNodeProcAuth',
        type: RTYPE.POST
    },

    selectUnitScop: {
        service: SERVICE,
        controller: CONTROLLER,
        action: 'selectUnitScop',
        type: RTYPE.GET
    },

    newProcDef: {
        service: SERVICE,
        controller: CONTROLLER,
        action: 'newProcDef',
        type: RTYPE.POST
    },

    copy: {
        service: SERVICE,
        controller: CONTROLLER,
        action: 'copy',
        type: RTYPE.POST
    }

};
