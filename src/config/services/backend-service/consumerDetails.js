import { RTYPE } from '@/util/common'
import app from '@/config/app';

const SERVICE = app.services.backend;
const CONTROLLER = 'consumerDetails';

export let consumerDetailsRestController = {
  /**
   * 借款消费管理表格查询
   */
  query: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'findDebitDataByPage',
    url: '/backend/appBack/consumerDetails/findDebitDataByPage',
    type: RTYPE.POST
  },

  /**
   * 借款消费管理的消费记录表格查询
   */
  findConsumerList: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'findConsumerList',
    url: '/backend/appBack/consumerDetails/findConsumerList',
    type: RTYPE.POST
  },

  /**
   * 新增消费记录
   */
  batchInsert: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'batchInsert',
    url: '/backend/appBack/consumerDetails/batchInsert',
    type: RTYPE.POST
  },

  /**
   * 导出消费记录
   */
  exportInfo: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'exportInfo',
    url: 'backend/appBack/consumerDetails/exportInfo',
    type: RTYPE.POST
  },

  /**
   * 借款消费管理列表
  */
  findDebitByPage: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'findDebitByPage',
    url: '/backend/appBack/consumerDetails/findDebitByPage',
    type: RTYPE.POST
  },

  /**
   * 借款消费管理详情
  */
  getOrderDetailInfo: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'getOrderDetailInfo',
    url: '/backend/appBack/consumerDetails/getOrderDetailInfo',
    type: RTYPE.POST
  },

  /**
   * 借款消费管理导出
  */
  exportOrderInfo: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'exportOrderInfo',
    url: '/backend/appBack/consumerDetails/exportOrderInfo',
    type: RTYPE.GET
  },

  /**
   * 借款消费管理导入模板下载
   */
  downloanTemplate: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'exportOrderInfo',
    url: '/backend/appBack/consumerDetails/downloanTemplate',
    type: RTYPE.GET
  },

  /**
   * 消费记录导入校验数据是否重复接口
   */
  checkImportData: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'checkImportData',
    url: 'backend/appBack/consumerDetails/checkImportData',
    type: RTYPE.POST
  },

  /**
   * 借款消费管理导入
   */
  importExcel: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'importExcel',
    url: '/backend/appBack/consumerDetails/importExcel',
    type: RTYPE.POST
  },

  /**
   * 借款消费管理导入失败记录导出
   */
  exportFaileInfo: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'exportFaileInfo',
    url: '/backend/appBack/consumerImportFaile/exportFaileInfo',
    type: RTYPE.GET
  },

  /**
   * 借款消费管理导入失败记录导出
   */
  getOrderProc: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'exportFaileInfo',
    url: '/backend/appBack/consumerDetails/getOrderProc',
    type: RTYPE.POST
  }
}