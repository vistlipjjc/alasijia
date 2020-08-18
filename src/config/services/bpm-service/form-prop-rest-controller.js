import { RTYPE } from '@/util/common'
import app from '@/config/app';

const SERVICE = app.services.wf;
const CONTROLLER = 'formProp';

export let formPropRestController = {

    /**
     *不分页列表
     */
    list: {
        service: SERVICE,
        controller: CONTROLLER,
        action: 'list',
        type: RTYPE.POST
    },
    /**
     *不分页列表
     */
    save: {
        service: SERVICE,
        controller: CONTROLLER,
        action: 'save',
        type: RTYPE.POST
    },
    /**
     * 验证编码的唯一性
     */
    check: {
        service: SERVICE,
        controller: CONTROLLER,
        action: 'check',
        type: RTYPE.GET
    },
};
