// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'

import VueLazyLoad from 'vue-lazyload' //图片懒加载
import infiniteScroll from 'vue-infinite-scroll'
import {currency} from './util/currency'

// 全局过滤器
Vue.filter('currency', currency)

Vue.use(VueLazyLoad, {
  loading: '/static/loading-svg/loading-balls.svg'
})
Vue.use(infiniteScroll)
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: {App},
  template: '<App/>'
})
