import { RTYPE } from '@/util/common'
import app from '@/config/app';

const SERVICE = app.services.backend;
const CONTROLLER = 'advert';

export let advertRestController = {
  /**
   * 查询广告参数
   */
  getAdvert: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'getAdvert',
    url: '/backend/web/advert/getAdvert',
    type: RTYPE.GET
  },

  /*
  * 新增广告参数
  */
  saveAdvert: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'saveAdvert',
    url: '/backend/web/advert/saveAdvert',
    type: RTYPE.POST
  },

  /*
  * 修改广告参数
  */
  updateAdvert: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'updateAdvert',
    url: '/backend/web/advert/updateAdvert',
    type: RTYPE.POST
  },

  /*
  * 删除广告参数 
  */
  deleteAdvert: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'deleteAdvert',
    url: '/backend/web/advert/deleteAdvert',
    type: RTYPE.DELETE
  }
}