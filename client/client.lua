local isReady = false

local VALID_POSITIONS = {
    ['top']          = true,
    ['top-left']     = true,
    ['top-right']    = true,
    ['bottom']       = true,
    ['bottom-left']  = true,
    ['bottom-right'] = true,
    ['left']         = true,
    ['right']        = true,
}

local VALID_TYPES = {
    ['success'] = true,
    ['error']   = true,
    ['warning'] = true,
    ['info']    = true,
}

-- ─── Send config to NUI once the page is loaded ───────────────────────────────
AddEventHandler('onClientResourceStart', function(resourceName)
    if resourceName ~= GetCurrentResourceName() then return end

    SetTimeout(500, function()
        SendNUIMessage({
            action          = 'auzzie_notify_init',
            defaultPosition = Config.Position,
            maxCount        = Config.MaxNotifications,
            colors          = Config.Colors,
            icons           = Config.Icons,
            duration        = Config.Duration,
        })
        isReady = true
    end)
end)

-- ─── Core send function ───────────────────────────────────────────────────────
local function sendNotify(notifyType, message, position, duration)
    if not isReady then
        SetTimeout(600, function() sendNotify(notifyType, message, position, duration) end)
        return
    end

    -- Validate / fallback type
    if not VALID_TYPES[notifyType] then
        notifyType = 'info'
    end

    -- Validate / fallback position  (nil → use Config.Position default in NUI)
    if position ~= nil and not VALID_POSITIONS[position] then
        print(('[auzzie_notify] Invalid position "%s" — falling back to config default.'):format(tostring(position)))
        position = nil
    end

    SendNUIMessage({
        action   = 'auzzie_notify',
        type     = notifyType,
        message  = tostring(message),
        position = position,   -- nil means "use default"
        duration = duration or Config.Duration[notifyType] or 5000,
    })
end

-- ─── Exports ──────────────────────────────────────────────────────────────────
exports('Notify', function(notifyType, message, position, duration)
    sendNotify(notifyType, message, position, duration)
end)

exports('Success', function(message, position, duration)
    sendNotify('success', message, position, duration)
end)

exports('Error', function(message, position, duration)
    sendNotify('error', message, position, duration)
end)

exports('Warning', function(message, position, duration)
    sendNotify('warning', message, position, duration)
end)

exports('Info', function(message, position, duration)
    sendNotify('info', message, position, duration)
end)

-- ─── Net event (server → client / client → client) ───────────────────────────
RegisterNetEvent('auzzie_notify:client', function(type, message, position, duration)
    sendNotify(type, message, position, duration)
end)

-- ─── NUI ready callback ───────────────────────────────────────────────────────
RegisterNUICallback('nuiReady', function(_, cb)
    isReady = true
    cb('ok')
end)


Citizen.CreateThread(function()

    while true do
        Citizen.Wait(0)
        if IsControlJustReleased(0, 288) then -- F1 key
            sendNotify('success', 'This is a success notification!', 'top-right')
            sendNotify('error', 'This is an error notification!', 'top-left')
            sendNotify('warning', 'This is a warning notification!', 'bottom-left')
            sendNotify('info', 'This is an info notification!', 'bottom-right')
            sendNotify('success', 'This is a success notification!', 'bottom')
            sendNotify('error', 'This is an error notification!', 'top')
            sendNotify('warning', 'This is a warning notification!', 'left')
            sendNotify('info', 'This is an info notification!', 'right')
        end
    end
end)
