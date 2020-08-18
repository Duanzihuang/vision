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

// 开启websocket监听
const WebSocket = require('ws')
// 创建WebSocket服务端的对象，绑定的端口号是9998
const wss = new WebSocket.Server({
  port: 9998
})

// 对客户端连接事件进行监听
// client:代表的是客户端的连接socket对象
wss.on('connection', client => {
  console.log('有客户端连接成功了...')
  // 对客户端的连接对象进行message事件的监听
  // msg: 由客户端发给服务端的数据
  client.on('message', msg => {
    console.log('客户端发送数据给服务端了:' + msg)
    // 由服务端往客户端发送数据
    client.send('hello socket from backend')
  })
})
