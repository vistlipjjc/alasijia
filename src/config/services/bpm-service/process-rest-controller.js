import { RTYPE } from '@/util/common'
import app from '@/config/app';

const SERVICE = app.services.wf;
const CONTROLLER = 'process';

export let processRestController = {

    $setting: { //如果当前Controller配置了菜单，则需要配置 $setting，否则不需要配置。
        menuCode: 'workflow.monitor.procUpdate', //对应的菜单编码（sys_menu 表中的 menu_code_ 值）
        tenantRequired: false //是否有租户要求，业务级别菜单设置为 true。
    },

    /**
     *分页查询
     */
    queryHistory: {
        service: SERVICE,
        controller: CONTROLLER,
        action: 'queryHistory',
        type: RTYPE.GET
    },

    /**
     * 保存业务数据
     */
    save: {
        service: SERVICE,
        controller: CONTROLLER,
        action: 'save',
        type: RTYPE.POST
    },

    /**
     * 保存业务数据
     */
    saveAndStart: {
        service: SERVICE,
        controller: CONTROLLER,
        action: 'saveAndStart',
        type: RTYPE.POST
    },

    getProcInstDiagram:{
        service: SERVICE,
        controller: CONTROLLER,
        action: 'getProcInstDiagram',
        type: RTYPE.GET
    },

    getProcInstData:{
        service: SERVICE,
        controller: CONTROLLER,
        action: 'getProcInstData',
        type: RTYPE.POST
    },

    /**
     *分页查询
     */
    queryData: {
        service: SERVICE,
        controller: CONTROLLER,
        action: 'queryData',
        type: RTYPE.GET
    },
    /**
     * 编辑业务数据
     */
    editDraftProcInst: {
        service: SERVICE,
        controller: CONTROLLER,
        action: 'editDraftProcInst',
        type: RTYPE.POST
    },
    /**
     * 提交
     */
    submit: {
        service: SERVICE,
        controller: CONTROLLER,
        action: 'submit',
        type: RTYPE.POST
    },
    /**
     * 删除流程
     */
    delete: {
        service: SERVICE,
        controller: CONTROLLER,
        action: 'delete',
        type: RTYPE.DELETE
    },
    queryNotifyDataError:{
        service: SERVICE,
        controller: CONTROLLER,
        action: 'queryNotifyDataError',
        type: RTYPE.GET
    },
    queryLongTime:{
        service: SERVICE,
        controller: CONTROLLER,
        action: 'queryLongTime',
        type:RTYPE.GET

    },

    getAuth: {
        service: SERVICE,
        controller: CONTROLLER,
        action: 'getAuth',
        type:RTYPE.POST
    }
};
