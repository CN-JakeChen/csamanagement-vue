import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
// 导入全局样式表
import './assets/css/global.css'
// 导入字体图标
import './assets/fonts/iconfont.css'
// 导入axios模块
import axios from 'axios'
// 导入echarts
import echarts from 'echarts'

// 配置请求根路径
// axios.defaults.baseURL = 'http://39.104.190.21:8095/api/'
// axios.defaults.baseURL = 'http://localhost:8095/api/'
axios.defaults.baseURL = '/v1'
// 请求拦截器
axios.interceptors.request.use(config => {
  // console.log(config)
  // console.log(window.sessionStorage.getItem('token'))
  config.headers.Token = window.sessionStorage.getItem('token')
  return config
})

// 是否正在刷新的标记
let isRefreshing = false
// 重试队列，每一项将是一个待执行的函数形式
let requests = []

// 响应拦截器
axios.interceptors.response.use(response => {
  // console.log('response')
  const { meta } = response.data
  console.log(meta.status)
  if (meta.status === 9001) {
    console.log('过期了')
    const config = response.config
    if (!isRefreshing) {
      console.log('刷新中')
      isRefreshing = true
      return axios.get(`login/refresh/${window.sessionStorage.getItem('refreshToken')}`).then(res => {
        console.log(res)
        const { data: res1 } = res
        const token = res1.data.token
        console.log(token)
        axios.defaults.headers.Token = token
        window.sessionStorage.setItem('token', token)
        config.headers.Token = token
        // config.baseURL = ''
        console.log('baseurl:' + config.baseURL)
        // 已经刷新了token，将所有队列中的请求进行重试
        requests.forEach(cb => cb(token))
        requests = []
        return axios(config)
      }).catch(res => {
        // 如果获取新的token失败则回到登录界面
        // console.error('refreshtoken error =>', res)
        alert('安全起见，需要重新登录')
        window.sessionStorage.clear()
        window.location.href = '/'
      }).finally(() => {
        isRefreshing = false
      })
    } else {
      // 正在刷新token，将返回一个未执行resolve的promise
      return new Promise((resolve) => {
        // 将resolve放进队列，用一个函数形式来保存，等token刷新后直接执行
        requests.push((token) => {
          // config.baseURL = ''
          console.log('baseurl:' + config.baseURL)
          config.headers.Token = token
          resolve(axios(config))
        })
      })
    }
  }
  return response
}, error => {
  return Promise.reject(error)
})

Vue.prototype.$http = axios
Vue.prototype.$echarts = echarts
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
