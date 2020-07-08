import React, { useState } from 'react'
import { DataSource } from 'lemon-utils'
import GlobalContext from './global-context'
import dataSourceConfig from '../data-source-config'

interface Props {
  children: React.ReactElement | Array<React.ReactElement>
}

const cacheThemeType = (window.localStorage.getItem('themeType') || 'light') as 'light' | 'dark'

export default function GlobalContextProvide (props: Props) {
  const [searchContent, changeSearchContent] = useState('')
  const [themeType, setThemeType] = useState<'dark' | 'light'>(cacheThemeType)
  // 默认搜索必应壁纸
  const [dataSource, changeDataSource] = useState<keyof typeof dataSourceConfig>(DataSource.BING)
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
