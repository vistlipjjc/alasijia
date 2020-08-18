import { RTYPE } from '@/util/common'
import app from '@/config/app';

const SERVICE = app.services.system;
const CONTROLLER = 'staff';

export let staffRestController = {

    /**
     * 根据部门编号获取用户信息
     */
    queryByUnitCode: {
        service: SERVICE,
        controller: CONTROLLER,
        action: 'queryByUnitCode',
        type: RTYPE.GET
    },

    /**
     * 获取用户类别树
     */
    load: {
        service: SERVICE,
        controller: CONTROLLER,
        action: 'load',
        type: RTYPE.GET
    },
    /**
     * 新增用户信息
     */
    save: {
        service: SERVICE,
        controller: CONTROLLER,
        action: 'save',
        type: RTYPE.POST
    },
    /**
     * 根据部门编号获取用户信息
     */
    get: {
        service: SERVICE,
        controller: CONTROLLER,
        action: 'selectStaffByDeptCodes',
        type: RTYPE.POST
    },
    check: {
        service: SERVICE,
        controller: CONTROLLER,
        action: 'check',
        type: RTYPE.GET
    },
    /**
     * 根据人员编号删除人员信息
     */
    remove: {
        service: SERVICE,
        controller: CONTROLLER,
        action: 'remove',
        type: RTYPE.DELETE
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
   *查询用户的详情信息
   */
  getStaffDetail: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'getStaffDetail',
    type: RTYPE.GET
  }
}