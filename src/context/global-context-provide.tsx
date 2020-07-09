import React, { useState } from 'react'
import { DataSource } from 'lemon-utils'
import GlobalContext, { ThemeType, DataSourceType } from './global-context'

interface Props {
  children: React.ReactElement | Array<React.ReactElement>
}

const cacheThemeType = (window.localStorage.getItem('themeType') || 'light') as ThemeType

export default function GlobalContextProvide (props: Props) {
  const [searchContent, changeSearchContent] = useState('')
  const [themeType, setThemeType] = useState<ThemeType>(cacheThemeType)
  // 默认搜索必应壁纸
  const [dataSource, changeDataSource] = useState<DataSourceType>(DataSource.BING)
  const [whParams, changeWhParams] = useState({
    categories: [1, 1, 1],
    purity: [1, 1]
  })

  return (
    <GlobalContext.Provider value={{ themeType, setThemeType, searchContent, changeSearchContent, dataSource, changeDataSource, whParams, changeWhParams }}>
      {props.children}
    </GlobalContext.Provider>
  )
}
