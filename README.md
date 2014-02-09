daily-comic.js
==============

A small node.js module which makes it easy to subscribe to daily comic strips. Default support for Dilbert and XKCD.

## Usage

```javascript

var DailyComic = require("daily-comic.js");

var comic = new DailyComic({
    updateInterval: 3600 * 6,
    subscriptions: [ "xkcd", "dilbert" ]
});

comic.on("error", function(error) {
    console.log("error", error);
});

comic.on("new", function(comic, data) {
   console.log("new", comic, data);
});

setTimeout(function() {
    console.log("current xkcd", comic.get("xkcd"));
    console.log("current dilbert", comic.get("dilbert"));
}, 5000);

```

## Awesome comics
* [XKCD](http://xkcd.com/) [rss](http://xkcd.com/rss.xml)
* [Dilbert](http://www.dilbert.com/) [rss](http://rss.latunyi.com/dilbert.rss)
