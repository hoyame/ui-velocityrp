fx_version 'adamant'
game { 'gta5' }

lua54 'yes'

client_scripts {
    'dist/client/*.js',
}

server_scripts {
    'dist/server/*.js',
}

files {
   'dist/ui/index.html',
   'dist/ui/*',
   'dist/ui/**/*',
--    'loadscreen/**/*'
}

dependencies {
    "screenshot-basic"
}

-- loadscreen 'loadscreen/index.html'

ui_page 'dist/ui/index.html'

exports {
    "showNotification",
    "showAdvancedNotification",
    "showOverlay"
}
