import { RTYPE } from '@/util/common'
import app from '@/config/app';

const SERVICE = app.services.schedule;
const CONTROLLER = 'calendar';

export let calendarRestController = {

    $setting: {
        menuCode: 'sch.calendar',
        tenantRequired: false
    },

    /**
     * 查询日历列表
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
        type: RTYPE.DELETE
    },

    /**
     * 设置包含或者排除星期
     */
    weekSet: {
        service: SERVICE,
        controller: CONTROLLER,
        action: 'week/set',
        type: RTYPE.GET
    },

    /**
     * 获取星期数据
     */
    week: {
        service: SERVICE,
        controller: CONTROLLER,
        action: 'week',
        type: RTYPE.GET
    },

    /**
     * 设置排除时间段
     */
    timeSet: {
        service: SERVICE,
        controller: CONTROLLER,
        action: 'time/set',
        type: RTYPE.GET
    },

    /**
     * 获取排除的时间段
     */
    time: {
        service: SERVICE,
        controller: CONTROLLER,
        action: 'time',
        type: RTYPE.GET
    },

    /**
     * 删除排除时间段
     */
    timeRemove: {
        service: SERVICE,
        controller: CONTROLLER,
        action: 'time/remove',
        type: RTYPE.GET
    },

    /**
     * 获取包含和排除的天数
     */
    days: {
        service: SERVICE,
        controller: CONTROLLER,
        action: 'days',
        type: RTYPE.GET
    },

    /**
     * 设置包含天数
     */
    include: {
        service: SERVICE,
        controller: CONTROLLER,
        action: 'set/include/days',
        type: RTYPE.GET
    },

    /**
     * 设置排除天数
     */
    exclude: {
        service: SERVICE,
        controller: CONTROLLER,
        action: 'set/exclude/days',
        type: RTYPE.GET
    }
}