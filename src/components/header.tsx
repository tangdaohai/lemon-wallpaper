import React, { useContext, useState, ChangeEvent, FormEvent } from 'react'
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
  Tooltip,
  Checkbox,
  FormControlLabel
} from '@material-ui/core'
import { grey, lightBlue } from '@material-ui/core/colors'
import { ThemeProvider, createMuiTheme, makeStyles, createStyles, Theme, fade } from '@material-ui/core/styles'
import MenuIcon from '@material-ui/icons/Menu'
import SearchIcon from '@material-ui/icons/Search'
import GitHubIcon from '@material-ui/icons/GitHub'
import Brightness4Icon from '@material-ui/icons/Brightness4'
import Brightness7Icon from '@material-ui/icons/Brightness7'
import dataSourceConfig from '../data-source-config'
import GlobalContext from '../context/global-context'

const { shell } = window.require('electron')

const drawerWidth = 240
const CategoriesLabel = ['一般', '动漫', '人物']
const PurityLabel = ['SFW', 'Sketchy']
const headerTheme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: {
      main: grey[900]
    },
    secondary: {
      main: lightBlue.A400
    }
  }
})
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
      marginRight: 10,
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
  isSearch: boolean,
  setDrawerOpen: (value: React.SetStateAction<boolean>) => void
}
export default function Header (props: HeaderProps) {
  // context 数据
  const {
    themeType,
    setThemeType,
    search,
    searchDispatch
  } = useContext(GlobalContext)
  const classes = useStyles()

  const { dataSource, whParams } = search

  const [searchParam, setSearchParam] = useState<string>('')
  // wall haven 壁纸分类选项
  const whCategories = whParams.categories
  // 壁纸尺度，SFW 适合出现在工作场合，Sketchy 不太适合
  const whPurity = whParams.purity

  // header 上的打开菜单事件
  const handleDrawerOpen = () => {
    props.setDrawerOpen(true)
  }

  // 数据源选择事件
  const dataSourceSelect = (event: ChangeEvent<{ value: unknown }>) => {
    searchDispatch({
      type: 'dataSource',
      value: event.target.value as string
    })
  }

  // 搜索框的 input 事件监听
  const searchChange = (event: ChangeEvent<{ value: string }>) => {
    setSearchParam(event.target.value)
  }

  // submit 事件
  const submit = (event: FormEvent) => {
    // 阻止默认行为
    event.preventDefault()
    event.stopPropagation()
    // 传递搜索内容
    searchDispatch({
      type: 'searchContent',
      value: encodeURIComponent(searchParam)
    })
  }

  // wall haven 壁纸分类选项 change
  const whCategoriesChangeHandle = (index: number) => {
    const arr = [...whCategories!]
    arr[index] = (arr[index] + 1) % 2
    searchDispatch({
      type: 'whParams',
      value: {
        categories: arr,
        purity: whPurity
      }
    })
  }
  const whPurityChangeHandle = (index: number) => {
    const arr = [...whPurity!]
    arr[index] = (arr[index] + 1) % 2
    searchDispatch({
      type: 'whParams',
      value: {
        categories: whCategories,
        purity: arr
      }
    })
  }

  const themeTypeChangeHandle = () => {
    const type = themeType === 'light' ? 'dark' : 'light'
    setThemeType(type)
    window.localStorage.setItem('themeType', type)
  }

  return (
    <ThemeProvider theme={headerTheme}>
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
          {
            props.isSearch &&
              <Select value={dataSource} onChange={dataSourceSelect}>
                {Object.values(dataSourceConfig).map(val => <MenuItem key={val.key} value={val.key}>{val.name}</MenuItem>)}
              </Select>
          }
          {
            props.isSearch && dataSourceConfig[dataSource]!.canSearch &&
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
          {
            props.isSearch && dataSource === 'wallhaven' && whCategories!.map((val, index) => {
              return (
                <FormControlLabel
                  key={index}
                  control={
                    <Checkbox
                      size='small'
                      checked={!!val}
                      onChange={_ => whCategoriesChangeHandle(index)}
                    />
                  }
                  label={CategoriesLabel[index]}
                />
              )
            })
          }
          {
            props.isSearch && dataSource === 'wallhaven' &&
              <Tooltip title='WallHaven 图片源对尺度进行了分类。SFW意为可以在工作场合展示，Sketchy则不太适合。'>
                <div>
                  {
                    whPurity!.map((val, index) => {
                      return (
                        <FormControlLabel
                          key={index}
                          control={
                            <Checkbox
                              size='small'
                              checked={!!val}
                              onChange={_ => whPurityChangeHandle(index)}
                            />
                          }
                          label={PurityLabel[index]}
                        />
                      )
                    })
                  }
                </div>
              </Tooltip>
          }
          <Tooltip title='访问 Github'>
            <IconButton onClick={() => { shell.openExternal('https://github.com/tangdaohai/lemon-wallpaper') }}>
              <GitHubIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title={`切换${themeType === 'light' ? '深色' : '浅色'}主题`}>
            <IconButton onClick={themeTypeChangeHandle}>
              {themeType === 'light' ? <Brightness4Icon /> : <Brightness7Icon />}
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>
    </ThemeProvider>
  )
}
