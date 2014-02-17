
var FeedParser = require("feedparser");
var Q = require("q");
var request = require("request");
var util = require("util");
var events = require("events");

module.exports = function(options) {
    events.EventEmitter.call(this);
    
    var comics = require("./comics.json");
    var latest = {};
    
    options = options || {};
    options.updateInterval = options.updateInterval || 3600 * 6; // Default every 6 hours
    options.subscriptions = options.subscriptions || Object.keys(comics);
    options.comics = options.comics || {};
    
    for (var comic in comics) {
        if (!options.comics[comic]) {
            options.comics[comic] = comics[comic];
        }
    }
    
    this._getList = function(url) {
        var deferred = Q.defer();
        var items = [];

        try {
            request(url, { proxy: process.env.http_proxy })
            .pipe(new FeedParser())
            .on("error", function(error) {
                deferred.reject(error);
            })
            .on("readable", function() {
                var item;

                while (item = this.read()) {
                    try {
                        item.summary = item.summary.replace(/\'/g, "'");
                        var urlGroup = item.summary.match(/<img.*?src="(.*?)"/);
                        var altGroup = item.summary.match(/<img.*?alt="(.*?)"/);

                        // Only add if we could parse an url
                        if (urlGroup.length > 1) {
                            items.push({
                                date: new Date(item.date),
                                title: item.title,
                                url: urlGroup[1],
                                text: altGroup && altGroup.length > 1 ? altGroup[1] : "",
                                link: item.link
                            });
                        }
                    } catch (e) {
                        // Just ignore bad data
                    }
                }
            })
            .on("end", function() {
                deferred.resolve(items);
            });
        } catch (e) {
            deferred.reject(e);
        }

        return deferred.promise;
    };
    
    this._checkSubscriptions = function() {
        for (var n = 0; n < options.subscriptions.length; n++) {
            var comic = options.subscriptions[n];
            
            if (!options.comics[comic]) {
                this.emit("error", "Unrecognized subscription, " + comic + ", valid are: " + Object.keys(options.comics).join(","));
                continue;
            }
            
            this._checkSubscription(comic);
        }
    };
    
    this._checkSubscription = function(comic) {
        this._getList(options.comics[comic])
        .then(function(list) {
            list.sort(function(a, b) {
                return b.date - a.date;
            });

            if (list.length > 0) {
                if (!latest[comic] || list[0].date - latest[comic].date !== 0) {
                    latest[comic] = list[0];
                
                    this.emit("new", comic, latest[comic]);
                }
            }
        }.bind(this))
        .catch(function(error) {
            this.emit("error", "Failed to get comic, " + error);
        }.bind(this));
    }
    
    this.get = function(comic) {
        return latest[comic];
    };
    
    setInterval(function() {
        this._checkSubscriptions();
    }.bind(this), options.updateInterval * 1000);
    
    this._checkSubscriptions();
}

util.inherits(module.exports, events.EventEmitter);
