<template>
	<i :class="activeClass"></i>
</template>

<script>
	export default {
		props: {
			type: {
				type: String,
				ddefault: ''
			}
		},
		computed: {
			activeClass() {
				return 'iconfont icon-' + this.type
			}
		}
	}
</script>

<style scoped>
	@font-face {
		font-family: "iconfont";
		/* Project id 3966864 */
		src: url('//at.alicdn.com/t/c/font_3966864_yq6yo8selgr.woff2?t=1679393333293') format('woff2'),
			url('//at.alicdn.com/t/c/font_3966864_yq6yo8selgr.woff?t=1679393333293') format('woff'),
			url('//at.alicdn.com/t/c/font_3966864_yq6yo8selgr.ttf?t=1679393333293') format('truetype');
	}

	.iconfont {
		margin-right: 10px;
		font-family: "iconfont" !important;
		font-size: 16px;
		font-style: normal;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
	}

	.icon-user:before {
		content: "\e68e";
	}

	.icon-menu-unfold:before {
		content: "\e954";
	}

	.icon-menu-fold:before {
		content: "\e955";
	}

	.icon-edit:before {
		content: "\e7e1";
	}

	.icon-upload:before {
		content: "\e7ef";
	}

	.icon-lock:before {
		content: "\e7fb";
	}

	.icon-dashboard:before {
		content: "\e61e";
	}

	.icon-securityscan:before {
		content: "\e7c0";
	}

	.icon-apartment:before {
		content: "\e897";
	}

	.icon-setting:before {
		content: "\e78e";
	}

	.icon-star:before {
		content: "\e7df";
	}
</style>
