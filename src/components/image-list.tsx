import React, { useContext, useState, useEffect } from 'react'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'
import {
  Grid,
  Card,
  CardMedia,
  CardActionArea,
  CardContent,
  CardActions,
  Typography,
  IconButton,
  Button,
  Snackbar,
  TablePagination,
  LinearProgress
} from '@material-ui/core'
import MuiAlert, { AlertProps, Color as AlertType } from '@material-ui/lab/Alert'
import { EventType } from 'lemon-utils'
import { ArrowDownward } from '@material-ui/icons'
import GlobalContext from '../context/global-context'
import ipcRequest from '../util/ipc-request'

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
    // 进度条
    linearProgress: {
      position: 'absolute',
      width: '100%'
    },
    fixed: {
      zIndex: 1,
      width: 'calc(100% - 48px)',
      height: '76px',
      backgroundColor: theme.palette.background.default,
      paddingTop: '24px',
      margin: '0 24px',
      position: 'fixed',
      top: '64px',
      left: 0
    }
  })
)

function Alert (props: AlertProps) {
  return <MuiAlert elevation={6} variant='filled' {...props} />
}

export default function ImageList () {
  const { searchContent, dataSource, whParams } = useContext(GlobalContext)
  const [loading, setLoading] = useState(false)
  const [snackbar, setSnackbar] = useState(false)
  const [resultInfo, setResultInfo] = useState<{type: AlertType, content: string}>({ type: 'success', content: '' })
  const [list, setList] = useState([])
  // 页码
  const [pageNum, setPageNum] = useState(0)
  // 每页几条
  const [rowsPerPage, setRowsPerPage] = useState(12)

  useEffect(() => {
    setPageNum(0)
  }, [dataSource, searchContent])

  // 分页事件
  const handleChangePage = (event: unknown, newPage: number) => {
    setPageNum(newPage)
  }

  // 每页显示数量变化
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPageNum(0)
  }

  // 显示提示框，对显示内容复制，切换 Snackbar 显示状态
  const showSnackbar = (content: string, success: AlertType = 'success') => {
    setResultInfo({
      type: success,
      content: content
    })
    setSnackbar(true)
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

  // 下载图片
  const downLoadImg = async (url: string) => {
    setLoading(true)
    try {
      const result = await ipcRequest(EventType.DOWNLOAD, {
        url,
        type: dataSource
      })
      if (result.success) {
        showSnackbar('下载成功。', 'success')
      } else {
        showSnackbar('下载失败。', 'error')
      }
    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false)
    }
  }

  // 设置桌面
  const setDesktopHandle = async (url: string) => {
    setLoading(true)
    try {
      const result = await ipcRequest(EventType.SET_DESKTOP, {
        url,
        type: dataSource
      })
      if (result.success) {
        showSnackbar('已设置成功。', 'success')
      } else {
        showSnackbar('设置失败。', 'error')
      }
    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false)
    }
  }

  // 关闭提示框
  const snackbarClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === 'clickaway') {
      return
    }
    setSnackbar(false)
  }

  const classes = useStyles()

  // 图片布局列表
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
        <CardActions>
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
      <div className={classes.fixed}>
        <LinearProgress className={classes.linearProgress} style={{ display: loading ? '' : 'none' }} />
        {/* 分页组件 */}
        <TablePagination
          classes={{
            // wallHaven 不可以选择分页条数
            root: dataSource === 'wallhaven' ? 'pagination-root-select-none' : ''
          }}
          rowsPerPageOptions={[6, 8, 9, 12, 16, 18]}
          component='div'
          count={-1}
          rowsPerPage={rowsPerPage}
          page={pageNum}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </div>
      {/* 提示框 */}
      <Snackbar
        open={snackbar}
        onClose={snackbarClose}
        autoHideDuration={2000}
        anchorOrigin={{ horizontal: 'center', vertical: 'top' }}
      >
        <Alert severity={resultInfo.type}>
          {resultInfo.content}
        </Alert>
      </Snackbar>
      <Grid container spacing={3} style={{ marginTop: '52px' }}>
        {list.length > 0 ? imgGrids : <Typography>没有可以显示的内容。</Typography>}
      </Grid>
    </div>
  )
}
