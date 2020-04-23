import Vue from 'vue'
import './plugins/axios'
import App from './App.vue'
import router from './router'
import '../src/assets/global.css'
// 字体图标
import '../src/assets/fonts/iconfont.css'
import './plugins/element.js'
// import axios from 'axios'
import VueQuillEditor from 'vue-quill-editor'
// require styles 导入富文本编辑器对应的样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

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
Vue.use(VueQuillEditor)
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
