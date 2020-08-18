import { RTYPE } from '@/util/common'
import app from '@/config/app';

const SERVICE = app.services.wf;
const CONTROLLER = 'monitor';

export let monitorRestController = {

    candidates:{
        service: SERVICE,
        controller: CONTROLLER,
        action: 'candidates',
        type: RTYPE.POST
    },

};
