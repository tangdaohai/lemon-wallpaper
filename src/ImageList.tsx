import React from 'react'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
// import Image from './images/test.jpg'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1
    },
    img: {
      width: '100%',
      height: '300px',
      objectFit: 'contain'
    }
  })
)

export default function ImageList () {
  const classes = useStyles()

  const imgGrids = new Array(15).fill(0).map((val, index) => (
    <Grid key={index} item xl={2} lg={4} md={6} sm={12}>
      <img className={classes.img} src='/images/test.jpg' alt='图片测试' />
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
