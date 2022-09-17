import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.config.productionTip = false
Vue.use(ElementUI);
import axios from 'axios'
import VueAxios from 'vue-axios'  //no
Vue.use(VueAxios,axios)    //no
// 引入httpApis
import httpApis from './http/index'
Vue.prototype.http=httpApis
// 设置jscode安全密钥
window._AMapSecurityConfig = {
  securityJsCode: "93ac4302ed8e21e68147f82ab63e4ce0",
};
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
