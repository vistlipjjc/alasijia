import { RTYPE } from '@/util/common'
import app from '@/config/app';

const SERVICE = app.services.schedule;
const CONTROLLER = 'jobInstMonitor';

export let jobInstMonitorRestController = {

    /**
     * 查找实例结果饼图
     */
    getJobInstResultPie: {
        service: SERVICE,
        controller: CONTROLLER,
        action: 'getJobInstResultPie',
        type: RTYPE.GET
    },

    /**
     * 查找实例结果折线图
     */
    selectJobInstResultLine: {
        service: SERVICE,
        controller: CONTROLLER,
        action: 'selectJobInstResultLine',
        type: RTYPE.GET
    },

    /**
     * 查找实例执行时间饼图
     */
    getJobInstTimePie: {
        service: SERVICE,
        controller: CONTROLLER,
        action: 'getJobInstTimePie',
        type: RTYPE.GET
    },

    /**
     * 查找实例执行时间折线图
     */
    selectJobInstTimeLine: {
        service: SERVICE,
        controller: CONTROLLER,
        action: 'selectJobInstTimeLine',
        type: RTYPE.GET
    },

    /**
     * 查找实例错误率折线图
     */
    selectJobErrorRateLine: {
        service: SERVICE,
        controller: CONTROLLER,
        action: 'selectJobErrorRateLine',
        type: RTYPE.GET
    },





    /**
     * 查询错误实例
     */
    queryErrorInst: {
        service: SERVICE,
        controller: CONTROLLER,
        action: 'queryErrorInst',
        type: RTYPE.GET
    },

    /**
     * 查询超时实例
     */
    queryTimeOutInst: {
        service: SERVICE,
        controller: CONTROLLER,
        action: 'queryTimeOutInst',
        type: RTYPE.GET
    },


    /**
     * 查询超长执行时间实例
     */
    queryLongExecTimeInst: {
        service: SERVICE,
        controller: CONTROLLER,
        action: 'queryLongExecTimeInst',
        type: RTYPE.GET
    },



}