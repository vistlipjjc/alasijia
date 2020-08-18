import {RTYPE} from '@/util/common'
import app from '@/config/app';

const SERVICE = app.services.wf;
const CONTROLLER = 'procTemplate';

export let procTemplateRestController = {

    $setting: { //如果当前Controller配置了菜单，则需要配置 $setting，否则不需要配置。
        menuCode: 'workflow.base.procTemplate', //对应的菜单编码（sys_menu 表中的 menu_code_ 值）
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
     *部署
     */
    deploy: {
        service: SERVICE,
        controller: CONTROLLER,
        action: 'deploy',
        type: RTYPE.POST
    },

    /**
     *卸载
     */
    undeploy: {
        service: SERVICE,
        controller: CONTROLLER,
        action: 'undeploy',
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


    getProcInstDiagram: {
        service: SERVICE,
        controller: CONTROLLER,
        action: 'getProcInstDiagram',
        type: RTYPE.GET
    }

};
