import { RTYPE } from '@/util/common'
import app from '@/config/app';

const SERVICE = app.services.schedule;
const CONTROLLER = 'jobTrace';

export let jobTraceRestController = {

    /**
     * 根据jobinstid查找es日志集合
     */
    queryJobInstLog: {
        service: SERVICE,
        controller: CONTROLLER,
        action: 'traceJob',
        type: RTYPE.GET
    }
}