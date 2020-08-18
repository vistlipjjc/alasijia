import { RTYPE } from '@/util/common'
import app from '@/config/app'

const SERVICE = app.services.backend
const CONTROLLER = 'orders'

export let ordersRestController = {
  /**
   * 指派工单
   */
  assignOrders: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'assignOrders',
    url: '/backend/web/orders/assignOrders',
    type: RTYPE.POST
  },
}