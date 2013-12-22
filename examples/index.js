
var TinyRest = require('../lib/tinyrest'),
    cred = require('../test/credentials');


var linkedin = new TinyRest({
    provider:'linkedin',
    consumerKey:cred.app.linkedin.key,
    consumerSecret:cred.app.linkedin.secret
});

(function () {
    linkedin.get('people/id=4cmQvrxtRR', {
        t_token:cred.user.linkedin.token,
        t_secret:cred.user.linkedin.secret
    }, function (err, res, body) {
        console.log(body);
    });

    linkedin.get('people/id=pxHPwSchVu', {
        t_token:cred.user.linkedin.token,
        t_secret:cred.user.linkedin.secret
    }, function (err, res, body) {
        console.log(body);
    });
});


var twitter = new TinyRest({
    provider:'twitter',
    consumerKey:cred.app.twitter.key,
    consumerSecret:cred.app.twitter.secret
});

(function () {
    twitter.get('statuses/user_timeline', {
        t_token:cred.user.twitter.token,
        t_secret:cred.user.twitter.secret
    }, function (err, res, body) {
        debugger;
        console.log(body);
    });
}());
