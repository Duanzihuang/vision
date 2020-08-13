const path = require('path')
const getFileData = require('../utils/file_utils')

module.exports = async (ctx, next) => {
  let filePath = ctx.request.url.replace('/api', '')
  filePath = path.join(__dirname, `../data/${filePath}.json`)
  try {
    const res = await getFileData(filePath)
    ctx.response.body = res
  } catch (err) {
    const errObj = {
      message: '未获取到数据，请检查URL',
      status: 404
    }

    ctx.response.body = errObj
  }

  await next()
}
