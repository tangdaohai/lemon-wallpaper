import { promises as fsPromises } from 'fs'
import { join } from 'path'
import { app } from 'electron'
let lemonConfig: LemonConfig

export async function set (config: LemonConfig, write: boolean = false) {
  lemonConfig = config
  if (write) {
    // 写入配置文件中
    const userDataPath = app.getPath('userData')
    const configPath = join(userDataPath, 'config.json')
    try {
      await fsPromises.writeFile(configPath, JSON.stringify(lemonConfig), 'utf8')
    } catch (err) {
      console.log(err)
      throw new Error('写入配置文件失败')
    }
  }
}

export function get () {
  return lemonConfig
}

export interface LemonConfig {
  downLoadPath: string;
}
