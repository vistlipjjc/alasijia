import { RTYPE } from '@/util/common'
import app from '@/config/app';

const SERVICE = app.services.system;
const CONTROLLER = 'metaRegionTable';

export let metaRegionTableRestController = {

    $setting: {
        menuCode: 'sys.meta.metaRegionTable',
        tenantRequired: false
    },
    //查询对于的表
    queryBusinessMetaTabe:{
        service:SERVICE,
        controller:CONTROLLER,
        action:'queryBusinessMetaTabe',
        type:RTYPE.GET
    },
    queryMetaRegionTableNameDto:{
        service: SERVICE,
        controller: CONTROLLER,
        action: 'queryMetaRegionTableNameDto',
        type: RTYPE.GET
    }
}