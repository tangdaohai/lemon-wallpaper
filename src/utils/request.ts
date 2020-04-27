const { ipcRenderer } = window.require('electron')

interface SendParams {
  type: string,
  data: any
}

interface ReceivedParams {
  currentSymbol: string,
  data: any
}

type Callback = (data: any) => void

// 缓存标识与回调函数
const _waitMap = new Map<string, Callback>()

// 监听 electron 端发送来的消息
ipcRenderer.on('from-server', (event, params: ReceivedParams) => {
  // 通过服务器返回的唯一标识，找到对应的回调函数
  const cb = _waitMap.get(params.currentSymbol)
  if (typeof cb === 'function') {
    cb(params.data)
    // 移除当前标识与回调
    _waitMap.delete(params.currentSymbol)
  }
})

/**
 * 向 electron 服务端发送 ipc 通信，可以通过 async/await 方式获得服务端返回的结果
 * @param params SendParams
 */
export default function request (params: SendParams): Promise<any> {
  // @FIXME 生成机制有待优化
  // 生成唯一标识
  const currentSymbol = Date.now() + ''

  return new Promise(resolve => {
    // 在 promise 中等待回调被执行
    _waitMap.set(currentSymbol, data => {
      resolve(data)
    })
    // 发送到 electron 服务端
    ipcRenderer.send('from-client', {
      currentSymbol,
      params
    })
  })
}
