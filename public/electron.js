const { app, BrowserWindow, ipcMain, dialog } = require('electron')
const path = require('path')
const isDev = require('electron-is-dev')
const fs = require('fs')
const https = require('https')

let mainWindow

function createWindow() {
    mainWindow = new BrowserWindow({
      width: 900,
      height: 680,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
      },
      maximizable: false,
      icon: path.join(__dirname, 'src/favicon.ico'),
    });

    mainWindow.loadURL(
      isDev
        ? 'http://localhost:3000'
        : `file://${path.join(__dirname, '../build/index.html')}`
    )

    // Hides the menu bar
    mainWindow.setMenuBarVisibility(false)
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow()
    }
})

ipcMain.handle('open-file-dialog', async (event) => {
    const result = await dialog.showOpenDialog(mainWindow, {
        properties: ['openFile', 'openDirectory']
    })

    return result.filePaths
})

ipcMain.handle('does-path-exist', async (event, path) => {
  return fs.existsSync(path)
})

ipcMain.handle('download-file', async (event, url, destination) => {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(destination)
    https.get(url, response => {
      response.pipe(file)

      file.on('finish', () => {
        file.close(resolve)
      })
    }).on('error', error => {
      fs.unlink(destination)
      reject(error.message)
    })
  })
})
