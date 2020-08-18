import { RTYPE } from '@/util/common';

const SERVICE = 'wf';
const CONTROLLER = 'processForm';

export let processFormRestController = {

    /**
     *获取对应的模板地址
     */
    getModule: {
        service: SERVICE,
        controller: CONTROLLER,
        action: 'getModule',
        type: RTYPE.POST
    }
};