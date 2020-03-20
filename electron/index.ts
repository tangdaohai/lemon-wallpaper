import { app, BrowserWindow, ipcMain } from 'electron'
import ipcType from './service/ipc-type-service'
import { join } from 'path'
import { homedir } from 'os'
import loadConfig from './service/load-config'

async function createWindow () {
  // 创建浏览器窗口
  const win = new BrowserWindow({
    width: 1920,
    height: 1080,
    webPreferences: {
      nodeIntegration: true
    }
  })

  // 加载配置文件
  await loadConfig()

  // @TODO 区分开发环境
  // 添加 react chrome 开发者插件
  try {
    BrowserWindow.addDevToolsExtension(
      join(homedir(), '/Library/Application Support/Google/Chrome/Profile 1/Extensions/fmkadmapgofadopljbjfkapdkoienihi/4.5.0_0')
    )
  } catch (err) {
    console.log('React dev tools 加载失败')
    console.log(err)
  }

  // 处理页面发送的 ipc 事件
  ipcMain.on('server', ipcType)

  // and load the index.html of the app.
  win.loadURL('http://localhost:3000')

  // 打开开发者工具
  win.webContents.openDevTools()
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
