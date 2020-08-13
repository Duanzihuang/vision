module.exports = async (ctx, next) => {
  await next()

  ctx.set('Content-Type', 'application/json;charset=utf-8')
  // 允许跨域
  ctx.set('Access-Control-Allow-Origin', '*')
  ctx.set(
    'Access-Control-Allow-Headers',
    'Content-Type, Content-Length, Authorization, Accept, X-Requested-With'
  )
  ctx.set('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS')
}
