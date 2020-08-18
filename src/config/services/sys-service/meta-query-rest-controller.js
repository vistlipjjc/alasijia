import { RTYPE } from '@/util/common'
import app from '@/config/app';

const SERVICE = app.services.system;
const CONTROLLER = 'metaQuery';

export let metaQueryRestController = {


    /**
     * 初始化查询表格
     */
    get: {
        service: SERVICE,
        controller:CONTROLLER,
        action: 'get',
        type: RTYPE.POST
    },
    //对保存的查询进行访问
    edit : {
        service: SERVICE,
        controller:CONTROLLER,
        action: 'edit',
        type: RTYPE.POST
    },
    /**
    * 根据脚本查询
    */
    queryResult: {
        service: SERVICE,
        controller:CONTROLLER,
        action: 'queryResult',
        type: RTYPE.POST
    },
    /**
     * 保存
     */
    save: {
        service: SERVICE,
        controller:CONTROLLER,
        action: 'save',
        type: RTYPE.POST
    },
    //另存为视图
    saveView:{
        service:SERVICE,
        controller:CONTROLLER,
        action:'saveView',
        type:RTYPE.POST
    },

    //查询同步数据源
    syncQuery:{
        service: SERVICE,
        controller:CONTROLLER,
        action: 'query',
        type: RTYPE.GET
    },

    //验证查询是否是自己写的
    verify:{
        service: SERVICE,
        controller:CONTROLLER,
        action: 'verify',
        type: RTYPE.POST
    },

    //删除对应的查询
    remove:{
        service: SERVICE,
        controller:CONTROLLER,
        action: 'remove',
        type: RTYPE.POST
    },

    //查询
    queryChild:{
        service: SERVICE,
        controller:CONTROLLER,
        action: 'queryChild',
        type: RTYPE.POST
    }
}