import { RTYPE } from '@/util/common'
import app from '@/config/app';

const SERVICE = app.services.system;
const CONTROLLER = 'metaColumn';

export let metaColumnRestController = {

    /**
     * 初始化查询
     */
    query: {
        service: SERVICE,
        controller:CONTROLLER,
        action: 'query',
        type: RTYPE.GET
    },

    //通过tableId查询列
    selectMetaColumnDto: {
        service: SERVICE,
        controller:CONTROLLER,
        action: 'selectMetaColumnDto',
        type: RTYPE.GET
    },
    //通过tableId查询对于的数据列
    selectMetaColumn:{
        service: SERVICE,
        controller: CONTROLLER,
        action: 'selectMetaColumn',
        type: RTYPE.GET
    },
    //同步元数列信息
    update: {
        service: SERVICE,
        controller:CONTROLLER,
        action: 'update',
        type: RTYPE.GET
    },
    //获取列信息
    getAllColumns: {
        service: SERVICE,
        controller:CONTROLLER,
        action: 'getAllColumns',
        type: RTYPE.POST
    },


    //同步列信息（保存按钮）
    updateMetaColumn: {
        service: SERVICE,
        controller:CONTROLLER,
        action: 'updateMetaColumn',
        type: RTYPE.POST
    },



}