import { RTYPE } from '@/util/common'
import app from '@/config/app';

const SERVICE = app.services.backend;
const CONTROLLER = 'sysRegion';

export let sysRegionRestController = {
  /**
   * 根据区域查询机构权重
   */
  getDispatchParams: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'getDispatchParams',
    url: '/backend/web/sysRegion/getDispatchParams',
    type: RTYPE.GET
  },

  /**
   * 新增机构派单权重
   */
  addRegion: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'addRegion',
    url: '/backend/web/sysRegion/addRegion',
    type: RTYPE.POST
  },

  /**
   * 更新机构派单权重
   */
  updateSysDispatchParam: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'updateSysDispatchParam',
    url: '/backend/web/sysRegion/updateSysDispatchParam',
    type: RTYPE.POST
  },

  /**
   * 初始化一级区域树
   */
  getFirstRegionTree: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'getFirstRegionTree',
    url: '/backend/web/sysRegion/getFirstRegionTree',
    type: RTYPE.GET
  },

  /**
   * 查询下级区域树
   */
  getRegionTree: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'getRegionTree',
    url: '/backend/web/sysRegion/getRegionTree',
    type: RTYPE.GET
  },

  /**
   * 展开所有区域树
   */
  getAllRegionTree: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'getAllRegionTree',
    url: '/backend/web/sysRegion/getAllRegionTree',
    type: RTYPE.GET
  },

  /**
   * 根据区域查询机构权重
   */
  getDispatchParams: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'getDispatchParams',
    url: '/backend/web/sysRegion/getDispatchParams',
    type: RTYPE.GET
  },

  /**
   * 删除区域树
   */
  deleteRegion: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'deleteRegion',
    url: '/backend/web/sysRegion/deleteRegion',
    type: RTYPE.DELETE
  },

  /**
   * 新增机构派单权重
   */
  addRegion: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'addRegion',
    url: '/backend/web/sysRegion/addRegion',
    type: RTYPE.POST
  },

  /**
   * 更新机构派单权重
   */
  updateSysDispatchParam: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'updateSysDispatchParam',
    url: '/backend/web/sysRegion/updateSysDispatchParam',
    type: RTYPE.POST
  },
}