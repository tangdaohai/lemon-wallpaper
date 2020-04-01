import React, { useState, ChangeEvent, FormEvent } from 'react'
import clsx from 'clsx'
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Select,
  MenuItem,
  Paper,
  InputBase,
  Tooltip
} from '@material-ui/core'
import { makeStyles, createStyles, Theme, fade } from '@material-ui/core/styles'
import MenuIcon from '@material-ui/icons/Menu'
import SearchIcon from '@material-ui/icons/Search'
import GitHubIcon from '@material-ui/icons/GitHub'
import Brightness4Icon from '@material-ui/icons/Brightness4'
import Brightness7Icon from '@material-ui/icons/Brightness7'
import dataSourceConfig from '../data-source-config'

const drawerWidth = 240
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    appBar: {
      transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen
      })
    },
    appBarShift: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
      transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen
      })
    },
    menuButton: {
      marginRight: theme.spacing(2)
    },
    title: {
      flexGrow: 1,
      display: 'none',
      [theme.breakpoints.up('sm')]: {
        display: 'block'
      }
    },
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120
    },
    search: {
      position: 'relative',
      borderRadius: theme.shape.borderRadius,
      backgroundColor: fade(theme.palette.common.white, 0.15),
      '&:hover': {
        backgroundColor: fade(theme.palette.common.white, 0.25)
      },
      marginLeft: 0,
      width: '100%',
      [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(1),
        width: 'auto'
      }
    },
    searchIcon: {
      width: theme.spacing(7),
      height: '100%',
      position: 'absolute',
      top: 0,
      right: 0,
      pointerEvents: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    inputRoot: {
      color: 'inherit'
    },
    inputInput: {
      padding: theme.spacing(1, 7, 1, 1),
      transition: theme.transitions.create('width'),
      width: '100%',
      [theme.breakpoints.up('sm')]: {
        width: 120,
        '&:focus': {
          width: 200
        }
      }
    },
    hide: {
      display: 'none'
    }
  })
)
interface HeaderProps {
  drawerOpen: boolean,
  setDrawerOpen: (value: React.SetStateAction<boolean>) => void,
  themeType: 'light' | 'dark'
}
export default function Header (props: HeaderProps) {
  const [dataSource, setDataSource] = useState<keyof typeof dataSourceConfig>('unsplash')
  const classes = useStyles()
  const [searchParam, setSearchParam] = useState<string>('')

  const handleDrawerOpen = () => {
    props.setDrawerOpen(true)
  }

  const dataSourceSelect = (event: ChangeEvent<{ value: unknown }>) => {
    setDataSource(event.target.value as keyof typeof dataSourceConfig)
  }

  const searchChange = (event: ChangeEvent<{ value: string }>) => {
    setSearchParam(event.target.value)
  }
  const submit = (event: FormEvent) => {
    event.preventDefault()
    event.stopPropagation()
    console.log(searchParam)
  }

  return (
    <AppBar
      position='fixed'
      className={clsx(classes.appBar, {
        [classes.appBarShift]: props.drawerOpen
      })}
    >
      <Toolbar>
        <IconButton
          color='inherit'
          onClick={handleDrawerOpen}
          edge='start'
          className={clsx(classes.menuButton, props.drawerOpen && classes.hide)}
        >
          <MenuIcon />
        </IconButton>
        <Typography className={classes.title} variant='h6' noWrap>
          Lemon Wallpaper
        </Typography>
        <Select value={dataSource} onChange={dataSourceSelect}>
          {Object.values(dataSourceConfig).map(val => <MenuItem key={val.key} value={val.key}>{val.name}</MenuItem>)}
        </Select>
        {
              dataSourceConfig[dataSource]!.canSearch &&
                <Paper component='form' onSubmit={submit} className={classes.search}>
                  <InputBase
                    placeholder='enter for search'
                    onChange={searchChange}
                    classes={{
                      root: classes.inputRoot,
                      input: classes.inputInput
                    }}
                    inputProps={{ 'aria-label': 'search' }}
                  />
                  <div className={classes.searchIcon}>
                    <SearchIcon />
                  </div>
                </Paper>
        }
        <Tooltip title='访问 Github'>
          <IconButton>
            <GitHubIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title='切换深色/浅色主题'>
          <IconButton>
            {props.themeType === 'light' ? <Brightness4Icon /> : <Brightness7Icon />}
          </IconButton>
        </Tooltip>
      </Toolbar>
    </AppBar>
  )
}
