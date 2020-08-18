import { RTYPE } from '@/util/common'
import app from '@/config/app'

const SERVICE = app.services.backend
const CONTROLLER = 'chart'

export let chartRestController = {
  /**
   * 获取统计报表
   */
  getList: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'getList',
    url: '/backend/web/chart/getList',
    type: RTYPE.POST
  },

  /**
   * 获取统计报表总数
   */
  getAllCount: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'getAllCount',
    url: '/backend/web/chart/getAllCount',
    type: RTYPE.POST
  },

  /**
   * 导出
   */
  exportOrderChart: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'exportOrderChart',
    url: 'backend/web/chart/exportOrderChart',
    type: RTYPE.GET
  }
}