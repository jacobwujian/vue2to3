import request from '@/utils/request'
const obj = {}

/**
 * 获取菜单及其元素列表
 * @method
 * @name getMenuList

 */
obj.getMenuList=function(params) {
  return request({
    url: '/api/menu/getMenuList',
    method: 'get',
    params,
    domain: 'cw'
  })
}

/**
 * 获取当前用户菜单
 * @method
 * @name getUserMenu

 */
obj.getUserMenu=function(params) {
  return request({
    url: '/api/menu/getUserMenu',
    method: 'get',
    params,
    domain: 'cw'
  })
}

export default obj