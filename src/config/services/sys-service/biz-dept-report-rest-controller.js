import { RTYPE } from '@/util/common';
import app from '@/config/app';

const SERVICE = app.services.system;
const CONTROLLER = 'bizDeptReport';

export let bizDeptReportRestController = {
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
        type: RTYPE.DELETE
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
     * 通过deptCode查询该部门业务种类
     */
    queryBizType: {
        service: SERVICE,
        controller: CONTROLLER,
        action: 'queryBizType',
        type: RTYPE.GET
    },

    /**
     * 验证提交的上报部门和上报业务是否已经存在数据库中（相同的部门和相同的业务不能重复）
     */
    checkRepeat: {
        service: SERVICE,
        controller: CONTROLLER,
        action: 'checkRepeat',
        type: RTYPE.GET
    }
}
