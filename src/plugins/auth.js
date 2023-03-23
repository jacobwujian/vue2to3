/**
 * <a-button v-if="$auth('form.edit')">Button</a-button>
 * @param app
 */
import {
	useStore
} from 'vuex'
export default (app) => {
	app.config.globalProperties.$auth = function(permissions) {
		const store = useStore()
		const permissionCodes = store.getters.userInfo && store.getters.userInfo.permissionCodes
		if (permissionCodes && permissionCodes.includes(permissions)) {
			return true
		} else {
			return false
		}
	}
}
