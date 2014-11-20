
var fs = require('fs'),
    path = require('path');
var Purest = require('../../lib/provider'),
    providers = require('../../config/providers');
var image = path.resolve(__dirname, '../fixtures/cat.png');


describe('defaults', function () {
    require('../utils/credentials');
    var cred = {
        app:require('../../config/app'),
        user:require('../../config/user')
    };
    var p = {};
    before(function () {
        for (var name in providers) {
            var provider = providers[name];
            p[name] = new Purest(provider.__provider.oauth
                ? {provider:name, key:cred.app[name].key, secret:cred.app[name].secret}
                : {provider:name});
        }
    });

    it('set defaults', function (done) {
        var defaults = {
            oauth: {
                consumer_key:cred.app.twitter.key,
                consumer_secret:cred.app.twitter.secret,
                token:cred.user.twitter.token,
                token_secret:cred.user.twitter.secret
            }
        };
        var twitter = new Purest({provider:'twitter', defaults:defaults})
        twitter.query()
            .select('users/show')
            .where({screen_name:'mightymob'})
            .request(function (err, res, body) {
                debugger;
                if (err) return error(err, done);
                body.id.should.equal(1504092505);
                body.screen_name.should.equal('mightymob');
                done();
            });
    });
});

function error (err, done) {
    return (err instanceof Error)
        ? done(err)
        : (console.log(err) || done(new Error('Network error!')));
}
