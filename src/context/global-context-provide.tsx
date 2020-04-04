import React, { useState } from 'react'
import GlobalContext from './global-context'
import dataSourceConfig from '../data-source-config'

interface Props {
  children: React.ReactElement | Array<React.ReactElement>
}

export default function GlobalContextProvide (props: Props) {
  const [searchContent, changeSearchContent] = useState('')
  const [dataSource, changeDataSource] = useState<keyof typeof dataSourceConfig>('unsplash')

  return (
    <GlobalContext.Provider value={{ searchContent, changeSearchContent, dataSource, changeDataSource }}>
      {props.children}
    </GlobalContext.Provider>
  )
}
