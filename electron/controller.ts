import { EventType } from 'lemon-utils'
import wallpaper from 'wallpaper'
import { use } from './util/ipc-server'
import Proxy from './service/proxy-service'
import Download from './service/download-service'

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
use(EventType.PROXY, async (ctx, data) => {
  const result = await Proxy(data.type, data.params)
  ctx.reply(_success(result))
})

// 下载图片
use(EventType.DOWNLOAD, async (ctx, data) => {
  try {
    const result = await Download(data.type, data.url)
    ctx.reply(_success(result))
  } catch (e) {
    ctx.reply(_error('下载失败了'))
  }
})

// 设置为桌面
use(EventType.SET_DESKTOP, async (ctx, data) => {
  try {
    const result = await Download(data.type, data.url)
    await wallpaper.set(result.saveImgName)
    ctx.reply(_format(result.saveImgName === await wallpaper.get()))
  } catch (e) {
    console.log(e)
    ctx.reply(_error('设置失败'))
  }
})
