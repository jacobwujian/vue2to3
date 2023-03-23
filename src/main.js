require('@babel/polyfill')
import {
	createApp
} from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import moment from 'moment'
import {
	cPath
} from '@/utils/constant'
import api from '@/api'
import plugins from '@/plugins'
import '@/styles/index.less'
import './permission'
import Icon from '@/components/plugins/Icon'

let app = createApp(App)
app.component('Icon', Icon)
app.provide('$dayjs', moment)
app.provide('$api', api)
app.provide('$cPath', cPath)
app.use(router)
store(app)
plugins(app)
app.mount('#app')
export default app
