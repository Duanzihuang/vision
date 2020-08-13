module.exports = async (cxt, next) => {
  const start = Date.now()
  await next()
  const end = Date.now()

  const duration = end - start

  // 通过响应头返回耗时时长
  cxt.set('X-Response-Time', `${duration} ms`)
}
