// ipc 通信处理
import { IpcMainEvent } from 'electron'
import { IncomingMessage } from 'http'
import { EventType } from 'lemon-utils'
const request = require('request')

/**
 * 处理 ipcMain 事件
 * @param event IpcMainEvent
 * @param data 页面发送的数据
 */
export default async function (event: IpcMainEvent, msg: { type: string, data: any}) {
  let result: object = {}
  switch (msg.type) {
    case EventType.PROXY:
      // 请求转发
      result = await proxy(msg.data)
      break
    case EventType.SET_DESKTOP:
      // 设置桌面
      break
  }
  event.reply('client', {
    type: msg.type,
    data: result
  })
}

async function proxy (data: any): Promise<object> {
  const { url, method } = data
  console.log('client ', data)
  return new Promise(resolve => {
    console.log('发起请求')
    request({
      url,
      method,
      json: true
    }, (err: any, response: IncomingMessage, body: any) => {
      console.log('请求结束')
      console.log('err: ' + err)
      console.log('typeof body: ' + typeof body)
      if (err) {
        resolve({
          success: false
        })
        return
      }
      resolve(body)
    })
  })
}
