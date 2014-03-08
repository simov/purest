
var TinyRest = require('../../lib/tinyrest'),
    providers = require('../../config/providers'),
    cred = require('../credentials');


describe('other http operations', function () {
    var t = {};
    before(function (done) {
        for (var name in providers) {
            var provider = providers[name];
            if (provider.oauth) {
                t[name] = new TinyRest({provider:name,
                    consumerKey:cred.app[name].key,
                    consumerSecret:cred.app[name].secret
                });
            } else {
                t[name] = new TinyRest({provider:name});
            }
        }
        done();
    });

    describe('options', function () {
        it.skip('should get yql resource', function (done) {
            t.yahoo.get('yql', {
                method:'OPTIONS',
                oauth:{
                    token:cred.user.yahoo.token, secret:cred.user.yahoo.secret
                },
                api:'query'
            }, function (err, res, body) {
                if (err) return error(err, done);
                res.headers.allow
                    .should.equal('GET, HEAD, POST, PUT, DELETE, TRACE, OPTIONS');
                done();
            });
        });
        it.skip('should get geo resource', function (done) {
            t.yahoo.get("places.q('Central Park, New York')", {
                method:'OPTIONS',
                api:'where'
            }, function (err, res, body) {
                if (err) return error(err, done);
                res.headers.allow.should.equal('GET,HEAD,POST,OPTIONS')
                done();
            });
        });
    });

    describe('head', function () {
        it.skip('should get social resource', function (done) {
            t.yahoo.get('user/C6YWVTVM24O4SEGIIDLTWA5NUA/profile', {
                method:'HEAD',
                oauth:{
                    token:cred.user.yahoo.token, secret:cred.user.yahoo.secret
                },
                api:'social'
            }, function (err, res, body) {
                debugger;
                if (err) return error(err, done);
                // ??
                done();
            });
        });
    });

    describe('put', function () {
        
    });

    describe('delete', function () {
        
    });
});

function error (err, done) {
    return (err instanceof Error)
        ? done(err)
        : (console.log(err) || done(new Error('Network error!')));
}
