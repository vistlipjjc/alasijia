import { RTYPE } from '@/util/common'
import app from '@/config/app';

const SERVICE = app.services.backend;
const CONTROLLER = 'questionDetails';

export let questionDetailsRestController = {
  /**
   * 查询自动问答明细参数
   */
  query: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'findQuestionByPage',
    url: '/backend/appBack/questionDetails/findQuestionByPage',
    type: RTYPE.POST
  },

  /*
  /**
   *自动问答明细导出
   */
  exportQuestion: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'exportQuestion',
    url: 'backend/appBack/questionDetails/exportQuestion',
    type: RTYPE.POST
  },


}


  