fx_version 'cerulean'
game 'common'

lua54 'yes'

client_scripts {
    'core/cl_c2.lua',
    'core/client.lua',
    'dist/client/*.js',
}

server_scripts {
    'core/server.lua',
    'dist/server/*.js',
}

files {
   'dist/ui/*',
   'dist/ui/**/*',
   'loadscreen/**/*'
}

dependencies {
    "screenshot-basic",
    "bob74_ipl",
    "spawnmanager"
}

loadscreen 'loadscreen/index.html'

ui_page 'dist/ui/index.html'