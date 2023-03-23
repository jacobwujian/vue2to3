import {
	createStore
} from 'vuex'
import getters from './getters'

const context = require.context('./modules', false, /\.js$/)
//获取moudules文件下所有js文件；
const moduleStores = {}

context.keys().forEach((key) => {
	const fileName = key.slice(2, -3)
	const fileModule = context(key).default
	moduleStores[fileName] = fileModule
})
export const store = createStore({
		modules: moduleStores,
		getters
	})
export default function(app) {
	app.use(store)
	app.config.globalProperties.$store = store
}
