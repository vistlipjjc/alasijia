import { RTYPE } from '@/util/common'
import app from '@/config/app'

const SERVICE = app.services.backend
const CONTROLLER = 'manageNotice'

export let manageNoticeRestController = {
  /**
   * 获取通知消息列表
   */
  query: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'query',
    url: '/backend/web/manageNotice/query',
    type: RTYPE.GET
  },

  /**
   * 获取通知消息详情
   */
  details: {
    service: SERVICE,
    controller: CONTROLLER,
    action: '',
    url: '/backend/web/manageNotice',
    type: RTYPE.GET
  },

  /**
   * 删除草稿
   */
  delete: {
    service: SERVICE,
    controller: CONTROLLER,
    action: '',
    url: '/backend/web/manageNotice',
    type: RTYPE.DELETE
  },

  /**
   * 批量删除草稿
   */
  batchDelete: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'batchDelete',
    url: '/backend/web/manageNotice/batchDelete',
    type: RTYPE.POST
  },

  // 新增草稿消息
  saveManageNotice: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'saveManageNotice',
    url: '/backend/web/manageNotice/saveManageNotice',
    type: RTYPE.POST
  },

  // 修改草稿消息
  updateManageNotice: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'updateManageNotice',
    url: '/backend/web/manageNotice/updateManageNotice',
    type: RTYPE.POST
  },

  // 发送消息
  sendManageNotice: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'manageNotice',
    url: '/backend/web/manageNotice/sendManageNotice',
    type: RTYPE.POST
  },

  // 批量发送
  batchSendManageNotice: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'batchSendManageNotice',
    url: '/backend/web/manageNotice/batchSendManageNotice',
    type: RTYPE.POST
  }
}