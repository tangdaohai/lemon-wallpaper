import React, { useState, useEffect } from 'react'
import { Card, CardHeader, CardContent, Typography, CardActions, Button } from '@material-ui/core'
import Layout from './normal-layout'
import ipcRequest from '../util/ipc-request'
const { shell } = window.require('electron')

export default function Setting () {
  const [currentPath, setCurrentPath] = useState<string>('')
  const [selectPath, setSelectPath] = useState<string>('')

  useEffect(() => {
    ipcRequest('get-download-path').then(result => {
      if (result.success) {
        setCurrentPath(result.content)
      } else {
        // 错误提示
      }
    })
  }, [])

  // 选择目录
  const selectDownloadDirHandle = async () => {
    const result = await ipcRequest('select-dir')
    if (!result.content.canceled) {
      setSelectPath(result.content.filePaths[0])
    }
  }

  const openCurrentPathDirHandle = () => {
    shell.openItem(currentPath)
  }
  return (
    <Layout>
      <Card>
        <CardHeader subheader='下载设置' />
        <CardContent>
          <Typography variant='body2'>
            {selectPath || currentPath}
          </Typography>
        </CardContent>
        <CardActions>
          <Button onClick={selectDownloadDirHandle}>选择目录</Button>
          {/* 没有选择目录或者选择与当前目录一致时， 禁用 */}
          <Button disabled={!selectPath || selectPath === currentPath}>保存</Button>
          <Button style={{ marginLeft: 'auto' }} onClick={openCurrentPathDirHandle}>打开下载目录</Button>
        </CardActions>
      </Card>
    </Layout>
  )
}
