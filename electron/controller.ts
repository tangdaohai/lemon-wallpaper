import { EventType } from 'lemon-utils'
import wallpaper from 'wallpaper'
import { use } from './util/ipc-server'
import Proxy from './service/proxy-service'
import Download from './service/download'

function _format (isSuccess: boolean, content?: any) {
  return {
    success: isSuccess,
    content
  }
}
// proxy
use(EventType.PROXY, async (ctx, data) => {
  const result = await Proxy(data.type, data.params)
  ctx.reply(_format(true, result))
})

// 下载图片
use(EventType.DOWNLOAD, async (ctx, data) => {
  const result = await Download(data.type, data.params)
  ctx.reply(_format(true, result))
})

// 设置为桌面
use(EventType.SET_DESKTOP, async (ctx, data) => {
  const result = await Download(data.type, data.params)
  await wallpaper.set(result.path)
  ctx.reply(result.path === await wallpaper.get())
})
