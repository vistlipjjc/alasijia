import { RTYPE } from '@/util/common'
import app from '@/config/app'

const SERVICE = app.services.backend
const CONTROLLER = 'syslog'

export let syslogRestController = {
  /**
   * 获取操作日志列表
   */
  getList: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'getLogList',
    url: '/backend/web/syslog/getLogList',
    type: RTYPE.POST
  }
}