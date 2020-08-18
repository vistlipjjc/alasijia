import { RTYPE } from '@/util/common'
import app from '@/config/app';

const SERVICE = app.services.backend;
const CONTROLLER = 'globalParam';

export let globalParamRestController = {
  /**
   * 获取额度测算参数
   */
  getAllParam: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'getAllParam',
    url: '/backend/web/globalParam/getAllParam',
    type: RTYPE.GET
  },

  /**
   * 新增/修改额度测算参数
   */
  addGlobalParam: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'addGlobalParam',
    url: '/backend/web/globalParam/addGlobalParam',
    type: RTYPE.POST
  },

  /**
   * 删除额度测算参数
   */
  deleteParam: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'deleteParam',
    url: '/backend/web/globalParam/deleteParam',
    type: RTYPE.DELETE
  },

  /**
   * 获取全部参数
   */
  getGlobalParam: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'query',
    url: '/backend/web/globalParam/getGlobalParam',
    type: RTYPE.GET
  },

  /**
   * 更新参数
   */
  updateGlobalParamByRnId: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'query',
    url: '/backend/web/globalParam/updateGlobalParamByRnId',
    type: RTYPE.POST
  },

  /**
   * 参数配置开关查询
   */
  getGlobalParamByNameAndType: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'getGlobalParamByNameAndType',
    url: '/backend/web/globalParam/getGlobalParamByNameAndType',
    type: RTYPE.GET
  },

  /**
   * 参数配置开关的更新
   */
  updateGlobalParamById: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'updateGlobalParamById',
    url: '/backend/web/globalParam/updateGlobalParamById',
    type: RTYPE.POST
  },
}
