import { createContext } from 'react'
import dataSourceConfig from '../data-source-config'

interface WhParams {
  categories: Array<number>,
  purity: Array<number>,
}
interface GlobalContext {
  searchContent: string,
  changeSearchContent: (val: string) => void,
  dataSource: keyof typeof dataSourceConfig,
  changeDataSource: (val: keyof typeof dataSourceConfig) => void,
  whParams: WhParams,
  changeWhParams: (params: WhParams) => void
}

const defaultContext: GlobalContext = {
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
