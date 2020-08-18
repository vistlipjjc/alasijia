import { RTYPE } from '@/util/common'
import app from '@/config/app';

const SERVICE = app.services.schedule;
const CONTROLLER = 'schedule';

export let scheduleRestController = {

    /**
     * 获取服务端的servers
     */
    getServers: {
        service: SERVICE,
        controller: CONTROLLER,
        action: 'servers',
        type: RTYPE.GET
    },

    /**
     * 获取每个server的详情
     */
    getServiceInfo: {
        service: SERVICE,
        controller: CONTROLLER,
        action: 'server/info',
        type: RTYPE.GET
    },

    /**
     * 启动服务端
     */
    startServer: {
        service: SERVICE,
        controller: CONTROLLER,
        action: 'server/start',
        type: RTYPE.GET
    },

    /**
     * 暂停服务端
     */
    pauseServer: {
        service: SERVICE,
        controller: CONTROLLER,
        action: 'server/pause',
        type: RTYPE.GET
    },


    /**
     * 停止服务端
     */
    shutdownServer: {
        service: SERVICE,
        controller: CONTROLLER,
        action: 'server/shutdown',
        type: RTYPE.GET
    },




    /**
     * 获取客户端的clients
     */
    getClients: {
        service: SERVICE,
        controller: CONTROLLER,
        action: 'clients',
        type: RTYPE.GET
    },

    /**
     * 获取每个client的详情
     */
    getClientInfo: {
        service: SERVICE,
        controller: CONTROLLER,
        action: 'client/info',
        type: RTYPE.GET
    },

    /**
     * 启动客户端
     */
    startClient: {
        service: SERVICE,
        controller: CONTROLLER,
        action: 'client/start',
        type: RTYPE.GET
    },

    /**
     * 暂停客户端
     */
    pauseClient: {
        service: SERVICE,
        controller: CONTROLLER,
        action: 'client/pause',
        type: RTYPE.GET
    },


    /**
     * 停止客户端
     */
    shutdownClient: {
        service: SERVICE,
        controller: CONTROLLER,
        action: 'client/shutdown',
        type: RTYPE.GET
    },
}