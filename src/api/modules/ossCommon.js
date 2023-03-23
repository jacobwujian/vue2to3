import request from '@/utils/request'
const obj = {}

/**
 * oss文件删除
 * @method
 * @name ossdeleteFile
 * @param {string} fileName -fileName
 */
obj.ossdeleteFile=function(data) {
  return request({
    url: '/api/common/oss/deleteFile',
    method: 'post',
    data
  })
}

/**
 * oss文件地址获取
 * @method
 * @name ossgetOssImageUrls
 * @param {} imageQueryDto -imageQueryDto
 */
obj.ossgetOssImageUrls=function(data) {
  return request({
    url: '/api/common/oss/getOssImageUrls',
    method: 'post',
    data
  })
}

/**
 * 文件上传
 * @method
 * @name ossupload
 * @param {file} file -file
 */
obj.ossupload=function(data) {
  return request({
    url: '/api/common/oss/upload',
    method: 'post',
    data
  })
}

export default obj