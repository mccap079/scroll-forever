var remote = require('remote')
var Menu = remote.require('menu')

var menu = Menu.buildFromTemplate([{
    label: 'Electron',
    submenu: [{
        label: 'Prefs',
        click: function() {

        }
    }]
}])

Menu.setApplicationMenu(menu)