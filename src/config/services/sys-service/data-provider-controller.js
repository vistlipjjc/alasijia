import { RTYPE } from '@/util/common'
import app from '@/config/app';

const SERVICE = app.services.system;
const CONTROLLER = 'dataProvider';

export let dataProviderRestController = {

    $setting: {
        menuCode: 'sys.dashboard.dataProvider',
        tenantRequired: false
    },

    /**
     * 初始化查询表格
     */
    query: {
        service: SERVICE,
        controller:CONTROLLER,
        action: 'query',
        type: RTYPE.GET
    },

    /**
     * 同步数据查询表格
     */

/*    syncQuery: {
        service: SERVICE,
        controller: CONTROLLER,
        action: 'query',
        type: RTYPE.GET
    },*/
    /**
     * 保存
     */
    save: {
        service: SERVICE,
        controller: CONTROLLER,
        action: 'save',
        type: RTYPE.POST
    },

    /**
     * 删除一条数据
     */
    remove: {
        service: SERVICE,
        controller: CONTROLLER,
        action: 'remove',
        type: RTYPE.DELETE
    }
}