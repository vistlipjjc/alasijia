import { RTYPE } from '@/util/common'
import app from '@/config/app'

const SERVICE = app.services.backend
const CONTROLLER = 'custManager'

export let custManagerRestController = {
  /**
   *分页查询客户经理列表
   */
  query: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'findInfoByPage',
    url: '/backend/appBack/custManager/findInfoByPage',
    type: RTYPE.POST
  },

  /**
   *不分页查询客户经理列表
   */
  getCust: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'findInfoByPage',
    url: '/backend/appBack/custManager/getCust',
    type: RTYPE.GET
  },

  /**
   *指派客户经理不分页查询客户经理列表
   */
  getCustList: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'findInfoByPage',
    url: '/backend/appBack/custManager/getCustList',
    type: RTYPE.POST
  },

  /**
   * 新增客户经理
   */
  save: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'save',
    url: '/backend/appBack/custManager/save',
    type: RTYPE.POST
  },

  /**
   * 修改客户经理
   */
  update: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'update',
    url: '/backend/appBack/custManager/update',
    type: RTYPE.POST
  },

  /**
   * 删除客户经理
   */
  remove: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'delete',
    url: '/backend/appBack/custManager',
    type: RTYPE.DELETE
  },

  /**
   * 查看客户经理
   */
  view: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'view',
    url: '/backend/appBack/custManager/getDetailInfo',
    type: RTYPE.GET
  },

  /**
   * 编辑时查看客户经理
   */
  editView: {
    service: SERVICE,
    controller: CONTROLLER,
    action: '',
    url: '/backend/appBack/custManager',
    type: RTYPE.GET
  },

  /**
   * 修改客户经理的密码
   */
  reset: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'reset',
    url: '/backend/appBack/custManager/reset-password',
    type: RTYPE.POST
  },

  /**
   * 客户经理的导出
   */
  exportInfo: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'export',
    url: 'backend/appBack/custManager/exportInfo',
    type: RTYPE.get
  },

  /**
   * 客户经理的导入
   */
  importExcel: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'importExcel',
    url: 'backend/appBack/custManager/importExcel',
    type: RTYPE.GET
  },

  /**
   * 客户经理的导入模板的下载
   */
  downloanTemplate: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'downloanTemplate',
    url: 'backend/appBack/custManager/downloanTemplate',
    type: RTYPE.GET
  },

  /**
   * 客户经理的导入失败记录导出
   */
  managerImportFail: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'exportInfo',
    url: 'backend/appBack/managerImportFail/exportInfo',
    type: RTYPE.GET
  },

  /**
   * 客户经理黑名单释放
   */
  releaseBlack: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'releaseBlack',
    url: 'backend/appBack/custManager/releaseBlack',
    type: RTYPE.GET
  }
}