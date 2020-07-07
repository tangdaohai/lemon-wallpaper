import { createContext } from 'react'
import dataSourceConfig from '../data-source-config'

interface WhParams {
  categories: Array<number>,
  purity: Array<number>,
}
interface GlobalContext {
  themeType: 'dark' | 'light',
  setThemeType: (val: 'dark' | 'light') => void,
  searchContent: string,
  changeSearchContent: (val: string) => void,
  dataSource: keyof typeof dataSourceConfig,
  changeDataSource: (val: keyof typeof dataSourceConfig) => void,
  whParams: WhParams,
  changeWhParams: (params: WhParams) => void
}

const defaultContext: GlobalContext = {
  themeType: 'light',
  setThemeType: (val) => {},
  searchContent: '',
  changeSearchContent: (val: string) => {},
  dataSource: 'unsplash',
  changeDataSource: (val: keyof typeof dataSourceConfig) => {},
  whParams: {
    categories: [],
    purity: []
  },
  changeWhParams: (params: WhParams) => {}
}

export default createContext(defaultContext)
