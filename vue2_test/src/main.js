import Vue from 'vue'
import App from './App.vue'


Vue.config.productionTip = false
//安装router
import VueRouter from "vue-router";
Vue.use(VueRouter);
import router from '../router/index'

//安装vuex
import store from "../store/index";

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
