// 正常文本展示的 layout 壳子
import React from 'react'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      width: '100%',
      display: 'flex',
      justifyContent: 'center'
    },
    box: {
      width: '850px'
    }
  })
)

export default function NormalLayout (props: {children: React.ReactElement | Array<React.ReactElement>}) {
  const classes = useStyles()
  return (
    <div className={classes.container}>
      <div className={classes.box}>
        {props.children}
      </div>
    </div>
  )
}
