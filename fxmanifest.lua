fx_version 'cerulean'
game 'gta5'
author 'Auzzie'
description 'Auzzie Notification System'
version '1.0.0'

shared_scripts {
    'shared/config.lua',
}

client_scripts {
    'client/client.lua',
}

server_scripts {
    'server/server.lua',
}

ui_page 'nui/index.html'

files {
    'nui/index.html',
    'nui/assets/notify.js',
    'nui/assets/notify.css',
}
