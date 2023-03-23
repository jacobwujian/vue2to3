/*
 * @created: Monday, 2020-08-03 11:46:46
 * @author: baix@shumei.ai
 * ---------
 * @desc 用户数据
 */

import app from '@/main'
import api from '@/api'
import { accessToken } from '@/utils/constant'
export default {
  namespaced: true,
  state: {
    userInfo: null
  },
  getters: {
    userInfo: state => state.userInfo
  },
  mutations: {
    SET_USER_INFO: (state, data) => {
      state.userInfo = data
    }
  },
  actions: {
    logout({ commit, state }) {
      app.ls.remove(accessToken)
      state.userInfo = null
      app.config.globalProperties.$router.replace('/login')
    },
    getUserInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        api.user
          .accountDetail()
          .then(res => {
            app.ls.set('loginVal', JSON.stringify(res))
            if (res.status === 0) {
              res.permissionCodes = ['organizationEdit', 'organizationDetail', 'dealDetail']
            }
            commit('SET_USER_INFO', res)
            resolve(res)
          })
          .catch(err => {
            reject(err)
          })
      })
    }
  }
}
