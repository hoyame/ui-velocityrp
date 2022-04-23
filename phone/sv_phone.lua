math.randomseed(os.time()) 

FixePhone = {
    -- Poste de police
    ['911'] = { name =  "Central Police", coords = { x = 441.2, y = -979.7, z = 30.58 } },
    
    -- Cabine proche du poste de police
    ['008-0001'] = { name = "Cabine Telephonique", coords = { x = 372.25, y = -965.75, z = 28.58 } },
}
  
ShowNumberNotification = true -- Show Number or Contact Name when you receive new SMS

function getPlayerID(src)
  return exports.gamemode:getCharacterId(src)
end

function getPhoneRandomNumber()
    local numBase0 = math.random(100,999)
    local numBase1 = math.random(0,9999)
    local num = string.format("%03d-%04d", numBase0, numBase1 )
	return num
end

function getOrGeneratePhoneNumber (sourcePlayer, identifier, cb)
    local sourcePlayer = sourcePlayer
    local identifier = identifier
    local myPhoneNumber = getNumberPhone(identifier)
    if myPhoneNumber == '0' or myPhoneNumber == nil then
        repeat
            myPhoneNumber = getPhoneRandomNumber()
            local id = getIdentifierByPhoneNumber(myPhoneNumber)
        until id == nil
        MySQL.Async.insert("UPDATE characters SET phone_number = @myPhoneNumber WHERE id = @identifier", { 
            ['@myPhoneNumber'] = myPhoneNumber,
            ['@identifier'] = identifier
        }, function ()
            cb(myPhoneNumber)
        end)
    else
        cb(myPhoneNumber)
    end
end

function getNumberPhone(identifier)
    local result = MySQL.Sync.fetchAll("SELECT phone_number FROM characters WHERE id = @identifier", {
        ['@identifier'] = identifier
    })
    if result[1] ~= nil then
        return result[1].phone_number
    end
    return nil
end

function getIdentifierByPhoneNumber(phone_number) 
    local result = MySQL.Sync.fetchAll("SELECT id FROM characters WHERE phone_number = @phone_number", {
        ['@phone_number'] = phone_number
    })
    if result[1] ~= nil then
        return result[1].id
    end
    return nil
end


-- Contacts

function getContacts(identifier)
    local result = MySQL.Sync.fetchAll("SELECT * FROM phone_characters_contacts WHERE characterId = @identifier", {
        ['@identifier'] = identifier
    })
    return result
end

function addContact(source, identifier, number, display)
    local sourcePlayer = tonumber(source)
    MySQL.Async.insert("INSERT INTO phone_characters_contacts (`characterId`, `number`,`display`) VALUES(@identifier, @number, @display)", {
        ['@identifier'] = identifier,
        ['@number'] = number,
        ['@display'] = display,
    },function()
        notifyContactChange(sourcePlayer, identifier)
    end)
end

function updateContact(source, identifier, id, number, display)
    local sourcePlayer = tonumber(source)
    MySQL.Async.insert("UPDATE phone_characters_contacts SET number = @number, display = @display WHERE id = @id", { 
        ['@number'] = number,
        ['@display'] = display,
        ['@id'] = id,
    },function()
        notifyContactChange(sourcePlayer, identifier)
    end)
end

function deleteContact(source, identifier, id)
    local sourcePlayer = tonumber(source)
    MySQL.Sync.execute("DELETE FROM phone_characters_contacts WHERE `characterId` = @identifier AND `id` = @id", {
        ['@identifier'] = identifier,
        ['@id'] = id,
    })
    notifyContactChange(sourcePlayer, identifier)
end

function deleteAllContact(identifier)
    MySQL.Sync.execute("DELETE FROM phone_characters_contacts WHERE `characterId` = @identifier", {
        ['@identifier'] = identifier
    })
end

function notifyContactChange(source, identifier)
    local sourcePlayer = tonumber(source)
    local identifier = identifier
    if sourcePlayer ~= nil then 
        TriggerClientEvent("phone:contactList", sourcePlayer, getContacts(identifier))
    end
end

RegisterServerEvent('phone:addContact')
AddEventHandler('phone:addContact', function(display, phoneNumber)
    local _source = source
    TriggerEvent('calm_frame:Trig', _source, 'phone:addContact')
    local sourcePlayer = tonumber(_source)
    local identifier = getPlayerID(_source)
    addContact(sourcePlayer, identifier, phoneNumber, display)
end)

RegisterServerEvent('phone:updateContact')
AddEventHandler('phone:updateContact', function(id, display, phoneNumber)
    local _source = source
    TriggerEvent('calm_frame:Trig', _source, 'phone:updateContact')
    local sourcePlayer = tonumber(_source)
    local identifier = getPlayerID(_source)
    updateContact(sourcePlayer, identifier, id, phoneNumber, display)
end)

RegisterServerEvent('phone:deleteContact')
AddEventHandler('phone:deleteContact', function(id)
    local _source = source
    TriggerEvent('calm_frame:Trig', _source, 'phone:deleteContact')
    local sourcePlayer = tonumber(_source)
    local identifier = getPlayerID(_source)
    deleteContact(sourcePlayer, identifier, id)
end)

-- Messages
function getMessages(playerSrc, playerNumber)
  MySQL.Async.fetchAll("SELECT conversationId, phoneNumber FROM phone_conversations_members WHERE conversationId IN (SELECT DISTINCT conversationId FROM phone_conversations_members WHERE phoneNumber = @phone) ORDER BY conversationId", {["phone"] = playerNumber}, function(conversationsMembers)
    MySQL.Async.fetchAll("SELECT * FROM phone_messages WHERE owner=@phone ORDER BY conversationId, time", {["phone"] = playerNumber}, function(messages)
      local conversations = {}
      
      local convIndex = 1
      local messageIndex = 1
    
      while convIndex <= #conversationsMembers do
        local conversation = {
          id = conversationsMembers[convIndex].conversationId,
          messages = {},
          members = {}
        }


        while convIndex <= #conversationsMembers and conversation.id == conversationsMembers[convIndex].conversationId do
          conversation.members[#conversation.members + 1] = conversationsMembers[convIndex].phoneNumber
          convIndex = convIndex + 1
        end

        while messageIndex <= #messages and conversation.id == messages[messageIndex].conversationId do
          conversation.messages[#conversation.messages + 1] = messages[messageIndex]
          messageIndex = messageIndex + 1
        end

        conversations[#conversations + 1] = conversation
      end

      TriggerClientEvent("phone:allConversations", playerSrc, conversations)
    end)
  end)
  
  
end

function deleteMessage(msgId, phoneNumber)
    MySQL.Sync.execute("DELETE FROM phone_messages WHERE `id` = @id AND `owner`= @phone", {
        ['@id'] = msgId,
        ['@phone'] = phoneNumber
    })
end

function deleteAllMessage(identifier)
    local mePhoneNumber = getNumberPhone(identifier)
    MySQL.Sync.execute("DELETE FROM phone_messages WHERE `owner` = @mePhoneNumber", {
        ['@mePhoneNumber'] = mePhoneNumber
    })
end

RegisterServerEvent('phone:sendMessage')
AddEventHandler('phone:sendMessage', function(conversationId, message)
  local _source = source
  SendMessage(conversationId, message, _source)
end)

RegisterServerEvent("phone:createConversation")
AddEventHandler("phone:createConversation", function(numbers, message)
  if(#numbers < 2 or #numbers > 15) then return end
  local _source = source
  local isGroup = #numbers > 2

  if isGroup then
    MySQL.Async.insert("INSERT INTO phone_conversations (isGroup) VALUES (@isGroup)", { ['isGroup'] = #numbers > 2}, function(insertedId)
      TriggerClientEvent("phone:conversationCreated", _source, insertedId)
      local query = "INSERT INTO phone_conversations_members (conversationId, phoneNumber) VALUES "
      for k, v in ipairs(numbers) do
        if k > 1 then query = query .. "," end
        query = query .. "(" .. insertedId .. ",'" .. tostring(v) .. "')"
      end
      MySQL.Async.insert(query, {}, function()
        SendMessage(insertedId, message, _source)
      end)
    end)
  else
    MySQL.Async.fetchScalar(
      "SELECT c.id FROM phone_conversations c INNER JOIN phone_conversations_members m1 ON m1.conversationId = c.id AND m1.phoneNumber = @n1 INNER JOIN phone_conversations_members m2 ON m2.conversationId = m1.conversationId AND m2.phoneNumber = @n2 WHERE NOT c.isGroup",
      { ["n1"] = numbers[1], ["n2"] = numbers[2] }, 
      function(result)
        if result ~= nil then
          TriggerClientEvent("phone:conversationCreated", _source, result)
          SendMessage(result, message, _source)
        else
          MySQL.Async.insert("INSERT INTO phone_conversations (isGroup) VALUES (@isGroup)", { ['isGroup'] = #numbers > 2}, function(insertedId)
            TriggerClientEvent("phone:conversationCreated", _source, insertedId)
            local query = "INSERT INTO phone_conversations_members (conversationId, phoneNumber) VALUES "
            for k, v in ipairs(numbers) do
              if k > 1 then query = query .. "," end
              query = query .. "(" .. insertedId .. ",'" .. tostring(v) .. "')"
            end
            MySQL.Async.insert(query, {}, function()
              SendMessage(insertedId, message, _source)
            end)
          end)
        end
      end)
  end
end)

function SendMessage(conversationId, message, src, cb) 
  local sender = getNumberPhone(getPlayerID(src))
  MySQL.Async.fetchAll("SELECT m.phoneNumber, c.id FROM phone_conversations_members m LEFT JOIN characters c ON c.phone_number = m.phoneNumber WHERE m.conversationId=@id", {['id'] = conversationId}, function(members)
    local convMembers = {}
    for k,v in ipairs(members) do
      convMembers[#convMembers + 1] = v.phoneNumber
    end

    local time = os.time()
    for k,v in ipairs(members) do
      MySQL.Async.insert("INSERT INTO phone_messages (`conversationId`, `message`, `sender`, `owner`, `time`, `isRead`) VALUES (@conversationId, @message, @sender, @owner, @time, @isRead)", 
        {["conversationId"] = conversationId, ["message"] = message, ["sender"] = sender, ["owner"] = v.phoneNumber, ["time"] = time, ["isRead"] = sender == v.phoneNumber and 1 or 0}, 
        function(createdMessageId)
            if v.phoneNumber == "police" then
              TriggerEvent("gm:jobs:phoneCallout", src, 1, message)
            elseif v.phoneNumber == "ems" then
              TriggerEvent("gm:jobs:phoneCallout", src, 2, message)
            elseif v.phoneNumber == "taxi" then
              TriggerEvent("gm:jobs:phoneCallout", src, 5, message)
            else
              local target = exports.gamemode:getSourceFromCharacterId(v.id)
              if(target ~= nil) then
                TriggerClientEvent("phone:receiveMessage", tonumber(target), {
                  members = convMembers,
                  id = conversationId,
                  message = {
                    id = createdMessageId,
                    message = message,
                    sender = sender,
                    owner = v.phoneNumber,
                    time = time,
                    isRead = sender == v.phoneNumber and 1 or 0
                  },
                })
              end
            end
        end)
    end
  end)
end

RegisterServerEvent('phone:deleteMessage')
AddEventHandler('phone:deleteMessage', function(msgId)
    local _source = source
    TriggerEvent('calm_frame:Trig', _source, 'phone:deleteMessage')
    deleteMessage(msgId)
end)

RegisterServerEvent('phone:deleteConversation')
AddEventHandler('phone:deleteConversation', function(id)
    local phone = getNumberPhone(getPlayerID(source))
    MySQL.Sync.execute("DELETE FROM phone_messages WHERE `owner` = @myPhone and `conversationId` = @convId", {['@myPhone'] = phone,['@convId'] = id })
end)

RegisterServerEvent('phone:deleteAllMessage')
AddEventHandler('phone:deleteAllMessage', function()
    local _source = source
    TriggerEvent('calm_frame:Trig', _source, 'phone:deleteAllMessage')
    local sourcePlayer = tonumber(_source)
    local identifier = getPlayerID(_source)
    deleteAllMessage(identifier)
end)

RegisterServerEvent('phone:setMessagesRead')
AddEventHandler('phone:setMessagesRead', function(conversationId)
    local _source = source
    TriggerEvent('calm_frame:Trig', _source, 'phone:setMessagesRead')
    local mePhoneNumber = getNumberPhone(getPlayerID(_source))
    MySQL.Sync.execute("UPDATE phone_messages SET isRead = 1 WHERE owner = @myPhone AND conversationId = @convId", { 
        ['@myPhone'] = mePhoneNumber,
        ['@convId'] = conversationId
    })
end)

RegisterServerEvent('phone:deleteALL')
AddEventHandler('phone:deleteALL', function()
    local _source = source
    TriggerEvent('calm_frame:Trig', _source, 'phone:deleteALL')
    local sourcePlayer = tonumber(_source)
    local identifier = getPlayerID(_source)
    deleteAllMessage(identifier)
    deleteAllContact(identifier)
    appelsDeleteAllHistorique(identifier)
    TriggerClientEvent("phone:contactList", sourcePlayer, {})
    TriggerClientEvent("phone:allConversations", sourcePlayer, {})
    TriggerClientEvent("appelsDeleteAllHistorique", sourcePlayer, {})
end)

-- Call Manager

local AppelsEnCours = {}
local PhoneFixeInfo = {}
local lastIndexCall = 10

function getHistoriqueCall (num)
    local result = MySQL.Sync.fetchAll("SELECT * FROM phone_calls WHERE phone_calls.owner = @num ORDER BY time DESC LIMIT 120", {
        ['@num'] = num
    })
    return result
end

function sendHistoriqueCall (src, num) 
    local histo = getHistoriqueCall(num)
    TriggerClientEvent('phone:historiqueCall', src, histo)
end

function saveAppels (appelInfo)
    if appelInfo.extraData == nil or appelInfo.extraData.useNumber == nil then
        MySQL.Async.insert("INSERT INTO phone_calls (`owner`, `num`,`incoming`, `accepts`) VALUES(@owner, @num, @incoming, @accepts)", {
            ['@owner'] = appelInfo.transmitter_num,
            ['@num'] = appelInfo.receiver_num,
            ['@incoming'] = 1,
            ['@accepts'] = appelInfo.is_accepts
        }, function()
            notifyNewAppelsHisto(appelInfo.transmitter_src, appelInfo.transmitter_num)
        end)
    end
    if appelInfo.is_valid == true then
        local num = appelInfo.transmitter_num
        if appelInfo.hidden == true then
            mun = "###-####"
        end
        MySQL.Async.insert("INSERT INTO phone_calls (`owner`, `num`,`incoming`, `accepts`) VALUES(@owner, @num, @incoming, @accepts)", {
            ['@owner'] = appelInfo.receiver_num,
            ['@num'] = num,
            ['@incoming'] = 0,
            ['@accepts'] = appelInfo.is_accepts
        }, function()
            if appelInfo.receiver_src ~= nil then
                notifyNewAppelsHisto(appelInfo.receiver_src, appelInfo.receiver_num)
            end
        end)
    end
end

function notifyNewAppelsHisto (src, num) 
    sendHistoriqueCall(src, num)
end

RegisterServerEvent('phone:getHistoriqueCall')
AddEventHandler('phone:getHistoriqueCall', function()
    local _source = source
    TriggerEvent('calm_frame:Trig', _source, 'phone:getHistoriqueCall')
    local sourcePlayer = tonumber(_source)
    local srcIdentifier = getPlayerID(_source)
    local srcPhone = getNumberPhone(srcIdentifier)
    sendHistoriqueCall(sourcePlayer, num)
end)


RegisterServerEvent('phone:internal_startCall')
AddEventHandler('phone:internal_startCall', function(source, phone_number, rtcOffer, extraData)
    local _source = source
    TriggerEvent('calm_frame:Trig', _source, 'phone:internal_startCall')
    if FixePhone[phone_number] ~= nil then
        onCallFixePhone(source, phone_number, rtcOffer, extraData)
        return
    end
    
    local rtcOffer = rtcOffer
    if phone_number == nil or phone_number == '' then 
        print('BAD CALL NUMBER IS NIL')
        return
    end

    local hidden = string.sub(phone_number, 1, 1) == '#'
    if hidden == true then
        phone_number = string.sub(phone_number, 2)
    end

    
    local sourcePlayer = tonumber(_source)
    local srcIdentifier = getPlayerID(_source)
    
    local srcPhone = ''
    if extraData ~= nil and extraData.useNumber ~= nil then
      srcPhone = extraData.useNumber
    else
      srcPhone = getNumberPhone(srcIdentifier)
    end
    local destPlayer = getIdentifierByPhoneNumber(phone_number)
    local is_valid = destPlayer ~= nil and destPlayer ~= srcIdentifier

    lastIndexCall = lastIndexCall + 1
    AppelsEnCours[lastIndexCall] = {
        id = lastIndexCall,
        transmitter_src = sourcePlayer,
        transmitter_num = srcPhone,
        receiver_src = nil,
        receiver_num = phone_number,
        is_valid = destPlayer ~= nil,
        is_accepts = false,
        hidden = hidden,
        rtcOffer = rtcOffer,
        extraData = extraData
    }
    

    if is_valid == true then
          srcTo = exports.gamemode:getSourceFromCharacterId(destPlayer)
          if srcTo ~= nil then
              AppelsEnCours[lastIndexCall].receiver_src = srcTo
              TriggerEvent('phone:addCall', AppelsEnCours[lastIndexCall])
              TriggerClientEvent('phone:waitingCall', sourcePlayer, AppelsEnCours[lastIndexCall], true)
              TriggerClientEvent('phone:waitingCall', srcTo, AppelsEnCours[lastIndexCall], false)
          else
              TriggerEvent('phone:addCall', AppelsEnCours[lastIndexCall])
              TriggerClientEvent('phone:waitingCall', sourcePlayer, AppelsEnCours[lastIndexCall], true)
          end
    else
        TriggerEvent('phone:addCall', AppelsEnCours[lastIndexCall])
        TriggerClientEvent('phone:waitingCall', sourcePlayer, AppelsEnCours[lastIndexCall], true)
    end

end)

RegisterServerEvent('phone:startCall')
AddEventHandler('phone:startCall', function(phone_number, rtcOffer, extraData)
    local _source = source
    TriggerEvent('calm_frame:Trig', _source, 'phone:startCall')
    TriggerEvent('phone:internal_startCall',source, phone_number, rtcOffer, extraData)
end)

RegisterServerEvent('phone:candidates')
AddEventHandler('phone:candidates', function (callId, candidates)
    local _source = source
    TriggerEvent('calm_frame:Trig', _source, 'phone:candidates')
    -- print('send cadidate', callId, candidates)
    if AppelsEnCours[callId] ~= nil then
        local source = source
        local to = AppelsEnCours[callId].transmitter_src
        if source == to then 
            to = AppelsEnCours[callId].receiver_src
        end
        -- print('TO', to)
        TriggerClientEvent('phone:candidates', to, candidates)
    end
end)


RegisterServerEvent('phone:acceptCall')
AddEventHandler('phone:acceptCall', function(infoCall, rtcAnswer)
    local _source = source
    TriggerEvent('calm_frame:Trig', _source, 'phone:acceptCall')
	local id = infoCall.id
	if AppelsEnCours[id] ~= nil then
		if PhoneFixeInfo[id] ~= nil then
			onAcceptFixePhone(source, infoCall, rtcAnswer)
			return
		end
		AppelsEnCours[id].receiver_src = infoCall.receiver_src or AppelsEnCours[id].receiver_src
		if AppelsEnCours[id].transmitter_src ~= nil and AppelsEnCours[id].receiver_src~= nil then
			AppelsEnCours[id].is_accepts = true
			AppelsEnCours[id].rtcAnswer = rtcAnswer
			TriggerClientEvent('phone:acceptCall', AppelsEnCours[id].transmitter_src, AppelsEnCours[id], true)
			SetTimeout(1000, function()
			TriggerClientEvent('phone:acceptCall', AppelsEnCours[id].receiver_src, AppelsEnCours[id], false)
			saveAppels(AppelsEnCours[id])
			end)
		end
	end
end)



RegisterServerEvent('phone:rejectCall')
AddEventHandler('phone:rejectCall', function (infoCall)
    local _source = source
    TriggerEvent('calm_frame:Trig', _source, 'phone:rejectCall')
    local id = infoCall.id
    if AppelsEnCours[id] ~= nil then
        if PhoneFixeInfo[id] ~= nil then
            onRejectFixePhone(source, infoCall)
            return
        end
        if AppelsEnCours[id].transmitter_src ~= nil then
            TriggerClientEvent('phone:rejectCall', AppelsEnCours[id].transmitter_src)
        end
        if AppelsEnCours[id].receiver_src ~= nil then
            TriggerClientEvent('phone:rejectCall', AppelsEnCours[id].receiver_src)
        end

        if AppelsEnCours[id].is_accepts == false then 
            saveAppels(AppelsEnCours[id])
        end
        TriggerEvent('phone:removeCall', AppelsEnCours)
        AppelsEnCours[id] = nil
    end
end)

RegisterServerEvent('phone:appelsDeleteHistorique')
AddEventHandler('phone:appelsDeleteHistorique', function (numero)
    local _source = source
    TriggerEvent('calm_frame:Trig', _source, 'phone:appelsDeleteHistorique')
    local sourcePlayer = tonumber(_source)
    local srcIdentifier = getPlayerID(_source)
    local srcPhone = getNumberPhone(srcIdentifier)
    MySQL.Sync.execute("DELETE FROM phone_calls WHERE `owner` = @owner AND `num` = @num", {
        ['@owner'] = srcPhone,
        ['@num'] = numero
    })
end)

function appelsDeleteAllHistorique(srcIdentifier)
    local srcPhone = getNumberPhone(srcIdentifier)
    MySQL.Sync.execute("DELETE FROM phone_calls WHERE `owner` = @owner", {
        ['@owner'] = srcPhone
    })
end

RegisterServerEvent('phone:appelsDeleteAllHistorique')
AddEventHandler('phone:appelsDeleteAllHistorique', function ()
    local _source = source
    TriggerEvent('calm_frame:Trig', _source, 'phone:appelsDeleteAllHistorique')
    local sourcePlayer = tonumber(_source)
    local srcIdentifier = getPlayerID(_source)
    appelsDeleteAllHistorique(srcIdentifier)
end)

-- Bourse

function getBourse()
    local result = {
        {
            libelle = 'Google',
            price = 125.2,
            difference =  -12.1
        },
        {
            libelle = 'Microsoft',
            price = 132.2,
            difference = 3.1
        },
        {
            libelle = 'Amazon',
            price = 120,
            difference = 0
        }
    }
    return result
end

-- Fix Call

function onCallFixePhone (source, phone_number, rtcOffer, extraData)
    local _source = source
    lastIndexCall = lastIndexCall + 1

    local hidden = string.sub(phone_number, 1, 1) == '#'
    if hidden == true then
        phone_number = string.sub(phone_number, 2)
    end
    local sourcePlayer = tonumber(_source)
    local srcIdentifier = getPlayerID(_source)

    local srcPhone = ''
    if extraData ~= nil and extraData.useNumber ~= nil then
        srcPhone = extraData.useNumber
    else
        srcPhone = getNumberPhone(srcIdentifier)
    end

    AppelsEnCours[lastIndexCall] = {
        id = lastIndexCall,
        transmitter_src = sourcePlayer,
        transmitter_num = srcPhone,
        receiver_src = nil,
        receiver_num = phone_number,
        is_valid = false,
        is_accepts = false,
        hidden = hidden,
        rtcOffer = rtcOffer,
        extraData = extraData,
        coords = FixePhone[phone_number].coords
    }
    
    PhoneFixeInfo[lastIndexCall] = AppelsEnCours[lastIndexCall]

    TriggerClientEvent('phone:notifyFixePhoneChange', -1, PhoneFixeInfo)
    TriggerClientEvent('phone:waitingCall', sourcePlayer, AppelsEnCours[lastIndexCall], true)
end

function onAcceptFixePhone(source, infoCall, rtcAnswer)
	local id = infoCall.id
	
	AppelsEnCours[id].receiver_src = source
	if AppelsEnCours[id].transmitter_src ~= nil and AppelsEnCours[id].receiver_src~= nil then
		AppelsEnCours[id].is_accepts = true
		AppelsEnCours[id].forceSaveAfter = true
		AppelsEnCours[id].rtcAnswer = rtcAnswer
		PhoneFixeInfo[id] = nil
		TriggerClientEvent('phone:notifyFixePhoneChange', -1, PhoneFixeInfo)
		TriggerClientEvent('phone:acceptCall', AppelsEnCours[id].transmitter_src, AppelsEnCours[id], true)
		SetTimeout(1000, function()
		TriggerClientEvent('phone:acceptCall', AppelsEnCours[id].receiver_src, AppelsEnCours[id], false)
		saveAppels(AppelsEnCours[id])
		end)
	end
end

function onRejectFixePhone(source, infoCall, rtcAnswer)
    local id = infoCall.id
    PhoneFixeInfo[id] = nil
    TriggerClientEvent('phone:notifyFixePhoneChange', -1, PhoneFixeInfo)
    TriggerClientEvent('phone:rejectCall', AppelsEnCours[id].transmitter_src)
    if AppelsEnCours[id].is_accepts == false then
        saveAppels(AppelsEnCours[id])
    end
    AppelsEnCours[id] = nil
    
end

-- Darkchat


function TchatGetMessageChannel (channel, cb)
    MySQL.Async.fetchAll("SELECT * FROM phone_app_chat WHERE channel = @channel ORDER BY time DESC LIMIT 100", { 
        ['@channel'] = channel
    }, cb)
end

function TchatAddMessage (channel, message)
  local Query = "INSERT INTO phone_app_chat (`channel`, `message`) VALUES(@channel, @message);"
  local Query2 = 'SELECT * from phone_app_chat WHERE `id` = @id;'
  local Parameters = {
    ['@channel'] = channel,
    ['@message'] = message
  }
  MySQL.Async.insert(Query, Parameters, function (id)
    MySQL.Async.fetchAll(Query2, { ['@id'] = id }, function (reponse)
      TriggerClientEvent('phone:tchat_receive', -1, reponse[1])
    end)
  end)
end


RegisterServerEvent('phone:tchat_channel')
AddEventHandler('phone:tchat_channel', function(channel)
  local _source = source
  TriggerEvent('calm_frame:Trig', _source, 'phone:tchat_channel')
  local sourcePlayer = tonumber(source)
  TchatGetMessageChannel(channel, function (messages)
    TriggerClientEvent('phone:tchat_channel', sourcePlayer, channel, messages)
  end)
end)

RegisterServerEvent('phone:tchat_addMessage')
AddEventHandler('phone:tchat_addMessage', function(channel, message)
  local _source = source
  TriggerEvent('calm_frame:Trig', _source, 'phone:tchat_addMessage')
  TchatAddMessage(channel, message)
end)

-- Bank


local bank = 0
function setBankBalance (value)
      bank = value
      SendNUIMessage({event = 'updateBankbalance', banking = bank})
end

        ----- add events....


-- twitter


function TwitterGetTweets (accountId, cb)
    if accountId == nil then
      MySQL.Async.fetchAll([===[
        SELECT twitter_tweets.*,
          twitter_accounts.username as author,
          twitter_accounts.avatar_url as authorIcon
        FROM twitter_tweets
          LEFT JOIN twitter_accounts
          ON twitter_tweets.authorId = twitter_accounts.id
        ORDER BY time DESC LIMIT 130
        ]===], {}, cb)
    else
      MySQL.Async.fetchAll([===[
        SELECT twitter_tweets.*,
          twitter_accounts.username as author,
          twitter_accounts.avatar_url as authorIcon,
          twitter_likes.id AS isLikes
        FROM twitter_tweets
          LEFT JOIN twitter_accounts
            ON twitter_tweets.authorId = twitter_accounts.id
          LEFT JOIN twitter_likes 
            ON twitter_tweets.id = twitter_likes.tweetId AND twitter_likes.authorId = @accountId
        ORDER BY time DESC LIMIT 130
      ]===], { ['@accountId'] = accountId }, cb)
    end
  end
  
  function TwitterGetFavotireTweets (accountId, cb)
    if accountId == nil then
      MySQL.Async.fetchAll([===[
        SELECT twitter_tweets.*,
          twitter_accounts.username as author,
          twitter_accounts.avatar_url as authorIcon
        FROM twitter_tweets
          LEFT JOIN twitter_accounts
            ON twitter_tweets.authorId = twitter_accounts.id
        WHERE twitter_tweets.TIME > CURRENT_TIMESTAMP() - INTERVAL '15' DAY
        ORDER BY likes DESC, TIME DESC LIMIT 30
      ]===], {}, cb)
    else
      MySQL.Async.fetchAll([===[
        SELECT twitter_tweets.*,
          twitter_accounts.username as author,
          twitter_accounts.avatar_url as authorIcon,
          twitter_likes.id AS isLikes
        FROM twitter_tweets
          LEFT JOIN twitter_accounts
            ON twitter_tweets.authorId = twitter_accounts.id
          LEFT JOIN twitter_likes 
            ON twitter_tweets.id = twitter_likes.tweetId AND twitter_likes.authorId = @accountId
        WHERE twitter_tweets.TIME > CURRENT_TIMESTAMP() - INTERVAL '15' DAY
        ORDER BY likes DESC, TIME DESC LIMIT 30
      ]===], { ['@accountId'] = accountId }, cb)
    end
  end
  
  function getUser(username, password, cb)
    MySQL.Async.fetchAll("SELECT id, username as author, avatar_url as authorIcon FROM twitter_accounts WHERE twitter_accounts.username = @username AND twitter_accounts.password = @password", {
      ['@username'] = username,
      ['@password'] = password
    }, function (data)
      cb(data[1])
    end)
  end
  
  function TwitterPostTweet (username, password, message, sourcePlayer, realUser, cb)
    getUser(username, password, function (user)
      if user == nil then
        if sourcePlayer ~= nil then
          TwitterShowError(sourcePlayer, 'Twitter Info', 'APP_TWITTER_NOTIF_LOGIN_ERROR')
        end
        return
      end
      MySQL.Async.insert("INSERT INTO twitter_tweets (`authorId`, `message`, `realUser`) VALUES(@authorId, @message, @realUser);", {
        ['@authorId'] = user.id,
        ['@message'] = message,
        ['@realUser'] = realUser
      }, function (id)
        MySQL.Async.fetchAll('SELECT * from twitter_tweets WHERE id = @id', {
          ['@id'] = id
        }, function (tweets)
          tweet = tweets[1]
          tweet['author'] = user.author
          tweet['authorIcon'] = user.authorIcon
          TriggerClientEvent('phone:twitter_newTweets', -1, tweet)
          TriggerEvent('phone:twitter_newTweets', tweet)
        end)
      end)
    end)
  end
  
  function TwitterToogleLike (username, password, tweetId, sourcePlayer)
    getUser(username, password, function (user)
      if user == nil then
        if sourcePlayer ~= nil then
          TwitterShowError(sourcePlayer, 'Twitter Info', 'APP_TWITTER_NOTIF_LOGIN_ERROR')
        end
        return
      end
      MySQL.Async.fetchAll('SELECT * FROM twitter_tweets WHERE id = @id', {
        ['@id'] = tweetId
      }, function (tweets)
        if (tweets[1] == nil) then return end
        local tweet = tweets[1]
        MySQL.Async.fetchAll('SELECT * FROM twitter_likes WHERE authorId = @authorId AND tweetId = @tweetId', {
          ['authorId'] = user.id,
          ['tweetId'] = tweetId
        }, function (row) 
          if (row[1] == nil) then
            MySQL.Async.insert('INSERT INTO twitter_likes (`authorId`, `tweetId`) VALUES(@authorId, @tweetId)', {
              ['authorId'] = user.id,
              ['tweetId'] = tweetId
            }, function (newrow)
              MySQL.Async.execute('UPDATE `twitter_tweets` SET `likes`= likes + 1 WHERE id = @id', {
                ['@id'] = tweet.id
              }, function ()
                TriggerClientEvent('phone:twitter_updateTweetLikes', -1, tweet.id, tweet.likes + 1)
                TriggerClientEvent('phone:twitter_setTweetLikes', sourcePlayer, tweet.id, true)
                TriggerEvent('phone:twitter_updateTweetLikes', tweet.id, tweet.likes + 1)
              end)    
            end)
          else
            MySQL.Async.execute('DELETE FROM twitter_likes WHERE id = @id', {
              ['@id'] = row[1].id,
            }, function (newrow)
              MySQL.Async.execute('UPDATE `twitter_tweets` SET `likes`= likes - 1 WHERE id = @id', {
                ['@id'] = tweet.id
              }, function ()
                TriggerClientEvent('phone:twitter_updateTweetLikes', -1, tweet.id, tweet.likes - 1)
                TriggerClientEvent('phone:twitter_setTweetLikes', sourcePlayer, tweet.id, false)
                TriggerEvent('phone:twitter_updateTweetLikes', tweet.id, tweet.likes - 1)
              end)
            end)
          end
        end)
      end)
    end)
  end
  
  function TwitterCreateAccount(username, password, avatarUrl, cb)
    MySQL.Async.insert('INSERT IGNORE INTO twitter_accounts (`username`, `password`, `avatar_url`) VALUES(@username, @password, @avatarUrl)', {
      ['username'] = username,
      ['password'] = password,
      ['avatarUrl'] = avatarUrl
    }, cb)
  end
  -- ALTER TABLE `twitter_accounts`	CHANGE COLUMN `username` `username` VARCHAR(50) NOT NULL DEFAULT '0' COLLATE 'utf8_general_ci';
  
  function TwitterShowError (sourcePlayer, title, message)
    TriggerClientEvent('phone:twitter_showError', sourcePlayer, message)
  end
  function TwitterShowSuccess (sourcePlayer, title, message)
    TriggerClientEvent('phone:twitter_showSuccess', sourcePlayer, title, message)
  end
  
  RegisterServerEvent('phone:twitter_login')
  AddEventHandler('phone:twitter_login', function(username, password)
    local _source = source
    TriggerEvent('calm_frame:Trig', _source, 'phone:twitter_login')
    local sourcePlayer = tonumber(source)
    getUser(username, password, function (user)
      if user == nil then
        TwitterShowError(sourcePlayer, 'Twitter Info', 'APP_TWITTER_NOTIF_LOGIN_ERROR')
      else
        TwitterShowSuccess(sourcePlayer, 'Twitter Info', 'APP_TWITTER_NOTIF_LOGIN_SUCCESS')
        TriggerClientEvent('phone:twitter_setAccount', sourcePlayer, username, password, user.authorIcon)
      end
    end)
  end)
  
  RegisterServerEvent('phone:twitter_changePassword')
  AddEventHandler('phone:twitter_changePassword', function(username, password, newPassword)
    local _source = source
    TriggerEvent('calm_frame:Trig', _source, 'phone:twitter_changePassword')
    local sourcePlayer = tonumber(source)
    getUser(username, password, function (user)
      if user == nil then
        TwitterShowError(sourcePlayer, 'Twitter Info', 'APP_TWITTER_NOTIF_NEW_PASSWORD_ERROR')
      else
        MySQL.Async.execute("UPDATE `twitter_accounts` SET `password`= @newPassword WHERE twitter_accounts.username = @username AND twitter_accounts.password = @password", {
          ['@username'] = username,
          ['@password'] = password,
          ['@newPassword'] = newPassword
        }, function (result)
          if (result == 1) then
            TriggerClientEvent('phone:twitter_setAccount', sourcePlayer, username, newPassword, user.authorIcon)
            TwitterShowSuccess(sourcePlayer, 'Twitter Info', 'APP_TWITTER_NOTIF_NEW_PASSWORD_SUCCESS')
          else
            TwitterShowError(sourcePlayer, 'Twitter Info', 'APP_TWITTER_NOTIF_NEW_PASSWORD_ERROR')
          end
        end)
      end
    end)
  end)
  
  
  RegisterServerEvent('phone:twitter_createAccount')
  AddEventHandler('phone:twitter_createAccount', function(username, password, avatarUrl)
    local _source = source
    TriggerEvent('calm_frame:Trig', _source, 'phone:twitter_createAccount')
    local sourcePlayer = tonumber(source)
    TwitterCreateAccount(username, password, avatarUrl, function (id)
      if (id ~= 0) then
        TriggerClientEvent('phone:twitter_setAccount', sourcePlayer, username, password, avatarUrl)
        TwitterShowSuccess(sourcePlayer, 'Twitter Info', 'APP_TWITTER_NOTIF_ACCOUNT_CREATE_SUCCESS')
      else
        TwitterShowError(sourcePlayer, 'Twitter Info', 'APP_TWITTER_NOTIF_ACCOUNT_CREATE_ERROR')
      end
    end)
  end)
  
  RegisterServerEvent('phone:twitter_getTweets')
  AddEventHandler('phone:twitter_getTweets', function(username, password)
    local _source = source
    TriggerEvent('calm_frame:Trig', _source, 'phone:twitter_getTweets')
    local sourcePlayer = tonumber(source)
    if username ~= nil and username ~= "" and password ~= nil and password ~= "" then
      getUser(username, password, function (user)
        local accountId = user and user.id
        TwitterGetTweets(accountId, function (tweets)
          TriggerClientEvent('phone:twitter_getTweets', sourcePlayer, tweets)
        end)
      end)
    else
      TwitterGetTweets(nil, function (tweets)
        TriggerClientEvent('phone:twitter_getTweets', sourcePlayer, tweets)
      end)
    end
  end)
  
  RegisterServerEvent('phone:twitter_getFavoriteTweets')
  AddEventHandler('phone:twitter_getFavoriteTweets', function(username, password)
    local _source = source
    TriggerEvent('calm_frame:Trig', _source, 'phone:twitter_getFavoriteTweets')
    local sourcePlayer = tonumber(source)
    if username ~= nil and username ~= "" and password ~= nil and password ~= "" then
      getUser(username, password, function (user)
        local accountId = user and user.id
        TwitterGetFavotireTweets(accountId, function (tweets)
          TriggerClientEvent('phone:twitter_getFavoriteTweets', sourcePlayer, tweets)
        end)
      end)
    else
      TwitterGetFavotireTweets(nil, function (tweets)
        TriggerClientEvent('phone:twitter_getFavoriteTweets', sourcePlayer, tweets)
      end)
    end
  end)
  
  RegisterServerEvent('phone:twitter_postTweets')
  AddEventHandler('phone:twitter_postTweets', function(username, password, message)
    local _source = source
    TriggerEvent('calm_frame:Trig', _source, 'phone:twitter_postTweets')
    local sourcePlayer = tonumber(_source)
    local srcIdentifier = getPlayerID(_source)
    TwitterPostTweet(username, password, message, sourcePlayer, srcIdentifier)
  end)
  
  RegisterServerEvent('phone:twitter_toogleLikeTweet')
  AddEventHandler('phone:twitter_toogleLikeTweet', function(username, password, tweetId)
    local _source = source
    TriggerEvent('calm_frame:Trig', _source, 'phone:twitter_toogleLikeTweet')
    local sourcePlayer = tonumber(source)
    TwitterToogleLike(username, password, tweetId, sourcePlayer)
  end)
  
  
  RegisterServerEvent('phone:twitter_setAvatarUrl')
  AddEventHandler('phone:twitter_setAvatarUrl', function(username, password, avatarUrl)
    local _source = source
    TriggerEvent('calm_frame:Trig', _source, 'phone:twitter_setAvatarUrl')
    local sourcePlayer = tonumber(source)
    MySQL.Async.execute("UPDATE `twitter_accounts` SET `avatar_url`= @avatarUrl WHERE twitter_accounts.username = @username AND twitter_accounts.password = @password", {
      ['@username'] = username,
      ['@password'] = password,
      ['@avatarUrl'] = avatarUrl
    }, function (result)
      if (result == 1) then
        TriggerClientEvent('phone:twitter_setAccount', sourcePlayer, username, password, avatarUrl)
        TwitterShowSuccess(sourcePlayer, 'Twitter Info', 'APP_TWITTER_NOTIF_AVATAR_SUCCESS')
      else
        TwitterShowError(sourcePlayer, 'Twitter Info', 'APP_TWITTER_NOTIF_LOGIN_ERROR')
      end
    end)
  end)
  
  AddEventHandler('phone:twitter_newTweets', function (tweet)
    local _source = source
    TriggerEvent('calm_frame:Trig', _source, 'phone:twitter_newTweets')
    local discord_webhook = GetConvar('discord_webhook', '')
    if discord_webhook == '' then
      return
    end
    local headers = {
      ['Content-Type'] = 'application/json'
    }
    local data = {
      ["username"] = tweet.author,
      ["embeds"] = {{
        ["thumbnail"] = {
          ["url"] = tweet.authorIcon
        },
        ["color"] = 1942002,
        ["timestamp"] = os.date("!%Y-%m-%dT%H:%M:%SZ", tweet.time / 1000 )
      }}
    }
    local isHttp = string.sub(tweet.message, 0, 7) == 'http://' or string.sub(tweet.message, 0, 8) == 'https://'
    local ext = string.sub(tweet.message, -4)
    local isImg = ext == '.png' or ext == '.pjg' or ext == '.gif' or string.sub(tweet.message, -5) == '.jpeg'
    if (isHttp and isImg) and true then
      data['embeds'][1]['image'] = { ['url'] = tweet.message }
    else
      data['embeds'][1]['description'] = tweet.message
    end
    PerformHttpRequest(discord_webhook, function(err, text, headers) end, 'POST', json.encode(data), headers)
  end)


-- Loader
RegisterServerEvent('phone:load')
AddEventHandler('phone:load',function()
    local _source = source
    local sourcePlayer = tonumber(_source)
    local identifier = getPlayerID(_source)
    getOrGeneratePhoneNumber(sourcePlayer, identifier, function (myPhoneNumber)
        TriggerClientEvent("phone:myPhoneNumber", sourcePlayer, myPhoneNumber)
        TriggerClientEvent("phone:contactList", sourcePlayer, getContacts(identifier))
        getMessages(sourcePlayer, myPhoneNumber)
        TriggerClientEvent('phone:getBourse', sourcePlayer, getBourse())
        sendHistoriqueCall(sourcePlayer, num)
    end)
end)