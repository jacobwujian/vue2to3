<template>
	<div id="v_container" />
</template>

<script>
	import {
		onMounted,
		defineComponent,
		inject
	} from 'vue'
	import {
		GVerify
	} from '@/utils/GVerify'
	export default defineComponent ({
		setup(props, context) {
			const verifyCode = inject('verifyCode')
			onMounted(() => {
				verifyCode.value = new GVerify('v_container')
			})
		}
	})
</script>

<style>
</style>
