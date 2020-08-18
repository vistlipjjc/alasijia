import { RTYPE } from '@/util/common'
import app from '@/config/app';

const SERVICE = app.services.backend;
const CONTROLLER = 'knowledge';

export let knowledgeRestController = {
  /**
   * 查询知识库管理列表
   */
  query: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'findKnowledgeByPage',
    url: '/backend/appBack/knowledge/findKnowledgeByPage',
    type: RTYPE.POST
  },
  /**
   * 新增知识库
   */
  save: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'save',
    url: '/backend/appBack/knowledge/save',
    type: RTYPE.POST
    
  },
  /**
   * 更新知识库
   */
  update: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'update',
    url: '/backend/appBack/knowledge/update',
    type: RTYPE.POST
    
  },
   /**
   * 删除知识库
   */
  delete: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'deleteKnowledge',
    url: '/backend/appBack/knowledge',
    type: RTYPE.DELETE
  },
 /**
   * 批量删除知识库
   */
  batchDelete: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'batchDelete',
    url: '/backend/appBack/knowledge/batchDelete',
    type: RTYPE.POST
  },
  /**
   *自动问答明细导出
   */
  exportKnowledge: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'exportKnowledge',
    url: 'backend/appBack/knowledge/exportKnowledge',
    type: RTYPE.POST
  }


}


  