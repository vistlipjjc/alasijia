import {RTYPE} from '@/util/common'
import app from '@/config/app';

const SERVICE = app.services.wf;
const CONTROLLER = 'approve';

export let approveRestController = {

    $setting: { //如果当前Controller配置了菜单，则需要配置 $setting，否则不需要配置。
        menuCode: 'workflow.myApprove.todo', //对应的菜单编码（sys_menu 表中的 menu_code_ 值）
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

    //在任务前面插入节点
    insertTasksBefore: {
        service: SERVICE,
        controller: CONTROLLER,
        action: 'insertTasksBefore',
        type: RTYPE.POST
    },

    //在任务后面插入节点
    insertTasksAfter: {
        service: SERVICE,
        controller: CONTROLLER,
        action: 'insertTasksAfter',
        type: RTYPE.POST
    },
    //转办
    transfer: {
        service: SERVICE,
        controller: CONTROLLER,
        action: 'transfer',
        type: RTYPE.POST
    },

    queryHis: {
        service: SERVICE,
        controller: CONTROLLER,
        action: 'queryHis',
        type: RTYPE.GET
    },

    //挂起
    suspend: {
        service: SERVICE,
        controller: CONTROLLER,
        action: 'suspend',
        type: RTYPE.POST
    },
    //激活
    activate: {
        service: SERVICE,
        controller: CONTROLLER,
        action: 'activate',
        type: RTYPE.POST
    },

    reject:{
        service: SERVICE,
        controller: CONTROLLER,
        action: 'reject',
        type: RTYPE.POST
    },

    complete:{
        service: SERVICE,
        controller: CONTROLLER,
        action: 'complete',
        type: RTYPE.POST
    },

    queryTaskList:{
        service: SERVICE,
        controller: CONTROLLER,
        action: 'queryTaskList',
        type: RTYPE.GET
    },
    queryNodeList:{
        service: SERVICE,
        controller: CONTROLLER,
        action: 'queryNodeList',
        type: RTYPE.GET
    },

    terminate:{
        service: SERVICE,
        controller: CONTROLLER,
        action: 'terminate',
        type: RTYPE.POST
    },

    moveTo:{
        service: SERVICE,
        controller: CONTROLLER,
        action: 'moveTo',
        type: RTYPE.POST
    },

    queryNoCandidate:{
        service: SERVICE,
        controller: CONTROLLER,
        action: 'queryNoCandidate',
        type: RTYPE.GET
    },
    queryNodeKey:{
        service: SERVICE,
        controller: CONTROLLER,
        action: 'queryNodeKey',
        type: RTYPE.GET
    },
    queryNoCandidate:{
        service: SERVICE,
        controller: CONTROLLER,
        action: 'queryNoCandidate',
        type: RTYPE.GET
    },
};
