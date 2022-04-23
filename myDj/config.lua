Config = {}
Translation = {
    ['fr'] = {
        ['DJ_interact'] = 'Appuyez sur ~b~E~w~ pour utiliser le poste de DJ',
        ['title_does_not_exist'] = 'Ce titre n\'existe pas !',
    }
}

Config.Locale = 'fr'

Config.useESX = false -- can not be disabled without changing the callbacks
Config.enableCommand = false

Config.enableMarker = true -- purple marker at the DJ stations

Config.DJPositions = {
    {
        name = 'bahama',
        pos = vector3(-1381.01, -616.17, 31.5),
        requiredJob = nil, 
        range = 25.0, 
        volume = 1.0 --[[ do not touch the volume! --]]
    }

    --{name = 'bahama', pos = vector3(-1381.01, -616.17, 31.5), requiredJob = 'DJ', range = 25.0}
}