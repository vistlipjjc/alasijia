import storage from '@/util/storage';

/**
 * 通知中心状态管理
 */
const  notify = {
    namespaced: true,
    state: {
        annBoxStatus: 'sendbox' // 系统公告文件夹的选中状态, 默认选中发件箱
    },
    mutations: {
        updateAnnBoxStatus(state, status){
            state.annBoxStatus = status;
        }
    },
    getters: {
        getAnnBoxStatus (state) {
            return state.annBoxStatus;
        }
    }
};

export default notify;