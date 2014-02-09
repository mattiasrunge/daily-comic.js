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

daily.on("error", function(error) {
    console.log("error", error);
});

daily.on("new", function(comic, data) {
   console.log("new", comic, data);
});

console.log("current xkcd", daily.get("xkcd"));
console.log("current dilbert", daily.get("dilbert"));

```

## Awesome comics
* [XKCD](http://xkcd.com/)
* [XKCD RSS](http://xkcd.com/rss.xml)

* [Dilbert](http://www.dilbert.com/)
* [Dilbert RSS](http://rss.latunyi.com/dilbert.rss)
