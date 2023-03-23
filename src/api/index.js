const context = require.context('./modules', false, /\.js$/)
//获取moudules文件下所有js文件；
const moduleStores = {}

context.keys().forEach((key) => {
  const fileName = key.slice(2, -3)
  const fileModule = context(key).default
  moduleStores[fileName] = fileModule
})

export default {
  ...moduleStores
}
