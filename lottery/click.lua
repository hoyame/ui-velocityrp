

local menuEnabled = false

function ToggleActionMenu()
	Citizen.Trace("tutorial launch")
	menuEnabled = not menuEnabled
	if ( menuEnabled ) then
		SetNuiFocus( true, true )
		SendNUIMessage({
			showPlayerMenu = true
		})
	else
		SetNuiFocus( false )
		SendNUIMessage({
			showPlayerMenu = false
		})
	end
end

function killTutorialMenu()
		SetNuiFocus( false, false )
		SendNUIMessage({
			showPlayerMenu = false
		})
		menuEnabled = false

end

RegisterNUICallback('closeButton', function(data, cb)
	killTutorialMenu()
  	cb('ok')
end)

RegisterNUICallback('win', function(data, cb)
	TriggerServerEvent("gm:lottery:useLottery")
  	cb('ok')
end)

