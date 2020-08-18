import Vue from 'vue';
import iView from 'iview';
import {router} from './router/index';
import store from './store';
import App from './app.vue';
import '@/locale';
import 'iview/dist/styles/iview.css';
import VueI18n from 'vue-i18n';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
// 图片截取器
import VueCropper from 'vue-cropper'
// 富文本编辑器
import 'summernote'
import 'summernote/dist/summernote.css';
import 'font-awesome/css/font-awesome.css'
import 'summernote/dist/lang/summernote-zh-CN'

import contentmenu from 'v-contextmenu';
import 'v-contextmenu/dist/index.css';
import SimpleCalendar from './views/schedule/component/simpleCalendar.js';

import jTable from './components/jTable/jTable.vue';
import jLabel from './components/jLabel.vue';
import jSelect from './components/jSelect.vue';
import jStaff from './components/jStaff';
import jUnit from './components/jUnit';
import jRadio from './components/jRadio';
import jCheckbox from './components/jCheckbox';
import jTree from './components/jTree';
import jUpload from './components/jUpload';

//引入全局js文件
import {services} from '@/config/services/index';
import net from '@/util/net';
import validator from '@/config/validator/validator';
Vue.prototype.$services = services;
Vue.prototype.$net = net;
Vue.prototype.$validator = validator;

Vue.use(VueI18n);
Vue.use(iView);
Vue.use(SimpleCalendar);
Vue.use(contentmenu);
Vue.use(VueCropper)

//注册
Vue.component(jTable.name, jTable);
Vue.component(jLabel.name, jLabel);
Vue.component(jSelect.name, jSelect);
Vue.component(jStaff.name, jStaff);
Vue.component(jUnit.name, jUnit);
Vue.component(jRadio.name, jRadio);
Vue.component(jCheckbox.name, jCheckbox);
Vue.component(jTree.name, jTree);
Vue.component(jUpload.name, jUpload);

new Vue({
    el: '#app',
    router: router,
    store: store,
    render: h => h(App),
    data: {
        currentPageName: ''
    },
    mounted () {
        this.currentPageName = this.$route.name;
        // 显示打开的页面的列表
        this.$store.commit('setOpenedList');
        this.$store.commit('initCachepage');
        // 权限菜单过滤相关，解决刷新页面没有菜单问题
        this.$store.dispatch('updateUserMenu');
    }
});
