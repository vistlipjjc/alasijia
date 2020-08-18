import { RTYPE } from '@/util/common'
import app from '@/config/app';

const SERVICE = app.services.backend;
const CONTROLLER = 'dataAuthority';

export let dataAuthorityRestController = {
  /**
   * 查询数据权限
   */
  getdataAuthority: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'getdataAuthority',
    url: '/backend/web/dataAuthority',
    type: RTYPE.GET
  },
  
  /*
   * 新增数据权限
   */
  saveAataAuthority: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'saveAataAuthority',
    url: '/backend/web/dataAuthority/saveAataAuthority',
    type: RTYPE.POST
  },
  
  /*
  * 修改数据权限
  */
  updateAataAuthority: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'updateAataAuthority',
    url: '/backend/web/dataAuthority/updateAataAuthority',
    type: RTYPE.POST
  },
  
}


  