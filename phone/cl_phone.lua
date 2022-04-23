local Keys = {
	['ESC'] = 322, ['F1'] = 288, ['F2'] = 289, ['F3'] = 170, ['F5'] = 166, ['F6'] = 167, ['F7'] = 168, ['F8'] = 169, ['F9'] = 56, ['F10'] = 57,
	['~'] = 243, ['1'] = 157, ['2'] = 158, ['3'] = 160, ['4'] = 164, ['5'] = 165, ['6'] = 159, ['7'] = 161, ['8'] = 162, ['9'] = 163, ['-'] = 84, ['='] = 83, ['BACKSPACE'] = 177,
	['TAB'] = 37, ['Q'] = 44, ['W'] = 32, ['E'] = 38, ['R'] = 45, ['T'] = 245, ['Y'] = 246, ['U'] = 303, ['P'] = 199, ['['] = 39, [']'] = 40, ['ENTER'] = 18,
	['CAPS'] = 137, ['A'] = 34, ['S'] = 8, ['D'] = 9, ['F'] = 23, ['G'] = 47, ['H'] = 74, ['K'] = 311, ['L'] = 182,
	['LEFTSHIFT'] = 21, ['Z'] = 20, ['X'] = 73, ['C'] = 26, ['V'] = 0, ['B'] = 29, ['N'] = 249, ['M'] = 244, [','] = 82, ['.'] = 81,
	['LEFTCTRL'] = 36, ['LEFTALT'] = 19, ['SPACE'] = 22, ['RIGHTCTRL'] = 70,
	['HOME'] = 213, ['PAGEUP'] = 10, ['PAGEDOWN'] = 11, ['DELETE'] = 178,
	['LEFT'] = 174, ['RIGHT'] = 175, ['TOP'] = 27, ['DOWN'] = 173,
	['NENTER'] = 201, ['N4'] = 108, ['N5'] = 60, ['N6'] = 107, ['N+'] = 96, ['N-'] = 97, ['N7'] = 117, ['N8'] = 61, ['N9'] = 118
}

FixePhone = {
	-- Poste de police
	['911'] = { name =  "Central Police", coords = { x = 441.2, y = -979.7, z = 30.58 } },
	
	-- Cabine proche du poste de police
	['008-0001'] = { name = "Cabine Telephonique", coords = { x = 372.25, y = -965.75, z = 28.58 } },
  }
  
ShowNumberNotification = true -- Show Number or Contact Name when you receive new SMS

local KeyOpenClose = 244 -- ,
local KeyTakeCall = 38 -- E
local menuIsOpen = false
contacts = {}
local myPhoneNumber = ''
local isDead = false
local USE_RTC = false
local useMouse = false
local ignoreFocus = false
local takePhoto = false
local hasFocus = false
local phoneLoaded = false

local PhoneInCall = {}
local currentPlaySound = false
local soundDistanceMax = 8.0
local myPedId = nil

local phoneProp = 0
local phoneModel = "prop_amb_phone"
-- OR "prop_npc_phone"
-- OR "prop_npc_phone_02"
-- OR "prop_cs_phone_01"

local currentStatus = 'out'
local lastDict = nil
local lastAnim = nil
local lastIsFreeze = false
local convCallback = nil

local KeyToucheCloseEvent = {
	{ code = 172, event = 'ArrowUp' },
	{ code = 173, event = 'ArrowDown' },
	{ code = 174, event = 'ArrowLeft' },
	{ code = 175, event = 'ArrowRight' },
	{ code = 176, event = 'Enter' },
	{ code = 177, event = 'Backspace' },
	{ code = 82,  event = ","}
}

local ANIMS = {
	['cellphone@'] = {
		['out'] = {
			['text'] = 'cellphone_text_in',
			['call'] = 'cellphone_call_listen_base',
		},
		['text'] = {
			['out'] = 'cellphone_text_out',
			['text'] = 'cellphone_text_in',
			['call'] = 'cellphone_text_to_call',
		},
		['call'] = {
			['out'] = 'cellphone_call_out',
			['text'] = 'cellphone_call_to_text',
			['call'] = 'cellphone_text_to_call',
		}
	},
	['anim@cellphone@in_car@ps'] = {
		['out'] = {
			['text'] = 'cellphone_text_in',
			['call'] = 'cellphone_call_in',
		},
		['text'] = {
			['out'] = 'cellphone_text_out',
			['text'] = 'cellphone_text_in',
			['call'] = 'cellphone_text_to_call',
		},
		['call'] = {
			['out'] = 'cellphone_horizontal_exit',
			['text'] = 'cellphone_call_to_text',
			['call'] = 'cellphone_text_to_call',
		}
	}
}

function newPhoneProp()
	deletePhone()
	RequestModel(phoneModel)
	while not HasModelLoaded(phoneModel) do
		Citizen.Wait(1)
	end
	phoneProp = CreateObject(phoneModel, 1.0, 1.0, 1.0, 1, 1, 0)
	local bone = GetPedBoneIndex(myPedId, 28422)
	AttachEntityToEntity(phoneProp, myPedId, bone, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1, 1, 0, 0, 2, 1)
end

function deletePhone ()
	if phoneProp ~= 0 then
    DeleteObject(phoneProp)
		phoneProp = 0
	end
end

function PhonePlayAnim (status, freeze, force)
	if currentStatus == status and force ~= true then
		return
	end

	myPedId = GetPlayerPed(-1)
	local freeze = freeze or false

	local dict = "cellphone@"
	if IsPedInAnyVehicle(myPedId, false) then
		dict = "anim@cellphone@in_car@ps"
	end
	loadAnimDict(dict)

	local anim = ANIMS[dict][currentStatus][status]
	if currentStatus ~= 'out' then
		StopAnimTask(myPedId, lastDict, lastAnim, 1.0)
	end
	local flag = 50
	if freeze == true then
		flag = 14
	end
	TaskPlayAnim(myPedId, dict, anim, 3.0, -1, -1, flag, 0, false, false, false)

	if status ~= 'out' and currentStatus == 'out' then
		Citizen.Wait(380)
		newPhoneProp()
	end

	lastDict = dict
	lastAnim = anim
	lastIsFreeze = freeze
	currentStatus = status

	if status == 'out' then
		Citizen.Wait(180)
		deletePhone()
		StopAnimTask(myPedId, lastDict, lastAnim, 1.0)
	end

end


function PhonePlayOut()
	PhonePlayAnim('out')
end

function PhonePlayText()
	PhonePlayAnim('text')
end

function PhonePlayCall(freeze)
	PhonePlayAnim('call', freeze)
end

function PhonePlayIn() 
	if currentStatus == 'out' then
		PhonePlayText()
	end
end

function loadAnimDict(dict)
	RequestAnimDict(dict)
	while not HasAnimDictLoaded(dict) do
		Citizen.Wait(1)
	end
end

RegisterNetEvent('phone:setEnableApp')
AddEventHandler('phone:setEnableApp', function(appName, enable)
	SendNUIMessage({event = 'setEnableApp', appName = appName, enable = enable })
end)

function startFixeCall(fixeNumber)
	local number = ''
	DisplayOnscreenKeyboard(1, "FMMC_MPM_NA", "", "", "", "", "", 10)
	
	while (UpdateOnscreenKeyboard() == 0) do
		DisableAllControlActions(0);
		Wait(0);
	end
	if (GetOnscreenKeyboardResult()) then
		number =  GetOnscreenKeyboardResult()
	end
	if number ~= '' then
		TriggerEvent('phone:autoCall', number, {
			useNumber = fixeNumber
		})
		PhonePlayCall(true)
	end
end

function TakeAppel(infoCall)
	TriggerEvent('phone:autoAcceptCall', infoCall)
end

RegisterNetEvent("phone:notifyFixePhoneChange")
AddEventHandler("phone:notifyFixePhoneChange", function(_PhoneInCall)
	PhoneInCall = _PhoneInCall
end)

function showFixePhoneHelper(coords)
	for number, data in pairs(FixePhone) do
		local dist = GetDistanceBetweenCoords(
			data.coords.x, data.coords.y, data.coords.z,
			coords.x, coords.y, coords.z, 1)
		if dist <= 2.0 then
			SetTextComponentFormat("STRING")
			AddTextComponentString("~g~" .. data.name .. ' ~o~' .. number .. '~n~~INPUT_PICKUP~~w~ Utiliser')
			DisplayHelpTextFromStringLabel(0, 0, 0, -1)
			if IsControlJustPressed(1, KeyTakeCall) then
			startFixeCall(number)
			end
			break
		end
	end
end

Citizen.CreateThread(function ()
	local mod = 0
	while true do 
		local playerPed   = PlayerPedId()
		local coords      = GetEntityCoords(playerPed)
		local inRangeToActivePhone = false
		local inRangedist = 0
		for i, _ in pairs(PhoneInCall) do 
			local dist = GetDistanceBetweenCoords(
				PhoneInCall[i].coords.x, PhoneInCall[i].coords.y, PhoneInCall[i].coords.z,
				coords.x, coords.y, coords.z, 1)
			if (dist <= soundDistanceMax) then
				DrawMarker(1, PhoneInCall[i].coords.x, PhoneInCall[i].coords.y, PhoneInCall[i].coords.z,
					0,0,0, 0,0,0, 0.1,0.1,0.1, 0,255,0,255, 0,0,0,0,0,0,0)
				inRangeToActivePhone = true
				inRangedist = dist
				if (dist <= 1.5) then 
				SetTextComponentFormat("STRING")
				AddTextComponentString("~INPUT_PICKUP~ Décrocher")
				DisplayHelpTextFromStringLabel(0, 0, 1, -1)
				if IsControlJustPressed(1, KeyTakeCall) then
					PhonePlayCall(true)
					TakeAppel(PhoneInCall[i])
					PhoneInCall = {}
					StopSoundJS('ring2.ogg')
				end
				end
				break
			end
		end
		if inRangeToActivePhone == false then
			showFixePhoneHelper(coords)
		end
		if inRangeToActivePhone == true and currentPlaySound == false then
			PlaySoundJS('ring2.ogg', 0.2 + (inRangedist - soundDistanceMax) / -soundDistanceMax * 0.8 )
			currentPlaySound = true
		elseif inRangeToActivePhone == true then
			mod = mod + 1
			if (mod == 15) then
			mod = 0
			SetSoundVolumeJS('ring2.ogg', 0.2 + (inRangedist - soundDistanceMax) / -soundDistanceMax * 0.8 )
			end
		elseif inRangeToActivePhone == false and currentPlaySound == true then
			currentPlaySound = false
			StopSoundJS('ring2.ogg')
		end
		Citizen.Wait(0)
	end
end)


function PlaySoundJS (sound, volume)
	SendNUIMessage({ event = 'playSound', sound = sound, volume = volume })
  end
  
  function SetSoundVolumeJS (sound, volume)
	SendNUIMessage({ event = 'setSoundVolume', sound = sound, volume = volume})
  end
  
  function StopSoundJS (sound)
	SendNUIMessage({ event = 'stopSound', sound = sound})
  end
  
  RegisterNetEvent("phone:forceOpenPhone")
  AddEventHandler("phone:forceOpenPhone", function(_myPhoneNumber)
	if menuIsOpen == false then
	  TogglePhone()
	end
  end)
  
  RegisterNetEvent("phone:myPhoneNumber")
  AddEventHandler("phone:myPhoneNumber", function(_myPhoneNumber)
	myPhoneNumber = _myPhoneNumber
	SendNUIMessage({event = 'updateMyPhoneNumber', myPhoneNumber = myPhoneNumber})
  end)
  
  RegisterNetEvent("phone:contactList")
  AddEventHandler("phone:contactList", function(_contacts)
	SendNUIMessage({event = 'updateContacts', contacts = _contacts})
	contacts = _contacts
  end)
  
  RegisterNetEvent("phone:allConversations")
  AddEventHandler("phone:allConversations", function(conversations)
	  SendNUIMessage({event = 'setConversations', conversations = conversations})
  end)
  
  RegisterNetEvent("phone:getBourse")
  AddEventHandler("phone:getBourse", function(bourse)
	SendNUIMessage({event = 'updateBourse', bourse = bourse})
  end)
  
  
RegisterNetEvent("phone:receiveMessage")
AddEventHandler("phone:receiveMessage", function(payload)
  SendNUIMessage({event = 'newMessage', payload = payload})

  if payload.message.sender == myPhoneNumber then return end
  local text = 'Nouveau message'
  if ShowNumberNotification == true then
    text = 'Nouveau message du ~y~'.. payload.message.sender
    for _,contact in pairs(contacts) do
      if contact.number == payload.message.sender then
        text = 'Nouveau message de ~g~'.. contact.display
        break
      end
    end
  end
  TriggerEvent("gm:player:localnotify", text, "sms", 1, 5000)
  PlaySound(-1, "Menu_Accept", "Phone_SoundSet_Default", 0, 0, 1)
  Citizen.Wait(300)
  PlaySound(-1, "Menu_Accept", "Phone_SoundSet_Default", 0, 0, 1)
  Citizen.Wait(300)
  PlaySound(-1, "Menu_Accept", "Phone_SoundSet_Default", 0, 0, 1)
end)

function addContact(display, num) 
    TriggerServerEvent('phone:addContact', display, num)
end

function deleteContact(num) 
    TriggerServerEvent('phone:deleteContact', num)
end

function sendMessage(num, message, groupId)
  TriggerServerEvent('phone:sendMessage', num, message, groupId)
end

function deleteMessage(msgId)
  TriggerServerEvent('phone:deleteMessage', msgId, myPhoneNumber)
end

function requestAllMessages()
  TriggerServerEvent('phone:requestAllMessages')
end

function requestAllContact()
  TriggerServerEvent('phone:requestAllContact')
end

local aminCall = false
local inCall = false

RegisterNetEvent("phone:waitingCall")
AddEventHandler("phone:waitingCall", function(infoCall, initiator)
  SendNUIMessage({event = 'waitingCall', infoCall = infoCall, initiator = initiator})
  if initiator == true then
    PhonePlayCall()
    if menuIsOpen == false then
      TogglePhone()
    end
  end
end)

RegisterNetEvent("phone:acceptCall")
AddEventHandler("phone:acceptCall", function(infoCall, initiator)
  if inCall == false and USE_RTC == false then
    inCall = true
	-- exports["mumble-voip"]:SetCallChannel(infoCall.id + 1)
  end
  if menuIsOpen == false then 
    TogglePhone()
  end
  PhonePlayCall()
  SendNUIMessage({event = 'acceptCall', infoCall = infoCall, initiator = initiator})
end)

RegisterNetEvent("phone:rejectCall")
AddEventHandler("phone:rejectCall", function(infoCall)
  if inCall == true then
    inCall = false
	-- exports["mumble-voip"]:SetCallChannel(0)
  end
  PhonePlayText()
  SendNUIMessage({event = 'rejectCall', infoCall = infoCall})
end)


RegisterNetEvent("phone:historiqueCall")
AddEventHandler("phone:historiqueCall", function(historique)
  SendNUIMessage({event = 'historiqueCall', historique = historique})
end)


function startCall (phone_number, rtcOffer, extraData)
  TriggerServerEvent('phone:startCall', phone_number, rtcOffer, extraData)
end

function acceptCall (infoCall, rtcAnswer)
  TriggerServerEvent('phone:acceptCall', infoCall, rtcAnswer)
end

function rejectCall(infoCall)
  TriggerServerEvent('phone:rejectCall', infoCall)
end

function ignoreCall(infoCall)
  TriggerServerEvent('phone:ignoreCall', infoCall)
end

function requestHistoriqueCall() 
  TriggerServerEvent('phone:getHistoriqueCall')
end

function appelsDeleteHistorique (num)
  TriggerServerEvent('phone:appelsDeleteHistorique', num)
end

function appelsDeleteAllHistorique ()
  TriggerServerEvent('phone:appelsDeleteAllHistorique')
end

RegisterNUICallback('startCall', function (data, cb)
  startCall(data.numero, data.rtcOffer, data.extraData)
  cb()
end)

RegisterNUICallback('acceptCall', function (data, cb)
  acceptCall(data.infoCall, data.rtcAnswer)
  cb()
end)
RegisterNUICallback('rejectCall', function (data, cb)
  rejectCall(data.infoCall)
  cb()
end)

RegisterNUICallback('ignoreCall', function (data, cb)
  ignoreCall(data.infoCall)
  cb()
end)

RegisterNUICallback('notififyUseRTC', function (use, cb)
  USE_RTC = use
  if USE_RTC == true and inCall == true then
    inCall = false
    Citizen.InvokeNative(0xE036A705F989E049)
  end
  cb()
end)


RegisterNUICallback('onCandidates', function (data, cb)
  TriggerServerEvent('phone:candidates', data.id, data.candidates)
  cb()
end)

RegisterNetEvent("phone:candidates")
AddEventHandler("phone:candidates", function(candidates)
  SendNUIMessage({event = 'candidatesAvailable', candidates = candidates})
end)



RegisterNetEvent('phone:autoCall')
AddEventHandler('phone:autoCall', function(number, extraData)
  if number ~= nil then
    SendNUIMessage({ event = "autoStartCall", number = number, extraData = extraData})
  end
end)

RegisterNetEvent('phone:autoCallNumber')
AddEventHandler('phone:autoCallNumber', function(data)
  TriggerEvent('phone:autoCall', data.number)
end)

RegisterNetEvent('phone:autoAcceptCall')
AddEventHandler('phone:autoAcceptCall', function(infoCall)
  SendNUIMessage({ event = "autoAcceptCall", infoCall = infoCall})
end)

phone = false
phoneId = 0

RegisterNetEvent('camera:open')
AddEventHandler('camera:open', function()
  CreateMobilePhone(1)
	CellCamActivate(true, true)
	phone = true
    PhonePlayOut()
end)

frontCam = false

function CellFrontCamActivate(activate)
	return Citizen.InvokeNative(0x2491A93618B7D838, activate)
end

Citizen.CreateThread(function()
	DestroyMobilePhone()
	while true do
		Citizen.Wait(0)
				
		if IsControlJustPressed(1, 177) and phone == true then -- CLOSE PHONE
			DestroyMobilePhone()
			phone = false
			CellCamActivate(false, false)
			if firstTime == true then 
				firstTime = false 
				Citizen.Wait(2500)
				displayDoneMission = true
			end
		end
		
		if IsControlJustPressed(1, 27) and phone == true then -- SELFIE MODE
			frontCam = not frontCam
			CellFrontCamActivate(frontCam)
		end
			
		if phone == true then
			HideHudComponentThisFrame(7)
			HideHudComponentThisFrame(8)
			HideHudComponentThisFrame(9)
			HideHudComponentThisFrame(6)
			HideHudComponentThisFrame(19)
			HideHudAndRadarThisFrame()
		end
			
		ren = GetMobilePhoneRenderId()
		SetTextRenderId(ren)
		SetTextRenderId(1)
	end
end)

RegisterNUICallback('log', function(data, cb)
  cb()
end)
RegisterNUICallback('focus', function(data, cb)
  cb()
end)
RegisterNUICallback('blur', function(data, cb)
  cb()
end)
RegisterNUICallback('reponseText', function(data, cb)
  local limit = data.limit or 255
  local text = data.text or ''
  DisplayOnscreenKeyboard(1, "FMMC_MPM_NA", "", text, "", "", "", limit)
  while (UpdateOnscreenKeyboard() == 0) do
      DisableAllControlActions(0);
      Wait(0);
  end
  if (GetOnscreenKeyboardResult()) then
      text = GetOnscreenKeyboardResult()
  end
  cb(json.encode({text = text}))
end)

RegisterNUICallback('sendMessage', function(data, cb)
  if data.message == '%pos%' then
    local myPos = GetEntityCoords(PlayerPedId())
    data.message = 'GPS: ' .. myPos.x .. ', ' .. myPos.y
  end
  TriggerServerEvent('phone:sendMessage', data.conversationId, data.message)
end)
RegisterNUICallback('deleteMessage', function(data, cb)
  deleteMessage(data.id)
  cb()
end)
RegisterNUICallback('deleteConversation', function (data, cb)
  TriggerServerEvent('phone:deleteConversation', data.id)
  cb()
end)
RegisterNUICallback('deleteAllMessage', function (data, cb)
  TriggerServerEvent('phone:deleteAllMessage')
  cb()
end)
RegisterNUICallback('setMessagesRead', function (data, cb)
  TriggerServerEvent('phone:setMessagesRead', data.conversationId)
  cb()
end)

RegisterNUICallback('addContact', function(data, cb) 
  TriggerServerEvent('phone:addContact', data.display, data.phoneNumber)
end)
RegisterNUICallback('updateContact', function(data, cb)
  TriggerServerEvent('phone:updateContact', data.id, data.display, data.phoneNumber)
end)
RegisterNUICallback('deleteContact', function(data, cb)
  TriggerServerEvent('phone:deleteContact', data.id)
end)
RegisterNUICallback('getContacts', function(data, cb)
  cb(json.encode(contacts))
end)
RegisterNUICallback('setGPS', function(data, cb)
  SetNewWaypoint(tonumber(data.x), tonumber(data.y))
  cb()
end)

RegisterNUICallback('callEvent', function(data, cb)
  local eventName = data.eventName or ''
  if string.match(eventName, 'phone') then
    if data.data ~= nil then 
      TriggerEvent(data.eventName, data.data)
    else
      TriggerEvent(data.eventName)
    end
  else
    print('Event not allowed')
  end
  cb()
end)
RegisterNUICallback('useMouse', function(um, cb)
  useMouse = um
end)
RegisterNUICallback('deleteALL', function(data, cb)
  TriggerServerEvent('phone:deleteALL')
  cb()
end)

function EnsurePhoneLoaded()
  if phoneLoaded then return end
  TriggerServerEvent("phone:load")
  phoneLoaded = true
end

function TogglePhone()
  if not menuIsOpen and not exports.gamemode:hasItem('phone') then
    print("open phone canceled, no item")
    return
  end
  EnsurePhoneLoaded()
	menuIsOpen = not menuIsOpen
	SendNUIMessage({show = menuIsOpen})
	SetNuiFocus(true, true)
	if menuIsOpen == true then
		PhonePlayIn()
		SetNuiFocus(true, true)
    SetNuiFocusKeepInput(true)
    SendNUIMessage({event = 'updateBankbalance', banking = exports.gamemode:getMoney()})
	else
    EnsurePhoneLoaded()
		PhonePlayOut()
		SetNuiFocus(false, false)
	end
end

RegisterNUICallback('faketakePhoto', function(data, cb)
  menuIsOpen = false
  SendNUIMessage({show = false})
  cb()
  TriggerEvent('camera:open')
end)

RegisterNUICallback('closePhone', function(data, cb)
  menuIsOpen = false
  SendNUIMessage({show = false})
  SetNuiFocus(false, false)
  PhonePlayOut()
  cb()
end)

RegisterNUICallback('appelsDeleteHistorique', function (data, cb)
  appelsDeleteHistorique(data.numero)
  cb()
end)
RegisterNUICallback('appelsDeleteAllHistorique', function (data, cb)
  appelsDeleteAllHistorique(data.infoCall)
  cb()
end)

-- AddEventHandler('onClientResourceStart', function(res)
--   DoScreenFadeIn(300)
--   if res == "phone" then
--       TriggerServerEvent('phone:allUpdate')
--   end
-- end)


RegisterNUICallback('setIgnoreFocus', function (data, cb)
  ignoreFocus = data.ignoreFocus
  cb()
end)

RegisterNUICallback('takePhoto', function(data, cb)
	CreateMobilePhone(1)
  CellCamActivate(true, true)
  takePhoto = true
  Citizen.Wait(0)
  if hasFocus == true then
    SetNuiFocus(false, false)
    hasFocus = false
  end
	while takePhoto do
    Citizen.Wait(0)

		if IsControlJustPressed(1, 27) then -- Toogle Mode
			frontCam = not frontCam
			CellFrontCamActivate(frontCam)
    elseif IsControlJustPressed(1, 177) then -- CANCEL
      DestroyMobilePhone()
      CellCamActivate(false, false)
      cb(json.encode({ url = nil }))
      takePhoto = false
      break
    elseif IsControlJustPressed(1, 176) then -- TAKE.. PIC
		    exports['screenshot-basic']:requestScreenshotUpload(data.url, data.field, function(data)
          print(data)
          local resp = json.decode(data)
          DestroyMobilePhone()
          CellCamActivate(false, false)
          cb(json.encode({ url = resp.files[1].url }))
      end)
      takePhoto = false
		end
		HideHudComponentThisFrame(7)
		HideHudComponentThisFrame(8)
		HideHudComponentThisFrame(9)
		HideHudComponentThisFrame(6)
		HideHudComponentThisFrame(19)
    HideHudAndRadarThisFrame()
  end
  Citizen.Wait(1000)
  PhonePlayAnim('text', false, true)
end)

RegisterNetEvent("phone:tchat_receive")
AddEventHandler("phone:tchat_receive", function(message)
  SendNUIMessage({event = 'tchat_receive', message = message})
end)

RegisterNetEvent("phone:tchat_channel")
AddEventHandler("phone:tchat_channel", function(channel, messages)
  SendNUIMessage({event = 'tchat_channel', messages = messages})
end)

RegisterNUICallback('tchat_addMessage', function(data, cb)
  TriggerServerEvent('phone:tchat_addMessage', data.channel, data.message)
end)

RegisterNUICallback('tchat_getChannel', function(data, cb)
  TriggerServerEvent('phone:tchat_channel', data.channel)
end)

local bank = 0
function setBankBalance (value)
      bank = value
      SendNUIMessage({event = 'updateBankbalance', banking = bank})
end


RegisterNetEvent("phone:twitter_getTweets")
AddEventHandler("phone:twitter_getTweets", function(tweets)
  SendNUIMessage({event = 'twitter_tweets', tweets = tweets})
end)

RegisterNetEvent("phone:twitter_getFavoriteTweets")
AddEventHandler("phone:twitter_getFavoriteTweets", function(tweets)
  SendNUIMessage({event = 'twitter_favoritetweets', tweets = tweets})
end)

RegisterNetEvent("phone:twitter_newTweets")
AddEventHandler("phone:twitter_newTweets", function(tweet)
  SendNUIMessage({event = 'twitter_newTweet', tweet = tweet})
end)

RegisterNetEvent("phone:twitter_updateTweetLikes")
AddEventHandler("phone:twitter_updateTweetLikes", function(tweetId, likes)
  SendNUIMessage({event = 'twitter_updateTweetLikes', tweetId = tweetId, likes = likes})
end)

RegisterNetEvent("phone:twitter_setAccount")
AddEventHandler("phone:twitter_setAccount", function(username, password, avatarUrl)
  SendNUIMessage({event = 'twitter_setAccount', username = username, password = password, avatarUrl = avatarUrl})
end)

RegisterNetEvent("phone:twitter_createAccount")
AddEventHandler("phone:twitter_createAccount", function(account)
  SendNUIMessage({event = 'twitter_createAccount', account = account})
end)

RegisterNetEvent("phone:twitter_showError")
AddEventHandler("phone:twitter_showError", function(title, message)
  SendNUIMessage({event = 'twitter_showError', message = message, title = title})
end)

RegisterNetEvent("phone:twitter_showSuccess")
AddEventHandler("phone:twitter_showSuccess", function(title, message)
  SendNUIMessage({event = 'twitter_showSuccess', message = message, title = title})
end)

RegisterNetEvent("phone:twitter_setTweetLikes")
AddEventHandler("phone:twitter_setTweetLikes", function(tweetId, isLikes)
  SendNUIMessage({event = 'twitter_setTweetLikes', tweetId = tweetId, isLikes = isLikes})
end)

RegisterNUICallback('twitter_login', function(data, cb)
  TriggerServerEvent('phone:twitter_login', data.username, data.password)
end)
RegisterNUICallback('twitter_changePassword', function(data, cb)
  TriggerServerEvent('phone:twitter_changePassword', data.username, data.password, data.newPassword)
end)


RegisterNUICallback('twitter_createAccount', function(data, cb)
  TriggerServerEvent('phone:twitter_createAccount', data.username, data.password, data.avatarUrl)
end)

RegisterNUICallback('twitter_getTweets', function(data, cb)
  TriggerServerEvent('phone:twitter_getTweets', data.username, data.password)
end)

RegisterNUICallback('twitter_getFavoriteTweets', function(data, cb)
  TriggerServerEvent('phone:twitter_getFavoriteTweets', data.username, data.password)
end)

RegisterNUICallback('twitter_postTweet', function(data, cb)
  TriggerServerEvent('phone:twitter_postTweets', data.username or '', data.password or '', data.message)
end)

RegisterNUICallback('twitter_toggleLikeTweet', function(data, cb)
  TriggerServerEvent('phone:twitter_toogleLikeTweet', data.username or '', data.password or '', data.tweetId)
end)

RegisterNUICallback('twitter_setAvatarUrl', function(data, cb)
  TriggerServerEvent('phone:twitter_setAvatarUrl', data.username or '', data.password or '', data.avatarUrl)
end)

RegisterNUICallback("setTyping", function(data, cb)
  SetNuiFocusKeepInput(not data.value)
  cb()
end)

RegisterNUICallback("createConversation", function(data, cb)
  if(convCallback ~= nil) then return end
  convCallback = cb
  TriggerServerEvent('phone:createConversation', data.members, data.message)
end)

RegisterNetEvent("phone:conversationCreated")
AddEventHandler("phone:conversationCreated", function(id)
  if convCallback ~= nil then
    convCallback(id)
    convCallback = nil
  end
end)

RegisterCommand("+togglephone", function()
  if takePhoto ~= true then
      TogglePhone()
  end
end, false)
RegisterKeyMapping("+togglephone", "Ouvrir/fermer le télèphone", "keyboard", "h")


Citizen.CreateThread(function()
	while true do
	  	Citizen.Wait(0)

	  	if takePhoto ~= true then
        if IsControlJustPressed(0, 178) then
          if menuIsOpen == true then
            TogglePhone()
          end
        end
	  	end

      if menuIsOpen then
        DisableControlAction(0, 0, true)
        DisableControlAction(0, 1, true)
        DisableControlAction(0, 2, true)
        DisableControlAction(0, 6, true)
        DisableControlAction(0, 288, true)
        DisableControlAction(0, 318, true)
        DisableControlAction(0, 168, true)
        DisableControlAction(0, 327, true)
        DisableControlAction(0, 166, true)
        DisableControlAction(0, 289, true)
        DisableControlAction(0, 305, true)
        DisableControlAction(0, 331, true)
        DisableControlAction(0, 330, true)
        DisableControlAction(0, 329, true)
        DisableControlAction(0, 132, true)
        DisableControlAction(0, 246, true)
        DisableControlAction(0, 36, true)
        DisableControlAction(0, 18, true)
        DisableControlAction(0, 106, true)
        DisableControlAction(0, 122, true)
        DisableControlAction(0, 135, true)
        DisableControlAction(0, 218, true)
        DisableControlAction(0, 200, true)
        DisableControlAction(0, 219, true)
        DisableControlAction(0, 220, true)
        DisableControlAction(0, 221, true)
        DisableControlAction(0, 202, true)
        DisableControlAction(0, 199, true)
        DisableControlAction(0, 177, true)
        DisableControlAction(0, 19, true) -- INPUT_CHARACTER_WHEEL
        --DisableControlAction(0, 21, true) -- INPUT_SPRINT
        DisableControlAction(0, 22, true) -- INPUT_JUMP
        DisableControlAction(0, 23, true) -- INPUT_ENTER
        DisableControlAction(0, 24, true) -- INPUT_ATTACK
        DisableControlAction(0, 25, true) -- INPUT_AIM
        DisableControlAction(0, 26, true) -- INPUT_LOOK_BEHIND
        DisableControlAction(0, 38, true) -- INPUT KEY
        DisableControlAction(0, 44, true) -- INPUT_COVER
        DisableControlAction(0, 45, true) -- INPUT_RELOAD
        DisableControlAction(0, 50, true) -- INPUT_ACCURATE_AIM
        DisableControlAction(0, 51, true) -- CONTEXT KEY
        DisableControlAction(0, 58, true) -- INPUT_THROW_GRENADE
        DisableControlAction(0, 59, true) -- INPUT_VEH_MOVE_LR
        DisableControlAction(0, 60, true) -- INPUT_VEH_MOVE_UD
        DisableControlAction(0, 61, true) -- INPUT_VEH_MOVE_UP_ONLY
        DisableControlAction(0, 62, true) -- INPUT_VEH_MOVE_DOWN_ONLY
        DisableControlAction(0, 63, true) -- INPUT_VEH_MOVE_LEFT_ONLY
        DisableControlAction(0, 64, true) -- INPUT_VEH_MOVE_RIGHT_ONLY
        DisableControlAction(0, 65, true) -- INPUT_VEH_SPECIAL
        DisableControlAction(0, 66, true) -- INPUT_VEH_GUN_LR
        DisableControlAction(0, 67, true) -- INPUT_VEH_GUN_UD
        DisableControlAction(0, 68, true) -- INPUT_VEH_AIM
        DisableControlAction(0, 69, true) -- INPUT_VEH_ATTACK
        DisableControlAction(0, 70, true) -- INPUT_VEH_ATTACK2
        DisableControlAction(0, 71, true) -- INPUT_VEH_ACCELERATE
        DisableControlAction(0, 72, true) -- INPUT_VEH_BRAKE
        DisableControlAction(0, 73, true) -- INPUT_VEH_DUCK
        DisableControlAction(0, 74, true) -- INPUT_VEH_HEADLIGHT
        DisableControlAction(0, 75, true) -- INPUT_VEH_EXIT
        DisableControlAction(0, 76, true) -- INPUT_VEH_HANDBRAKE
        DisableControlAction(0, 81, true) -- INPUT_VEH_NEXT_RADIO_TRACK
        DisableControlAction(0, 82, true) -- INPUT_VEH_PREV_RADIO_TRACK
        DisableControlAction(0, 86, true) -- INPUT_VEH_HORN
        DisableControlAction(0, 92, true) -- INPUT_VEH_PASSENGER_ATTACK
        DisableControlAction(0, 99, true) -- INPUT_VEH_PASSENGER_ATTACK
        DisableControlAction(0, 100, true) -- INPUT_VEH_PASSENGER_ATTACK
        DisableControlAction(0, 114, true) -- INPUT_VEH_FLY_ATTACK
        DisableControlAction(0, 140, true) -- INPUT_MELEE_ATTACK_LIGHT
        DisableControlAction(0, 141, true) -- INPUT_MELEE_ATTACK_HEAVY
        DisableControlAction(0, 261, true) -- INPUT_PREV_WEAPON
        DisableControlAction(0, 262, true) -- INPUT_NEXT_WEAPON
        DisableControlAction(0, 263, true) -- INPUT_MELEE_ATTACK1
        DisableControlAction(0, 264, true) -- INPUT_MELEE_ATTACK2
        DisableControlAction(0, 142, true) -- INPUT_MELEE_ATTACK_ALTERNATE
        DisableControlAction(0, 143, true) -- INPUT_MELEE_BLOCK
        DisableControlAction(0, 144, true) -- PARACHUTE DEPLOY
        DisableControlAction(0, 145, true) -- PARACHUTE DETACH
        DisableControlAction(0, 156, true) -- INPUT_MAP
        DisableControlAction(0, 157, true) -- INPUT_SELECT_WEAPON_UNARMED
        DisableControlAction(0, 158, true) -- INPUT_SELECT_WEAPON_MELEE
        DisableControlAction(0, 159, true) -- INPUT_SELECT_WEAPON_HANDGUN
        DisableControlAction(0, 160, true) -- INPUT_SELECT_WEAPON_SHOTGUN
        DisableControlAction(0, 161, true) -- INPUT_SELECT_WEAPON_SMG
        DisableControlAction(0, 162, true) -- INPUT_SELECT_WEAPON_AUTO_RIFLE
        DisableControlAction(0, 243, true) -- INPUT_ENTER_CHEAT_CODE
        DisableControlAction(0, 257, true) -- INPUT_ATTACK2
        DisableControlAction(0, 183, true) -- GCPHONE
        DisableControlAction(0, 163, true) -- INPUT_SELECT_WEAPON_SNIPER
        DisableControlAction(0, 164, true) -- INPUT_SELECT_WEAPON_HEAVY
        DisableControlAction(0, 165, true) -- INPUT_SELECT_WEAPON_SPECIAL
      end
	end
end)

exports("isOpen", function()
  return menuIsOpen
end)

AddEventHandler("gm:character:loadphone", function()
  EnsurePhoneLoaded()
end)