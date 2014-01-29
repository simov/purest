
var TinyRest = require('../lib/tinyrest'),
    cred = require('../test/credentials');


if (!process.argv[2]) {
    return console.log('Pass in a social network!');
}
if (!process.argv[3]) {
    return console.log('Specify an example index to execute!');
}

var network = process.argv[2],
    index = parseInt(process.argv[3]);

var t = new TinyRest({
    provider:network,
    consumerKey:cred.app[network].key,
    consumerSecret:cred.app[network].secret
});

var example = require('./'+network)(t);

if (example[index] == undefined) {
    return console.log('Specified example index does not exist!');
}

example[index]();
