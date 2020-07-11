import { createContext } from 'react'
import dataSourceConfig from '../data-source-config'

export type ThemeType = 'dark' | 'light'
export type DataSourceType = keyof typeof dataSourceConfig
export type SearchDispatchAction = { type: keyof Search, value: string | object }
interface WhParams {
  categories: Array<number>,
  purity: Array<number>,
}
export interface Search {
  searchContent?: string,
  dataSource: DataSourceType,
  whParams?: WhParams
}
interface GlobalContext {
  themeType: ThemeType,
  setThemeType: (val: ThemeType) => void,
  search?: Search,
  searchDispatch?: React.Dispatch<SearchDispatchAction>,
  searchContent: string,
  changeSearchContent: (val: string) => void,
  dataSource: DataSourceType,
  changeDataSource: (val: DataSourceType) => void,
  whParams: WhParams,
  changeWhParams: (params: WhParams) => void
}

export default createContext({} as GlobalContext)
