// 获取本地下载文件夹中的图片、删除等

import { promises as fs } from 'fs'
import { getDownloadDir } from './directory-service'

interface LocalImag {
  name: string,
  time: number,
  size: number
}

export async function getLocalList () {
  const result: Array<LocalImag> = []
  const path = getDownloadDir()

  const dir = await fs.opendir(path)
  for await (const dirent of dir) {
    if (dirent.isFile()) {
      const name = dirent.name
      const stat = await fs.stat(path + '/' + name)
      result.push({
        name,
        time: stat.ctimeMs,
        size: stat.size
      })
    }
  }

  return result
}
