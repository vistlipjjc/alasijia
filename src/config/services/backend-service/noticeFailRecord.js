import { RTYPE } from '@/util/common'
import app from '@/config/app'

const SERVICE = app.services.backend
const CONTROLLER = 'noticeFailRecord'

export let noticeFailRecordRestController = {
  /**
   * 获取失败消息列表,同时包含管理系统
   */
  query: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'query',
    url: '/backend/web/noticeFailRecord/query',
    type: RTYPE.GET
  },
  //   /**
//    * 获取系统失败消息详情
//    */
  details: {
    service: SERVICE,
    controller: CONTROLLER,
    action: '',
    url: '/backend/web/noticeFailRecord',
    type: RTYPE.GET
  },
  /**
   * 删除系统失败
   */
  delete: {
    service: SERVICE,
    controller: CONTROLLER,
    action: '',
    url: '/backend/web/noticeFailRecord',
    type: RTYPE.DELETE
  },
  /**
   * 批量删除系统失败
   */
  bathDelete: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'bathDelete',
    url: '/backend/web/noticeFailRecord/bathDelete',
    type: RTYPE.POST
  }
}