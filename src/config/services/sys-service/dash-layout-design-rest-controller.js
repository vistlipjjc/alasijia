import { RTYPE } from '@/util/common'
import app from '@/config/app';

const SERVICE = app.services.system;
const CONTROLLER = 'dashLayoutDesign';

export let dashLayoutDesignRestController = {
    /**
     *请求经过解析的组件内容,html代码，该方法应该处理组件的数据权限
     */
    getWidgetContent: {
        service: SERVICE,
        controller: CONTROLLER,
        action: 'getWidgetContent',
        type: RTYPE.POST
    },
    /**
     *布局设计页面，下拉框显示启用的组件
     */
    getAllSelectWidget: {
        service: SERVICE,
        controller: CONTROLLER,
        action: 'getAllSelectWidget',
        type: RTYPE.POST
    }
}