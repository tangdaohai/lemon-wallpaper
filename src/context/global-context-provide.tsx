import React, { useState } from 'react'
import GlobalContext from './global-context'
import dataSourceConfig from '../data-source-config'

interface Props {
  children: React.ReactElement | Array<React.ReactElement>
}

export default function GlobalContextProvide (props: Props) {
  const [searchContent, changeSearchContent] = useState('')
  const [dataSource, changeDataSource] = useState<keyof typeof dataSourceConfig>('unsplash')
  const [whParams, changeWhParams] = useState({
    categories: [1, 1, 1],
    purity: [1, 1]
  })

  return (
    <GlobalContext.Provider value={{ searchContent, changeSearchContent, dataSource, changeDataSource, whParams, changeWhParams }}>
      {props.children}
    </GlobalContext.Provider>
  )
}
