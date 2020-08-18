import { RTYPE } from '@/util/common'
import app from '@/config/app';

const SERVICE = app.services.system;
const CONTROLLER = 'login';

export let loginRestController = {
    /**
     * 验证是否初次登录系统
     */
    checkFirstLogin: {
        service: SERVICE,
        controller: CONTROLLER,
        url: 'sys/checkFirstLogin',
        action: 'checkFirstLogin',
        type: RTYPE.POST
    },

  /**
   * 验证是否初次登录系统, 修改密码
   */
  modifyPassword: {
    service: SERVICE,
    controller: CONTROLLER,
    url: 'sys/modifyPassword',
    action: 'modifyPassword',
    type: RTYPE.POST
  },

}
