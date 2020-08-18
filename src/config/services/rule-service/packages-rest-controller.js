import { RTYPE } from '@/util/common'
import app from '@/config/app';

const SERVICE = app.services.rule;
const CONTROLLER = 'packages';

export let packagesRestController = {
    $setting: {
        menuCode: 'rul.packages',
        tenantRequired: false
    },
    /**
     *分页查询规则集信息
     */
    query: {
        service: SERVICE,
        controller: CONTROLLER,
        action: 'query',
        type: RTYPE.GET
    },

    /**
     * 保存一个规则集信息
     */
    save: {
        service: SERVICE,
        controller: CONTROLLER,
        action: 'save',
        type: RTYPE.POST
    },

    /**
     * 删除一个规则集信息
     */
    remove: {
        service: SERVICE,
        controller: CONTROLLER,
        action: 'remove',
        type: RTYPE.DELETE
    },
    /**
     * 部署
     */
    deploy: {
    service: SERVICE,
        controller: CONTROLLER,
        action: 'deploy',
        type: RTYPE.POST
    },
    /**
     * 部署
     */
    unDeploy: {
        service: SERVICE,
            controller: CONTROLLER,
            action: 'unDeploy',
            type: RTYPE.POST
    },
    /**
     * 查询规则
     */
    queryList:{
        service: SERVICE,
        controller: CONTROLLER,
        action: 'queryList',
        type: RTYPE.POST
    },
    /**
     * 查询用规则编码进行配对
     */
    queryRule:{
        service: SERVICE,
        controller: CONTROLLER,
        action: 'queryRule',
        type: RTYPE.POST
    }
}