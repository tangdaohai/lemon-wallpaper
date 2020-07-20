import React, { useState, useEffect } from 'react'
import { Dialog, Grid, Card, CardMedia, Button } from '@material-ui/core'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'
const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    cardMedia: {
      height: 0,
      paddingTop: '56.25%',
      backgroundSize: 'contain'
    },
    btnEle: {
      position: 'absolute',
      top: '20px',
      right: '20px'
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
      <Grid container>
        <Grid item sm={12}>
          <div className={classes.btnEle}>
            <Button onClick={() => { setOpen(false) }}>关闭</Button>
          </div>
          {
            props.url &&
              <Card>
                <CardMedia className={classes.cardMedia} image={props.url} />
              </Card>
          }
        </Grid>
      </Grid>
    </Dialog>
  )
}
