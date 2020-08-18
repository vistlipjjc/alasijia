import storage from '@/util/storage';

export const getters = {

    userToken (state) {
        if (state.userToken) {
            return state.userToken;
        }
        return sessionStorage.getItem('userToken');
    },

    userInfo (state) {
        if (state.user) {
            return state.user;
        }
        return storage.getItem('user');
    }
};
