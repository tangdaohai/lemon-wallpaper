import React, { useState, useEffect } from 'react'
import {
  Dialog,
  Box,
  Card,
  CardMedia,
  CardActions,
  Button,
  Backdrop,
  CircularProgress
} from '@material-ui/core'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'
const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    card: {
      width: '100%',
      borderRadius: 0,
      flexShrink: 0
    },
    cardMedia: {
      height: 0,
      paddingTop: '56.25%',
      backgroundSize: 'contain'
    },
    backdrop: {
      position: 'absolute',
      zIndex: theme.zIndex.drawer + 1,
      color: '#fff'
    }
  })
})
export interface FullImgProps {
  url: string
}
export default function FullImg (props: FullImgProps) {
  const classes = useStyles()
  const [open, setOpen] = useState(false)
  const [imgUrl, setImgUrl] = useState('')
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    loadImg()
    props.url && setOpen(true)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.url])

  function loadImg () {
    setImgUrl('')
    setLoading(true)
    const img = new Image()
    img.onload = () => {
      setImgUrl(props.url)
      setLoading(false)
    }
    img.src = props.url
  }

  return (
    <Dialog open={open} fullScreen>
      <Box display='flex' height='100%' m={2}>
        {/* 按钮菜单操作列 */}
        <Box
          width='200px'
          mr={2}
          display='flex'
          justifyContent='center'
          alignItems='center'
          flexDirection='column'
        >
          <Card className={classes.card} raised>
            <CardActions>
              <Button>下载</Button>
              <Button>设置桌面</Button>
            </CardActions>
          </Card>
          <br />
          <Card className={classes.card} raised>
            <CardActions>
              <Button onClick={() => setOpen(false)}>关闭</Button>
            </CardActions>
          </Card>
        </Box>
        {/* 图片展示区域 */}
        <Box flexGrow={1} display='flex' justifyContent='center' alignItems='center' position='relative'>
          <Backdrop open={loading} className={classes.backdrop} onClick={() => setLoading(false)}>
            <CircularProgress color='inherit' />
          </Backdrop>
          <Box flexGrow={1}>
            <Card className={classes.card} raised>
              {
                imgUrl &&
                  <CardMedia className={classes.cardMedia} image={imgUrl} />
              }
            </Card>
          </Box>
        </Box>
      </Box>
    </Dialog>
  )
}
