
var cred = require('../../test/credentials');


exports = module.exports = function (t) {
    return {
        0: function () {
            t.get('user/info', {
                access_token:cred.user.bitly.token
            }, function (err, res, body) {
                debugger;
                console.log(body);
            });
        },
        1: function () {
            t.get('shorten', {
                access_token:cred.user.bitly.token,
                longUrl:'http://simov.github.io'
            }, function (err, res, body) {
                debugger;
                console.log(body);
            });
        },
        2: function () {
            t.get('bitly_pro_domain', {
                access_token:cred.user.bitly.token,
                domain:'buswk.co'
            }, function (err, res, body) {
                debugger;
                console.log(body);
            });
        },
        3: function () {
            t.get('link/clicks', {
                access_token:cred.user.bitly.token,
                link:'http://nyti.ms/ItXWMo'
            }, function (err, res, body) {
                debugger;
                console.log(body);
            });
        },
        4: function () {
            t.get('info', {
                access_token:cred.user.bitly.token,
                shortUrl:'http://nyti.ms/ItXWMo'
            }, function (err, res, body) {
                debugger;
                console.log(body);
            });
        }
    };
}
