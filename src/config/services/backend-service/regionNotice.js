import { RTYPE } from '@/util/common'
import app from '@/config/app';

const SERVICE = app.services.backend;
const CONTROLLER = 'regionNotice';

export let regionNoticeRestController = {
  /**
   * 消息区域规则配置
   */
  getOrgTree: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'getOrgTree',
    url: '/backend/web/regionNotice/getOrgTree',
    type: RTYPE.GET
  },

  /**
   * 消息区域规则配置
   */
  getRegionNoticeByPage: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'findOrgenTree',
    url: '/backend/web/regionNotice/getRegionNoticeByPage',
    type: RTYPE.POST
  },

  /**
   * 消息区域规则新增修改保存
   */
  save: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'findOrgenTree',
    url: '/backend/web/regionNotice/save',
    type: RTYPE.POST
  },

  /**
   * 消息区域规则查看详情
   */
  getRegionNoticeById: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'getRegionNoticeById',
    url: '/backend/web/regionNotice/getRegionNoticeById',
    type: RTYPE.GET
  },

  /**
   * 消息区域规则查看详情
   */
  delete: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'getRegionNoticeById',
    url: '/backend/web/regionNotice/delete',
    type: RTYPE.POST
  },

  /**
   * 根据规则ID获取推送配置
   */
  getGlobalParamByRnId: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'getGlobalParamByRnId',
    url: '/backend/web/regionNotice/getGlobalParamByRnId',
    type: RTYPE.GET
  },

  /**
   * 根据规则ID获取消息模板
   */
  getNoticeTemplateByRnId: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'getNoticeTemplateByRnId',
    url: '/backend/web/regionNotice/getNoticeTemplateByRnId',
    type: RTYPE.GET
  }

}