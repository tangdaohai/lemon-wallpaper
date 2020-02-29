// ipc 通信处理
import { IpcMainEvent } from 'electron'
import { IncomingMessage } from 'http'
import { createWriteStream } from 'fs'
import { join } from 'path'
import { EventType } from 'lemon-utils'
import { get as getConfig } from '../config'
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
    case EventType.DOWNLOAD:
      result = await download(msg.data)
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

/**
 * http 代理
 * @param data
 */
async function proxy (data: any): Promise<object> {
  const { url, method } = data
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

// 下载图片
function download (data: any): Promise<object> {
  const { url, type } = data
  const downLoadUrl = getConfig().downLoadPath
  // 默认图片名称
  let imgName: string = 'default-' + Date.now() + '.jpg'
  switch (type) {
    case 'biying':
      imgName = url.match(/id=.*\.jpg/)[0]
  }
  return new Promise(resolve => {
    createWriteStream(join(downLoadUrl, imgName)).pipe(request(url, (err: any, response: IncomingMessage, body: any) => {
      if (err) {
        resolve({
          success: false
        })
        return
      }
      resolve({
        success: true
      })
    }))
  })
}