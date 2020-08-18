import { RTYPE } from '@/util/common'
import app from '@/config/app';

const SERVICE = app.services.system;
const CONTROLLER = 'metaTable';

export let metaTableRestController = {

    $setting: {
        menuCode: 'sys.meta.metaTable',
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

    //查询table元数据
    queryMetaTable:{
        service:SERVICE,
        controller:CONTROLLER,
        action:'queryMetatable',
        type:RTYPE.GET
    },

    //同步模态框查询table
    queryTables:{
        service:SERVICE,
        controller:CONTROLLER,
        action:'queryTables',
        type:RTYPE.POST
    },

    //同步数据
    syncCheckMetaTable: {
        service:SERVICE,
        controller:CONTROLLER,
        action:'syncCheckMetaTable',
        type:RTYPE.POST
    },

    //删除元数据table 中的表
    remove: {
        service:SERVICE,
        controller:CONTROLLER,
        action:'remove',
        type:RTYPE.POST
    },

    //查询表字段
    querySchema:{
        service:SERVICE,
        controller:CONTROLLER,
        action:'querySchema',
        type:RTYPE.GET
    },

    //导出excel
    exportAll:{
        service:SERVICE,
        controller:CONTROLLER,
        action:'exportAll',
        type:RTYPE.POST
    },

    //查询数据区域下对应的表数据
    queryMetatableExclude:{
        service:SERVICE,
        controller:CONTROLLER,
        action:'queryMetatableExclude',
        type:RTYPE.GET
    }



}