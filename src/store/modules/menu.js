import {cPath} from '@/utils/constant'
function formatChildren(list, path) {
  const Clist = list.filter(it => !it.hidden)
  return Clist.map(item => {
    const obj = {
      name: item.meta.title,
      path: `${(path || cPath)}/${item.path}`,
      icon: item.meta.icon || 'dashboard',
      order: item.order
    }
    if(!item.children) return obj
    const childrenlist = item.children.filter(it => !it.hidden)
    if(childrenlist &&childrenlist.length){
      obj.children = formatChildren(childrenlist, obj.path)
    }
    return obj
  }).sort((a, b) => a.order - b.order)
}
export default {
  namespaced: true,
  state: {
    menulist: []
  },
  getters: {
    menulist: (state) => state.menulist
  },
  mutations: {
    set_menulist(state, data) {
      state.menulist = data
    }
  },
  actions: {
    set_menulist({ commit }, data) {
      const menulist = formatChildren(data[0].children)
      commit('set_menulist', menulist)
    }
  }
}
