import { app, BrowserWindow } from 'electron'
import { join } from 'path'
import loadConfig from './service/load-config'
// ipc 请求控制器
import './controller'

// 运行环境
const isDev = () => {
  const isEnvSet = 'ELECTRON_IS_DEV' in process.env
  const getFromEnv = parseInt(process.env.ELECTRON_IS_DEV as string, 10) === 1

  return isEnvSet ? getFromEnv : !app.isPackaged
}

async function createWindow () {
  let indexURL = ''
  const development = !!isDev()
  if (development) {
    console.log('开发环境')
    indexURL = 'http://localhost:3000'
    try {
      BrowserWindow.addDevToolsExtension(join(__dirname, '../chrome-dev-tools/react-tools'))
    } catch (err) {
      console.warn('chrome-dev-tools/react-tools 加载失败')
    }
  } else {
    // react 编译后的目录
    indexURL = `file://${join(__dirname, '../build')}/index.html`
  }

  // 创建浏览器窗口
  const win = new BrowserWindow({
    width: 1920,
    height: 1080,
    webPreferences: {
      nodeIntegration: true,
      // 开发模式下 关闭 同源策略限制，生产环境 都是 file:// 没有限制
      webSecurity: !development
    }
  })

  // 加载配置文件
  await loadConfig()

  // and load the index.html of the app.
  win.loadURL(indexURL)
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// 部分 API 在 ready 事件触发后才能使用。
app.whenReady().then(createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // 在 macOS 上，除非用户用 Cmd + Q 确定地退出，
  // 否则绝大部分应用及其菜单栏会保持激活。
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // 在macOS上，当单击dock图标并且没有其他窗口打开时，
  // 通常在应用程序中重新创建一个窗口。
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. 也可以拆分成几个文件，然后用 require 导入。
