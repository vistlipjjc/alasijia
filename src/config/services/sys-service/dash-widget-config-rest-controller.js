import {RTYPE} from '@/util/common'
import app from '@/config/app';

const SERVICE = app.services.system;
const CONTROLLER = 'dashWidgetConfig';

export let dashWidgetConfigRestController = {

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
     * 根据组件编码查询出组件设计
     */
    getWidgetConfigByWidgetCode: {
        service: SERVICE,
        controller: CONTROLLER,
        action: 'getWidgetConfigByWidgetCode',
        type: RTYPE.POST
    },
}