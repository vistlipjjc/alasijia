import { RTYPE } from '@/util/common'
import app from '@/config/app';

const SERVICE = app.services.wf;
const CONTROLLER = 'procLog';

export let procLogRestController = {

    /**
     *获得历史操作记录
     */
    hisLog: {
        service: SERVICE,
        controller: CONTROLLER,
        action: 'hisLog',
        type: RTYPE.GET
    },

};
