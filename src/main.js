import Vue from 'vue'
import './plugins/axios'
import App from './App.vue'
import router from './router'
import '../src/assets/global.css'
// 字体图标
import '../src/assets/fonts/iconfont.css'
import './plugins/element.js'
// import axios from 'axios'

// 请求地址
// axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// axios.interceptors.request.use(config => {
//   // console.log(config)
//   config.headers.Authorization = window.sessionStorage.getItem('token')
//   console.log(config)
// })
// Vue.prototype.$http = axios
Vue.config.productionTip = false

Vue.config.devtools = true

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')