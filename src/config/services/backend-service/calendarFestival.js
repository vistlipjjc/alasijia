import { RTYPE } from '@/util/common'
import app from '@/config/app';

const SERVICE = app.services.backend;
const CONTROLLER = 'calendarFestival';

export let calendarFestivalRestController = {
   /**
   * 查询假期
   */
  getCalendarFestival: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'getCalendarFestival',
    url: '/backend/web/calendarFestival/getCalendarFestivalByYear',
    type: RTYPE.GET
  },
  /*
  * 增改假期
  */
  saveCalendarFestival: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'saveCalendarFestival',
    url: '/backend/web/calendarFestival/save',
    type: RTYPE.POST
  },
}