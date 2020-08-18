import { RTYPE } from '@/util/common'
import app from '@/config/app';

const SERVICE = app.services.backend;
const CONTROLLER = 'organization';

export let organizationRestController = {
  /**
   * 初始化整个机构树
   */
  getOrganizationTree: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'findOrgenTree',
    url: '/backend/web/organization/getOrganizationTree',
    type: RTYPE.GET
  },

  /**
   * 查询根机构
   */
  query: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'findOrgenTree',
    url: '/backend/web/organization/OrgenFirstTree',
    type: RTYPE.GET
  },

  /**
   *根据根机构逐级查询子机构
   */
  getSubOrganization: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'getOrganizationTree',
    url: '/backend/web/organization/getSubOrganization',
    type: RTYPE.GET
  },

  /**
   *新增机构接口
   */
  addorganization: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'addorganization',
    url: '/backend/web/organization/addorganization',
    type: RTYPE.POST
  },

  /**
   *修改机构接口
   */
  updateorganization: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'getOrganizationTree',
    url: '/backend/web/organization/updateorganization',
    type: RTYPE.POST
  },

  /**
   *删除单个机构接口
   */
  deleteorganization: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'getOrganizationTree',
    url: '/backend/web/organization/deleteorganization',
    type: RTYPE.DELETE
  },

  /**
   *机构树上移下移
   */
  upDownMove: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'upDownMove',
    url: '/backend/web/organization/upDownMove',
    type: RTYPE.POST
  }

}