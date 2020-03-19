import React, { useState, useEffect } from 'react'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'
import { Grid, Card, CardMedia, CardActionArea, CardContent, CardActions, Typography, IconButton, Button, Snackbar, TablePagination } from '@material-ui/core'
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert'
import { EventType } from 'lemon-utils'
import { ArrowDownward } from '@material-ui/icons'
const { ipcRenderer } = window.require('electron')
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1
    },
    card: {
      width: '100%',
      borderRadius: 0
    },
    cardMedia: {
      height: 0,
      paddingTop: '56.25%',
      backgroundSize: 'contain'
    },
    cardActions: {
      // height: '60px',
      // justifyContent: 'center'
    }
  })
)

function Alert (props: AlertProps) {
  return <MuiAlert elevation={6} variant='filled' {...props} />
}

interface ImageListProps {
  dataSource: string;
}

export default function ImageList (props: ImageListProps) {
  const [snackbar, setSnackbar] = useState(false)
  const [downloadResult, setDownloadResult] = useState({ result: false, msg: '' })
  const [list, setList] = useState([])
  // 页码
  const [pageNum, setPageNum] = useState(0)
  // 每页几条
  const [rowsPerPage, setRowsPerPage] = useState(5)

  useEffect(() => {
    setPageNum(0)
  }, [props.dataSource])

  // 分页事件
  const handleChangePage = (event: unknown, newPage: number) => {
    setPageNum(newPage)
  }

  // 每页显示数量变化
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPageNum(0)
  }

  // @TODO 对多图片源支持（动态）
  // 生成查询对象
  useEffect(() => {
    console.log('search')
    const searchData = {
      type: EventType.PROXY,
      data: {
        type: props.dataSource,
        params: {
          pageNum,
          rowsPerPage,
          query: 'cat'
        }
      }
    }
    ipcRenderer.send('server', searchData)
  }, [props.dataSource, pageNum, rowsPerPage])

  // 关闭提示框
  const snackbarClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === 'clickaway') {
      return
    }
    setSnackbar(false)
  }

  // 下载图片
  const downLoadImg = (url: string) => {
    ipcRenderer.send('server', {
      type: EventType.DOWNLOAD,
      data: {
        url,
        type: props.dataSource
      }
    })
  }

  // 设置桌面
  const setDesktopHandle = (url: string) => {
    ipcRenderer.send('server', {
      type: EventType.SET_DESKTOP,
      data: {
        url,
        type: props.dataSource
      }
    })
  }

  // ipc 通信监听方法
  const ipcClientFn = (event: any, msg: any) => {
    const isSuccess = msg.data.success
    let snackbarMsg = ''
    switch (msg.type) {
      case EventType.PROXY:
        setList(msg?.data || [])
        break
      case EventType.DOWNLOAD:
      case EventType.SET_DESKTOP:
        if (msg.type === EventType.DOWNLOAD) {
          snackbarMsg = isSuccess ? '下载成功。' : '下载失败。'
        } else {
          snackbarMsg = isSuccess ? '设置成功。' : '设置失败。'
        }
        setDownloadResult({ result: isSuccess, msg: snackbarMsg })
        setSnackbar(true)
        break
    }
  }

  //  ipc 通信绑定监听事件
  useEffect(() => {
    ipcRenderer.on('client', ipcClientFn)
    return () => {
      // 解绑事件
      ipcRenderer.off('client', ipcClientFn)
    }
  }, [])

  const classes = useStyles()
  const imgGrids = list && list.map((val: any, index) => (
    <Grid key={index} item xl={3} lg={4} md={6} sm={12}>
      <Card className={classes.card} raised>
        <CardActionArea>
          <CardMedia className={classes.cardMedia} image={val.url} title='Lemon wallpaper' />
        </CardActionArea>
        <CardContent>
          {val.time && <Typography variant='body2' color='textSecondary' component='p'>{val.time}</Typography>}
          <Typography variant='body2' color='textSecondary' component='p'>分辨率: {val.resolution}</Typography>
        </CardContent>
        <CardActions className={classes.cardActions}>
          <IconButton aria-label='下载图片' onClick={() => downLoadImg(val.downloadUrl)}>
            <ArrowDownward />
          </IconButton>
          <Button variant='contained' color='primary' onClick={() => setDesktopHandle(val.downloadUrl)}>设置桌面</Button>
        </CardActions>
      </Card>
    </Grid>
  ))

  return (
    <div className={classes.root}>
      {/* 下载结果提示条 */}
      <Snackbar
        open={snackbar}
        onClose={snackbarClose}
        autoHideDuration={2000}
        anchorOrigin={{ horizontal: 'center', vertical: 'top' }}
      >
        <Alert severity={downloadResult.result ? 'success' : 'error'}>
          {downloadResult.msg}
        </Alert>
      </Snackbar>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component='div'
        count={-1}
        rowsPerPage={rowsPerPage}
        page={pageNum}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
      <Grid container spacing={3}>
        {imgGrids}
      </Grid>
    </div>
  )
}
