import { createContext } from 'react'
import dataSourceConfig from '../data-source-config'

interface GlobalContext {
  searchContent: string,
  changeSearchContent: (val: string) => void,
  dataSource: keyof typeof dataSourceConfig,
  changeDataSource: (val: keyof typeof dataSourceConfig) => void
}

const defaultContext: GlobalContext = {
  searchContent: '',
  changeSearchContent: (val: string) => {},
  dataSource: 'unsplash',
  changeDataSource: (val: keyof typeof dataSourceConfig) => {}
}

export default createContext(defaultContext)
