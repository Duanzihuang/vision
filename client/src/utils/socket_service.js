export default class SocketService {
  static instance = null
  static get Instacne () {
    if (!this.instance) {
      this.instance = new SocketService()
    }

    return this.instance
  }

  ws = null
  connected = false
  // 发送失败之后尝试的次数
  sendTryCount = 0
  // 连接失败之后尝试的次数
  connectTryCount = 0
  // 回调函数
  callBackMapping = {}

  registerCallBack = (type, callBackFunc) => {
    this.callBackMapping[type] = callBackFunc
  }

  unRegisterCallBack = type => {
    delete this.callBackMapping[type]
  }

  connect () {
    if (!window.WebSocket) {
      alert('您的浏览器不支持WebSocket')
      return
    }

    // this.ws = new WebSocket('ws://127.0.0.1:9998')
    this.ws = new WebSocket(process.env.VUE_APP_SOCKETURL)

    this.ws.onopen = () => {
      this.connected = true
      this.connectTryCount = 0
    }

    this.ws.onclose = () => {
      console.log('连接失败，请重试...')
      this.connectTryCount++
      this.connected = false

      // 失败之后尝试连接
      setTimeout(() => {
        this.connect()
      }, this.connectTryCount * 500)
    }

    this.ws.onmessage = msg => {
      const msgObj = JSON.parse(msg.data)
      if (msgObj.action === 'getData') {
        if (msgObj.socketType) {
          this.callBackMapping[msgObj.socketType].call(
            this,
            JSON.parse(msgObj.data)
          )
        }
      } else if (msgObj.action === 'fullScreen') {
        this.callBackMapping[msgObj.socketType].call(this, msgObj)
      } else if (msgObj.action === 'changeTheme') {
        this.callBackMapping[msgObj.socketType].call(this, msgObj)
      }
    }
  }

  // 发送数据给服务器
  send = data => {
    if (this.connected) {
      this.ws.send(JSON.stringify(data))
    } else {
      this.sendTryCount++

      // 尝试再次发送数据
      setTimeout(() => {
        this.send(data)
      }, this.sendTryCount * 500)
    }
  }
}
