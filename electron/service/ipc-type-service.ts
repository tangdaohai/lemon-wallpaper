// ipc 通信处理
import { IpcMainEvent } from 'electron'
import { IncomingMessage } from 'http'
import { createWriteStream, promises as fsPromises } from 'fs'
import { join } from 'path'
import wallpaper from 'wallpaper'
import { EventType } from 'lemon-utils'
import { get as getConfig } from '../config'
import dataSourceUrl from '../data-source-url'
const request = require('request')

/** 生成 URL */
function buildUrl (type: string, params: any): string|Array<string> {
  let url: string|Array<string> = ''
  const startNum = params.pageNum * params.rowsPerPage
  switch (type) {
    case 'biying':
      url = []
      for (let i = 0; i < params.rowsPerPage; i++) {
        url.push(`${dataSourceUrl.biying}&d=${startNum + i}`)
      }
  }
  return url
}

/** request 请求封装 */
function _request (url: string): Promise<object> {
  return new Promise(resolve => {
    console.log('发起请求')
    request({
      url,
      json: true,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36'
      }
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

/**
 * 处理 ipcMain 事件
 * @param event IpcMainEvent
 * @param data 页面发送的数据
 */
export default async function (event: IpcMainEvent, msg: { type: string, data: any}) {
  let result: object | Array<any> = {}
  switch (msg.type) {
    case EventType.PROXY:
      // 请求转发
      result = await proxy(msg.data)
      if (Array.isArray(result)) {
        result = result.map(val => val.data)
      }
      break
    case EventType.DOWNLOAD:
      result = await download(msg.data)
      break
    case EventType.SET_DESKTOP:
      // 设置桌面
      result = await setDesktop(msg.data)
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
async function proxy (data: any): Promise<object|Array<object>> {
  const url = buildUrl(data.type, data.params)
  if (Array.isArray(url)) {
    const result = await Promise.all(url.map(val => _request(val)))
    return result
  } else {
    return _request(url)
  }
}
proxy({
  type: 'biying',
  params: {
    pageNum: 0,
    rowsPerPage: 2
  }
})
interface DownLoadResult {
  success: boolean;
  content: {
    url: string,
    saveImgName?: string
  }
}
// 下载图片
async function download (data: any): Promise<DownLoadResult> {
  const { url, type } = data
  const saveImgPath = getConfig().downLoadPath
  console.log('图片保存地址：', saveImgPath)
  try {
    // 不存在就创建
    await fsPromises.mkdir(saveImgPath)
    console.log('文件夹创建成功。')
  } catch (err) {
    console.log('地址已存在。')
  }
  console.log('图片下载 url: ', url)
  // 默认图片名称
  let imgName: string = 'default-' + Date.now() + '.jpg'
  switch (type) {
    case 'biying':
      imgName = url.match(/id=.*\.jpg/)[0]
  }
  const saveImgName = join(saveImgPath, imgName)
  return new Promise(resolve => {
    request(url, (err: any, response: IncomingMessage, body: any) => {
      if (err) {
        resolve({
          success: false,
          content: {
            url
          }
        } as DownLoadResult)
        return
      }
      resolve({
        success: true,
        content: {
          url,
          saveImgName
        }
      } as DownLoadResult)
    }).pipe(createWriteStream(saveImgName))
  })
}

// 设置壁纸
async function setDesktop (data: any): Promise<object> {
  const downloadResult = await download(data)
  if (downloadResult.success) {
    const saveImgName = downloadResult.content.saveImgName!
    // 设置壁纸
    await wallpaper.set(saveImgName)
    // 验证是否已设置完成
    return {
      success: saveImgName === await wallpaper.get()
    }
  }

  return { success: false }
}
