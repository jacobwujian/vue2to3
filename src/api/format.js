const request = require('request')
const fs = require('fs')
const pathJ = require('path')

const url = 'http://10.53.2.226:8081/v2/api-docs'
const apiType = {
  cw: ['project', 'menu', 'exchange', 'cancelAfterVerification', 'device', 'asset', 'account', 'role'],
  wx: ['user', 'trade']
}

function funBase(params) {
  return `import request from '@/utils/request'
const obj = {}
${params.funListJoin}
export default obj`
}
function funStr(list, key) {
  let str = ''
  list.forEach(params => {
    const {name, ename, url, method, data} = params
    let annotation = ''
    if(data) {
      data.forEach((item, index) => {
        const flag = index === data.length - 1 ? '' : `\n`
        annotation+= ` * @param {${item.type || ''}} ${item.name} -${item.description ? item.description.trim() : ''}${flag}`
      })
    }
    const payload = method === 'get' ? 'params' : 'data'
    let domain = ``
    for(let typeKey in apiType){
      const itemType = apiType[typeKey]
      if(itemType.some(k => k===key)){
        domain = `,\n    domain: '${typeKey}'`
      }
    }
    str += `
/**
 * ${name}
 * @method
 * @name ${ename}
${annotation}
 */
obj.${ename}=function(${payload}) {
  return request({
    url: '${url}',
    method: '${method}',
    ${payload}${domain}
  })
}
`
  })
  return str
}

function joint(name, funStr) {
  fs.writeFileSync(pathJ.join(__dirname, `/modules/${name}.js`), funBase({
    funListJoin: funStr
  }))
}

request({
  url: url,
  method: 'get'
}, function(error, response, body) {
  if (!error && response.statusCode == 200) {
    const data = JSON.parse(body)
    formatData(data.paths)
  }
})

function formatData(data) {
  let mainData = {}
  for(let key in data){
    const item = data[key]
    let funList = []
    for(let skey in item){
      const item = data[key]
      const sitem = item[skey]
      const ename = key.split('/').slice(3).join('')
      const listTag = sitem.tags[0].split('-')
      tag = listTag.reduce((all, item, index) => {
        if(index === listTag.length - 1) return all
        if(index !== 0) return all + item.charAt(0).toUpperCase() + item.slice(1)
        return all + item
      }, '')
      funList.push({
        ename,
        name: sitem.summary,
        url: key,
        method: skey,
        data: sitem.parameters
      })
    }
    if(tag in mainData) {
      mainData[tag].funList.push(...funList)
    }else{
      mainData[tag] = {}
      mainData[tag].funList = funList
    }
  }
  for(let key in mainData){
    joint(key, funStr(mainData[key]['funList'], key))
  }
}

