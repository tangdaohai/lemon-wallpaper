import React, { useState, useReducer } from 'react'
import { DataSource } from 'lemon-utils'
import GlobalContext, { ThemeType, Search, SearchDispatchAction } from './global-context'

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
  return { ...prevState, [action.type]: action.value }
}
export default function GlobalContextProvide (props: Props) {
  const [search, searchDispatch] = useReducer(reducer, defaultSearchValue)
  const [themeType, setThemeType] = useState<ThemeType>(cacheThemeType)

  return (
    <GlobalContext.Provider value={{ search, searchDispatch, themeType, setThemeType }}>
      {props.children}
    </GlobalContext.Provider>
  )
}
