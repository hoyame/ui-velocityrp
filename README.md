# server.cfg

### Required resources

```
ensure mapmanager
ensure chat
ensure spawnmanager
ensure sessionmanager
ensure hardcap
ensure rconlog
ensure gamemode
ensure screenshot-basic
ensure bob74_ipl
ensure vMenu
ensure pillbox_hospital
ensure mysql-async
ensure vocal
ensure phone
ensure xsound
ensure myDj
```

### Permissions

```
add_ace group.owner command allow # allow all commands for owners
add_principal group.owner group.admin # owners inherits admin rights
add_ace group.admin "admin_menu" allow # allow admin menu for admins
add_ace group.admin "doorlocks" allow # allow admin to create/open all doors
add_ace resource.gamemode command.add_ace allow # allow gamemode to register commands at runtime
add_principal identifier.discord:264435985595629568 group.owner # register yourself as an admin
```

### Mysql

```
set mysql_connection_string "mysql://dbuser:password@host/databaseName"
```

### OneSync

This gamemode is developped for OneSync. You should enable it

```
set onesync on
```

### Dev mode (Disabled if not specified)

```
setr IS_DEV 1
```
