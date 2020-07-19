import { IncomingMessage } from 'http'
import { URL as UrlParse } from 'url'
import { DataSource } from 'lemon-utils'
import { get as getConfig } from '../config'
import { createWriteStream, promises as fsPromises } from 'fs'
import { join } from 'path'
const request = require('request')

interface DownLoadResult {
  url: string,
  saveImgName: string
}

export default async function (type: string, url: string): Promise<DownLoadResult> {
  // const { url, type } = data
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
  try {
    switch (type) {
      case DataSource.BING:
      case DataSource.WALLHAVEN:
        imgName = url.split(/^.*\//)[1]
        break
      case DataSource.UNSPLASH:
        // eslint-disable-next-line no-case-declarations
        const urlObj = new UrlParse(url)
        imgName = `${urlObj.pathname?.replace('/', '')}.${urlObj.searchParams.get('fm') || 'jpg'}`
        break
    }
  } catch (err) {}
  const saveImgName = join(saveImgPath, imgName)
  return new Promise((resolve, reject) => {
    request(url, (err: any, response: IncomingMessage, body: any) => {
      if (err) {
        console.log(err)
        return reject(err)
      }
      resolve({
        url,
        saveImgName
      } as DownLoadResult)
    }).pipe(createWriteStream(saveImgName))
  })
}
