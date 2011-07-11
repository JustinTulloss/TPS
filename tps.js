/* Copyright (C) 2011 by Justin Tulloss
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

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
