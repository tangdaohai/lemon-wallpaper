// 获取本地下载文件夹中的图片、删除等

import { promises as fs } from 'fs'
import { getDownloadDir } from './directory-service'

interface LocalImag {
  url: string,
  downloadUrl: string,
  time: string,
  size: string,
  mtime: number
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
        size: stat.size / 1024 + 'KB',
        mtime: stat.mtimeMs
      })
    }
  }
  // 按时间从大到小排序（早下载的在后面）
  result.sort((v1, v2) => {
    if (v2.mtime - v1.mtime > 0) {
      return 1
    } else {
      return -1
    }
  })
  return result
}

export function deleteLocalImg (path: string) {
  return fs.unlink(path)
}
