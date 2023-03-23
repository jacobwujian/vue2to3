import request from '@/utils/request'
const obj = {}

/**
 * 添加角色
 * @method
 * @name addRole
 * @param {} addRoleDto -addRoleDto
 */
obj.addRole=function(data) {
  return request({
    url: '/api/role/addRole',
    method: 'post',
    data,
    domain: 'cw'
  })
}

/**
 * 通过条件查询角色信息
 * @method
 * @name allRole
 * @param {integer} id -id
 * @param {integer} pageNum -起始页
 * @param {integer} pageSize -每页显示条数
 * @param {string} roleName -角色名称
 * @param {integer} status -状态
 * @param {string} createTimeStart -创建开始时间
 * @param {string} createTimeEnd -创建结束时间
 */
obj.allRole=function(params) {
  return request({
    url: '/api/role/allRole',
    method: 'get',
    params,
    domain: 'cw'
  })
}

/**
 * 角色详情
 * @method
 * @name getRoleDetail
 * @param {integer} id -id
 */
obj.getRoleDetail=function(params) {
  return request({
    url: '/api/role/getRoleDetail',
    method: 'get',
    params,
    domain: 'cw'
  })
}

/**
 * 启用角色
 * @method
 * @name startRole
 * @param {integer} id -id
 */
obj.startRole=function(data) {
  return request({
    url: '/api/role/startRole',
    method: 'post',
    data,
    domain: 'cw'
  })
}

/**
 * 暂停角色
 * @method
 * @name stopRole
 * @param {integer} id -id
 */
obj.stopRole=function(data) {
  return request({
    url: '/api/role/stopRole',
    method: 'post',
    data,
    domain: 'cw'
  })
}

/**
 * 修改角色
 * @method
 * @name updateRole
 * @param {} updateRoleDto -updateRoleDto
 */
obj.updateRole=function(data) {
  return request({
    url: '/api/role/updateRole',
    method: 'post',
    data,
    domain: 'cw'
  })
}

export default obj