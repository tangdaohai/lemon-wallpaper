import React, { useState, useEffect } from 'react'
import { Dialog, Box, Card, CardMedia, CardActions, Button } from '@material-ui/core'
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
    }
  })
})
export interface FullImgProps {
  url: string
}
export default function FullImg (props: FullImgProps) {
  const classes = useStyles()
  const [open, setOpen] = useState(false)
  useEffect(() => {
    props.url && setOpen(true)
  }, [props.url])
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
        <Box flexGrow={1} display='flex' justifyContent='center' alignItems='center'>
          <Box flexGrow={1}>
            <Card className={classes.card} raised>
              {
                props.url &&
                  <CardMedia className={classes.cardMedia} image={props.url} />
              }
            </Card>
          </Box>
        </Box>
      </Box>
    </Dialog>
  )
}
