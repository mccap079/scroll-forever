const electron = require('electron')
const ipcMain = require('electron').ipcMain;
const app = electron.app

const BrowserWindow = electron.BrowserWindow
const path = require('path')
const url = require('url')

let window1;
let window2;

function createWindow() {

    window2 = new BrowserWindow({
        webPreferences: {
            nodeIntegration: false
        },
        transparent: true,
        hasShadow: false,
        titleBarStyle: 'hidden',
    })
    window2.maximize()
    window2.show()
    window2.loadURL("https://pam457.itp.io:9999/window2.html");
    window2.on('closed', function() {
        window2 = null
    })

    window1 = new BrowserWindow({
        webPreferences: {
            nodeIntegration: false
        },
        transparent: true,
        hasShadow: false,
        titleBarStyle: 'hidden',
        show: false
    })
    window1.maximize()
    window1.show()
    window1.loadURL("https://pam457.itp.io:9999/window1.html");
    window1.on('closed', function() {
        window1 = null
    })
}

app.on('ready', createWindow)

app.on('window-all-closed', function() {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', function() {
    if (window1 === null) {
        createWindow()
    }
})

ipcMain.on('scroll', function(event, data) {
    window2.webContents.send('window1Scroll', data);
});