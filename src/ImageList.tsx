import React, { useState, useEffect } from 'react'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'
import { Grid, Card, CardMedia, CardActionArea, CardActions, IconButton, Button, Snackbar } from '@material-ui/core'
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

export default function ImageList () {
  const [snackbar, setSnackbar] = useState(false)
  const [downloadResult, setDownloadResult] = useState({ result: false, msg: '' })
  const [list, setList] = useState([])
  // @TODO 对多图片源支持（动态）
  const [searchData] = useState({
    type: EventType.PROXY,
    data: {
      url: 'https://cn.bing.com/HPImageArchive.aspx?format=js&idx=0&n=7&nc=1582381253445&pid=hp',
      method: 'get'
    }
  })

  const snackbarClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === 'clickaway') {
      return
    }
    setSnackbar(false)
  }

  // searchData 变化后调用
  useEffect(() => {
    console.log('server search', searchData)
    ipcRenderer.send('server', searchData)
  }, [searchData])

  // 下载图片
  const downLoadImg = (url: string) => {
    ipcRenderer.send('server', {
      type: EventType.DOWNLOAD,
      data: {
        url,
        type: 'biying'
      }
    })
  }

  // 设置桌面
  const setDesktopHandle = (url: string) => {
    ipcRenderer.send('server', {
      type: EventType.SET_DESKTOP,
      data: {
        url,
        type: 'biying'
      }
    })
  }

  ipcRenderer.on('client', (event: any, msg: any) => {
    const isSuccess = msg.data.success
    let snackbarMsg = ''
    switch (msg.type) {
      case EventType.PROXY:
        setList(msg?.data?.images || [])
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
  })

  const classes = useStyles()

  const imgGrids = list && list.map((val: any, index) => (
    <Grid key={index} item xl={3} lg={4} md={6} sm={12}>
      <Card className={classes.card} raised>
        <CardActionArea>
          <CardMedia className={classes.cardMedia} image={`https://cn.bing.com${val.url}`} title='Lemon wallpaper' />
        </CardActionArea>
        <CardActions className={classes.cardActions}>
          <IconButton aria-label='下载图片' onClick={() => downLoadImg(`https://cn.bing.com${val.url}`)}>
            <ArrowDownward />
          </IconButton>
          <Button variant='contained' color='primary' onClick={() => setDesktopHandle(`https://cn.bing.com${val.url}`)}>设置桌面</Button>
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
      <Grid container spacing={3}>
        {imgGrids}
      </Grid>
    </div>
  )
}
