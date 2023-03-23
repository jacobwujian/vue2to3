/*
 * @created: Monday, 2020-08-03 13:36:58
 * @author: baix@shumei.ai
 * ---------
 * @desc 路由访问权限配置
 */


/* Layout */

export default {
  namespaced: true,
  state: {
    breadcrumb: [],
    authBut: []
  },
  getters: {
    breadcrumb: (state) => state.breadcrumb
  },
  mutations: {
    set_breadcrumb(state, data) {
      state.breadcrumb = data
    }
  },
  actions: {
  }
}