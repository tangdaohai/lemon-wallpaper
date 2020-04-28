import { ipcMain } from 'electron'

interface ClientMsg {
  currentSymbol: string,
  params: {
    type: string,
    data: any
  }
}

type Callback = (reply: (data: any) => void, data: any) => void

// callback 回调缓存
const _cbMap = new Map<string, Callback>()

ipcMain.on('from-client', (event, clientMsg: ClientMsg) => {
  //  包裹响应函数
  function reply (data: any) {
    // 将 currentSymbol 返回给客户端
    event.reply('from-server', {
      currentSymbol: clientMsg.currentSymbol,
      data
    })
  }
  // 获取缓存的函数，并传递客户端发来的参数
  const _cb = _cbMap.get(clientMsg.params.type)
  if (typeof _cb === 'function') {
    _cb(reply, clientMsg.params.data)
  }
})

// 注册函数
function use (type: string, cb: Callback) {
  _cbMap.set(type, cb)
}

export {
  use
}
