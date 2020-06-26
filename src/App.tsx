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
import SearchIcon from '@material-ui/icons/Search'
import SettingIcon from '@material-ui/icons/Settings'
import CopyrightIcon from '@material-ui/icons/Copyright'

import Header from './components/header'
import GlobalContextProvide from './context/global-context-provide'
import ImageList from './components/image-list'
import LocalList from './components/local-list'
import Setting from './components/setting'
const drawerWidth = 240
interface MenuItem {
  key: string,
  text: string,
  icon: React.ReactElement
}
const menusList: Array<MenuItem> = [
  {
    key: 'search',
    text: '搜索',
    icon: <SearchIcon />
  },
  {
    key: 'local-list',
    text: '已下载',
    icon: <FavoriteIcon />
  },
  {
    key: 'setting',
    text: '设置',
    icon: <SettingIcon />
  },
  {
    key: 'other',
    text: '说明',
    icon: <CopyrightIcon />
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
  const [activeItem, setActiveItem] = useState('search')

  const handleDrawerClose = () => {
    setOpen(false)
  }

  const menuItemClick = (item: MenuItem) => {
    setActiveItem(item.key)
  }

  // 根据 menu list 动态展示子组件
  const childrenSwitch = () => {
    switch (activeItem) {
      case 'search':
        return <ImageList />
      case 'setting':
        return <Setting />
      case 'local-list':
        return <LocalList />
    }
  }

  return (
    <div className={classes.root}>
      <ThemeProvider theme={customTheme}>
        <GlobalContextProvide>
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
              {menusList.map(item => (
                <ListItem
                  button
                  key={item.text}
                  selected={activeItem === item.key}
                  onClick={() => menuItemClick(item)}
                >
                  <ListItemIcon>
                    {item.icon}
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
            {childrenSwitch()}
          </main>
        </GlobalContextProvide>
      </ThemeProvider>
    </div>
  )
}
