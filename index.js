var Twit = require('twit');
var aerospike = require('aerospike');
var config = require('./config');

// Connect to aerospike cluster
var client = aerospike.client({
    hosts: [ { addr: config.aerospike.address, port: config.aerospike.port } ]
}).connect();

createTwitterStream().on('tweet', function(tweet) {
    console.log('tweet', tweet);

    var key = aerospike.key('demo','twitter', tweet.id);

    client.put(key, {text: tweet.text}, function(err, key) {
        console.log('tweet inserted with key ', key);
    });
});


function createTwitterStream() {
    var T = new Twit({
        consumer_key: config.twitter.consumer_key,
        consumer_secret: config.twitter.consumer_secret,
        access_token: config.twitter.access_token,
        access_token_secret: config.twitter.access_token_secret
    });

    return T.stream('statuses/sample');
}
