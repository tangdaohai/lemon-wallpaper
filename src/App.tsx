import React, { useState } from 'react'
import clsx from 'clsx'
import { ThemeProvider, makeStyles, Theme, createStyles, useTheme } from '@material-ui/core/styles'
import createCustomTheme from './theme'
import {
  Drawer,
  CssBaseline,
  List,
  Divider,
  IconButton,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@material-ui/core'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'
import FavoriteIcon from '@material-ui/icons/Favorite'

import ImageList from './ImageList'
import Header from './components/header'

const drawerWidth = 240
const menusList = [
  {
    text: '已收藏',
    icon: FavoriteIcon
  }
]
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex'
    },
    drawer: {
      width: drawerWidth,
      flexShrink: 0
    },
    drawerPaper: {
      width: drawerWidth
    },
    drawerHeader: {
      display: 'flex',
      alignItems: 'center',
      padding: theme.spacing(0, 1),
      ...theme.mixins.toolbar,
      justifyContent: 'flex-end'
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing(3),
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen
      }),
      marginLeft: -drawerWidth
    },
    contentShift: {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen
      }),
      marginLeft: 0
    }
  })
)

export default function App () {
  // 获取系统主题模式（moc下的深色与浅色，默认为 dark）
  // const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)')
  // 自定义主题
  const customTheme = createCustomTheme(true)
  const classes = useStyles()
  const theme = useTheme()
  const [open, setOpen] = useState(false)

  const handleDrawerClose = () => {
    setOpen(false)
  }

  return (
    <div className={classes.root}>
      <ThemeProvider theme={customTheme}>
        <CssBaseline />
        <Header drawerOpen={open} setDrawerOpen={setOpen} themeType={customTheme.palette.type} />
        <Drawer
          className={classes.drawer}
          variant='persistent'
          anchor='left'
          open={open}
          classes={{
            paper: classes.drawerPaper
          }}
        >
          <div className={classes.drawerHeader}>
            <IconButton onClick={handleDrawerClose}>
              {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
            </IconButton>
          </div>
          <Divider />
          <List>
            {menusList.map((item, index) => (
              <ListItem button key={item.text}>
                <ListItemIcon>
                  <FavoriteIcon />
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItem>
            ))}
          </List>
        </Drawer>
        <main
          className={clsx(classes.content, {
            [classes.contentShift]: open
          })}
        >
          <div className={classes.drawerHeader} />
          <ImageList dataSource='unsplash' />
        </main>
      </ThemeProvider>
    </div>
  )
}
