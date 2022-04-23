# dmvschool
Realistic DMV school for ESX

## Requirements
- [esx_license](https://github.com/ESX-Org/esx_license)

## Download & Installation

### Using [fvm](https://github.com/qlaffont/fvm-installer)
```
fvm install --save --folder=esx esx-org/dmvschool
```

### Using Git
```
cd resources
git clone https://github.com/ESX-Org/dmvschool [esx]/dmvschool
```

### Manually
- Download https://github.com/ESX-Org/dmvschool/archive/master.zip
- Put it in the `[esx]` directory

## Installation
- Import `dmvschool.sql` in your database
- Add this in your `server.cfg`:

```
start dmvschool
```

# Legal
### License
dmvschool - realistic DMV school for ESX

Copyright (C) 2015-2018 Jérémie N'gadi

This program Is free software: you can redistribute it And/Or modify it under the terms Of the GNU General Public License As published by the Free Software Foundation, either version 3 Of the License, Or (at your option) any later version.

This program Is distributed In the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty Of MERCHANTABILITY Or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License For more details.

You should have received a copy Of the GNU General Public License along with this program. If Not, see http://www.gnu.org/licenses/.