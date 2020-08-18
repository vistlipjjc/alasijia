import { RTYPE } from '@/util/common'
import app from '@/config/app'

const SERVICE = app.services.backend
const CONTROLLER = 'estimate'

export let estimateRestController = {
  /**
   *分页查询额度测算列表
   */
  query: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'findEstimateInfoByPage',
    url: '/backend/appBack/estimate/findEstimateInfoByPage',
    type: RTYPE.POST
  },

  /**
   *额度测算列表导出
   */
  exportInfo: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'exportInfo',
    url: 'backend/appBack/estimate/exportInfo',
    type: RTYPE.POST
  },
}
