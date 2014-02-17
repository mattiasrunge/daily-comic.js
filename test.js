var DailyComic = require("./index.js");

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