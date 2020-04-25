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
import { makeStyles, createStyles, Theme, fade } from '@material-ui/core/styles'
import MenuIcon from '@material-ui/icons/Menu'
import SearchIcon from '@material-ui/icons/Search'
import GitHubIcon from '@material-ui/icons/GitHub'
import Brightness4Icon from '@material-ui/icons/Brightness4'
import Brightness7Icon from '@material-ui/icons/Brightness7'
import dataSourceConfig from '../data-source-config'
import GlobalContext from '../context/global-context'

const drawerWidth = 240
const CategoriesLabel = ['一般', '动漫', '人物']
const PurityLabel = ['SFW', 'Sketchy']
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
  // context 数据
  const { changeSearchContent, dataSource, changeDataSource, whParams, changeWhParams } = useContext(GlobalContext)
  const classes = useStyles()

  const [searchParam, setSearchParam] = useState<string>('')
  // wall haven 壁纸分类选项
  // const [whCategories, setWhCategories] = useState([1, 1, 1])
  // 壁纸尺度，SFW 适合出现在工作场合，Sketchy 不太适合
  // const [whPurity, setWhPurity] = useState([1, 1])
  const whCategories = whParams.categories
  const whPurity = whParams.purity

  // header 上的打开菜单事件
  const handleDrawerOpen = () => {
    props.setDrawerOpen(true)
  }

  // 数据源选择事件
  const dataSourceSelect = (event: ChangeEvent<{ value: unknown }>) => {
    changeDataSource(event.target.value as keyof typeof dataSourceConfig)
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
    changeSearchContent(searchParam)
  }

  // wall haven 壁纸分类选项 change
  const whCategoriesChangeHandle = (index: number) => {
    const arr = [...whCategories]
    arr[index] = (arr[index] + 1) % 2
    // setWhCategories(arr)
    changeWhParams({
      categories: arr,
      purity: whPurity
    })
  }
  const whPurityChangeHandle = (index: number) => {
    const arr = [...whPurity]
    arr[index] = (arr[index] + 1) % 2
    // setWhPurity(arr)
    changeWhParams({
      categories: whCategories,
      purity: arr
    })
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
        {
          dataSource === 'wallhaven' && whCategories.map((val, index) => {
            return (
              <FormControlLabel
                key={index}
                control={
                  <Checkbox
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
          dataSource === 'wallhaven' && whPurity.map((val, index) => {
            return (
              <FormControlLabel
                key={index}
                control={
                  <Checkbox
                    checked={!!val}
                    onChange={_ => whPurityChangeHandle(index)}
                  />
                }
                label={PurityLabel[index]}
              />
            )
          })
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
