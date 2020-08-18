import { RTYPE } from '@/util/common'
import app from '@/config/app';

const SERVICE = app.services.system;
const CONTROLLER = 'role';

export let roleRestController = {
    /**
     *分页查询角色信息
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
     * 验证编码的唯一性
     */
    check: {
        service: SERVICE,
        controller: CONTROLLER,
        action: 'check',
        type: RTYPE.GET
    },

    /**
     * 查询角色包含的用户
     */
    queryRoleStaff: {
        service: SERVICE,
        controller: CONTROLLER,
        action: 'queryRoleStaff',
        type: RTYPE.GET
    },

    /**
     * 根据角色组编码查询角色信息
     */
    queryByRoleGroupCode: {
        service: SERVICE,
        controller: CONTROLLER,
        action: 'queryByRoleGroupCode',
        type: RTYPE.GET
    },
    /**
     * 根据用户编码查询角色信息
     */
    selectRoleByStaffCode: {
        service: SERVICE,
        controller: CONTROLLER,
        action: 'selectRoleByStaffCode',
        type: RTYPE.GET
    },

    /**
     * 查询所有的角色信息
     */
    queryAllRole: {
        service: SERVICE,
        controller: CONTROLLER,
        action: 'queryAllRole',
        type: RTYPE.GET
    },

  /**
   * 查询所有的角色信息
   */
  queryAll: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'queryAll',
    type: RTYPE.GET
  },

  /**
   * 根据角色编码查询该角色的详情
   * */
  getRole: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'getRole',
    type: RTYPE.GET
  }

}