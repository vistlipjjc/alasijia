import { RTYPE } from '@/util/common'
import app from '@/config/app'

const SERVICE = app.services.backend
const CONTROLLER = 'managerTeam'

export let managerTeamRestController = {
  /**
   *分页查询团队列表
   */
  query: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'getTeamList',
    url: '/backend/web/team/managerTeam/getTeamList',
    type: RTYPE.POST
  },

  /**
   *新增团队
   */
  createTeam: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'createTeam',
    url: '/backend/web/team/managerTeam/createTeam',
    type: RTYPE.POST
  },

  /**
   *修改团队
   */
  updateTeam: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'updateTeam',
    url: '/backend/web/team/managerTeam/updateTeam',
    type: RTYPE.POST
  },

  /**
   * 查看详情
   */
  viewTeam: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'viewTeam',
    url: '/backend/web/team/managerTeam',
    type: RTYPE.GET
  },

  /**
   * 删除团队
   */
  delete: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'delete',
    url: '/backend/web/team/managerTeam/delete',
    type: RTYPE.DELETE
  },

  /**
   *分页查询团队成员列表
   */
  getMemberList: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'getTeamList',
    url: '/backend/web/team/teamMember/getMemberList',
    type: RTYPE.POST
  },

  /**
   *删除团队成员
   */
  deleteMember: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'deleteMember',
    url: '/backend/web/team/teamMember/deleteMember',
    type: RTYPE.POST
  },

  /**
   *设置团队成员为管理员
   */
  setAmdmin: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'setAmdmin',
    url: '/backend/web/team/teamMember/setAmdmin',
    type: RTYPE.POST
  },

  /**
   *新增团队成员
   */
  createMember: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'createMember',
    url: '/backend/web/team/teamMember/createMember',
    type: RTYPE.POST
  },

  /**
   *查询团队成员
   */
  getExistMember: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'getExistMember',
    url: '/backend/web/team/managerTeam/getExistMember',
    type: RTYPE.GET
  },
}