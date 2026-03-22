RegisterNetEvent('auzzie_notify:server', function(target, type,message,position,duration)
    if target and GetPlayerFromServerId(target) then
        TriggerClientEvent('auzzie_notify:client', target, type, message, position, duration)
    end
end)