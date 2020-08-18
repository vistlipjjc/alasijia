import { RTYPE } from '@/util/common'
import app from '@/config/app';

const SERVICE = app.services.schedule;
const CONTROLLER = 'jobEntity';

export let jobEntityRestController = {

    $setting: {
        menuCode: 'sch.jobEntity',
        tenantRequired: false
    },

    /**
     * 查询任务调度
     */
    query: {
        service: SERVICE,
        controller: CONTROLLER,
        action: 'query',
        type: RTYPE.GET
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

    /**
     * 保存任务调度
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
     * 启动任务
     */
    start: {
        service: SERVICE,
        controller: CONTROLLER,
        action: 'start',
        type: RTYPE.POST
    },

    /**
     * 暂停任务
     */
    pause: {
        service: SERVICE,
        controller: CONTROLLER,
        action: 'pause',
        type: RTYPE.POST
    },

    /**
     * 停止任务
     */
    stop: {
        service: SERVICE,
        controller: CONTROLLER,
        action: 'stop',
        type: RTYPE.POST
    },

    /**
     * 启动全部任务
     */
    startAll: {
        service: SERVICE,
        controller: CONTROLLER,
        action: 'startAll',
        type: RTYPE.POST
    },

    /**
     * 暂停全部任务
     */
    pauseAll: {
        service: SERVICE,
        controller: CONTROLLER,
        action: 'pauseAll',
        type: RTYPE.POST
    },

    /**
     * 停止全部任务
     */
    stopAll: {
        service: SERVICE,
        controller: CONTROLLER,
        action: 'stopAll',
        type: RTYPE.POST
    },

    /**
     * 启动一次Job实例
     */
    startOnce: {
        service: SERVICE,
        controller: CONTROLLER,
        action: 'startOnce',
        type: RTYPE.GET
    },

    /**
     * 通过groupCode查找jobCode
     */
    queryJobCodeByGroupCode: {
        service: SERVICE,
        controller: CONTROLLER,
        action: 'queryJobCodeByGroupCode',
        type: RTYPE.GET
    },

    /**
     * 查找jobCode
     */
    queryJobCode: {
        service: SERVICE,
        controller: CONTROLLER,
        action: 'queryJobCode',
        type: RTYPE.GET
    },

    /**
     * 启动微信
     */
    jobStart: {
        service: SERVICE,
        controller: CONTROLLER,
        action: 'job/start',
        type: RTYPE.GET
    },

    /**
     * 检验 cron 表达式是否正确
     */
    validCronExpression: {
        service: SERVICE,
        controller: CONTROLLER,
        action: 'validCronExpression',
        type: RTYPE.POST
    }
}
