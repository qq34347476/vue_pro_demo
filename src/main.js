import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/css/global.css'
import './assets/fonts/iconfont.css'
import TreeTable from 'vue-table-with-tree-grid'

import axios from 'axios'

import CheckedPic from './components/verification/src/index.js'
Vue.use(CheckedPic)

// 配置请求的基准URL地址
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// axios设置请求拦截器
axios.interceptors.request.use(
  config => {
    config.headers.Authorization = window.sessionStorage.getItem('token')
    return config
  },
  err => {
    console.log(err)
  }
)
Vue.prototype.$http = axios
Vue.component('traeTable', TreeTable)

Vue.config.productionTip = false

// 定于全局过滤器
// {{ date | dateFormat('yyyy-mm-dd') }} 不填默认 yyyy-mm-dd hh-mm-ss
// 过滤器， 进行时间的格式化
Vue.filter('dateFormat', function(dateStr, pattern = '') {
  let dt = new Date(dateStr)
  let y = dt.getFullYear()
  let m = (dt.getMonth() + 1).toString().padStart(2, '0')
  let d = dt
    .getDate()
    .toString()
    .padStart(2, '0')
  pattern.toLowerCase() // 传入参数转成小写
  if (pattern.toLowerCase() === 'yyyy-mm-dd') {
    return `${y}-${m}-${d}`
  } else {
    let hh = dt
      .getHours()
      .toString()
      .padStart(2, '0')
    let mm = dt
      .getMinutes()
      .toString()
      .padStart(2, '0')
    let ss = dt
      .getSeconds()
      .toString()
      .padStart(2, '0')
    return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
  }
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
