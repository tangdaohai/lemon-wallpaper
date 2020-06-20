// 获取本地下载文件夹中的图片、删除等

import { promises as fs } from 'fs'
import { getDownloadDir } from './directory-service'

interface LocalImag {
  url: string,
  downloadUrl: string,
  time: string,
  size: string
}

export async function getLocalList () {
  const result: Array<LocalImag> = []
  const path = getDownloadDir()

  const dir = await fs.opendir(path)
  for await (const dirent of dir) {
    if (dirent.isFile() && /\.(jpg|png)$/i.test(dirent.name)) {
      const imgPath = path + '/' + dirent.name
      const stat = await fs.stat(imgPath)
      result.push({
        url: 'file://' + imgPath,
        downloadUrl: imgPath,
        time: new Date(stat.mtimeMs).toLocaleString(),
        size: stat.size / 1024 + 'KB'
      })
    }
  }

  return result
}
