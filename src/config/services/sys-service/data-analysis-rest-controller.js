import { RTYPE } from '@/util/common'
import app from '@/config/app';

const SERVICE = app.services.system;
const CONTROLLER = 'dataAnalysis';

export let dataAnalysisRestController = {

    $setting: {
        menuCode: 'sys.meta.dataAnalysis',
        tenantRequired: false
    },

    /**
     * 初始化查询表格
     */
    queryTableTree: {
        service: SERVICE,
        controller:CONTROLLER,
        action: 'queryTableTree',
        type: RTYPE.GET
    },
    /**
     * 查看sql
     */
    viewSql: {
        service: SERVICE,
        controller:CONTROLLER,
        action: 'viewSql',
        type: RTYPE.GET
    },
    /**
     * 验证视图名字是否已存在
     */
    checkViewName: {
        service: SERVICE,
        controller:CONTROLLER,
        action: 'checkViewName',
        type: RTYPE.POST
    },


}