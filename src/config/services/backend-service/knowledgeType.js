import { RTYPE } from '@/util/common'
import app from '@/config/app';

const SERVICE = app.services.backend;
const CONTROLLER = 'knowledgeType';

export let knowledgeTypeRestController = {
  /**
   * 查询类别列表
   */
  query: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'findKnowLedgeTypeOrderList',
    url: '/backend/appBack/knowledgeType/findKnowLedgeTypeOrderList',
    type: RTYPE.POST
  },
  /**
   */
  /**
   * 查询类别（列表用）
   */
  gettype: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'gettype',
    url: '/backend/appBack/knowledgeType/findKnowLedgeTypeList',
    type: RTYPE.POST
    
  },

  /**
   * 新增批量增删改
   */
  batchInsert: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'batchInsert',
    url: '/backend/appBack/knowledgeType/batchInsert',
    type: RTYPE.POST
  },
  
}


  