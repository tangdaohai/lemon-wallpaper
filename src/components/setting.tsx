import React, { useState, useEffect } from 'react'
import {
  Card,
  CardHeader,
  CardContent,
  Typography,
  CardActions,
  Button,
  FormControlLabel,
  Checkbox
} from '@material-ui/core'
import Layout from './normal-layout'
import ipcRequest from '../util/ipc-request'
import { Color as AlertType } from '@material-ui/lab/Alert'
import ShowMessage, { ShowMessageProps } from './show-message'
const { shell } = window.require('electron')

export default function Setting () {
  // 当前设置的下载路径
  const [currentPath, setCurrentPath] = useState<string>('')
  // 当前选择要保存的路径
  const [selectPath, setSelectPath] = useState<string>('')
  const [moveAll, setMoveAll] = useState<boolean>(true)
  // 提示信息
  const [message, setMessage] = useState<ShowMessageProps>({
    content: '',
    open: false
  })

  useEffect(() => {
    ipcRequest('get-download-path').then(result => {
      if (result.success) {
        setCurrentPath(result.content)
      } else {
        // 错误提示
      }
    })
  }, [])

  // 显示提示框，对显示内容复制，切换 Snackbar 显示状态
  const showMessage = (content: string, type: AlertType) => {
    setMessage({
      content,
      type,
      open: true
    })
  }

  // 选择目录
  const selectDownloadDirHandle = async () => {
    const result = await ipcRequest('select-dir')
    if (!result.content.canceled) {
      setSelectPath(result.content.filePaths[0])
    }
  }

  // 保存当前选择的目录
  const saveDownloadPathHandle = async () => {
    const result = await ipcRequest('set-download-path', {
      path: selectPath,
      oldPath: moveAll ? currentPath : ''
    })
    if (result.success) {
      setCurrentPath(selectPath)
      showMessage('目录设置成功', 'success')
    } else {
      showMessage(result.content, 'error')
    }
  }

  // 打开当前下载目录
  const openCurrentPathDirHandle = () => {
    shell.openItem(currentPath)
  }

  // 是否移动图片的 checkbox
  const moveAllChangeHandle = () => {
    setMoveAll(!moveAll)
  }

  // 提示框关闭
  const messageCloseHandle = () => {
    setMessage({
      ...message,
      open: false
    })
  }
  return (
    <Layout>
      <ShowMessage {...message} onClose={messageCloseHandle} />
      <Card>
        <CardHeader subheader='下载设置' />
        <CardContent>
          <Typography variant='body2'>
            {selectPath || currentPath}
          </Typography>
          {
            selectPath &&
            selectPath !== currentPath &&
              <FormControlLabel
                label='同时将原目录下所有的图片移动到新目录中'
                control={
                  <Checkbox
                    color='primary'
                    size='small'
                    checked={moveAll}
                    onChange={moveAllChangeHandle}
                  />
                }
              />
          }
        </CardContent>
        <CardActions>
          <Button onClick={selectDownloadDirHandle}>选择目录</Button>
          {/* 没有选择目录或者选择与当前目录一致时， 禁用 */}
          <Button disabled={!selectPath || selectPath === currentPath} onClick={saveDownloadPathHandle}>保存</Button>
          <Button style={{ marginLeft: 'auto' }} onClick={openCurrentPathDirHandle}>打开下载目录</Button>
        </CardActions>
      </Card>
    </Layout>
  )
}
