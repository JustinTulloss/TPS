TPS
===

TPS (or tab pub/sub) is a simple way to communicate state changes between
multiple open tabs.

API
---

`Tps.subscribe(channel, callback)` - Subscribe to a channel. Everytime somebody
publishes something to `channel` (in a different browser tab), `callback` will
be called with the published data.

`Tps.publish(channel, data)` - Publish some data to a channel. All subscribers
(on other tabs) will be called back with `data`. Data can be anything, channel
must be a string.

Dependencies
------------
 - IE 8.0+ and all modern browsers
 - JSON. If running this on a browser that does not have built in JSON support,
you will need to [provide it](https://github.com/douglascrockford/JSON-js/blob/master/json2.js).


License
-------

 This is provided under the very permissive [MIT license](http://www.opensource.org/licenses/mit-license.php).
