import commonAction from './common';
import schedule from './schedule';
import system from './system';
import rule from './rule';
import dashboardConfig from './dashboardConfig';
import meta from './meta';
import demo from './demo';
import workflow from './workflow';
import alaska from './alaska';

export default [
    ...commonAction,
    ...schedule,
    ...system,
    ...rule,
    ...dashboardConfig,
    ...meta,
    ...demo,
    ...workflow,
    ...alaska
]