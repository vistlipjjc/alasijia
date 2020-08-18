import { RTYPE } from '@/util/common'
import app from '@/config/app'

const SERVICE = app.services.backend
const CONTROLLER = 'sysNotice'

export let sysNoticeRestController = {
  /**
   * 获取系统通知列表
   */
  selectList: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'selectList',
    url: '/backend/web/sysNotice/selectList',
    type: RTYPE.GET
  },

  /**
   * 获取系统通知详情
   */
  details: {
    service: SERVICE,
    controller: CONTROLLER,
    action: '',
    url: '/backend/web/sysNotice',
    type: RTYPE.GET
  }
}