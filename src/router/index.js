import {
	createRouter,
	createWebHistory
} from 'vue-router'
import {
	cPath
} from '@/utils/constant'

/* Layout */
import Layout from '@/layout'
/* Router Modules */

const baseRoute = {
	path: cPath,
	component: Layout,
	name: 'index',
	meta: {
		title: '首页'
	},
	redirect: `${cPath}/index`,
	children: []
}

const context = require.context('./modules', false, /\.js$/)
//获取moudules文件下所有js文件；
const moduleStores = []

context.keys().forEach((key) => {
	const fileModule = context(key).default
	const isA = Array.isArray(fileModule)
	const list = isA ? fileModule : [fileModule]
	list.forEach(it => {
		baseRoute.children.push(it)
	})
})

export const asyncRoutes = [
	...moduleStores,
	baseRoute
]

export const constantRoutes = [{
		path: '/',
		name: 'login',
		redirect: '/login'
	}, {
		path: '/login',
		name: 'UserLogin',
		component: () => import('@/views/login/index.vue'),
		hidden: true,
		meta: {
			title: '登录'
		}
	},
	{
		path: '/screen',
		name: 'screen',
		meta: {
			title: '大屏图表'
		},
		component: () => import('@/views/screen/index.vue'),
		hidden: true
	},
	{
		path: '/adm:catchAll(.*)',
		name: '404',
		component: () => import('@/views/error-pages/404.vue'),
		hidden: true,
		meta: {
			title: '未找到'
		}
	}
]
const createARouter = () => {
	let newRouter = createRouter({
		history: createWebHistory(),
		base: process.env.BASE_URL,
		scrollBehavior: () => ({
			y: 0
		}),
		routes: constantRoutes
	})
	const originalPush = newRouter.push
	newRouter.push = function push(location, onResolve, onReject) {
		if (onResolve || onReject) {
			return originalPush.call(this, location, onResolve, onReject)
		}
		return originalPush.call(this, location).catch(err => err)
	}
	newRouter.addRoutes = function(routeList) {
		for (const route of routeList) {
			newRouter.addRoute(route)
		}
	}
	newRouter.onError(e => {
		console.log(e)
	})
	return newRouter
}


const router = createARouter()

export function resetRouter() {
	const newRouter = createARouter()
	router.matcher = newRouter.matcher // the relevant part
	router.options.routes = []
}

export default router
