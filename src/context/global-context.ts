import { createContext } from 'react'
import dataSourceConfig from '../data-source-config'

export type ThemeType = 'dark' | 'light'
export type DataSourceType = keyof typeof dataSourceConfig
interface WhParams {
  categories: Array<number>,
  purity: Array<number>,
}
interface GlobalContext {
  themeType: ThemeType,
  setThemeType: (val: ThemeType) => void,
  searchContent: string,
  changeSearchContent: (val: string) => void,
  dataSource: DataSourceType,
  changeDataSource: (val: DataSourceType) => void,
  whParams: WhParams,
  changeWhParams: (params: WhParams) => void
}

export default createContext({} as GlobalContext)
