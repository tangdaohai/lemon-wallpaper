import { promises as fsPromises, constants } from 'fs'
import { dialog } from 'electron'
import * as Config from '../config'
// 选择目录
export function selectDir () {
  return dialog.showOpenDialog({
    properties: ['openDirectory', 'createDirectory', 'promptToCreate']
  })
}
// 获取当前存放下载图片的目录
export function getDownloadDir () {
  return Config.get().downLoadPath
}

// 设置保存图片的路径
export async function setDownloadDir (path: string, oldPath: string | false) {
  // 判断新路径是否存在
  try {
    await fsPromises.access(path, constants.F_OK | constants.W_OK)
  } catch (err) {
    console.log(err)
    if (err.code === 'ENOENT') {
      // 文件夹不存在，创建
      await fsPromises.mkdir(path, { recursive: true })
    } else {
      // err.code === 'EACCES' 没有写入的权限
      throw new Error(err)
    }
  }
  // 判断是否需要将原目录图片移动到新的目录下
  if (oldPath) {
    await _move(path, oldPath)
  }
  // 修改配置
  const config = Config.get()
  config.downLoadPath = path
  return Config.set(config, true)
}

/**
 * 先尝试文件夹重命名
 * 如果失败 则进入文件夹 单独对每个文件进行移动
 * @param newPath 新的路径
 * @param oldPath 旧的路径
 */
async function _move (newPath: string, oldPath: string) {
  // 1. 先尝试使用 rename
  try {
    await fsPromises.rename(oldPath, newPath)
    // 移动成功，旧的目录被移走了，重新生成一个
    await fsPromises.mkdir(oldPath)
  } catch (err) {
    if (err.code === 'ENOTEMPTY') {
      // newPath 不是一个空目录，移动失败
      const dir = await fsPromises.opendir(oldPath)
      for await (const file of dir) {
        // 移动文件
        await fsPromises.rename(oldPath + '/' + file.name, newPath + '/' + file.name)
      }
    } else {
      throw new Error(err)
    }
  }
}
