import { promises as fsPromises } from 'fs'
import { join } from 'path'
import { app } from 'electron'
import { set as setConfig, LemonConfig } from '../config'
const userDataPath = app.getPath('userData')

/**
 * 初始化 配置文件
 * 如果有则加载
 * 不存在则使用默认的配置模板
 * @returns 返回 LemonConfig
 */
export default async function () {
  const configPath = join(userDataPath, 'config.json')
  let lemonConfig: LemonConfig = { downLoadPath: '' }
  let isWriteConfig: boolean = false
  // 1. 读取文件
  try {
    const result = await fsPromises.readFile(configPath, 'utf8')
    lemonConfig = JSON.parse(result)
    console.log('已找到', result)
  } catch (err) {
    // 使用默认配置模板
    const configTemplate = lemonConfig = require('../config-template.json')
    // 设置默认下载图片的保存路径
    configTemplate.downLoadPath = join(app.getPath('pictures'), 'lemon-wallpaper')
    if (err.code === 'ENOENT') {
      console.log('不存在，立刻生成')
      isWriteConfig = true
    }
  }
  // 设置 config
  setConfig(lemonConfig, isWriteConfig)
}
