import { RTYPE } from '@/util/common'
import app from '@/config/app'

const SERVICE = app.services.backend
const CONTROLLER = 'extra'

export let extraRestController = {
  /**
   * 获取申请人管理列表
  */
  list: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'list',
    url: '/backend/web/clientele/query',
    type: RTYPE.GET
  },

  /**
   * 借款意向管理的状态修改
  */
  updateLendReportFlag: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'list',
    url: '/backend/web/extra/apiPhone/updateLendReportFlag',
    type: RTYPE.POST
  }
}