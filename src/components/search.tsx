import React, { useContext, useState, useEffect } from 'react'
import { LinearProgress } from '@material-ui/core'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'
import { EventType } from 'lemon-utils'
import GlobalContext from '../context/global-context'
import ipcRequest from 'electron-happy-ipc/request'
import ImageList from './common/image-list'

const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    // 进度条
    linearProgress: {
      position: 'absolute',
      width: '100%'
    }
  })
})

export default function Search () {
  const { search } = useContext(GlobalContext)
  const { searchContent, dataSource, whParams } = search
  const [loading, setLoading] = useState(false)
  const [list, setList] = useState([])
  // 页码
  const [pageNum, setPageNum] = useState(0)
  // 每页几条
  const [rowsPerPage, setRowsPerPage] = useState(12)

  const classes = useStyles()

  useEffect(() => {
    setPageNum(0)
  }, [dataSource, searchContent])

  // 分页事件
  const pageChangeHandle = (newPage: number) => {
    setPageNum(newPage)
  }

  // 每页显示数量变化
  const rowsPerPageChangeHandle = (num: number) => {
    setRowsPerPage(num)
    setPageNum(0)
  }

  // 图片列表发起请求
  const listRequest = async (data: any) => {
    setLoading(true)
    try {
      const result = await ipcRequest(EventType.PROXY, data)
      if (result.success) {
        setList(result?.content || [])
      } else {
        // 提示
      }
    } finally {
      setLoading(false)
    }
  }

  // @TODO 对多图片源支持（动态）
  // 生成查询对象
  useEffect(() => {
    const data = {
      type: dataSource,
      params: {
        pageNum,
        rowsPerPage,
        query: searchContent,
        whParams
      }
    }
    listRequest(data)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataSource, searchContent, pageNum, rowsPerPage, whParams])

  return (
    <div>
      <LinearProgress className={classes.linearProgress} style={{ display: loading ? '' : 'none' }} />
      <ImageList
        list={list}
        rowsPerPage={rowsPerPage}
        onPerPageChange={rowsPerPageChangeHandle}
        onPageChange={pageChangeHandle}
      />
    </div>
  )
}
