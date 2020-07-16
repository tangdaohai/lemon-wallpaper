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
const sizeUnit = ['B', 'KB', 'MB', 'GB']
/**
 * 存储单位大小转换。eg：1024B =》 1KB
 * @param size 单位为 B
 */
function formatSize (size: number): string {
  let temp: number = size
  let index: number = 0
  while (temp > 1024) {
    temp /= 1024
    index++
  }
  return (Number.isInteger(temp) ? temp : temp.toFixed(2)) + sizeUnit[index]
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
        size: formatSize(stat.size),
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
