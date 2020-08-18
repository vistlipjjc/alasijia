import { RTYPE } from '@/util/common'
import app from '@/config/app';

const SERVICE = app.services.backend;
const CONTROLLER = 'file';

export let fileRestController = {
  /**
   * 查询广告参数
   */
upload: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'upload',
    url: 'backend/web/advert/uploadPic',
    type: RTYPE.POST
  },
}