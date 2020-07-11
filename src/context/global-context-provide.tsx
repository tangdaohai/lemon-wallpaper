import React, { useState, useReducer } from 'react'
import { DataSource } from 'lemon-utils'
import GlobalContext, { ThemeType, DataSourceType, Search, SearchDispatchAction } from './global-context'

interface Props {
  children: React.ReactElement | Array<React.ReactElement>
}

const cacheThemeType = (window.localStorage.getItem('themeType') || 'light') as ThemeType

const defaultSearchValue: Search = {
  searchContent: '',
  dataSource: DataSource.BING,
  whParams: {
    categories: [1, 1, 1],
    purity: [1, 1]
  }
}

const reducer = (prevState: Search, action: SearchDispatchAction): Search => {
  switch (action.type) {
    case 'searchContent':
      return { ...prevState, searchContent: action.value as string }
    default:
      return defaultSearchValue
  }
}
export default function GlobalContextProvide (props: Props) {
  const [search, searchDispatch] = useReducer(reducer, defaultSearchValue)
  const [searchContent, changeSearchContent] = useState('')
  const [themeType, setThemeType] = useState<ThemeType>(cacheThemeType)
  // 默认搜索必应壁纸
  const [dataSource, changeDataSource] = useState<DataSourceType>(DataSource.BING)
  const [whParams, changeWhParams] = useState({
    categories: [1, 1, 1],
    purity: [1, 1]
  })

  return (
    <GlobalContext.Provider value={{ search, searchDispatch, themeType, setThemeType, searchContent, changeSearchContent, dataSource, changeDataSource, whParams, changeWhParams }}>
      {props.children}
    </GlobalContext.Provider>
  )
}
