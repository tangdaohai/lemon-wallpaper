const cheerio = require('cheerio')

interface WallHaven {
  url: string,
  downloadUrl: string,
  resolution: string
}
/**
 * 根据 WallHaven 返回的 html 解析来获取搜索后的地址信息
 * @param html
 */
export default function getWallHavenUrls (html: string): Array<WallHaven> {
  const result: Array<WallHaven> = []
  const $ = cheerio.load(html)
  $('figure[data-wallpaper-id]').each((i, element) => {
    const $node = $(element)
    // 展示的 small url
    const url = $node.find('img').data('src')
    const suffix = url.split('small/')[1]
    // 下载时使用的高清图片地址（根据 WallHaven 拼接）
    const downloadUrl = 'https://w.wallhaven.cc/full/' + suffix.replace('/', '/wallhaven-')
    // 分辨率信息
    const resolution = $node.find('span.wall-res').text()
    result.push({ url, downloadUrl, resolution })
  })
  return result
}
