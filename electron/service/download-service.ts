import { IncomingMessage } from 'http'
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
  switch (type) {
    case 'biying':
      imgName = url.split(/^.*\//)[1]
  }
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
