import { RTYPE } from '@/util/common'
import app from '@/config/app';

const SERVICE = app.services.backend;
const CONTROLLER = 'noticeTemplate';

export let noticeTemplateRestController = {
  // 模板列表查询
  query: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'query',
    url: '/backend/web/noticeTemplate/query',
    type: RTYPE.GET
  },

  // 新增模板
  save: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'saveNoticeTemplate',
    url: '/backend/web/noticeTemplate/saveNoticeTemplate',
    type: RTYPE.POST
  },

  // 修改模板
  update: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'updateNoticeTemplate',
    url: '/backend/web/noticeTemplate/updateNoticeTemplate',
    type: RTYPE.POST
  },

  // 模板详情查询
  details: {
    service: SERVICE,
    controller: CONTROLLER,
    action: '',
    url: '/backend/web/noticeTemplate',
    type: RTYPE.GET
  },

  // 删除模板
  delete: {
    service: SERVICE,
    controller: CONTROLLER,
    action: '',
    url: '/backend/web/noticeTemplate',
    type: RTYPE.DELETE
  },

  // 批量删除模板
  batchDelete: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'batchDelete',
    url: '/backend/web/noticeTemplate/batchDelete',
    type: RTYPE.POST
  }
}