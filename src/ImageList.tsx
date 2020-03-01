import React, { useState, useEffect } from 'react'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'
import { Grid, Card, CardMedia, CardActionArea, CardActions, IconButton, Button } from '@material-ui/core'
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

export default function ImageList () {
  const [list, setList] = useState([])
  // @TODO 对多图片源支持（动态）
  const [searchData] = useState({
    type: EventType.PROXY,
    data: {
      url: 'https://cn.bing.com/HPImageArchive.aspx?format=js&idx=0&n=7&nc=1582381253445&pid=hp',
      method: 'get'
    }
  })

  // searchData 变化后调用
  useEffect(() => {
    console.log('server search', searchData)
    ipcRenderer.send('server', searchData)
  }, [searchData])

  ipcRenderer.on('client', (event: any, msg: any) => {
    setList(msg?.data?.images)
    console.log(msg, msg?.data?.images, list)
  })

  const classes = useStyles()

  const imgGrids = list && list.map((val: any, index) => (
    <Grid key={index} item xl={3} lg={4} md={6} sm={12}>
      <Card className={classes.card} raised>
        <CardActionArea>
          <CardMedia className={classes.cardMedia} image={`https://cn.bing.com${val.url}`} title='Lemon wallpaper' />
        </CardActionArea>
        <CardActions className={classes.cardActions}>
          <IconButton aria-label='add to favorites'>
            <ArrowDownward />
          </IconButton>
          <Button variant='contained' color='primary'>设置桌面</Button>
        </CardActions>
      </Card>
    </Grid>
  ))

  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
        {imgGrids}
      </Grid>
    </div>
  )
}
