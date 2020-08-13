// 引入Koa
const Koa = require('koa')

// 创建app
const app = new Koa()

// 应用中间件
// 耗时中间件
app.use(require('./middleware/koa_response_duration'))
// 响应头中间件
app.use(require('./middleware/koa_response_header'))
// 逻辑处理中间件
app.use(require('./middleware/koa_response_data'))

// 监听端口
app.listen(3000)
