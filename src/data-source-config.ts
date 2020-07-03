import { DataSource } from 'lemon-utils'
export default {
  [DataSource.BING]: {
    key: DataSource.BING,
    name: '必应搜索壁纸(CN)',
    searchUrl: 'https://cn.bing.com/HPImageArchive.aspx?format=js&idx=0&n=7&nc=1582381253445&pid=hp',
    canSearch: false,
    showDetail: true
  },
  [DataSource.UNSPLASH]: {
    key: DataSource.UNSPLASH,
    name: 'unsplash',
    apiUrl: '',
    canSearch: true,
    showDetail: false
  },
  [DataSource.WALLHAVEN]: {
    key: DataSource.WALLHAVEN,
    name: 'WallHaven',
    apiUrl: '',
    canSearch: true,
    showDetail: false
  }
}
