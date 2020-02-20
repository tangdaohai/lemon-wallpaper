import React from 'react'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'
import { Grid, Card, CardMedia, CardActionArea, CardActions, IconButton, Button } from '@material-ui/core'
import { ArrowDownward } from '@material-ui/icons'
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
  const classes = useStyles()

  const imgGrids = new Array(15).fill(0).map((val, index) => (
    <Grid key={index} item xl={3} lg={4} md={6} sm={12}>
      <Card className={classes.card} raised>
        <CardActionArea>
          <CardMedia className={classes.cardMedia} image={`/images/test${index % 2}.jpg`} title='Lemon wallpaper' />
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
