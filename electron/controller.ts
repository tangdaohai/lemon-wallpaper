import { EventType } from 'lemon-utils'
import wallpaper from 'wallpaper'
import server from 'electron-happy-ipc/server'
import Proxy from './service/proxy-service'
import Download from './service/download-service'
import * as Directory from './service/directory-service'
import * as Local from './service/local-service'

function _success (content?: any) {
  return {
    success: true,
    content
  }
}

function _error (content?: any) {
  return {
    success: false,
    content
  }
}

function _format (isSuccess: boolean, content?: any) {
  return isSuccess ? _success(content) : _error(content)
}

// proxy
server.use(EventType.PROXY, async (ctx, data) => {
  const result = await Proxy(data.type, data.params)
  ctx.reply(_success(result))
})

// 下载图片
server.use(EventType.DOWNLOAD, async (ctx, data) => {
  try {
    const result = await Download(data.type, data.url)
    ctx.reply(_success(result))
  } catch (e) {
    ctx.reply(_error('下载失败了'))
  }
})

// 设置为桌面
server.use(EventType.SET_DESKTOP, async (ctx, data) => {
  try {
    const result = await Download(data.type, data.url)
    await wallpaper.set(result.saveImgName)
    ctx.reply(_format(result.saveImgName === await wallpaper.get()))
  } catch (e) {
    console.log(e)
    ctx.reply(_error('设置失败'))
  }
})

// 选择目录
server.use('select-dir', async (ctx) => {
  const result = await Directory.selectDir()
  ctx.reply(_success(result))
})

// 获取当前下载存放的目录
server.use('get-download-path', async ctx => {
  const result = await Directory.getDownloadDir()
  ctx.reply(_success(result))
})

// 写入配置文件
server.use('set-download-path', async (ctx, data) => {
  try {
    await Directory.setDownloadDir(data.path, data.oldPath)
    ctx.reply(_success())
  } catch (err) {
    if (err.code === 'EACCES') {
      ctx.reply(_error('新的目录没有写入的权限'))
    } else {
      ctx.reply(_error('设置失败...'))
    }
  }
})
// 获取本地图片
server.use('get-local-img', async ctx => {
  try {
    const result = await Local.getLocalList()
    ctx.reply(_success(result))
  } catch (err) {
    ctx.reply(_error('获取本地图片失败。'))
  }
})

server.use('set-local-img-desktop', async (ctx, data) => {
  try {
    await wallpaper.set(data.url)
    ctx.reply(_format(data.url === await wallpaper.get()))
  } catch (e) {
    console.log(e)
    ctx.reply(_error('设置失败'))
  }
})
