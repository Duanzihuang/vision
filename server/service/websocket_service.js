const path = require('path')
const WebSocket = require('ws')
const fileUtil = require('../utils/file_utils')
// 创建WebSocket服务端的对象，绑定的端口号是9998
const wss = new WebSocket.Server({
  port: 9998
})

module.exports.listen = () => {
  // 对客户端连接事件进行监听
  // client:代表的是客户端的连接socket对象
  wss.on('connection', client => {
    // 对客户端的连接对象进行message事件的监听
    // msg: 由客户端发给服务端的数据
    client.on('message', async msg => {
      try {
        const msgObj = JSON.parse(msg)
        const action = msgObj.action
        if (action === 'getData') {
          let filePath = '../data/' + msgObj.chartName + '.json'
          filePath = path.join(__dirname, filePath)

          const data = await fileUtil(filePath)

          msgObj.data = data.toString()

          // 由服务端往客户端发送数据
          client.send(JSON.stringify(msgObj))
        } else {
          // 全屏 & 主题切换
          // 由服务端往每个客户端发送数据
          wss.clients.forEach(client => {
            client.send(msg)
          })
        }
      } catch (error) {
        console.log(error)
      }
    })
  })
}
