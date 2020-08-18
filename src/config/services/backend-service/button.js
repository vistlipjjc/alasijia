import { RTYPE } from '@/util/common'
import app from '@/config/app'

const SERVICE = app.services.backend
const CONTROLLER = 'button'

export let buttonRestController = {
  /**
   * 获取授权页面按钮
   */
  getButtonByMenu: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'getButtonByMenu',
    url: '/sys/button/getButtonByMenu',
    type: RTYPE.GET
  },

  /**
   * 功能权限的保存
   */
  saveMenu: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'saveMenu',
    url: '/sys/button/saveMenu',
    type: RTYPE.POST
  },
}