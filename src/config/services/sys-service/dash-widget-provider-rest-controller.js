import { RTYPE } from '@/util/common'
import app from '@/config/app';

const SERVICE = app.services.system;
const CONTROLLER = 'dashWidgetProvider';

export let dashWidgetProviderRestController = {
    $setting: {
        menuCode: 'sys.dashboard.dataProvider',
        tenantRequired: false
    },
    /**
     *分页查询信息
     */
    query: {
        service: SERVICE,
        controller: CONTROLLER,
        action: 'query',
        type: RTYPE.GET
    },

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
     * 删除
     */
    remove: {
        service: SERVICE,
        controller: CONTROLLER,
        action: 'remove',
        type: RTYPE.POST
    },
    /**
     *获得组件的列数据
     */
    getDataProviderByWidgetProvierId: {
        service: SERVICE,
        controller: CONTROLLER,
        action: 'getDataProviderByWidgetProvierId',
        type: RTYPE.GET
    },
    /**
     *验证组件是否绑定数据程序
     */
    verifyForDashWidgetProvider: {
        service: SERVICE,
        controller: CONTROLLER,
        action: 'verifyForDashWidgetProvider',
        type: RTYPE.GET
    }
}