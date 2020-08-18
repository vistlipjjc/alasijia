import { RTYPE } from '@/util/common'
import app from '@/config/app';

const SERVICE = app.services.backend;
const CONTROLLER = 'sysParam';

export let sysParamRestController = {
  /**
   * 查询常规派单参数
   */
  query: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'query',
    url: '/backend/web/sysParam/query',
    type: RTYPE.GET
  },

  /*
  * 新增常规派单参数
  */
  addParam: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'addParam',
    url: '/backend/web/sysParam/addParam',
    type: RTYPE.POST
  },

  /*
  * 修改常规派单参数
  */
  updateParam: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'updateParam',
    url: '/backend/web/sysParam/updateParam',
    type: RTYPE.POST
  }
}