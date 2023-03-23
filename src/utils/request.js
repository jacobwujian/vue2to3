import axios from 'axios'
import Vue from '@/main'
import {
	message
} from 'ant-design-vue'
import router from '@/router'
import store from '@/store'
import {
	cPath,
	baseURL,
	accessToken
} from '@/utils/constant'

let prod = false
if (process.env.NODE_ENV === 'production') {
	prod = true
}

const service = axios.create({
	baseURL: 'http://127.0.0.1:8888', //prod ? baseURL : 'http://121.5.150.148:8000',
	timeout: 30000,
	withCredentials: false
})
// 测试后端地址  http://121.5.150.148:8000
// 生产后端地址  http://120.27.232.217:9090
const domain = {
	cw: 'http://127.0.0.1:8888', //http://121.5.150.148:8000',
	wx: 'http://127.0.0.1:8888' //'http://121.5.150.148:8000'
}

service.interceptors.request.use(
	(config) => {
		if (!prod) {
			config.url = (config.domain ? domain[config.domain] : domain['wx']) + config.url
		}
		const token = Vue.ls.get(accessToken)
		if (token && !config.noToken) {
			config.headers['Authorization'] = token
		}
		config.headers['RequestTime'] = Date.parse(new Date())
		return config
	},
	(error) => {
		return Promise.reject(error)
	}
)

service.interceptors.response.use(
	(response) => {
		const {
			data,
			config
		} = response
		if (data.status === 200) {
			return data.data
		} else if (data.status === 401) {
			message.error('登录已超时')
			if (location.pathname.indexOf(cPath) === 0) {
				router.push(cPath + '/login')
			} else {
				router.push('/login')
			}
			store.commit('user/SET_USER_INFO', null)
			return Promise.reject(new Error(data.error || 'Error'))
		} else {
			if (!config.noMessage) message.error(data.message || 'Error')
			return Promise.reject(new Error(data.error || 'Error'))
		}
	},
	(error) => {
		console.log(error)
		message.error('操作太频繁，请稍后重试！')
		return Promise.reject(error)
	}
)

export default service
