<template>
	<a-breadcrumb :routes="breadcrumblist">
		<template #itemRender="{ route, routes }">
			<template v-if="route.path">
				<span v-if="routes.indexOf(route) === routes.length - 1 || route.meta.noTouch">
					{{ route.meta.title }}
				</span>
				<span v-else :style="{cursor: 'pointer'}" @click="relink(route.path)">
					{{ route.meta.title }}
				</span>
			</template>
		</template>
	</a-breadcrumb>
</template>

<script>
	import {
		mapGetters
	} from 'vuex'
	import {useRouter} from 'vue-router'
	export default {
		computed: {
			...mapGetters({
				breadcrumblist: 'permission/breadcrumb'
			})
		},
		setup() {
			const userRouter = useRouter()
			const relink = function(path){
				userRouter.push(path)
			}
			return {
				relink
			}
		}
	}
</script>

<style scoped>
	.handpoint {
		cursor: pointer;
	}
</style>
