import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import SocketService from '@/utils/socket_service'

// import echarts from 'echarts'
Vue.prototype.$echarts = window.echarts
Vue.config.productionTip = false

// 连接到后台WebSocket服务器
SocketService.Instacne.connect()
// 把SocketService实例挂载到Vue原型上
Vue.prototype.$socket = SocketService.Instacne

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
