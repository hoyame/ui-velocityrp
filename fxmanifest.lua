fx_version 'adamant'
game { 'gta5' }

lua54 'yes'

client_scripts {
    'cl.lua',
    'dist/client/*.js',
}

server_scripts {
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
