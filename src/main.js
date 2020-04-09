import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ViewUI from 'view-design';
import 'view-design/dist/styles/iview.css';
import echarts from 'echarts'
import axios from 'axios'

axios.interceptors.request.use(function (config) {
	let token = localStorage.getItem('authorization');
	if (token) {
		config.headers['Authorization'] = token;
	}
	return config;
})

Vue.use(ViewUI);
Vue.prototype.$echarts = echarts
Vue.prototype.$axios = axios 


Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
