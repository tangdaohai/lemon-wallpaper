/** 生成 URL */
import { DataSource } from 'lemon-utils'
import dataSourceUrl from '../data-source-url'
import request from '../util/request'
import wallHavenParse from '../util/wallhaven-parse'

// 根据不同的壁纸类型与参数 生成对应的查询 url
function _buildUrl (type: string, params: any): string|Array<string> {
  let url: string|Array<string> = ''
  const startNum = params.pageNum * params.rowsPerPage
  // 默认搜索条件是 natural
  const queryText = params.query || 'night sky'
  const baseUrl = dataSourceUrl[type]
  switch (type) {
    case DataSource.BING:
      url = []
      for (let i = 0; i < params.rowsPerPage; i++) {
        url.push(`${baseUrl}&d=${startNum + i}`)
      }
      break
    case DataSource.UNSPLASH:
      // params.pageNum 前端中的第一页是 0，而 unsplash 的第一页是 1
      url = `${baseUrl}/?page=${params.pageNum + 1}&per_page=${params.rowsPerPage}&query=${queryText}`
      break
    case DataSource.WALLHAVEN:
      url = `${baseUrl}?q=${queryText}&categories=${params.whParams.categories.join('')}&purity=${params.whParams.purity.join('')}0&page=${params.pageNum + 1}`
      break
  }
  return url
}

export default async function (type: string, params: any) {
  const url = _buildUrl(type, params)
  let result: Object | Array<any> | string
  if (Array.isArray(url)) {
    result = await Promise.all(url.map(val => request(val)))
  } else {
    // wall haven 使用爬虫获取数据
    result = await request(url, type !== 'wallhaven')
  }

  // 转换数据格式
  switch (type) {
    case DataSource.BING:
      if (Array.isArray(result)) {
        result = result?.map(val => val.data).map(val => ({ time: val.enddate, url: val.url, downloadUrl: val.url, resolution: '1920 x 1080' })) || []
      }
      break
    case DataSource.UNSPLASH:
      result = (result as { results: Array<any> }).results!.map(val => {
        return {
          time: val.created_at,
          url: val.urls.small,
          downloadUrl: val.urls.full,
          resolution: val.width + ' x ' + val.height
        }
      })
      break
    case DataSource.WALLHAVEN:
      if (typeof result === 'string') {
        // 解析
        result = wallHavenParse(result)
      }
      break
  }

  return result
}
