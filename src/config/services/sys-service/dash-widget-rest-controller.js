import {RTYPE} from '@/util/common'
import app from '@/config/app';

const SERVICE = app.services.system;
const CONTROLLER = 'dashWidget';

export let dashWidgetRestController = {
    $setting: {
        menuCode: 'sys.dashboard.dashWidget',
        tenantRequired: false
    },
    /**
     *分页查询用户信息
     */
    query: {
        service: SERVICE,
        controller: CONTROLLER,
        action: 'query',
        type: RTYPE.GET
    },

    /**
     * 保存一个角色类型
     */
    save: {
        service: SERVICE,
        controller: CONTROLLER,
        action: 'save',
        type: RTYPE.POST
    },

    /**
     * 删除一个角色类型
     */
    remove: {
        service: SERVICE,
        controller: CONTROLLER,
        action: 'remove',
        type: RTYPE.POST
    },
    /**
     * 判断能否启用组件
     */
    canEnable: {
        service: SERVICE,
        controller: CONTROLLER,
        action: 'canEnable',
        type: RTYPE.POST
    },
    /**
     * 启用
     */
    enable: {
        service: SERVICE,
        controller: CONTROLLER,
        action: 'enable',
        type: RTYPE.POST
    },

    /**
     * 停用
     */
    disable: {
        service: SERVICE,
        controller: CONTROLLER,
        action: 'disable',
        type: RTYPE.POST
    },

    /**
     * 初始化数据提供器
     */
    initProvider: {
        service: SERVICE,
        controller: CONTROLLER,
        action: 'initProvider',
        type: RTYPE.POST
    },

    /**
     * 数据提供程序表分页查询
     */
    getDataByPage: {
        service: SERVICE,
        controller: CONTROLLER,
        action: 'getDataByPage',
        type: RTYPE.POST
    },

    /**
     * 组件设计页面
     */
    design: {
        service: SERVICE,
        controller: CONTROLLER,
        action: 'design',
        type: RTYPE.POST
    },
    /**
     * initChartOptions
     */
    initChartOptions: {
        service: SERVICE,
        controller: CONTROLLER,
        action: 'initChartOptions',
        type: RTYPE.POST
    },

    //表单校验
    check: {
        service: SERVICE,
        controller: CONTROLLER,
        action: 'check',
        type: RTYPE.POST
    },
}