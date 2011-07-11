(function() {
    var root = this;
    function throwNotSupported() {
        throw new Error("Local storage is not supported");
    }

    if (!root.localStorage) {
        // Not enabled, do something harmless
        root.Tps = {
            publish: throwNotSupported,
            subscribe: throwNotSupported
        };
        return;
    }

    var storage = root.localStorage;
    var subscribers = {};

    function handleStorageEvent(e) {
        var i, subscriber;
        var message = JSON.parse(e.newValue);
        var channelSubscribers = subscribers[e.key];
        if (channelSubscribers) {
            for (i=0; i < channelSubscribers.length; i++) {
                subscriber = channelSubscribers[i];
                subscriber(message);
            }
        }
    }

    if (root.addEventListener) {
        root.addEventListener('storage', handleStorageEvent, false);
    }
    else if (root.attachEvent) { // IE8
        root.attachEvent("onstorage", function() {
            handleStorageEvent.call(this, root.event);
        });
    }

    function realChannelName(channel) {
        return 'tps_' + channel;
    }

    root.Tps = {
        subscribe: function(channel, callback) {
            channel = realChannelName(channel);
            if (!subscribers[channel]) {
                subscribers[channel] = [];
            }
            subscribers[channel].push(callback);
        },
        publish: function(channel, payload) {
            channel = realChannelName(channel);
            storage[channel] = JSON.stringify(payload);
        }
    };
})();
