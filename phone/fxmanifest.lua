fx_version 'adamant'
game 'common'


ui_page 'html/index.html'

files {
	'html/*',
	'html/**/*'
}

client_script {
	"cl_phone.lua"
}

server_script {
	'@mysql-async/lib/MySQL.lua',
	"sv_phone.lua"
}

dependencies {
	"screenshot-basic"
}