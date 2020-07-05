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
  TablePagination,
  LinearProgress,
  Popover
} from '@material-ui/core'
import { Color as AlertType } from '@material-ui/lab/Alert'
import { EventType } from 'lemon-utils'
import { ArrowDownward, Delete as DeleteIcon } from '@material-ui/icons'
import GlobalContext from '../../context/global-context'
import ipcRequest from 'electron-happy-ipc/request'
import ShowMessage, { ShowMessageProps } from './show-message'

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
    },
    noData: {
      lineHeight: '60px',
      marginTop: '8px'
    }
  })
)
interface ImageListProps {
  list: Array<any>,
  total?: number,
  rowsPerPage: number,
  onPageChange?: (num: number) => void,
  onPerPageChange?: (num: number) => void,
  onDelete?: (downloadUrl: string) => void,
  isLocal?: boolean
}

/**
 * @FIXME 滚动动画算法需要优化
 * 设置 scrollTop 属性
 * @param doc HTMLHtmlElement
 * @param step number 每次滚动高度 默认 20px
 */
const scrollTop = (doc: HTMLHtmlElement, step: number = 20) => {
  doc.scrollTop -= step
  if (doc.scrollTop > 0) {
    const timer = setInterval(() => {
      doc.scrollTop -= step
      if (doc.scrollTop <= 0) {
        clearInterval(timer)
      }
    }, 0)
  }
}

// 存放要被删除图片的地址
let deleteUrl = ''

export default function ImageList (props: ImageListProps) {
  const { dataSource } = useContext(GlobalContext)
  const [loading, setLoading] = useState(false)
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null)
  const [message, setMessage] = useState<ShowMessageProps>({
    content: '',
    open: false
  })

  // 页码
  const [pageNum, setPageNum] = useState(0)

  const open = Boolean(anchorEl)
  const id = open ? 'simple-popover' : undefined

  const { list } = props

  useEffect(() => {
    setPageNum(0)
  }, [dataSource])

  useEffect(() => {
    scrollTop(document.querySelector('html')!)
  }, [props.list])

  // 分页事件
  const handleChangePage = (event: unknown, newPage: number) => {
    setPageNum(newPage)
    props.onPageChange && props.onPageChange(newPage)
  }

  // 每页显示数量变化
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPageNum(0)
    props.onPerPageChange && props.onPerPageChange(parseInt(event.target.value, 10))
  }

  // 显示提示框，对显示内容复制，切换 Snackbar 显示状态
  const showMessage = (content: string, type: AlertType) => {
    setMessage({
      content,
      type,
      open: true
    })
  }

  // 下载图片
  const downLoadImg = async (url: string) => {
    setLoading(true)
    try {
      const result = await ipcRequest(EventType.DOWNLOAD, {
        url,
        type: dataSource
      })
      if (result.success) {
        showMessage('下载成功。', 'success')
      } else {
        showMessage('下载失败。', 'error')
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
      const result = await ipcRequest(props.isLocal ? 'set-local-img-desktop' : EventType.SET_DESKTOP, {
        url,
        type: dataSource
      })
      if (result.success) {
        showMessage('已设置成功。', 'success')
      } else {
        showMessage('设置失败。', 'error')
      }
    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false)
    }
  }

  const deleteLocalImg = async () => {
    setLoading(true)
    const result = await ipcRequest(EventType.DELETE_LOCAL_IMG, { path: deleteUrl })
    setLoading(false)
    if (result.success) {
      switchPopover(null)
      showMessage('删除成功。', 'success')
      setPageNum(0)
      props.onDelete && props.onDelete(deleteUrl)
    } else {
      showMessage('删除失败。', 'error')
    }
  }

  function switchPopover (event: null): void
  function switchPopover (event: React.MouseEvent<HTMLButtonElement>, url: string): void
  function switchPopover (event: React.MouseEvent<HTMLButtonElement> | null, url?: string) {
    if (event && url) {
      deleteUrl = url
    }
    setAnchorEl(event ? event.currentTarget : null)
  }

  const messageCloseHandle = () => {
    setMessage({
      ...message,
      open: false
    })
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
          {val.time && <Typography variant='body2' color='textSecondary' component='p'>{props.isLocal ? '下载日期' : '用户上传时间'}: {val.time}</Typography>}
          {val.resolution && <Typography variant='body2' color='textSecondary' component='p'>分辨率: {val.resolution}</Typography>}
          {val.size && <Typography variant='body2' color='textSecondary' component='p'>大小: {val.size}</Typography>}
        </CardContent>
        <CardActions>
          {
            /** 本地图片不显示下载按钮 */
            !props.isLocal &&
              <IconButton aria-label='下载图片' onClick={() => downLoadImg(val.downloadUrl)}>
                <ArrowDownward />
              </IconButton>
          }
          {
            props.isLocal &&
              <Button color='secondary' aria-label='删除' onClick={event => switchPopover(event, val.downloadUrl)}>
                <DeleteIcon /> 删除
              </Button>
          }
          <Button variant='contained' color='primary' onClick={() => setDesktopHandle(val.downloadUrl)}>设置桌面</Button>
        </CardActions>
      </Card>
    </Grid>
  ))

  const popoverCard = (
    <Popover
      id={id}
      open={open}
      anchorEl={anchorEl}
      onClose={() => { switchPopover(null) }}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'center'
      }}
      transformOrigin={{
        vertical: 'bottom',
        horizontal: 'center'
      }}
    >
      <Card>
        <CardContent>
          <Typography variant='h6' component='h5'>确认删除吗？</Typography>
          <Typography variant='body2' component='p' color='textSecondary'>删除无法找回只能重新下载</Typography>
        </CardContent>
        <CardActions>
          <Button size='small' onClick={deleteLocalImg}>确认</Button>
          <Button
            size='small'
            color='primary'
            variant='contained'
            onClick={() => { switchPopover(null) }}
          >
            取消
          </Button>
        </CardActions>
      </Card>
    </Popover>
  )

  return (
    <div className={classes.root}>
      <div className={classes.fixed}>
        {props.isLocal && popoverCard}
        <LinearProgress className={classes.linearProgress} style={{ display: loading ? '' : 'none' }} />
        {/* 分页组件 */}
        <TablePagination
          classes={{
            // wallHaven 不可以选择分页条数
            root: (!props.isLocal && dataSource === 'wallhaven') ? 'pagination-root-select-none' : ''
          }}
          rowsPerPageOptions={[6, 8, 9, 12, 16, 18]}
          component='div'
          count={props.total || -1}
          rowsPerPage={props.rowsPerPage}
          page={pageNum}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </div>
      {/* 提示框 */}
      <ShowMessage
        open={message.open}
        content={message.content}
        type={message.type}
        onClose={messageCloseHandle}
      />
      <Grid container spacing={3} style={{ marginTop: '52px' }}>
        {
          list.length > 0
            ? imgGrids
            : <Grid className={classes.noData} container justify='center' alignContent='center'><Typography>没有可以显示的内容。</Typography></Grid>
        }
      </Grid>
    </div>
  )
}
