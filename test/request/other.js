
var purest = require('../../lib/provider'),
    providers = require('../../config/providers');


describe('verbs', function () {
    require('../utils/credentials');
    var cred = require('../../config/credentials');
    var p = {};
    before(function () {
        for (var name in providers) {
            var provider = providers[name];
            p[name] = new purest(provider.oauth
                ? {provider:name, key:cred.app[name].key, secret:cred.app[name].secret}
                : {provider:name});
        }
    });

    describe('options', function () {
        it('yahoo yql', function (done) {
            p.yahoo.get('yql', {
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
        it('yahoo geo', function (done) {
            p.yahoo.get("places.q('Central Park, New York')", {
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
        it('yagoo social', function (done) {
            p.yahoo.get('user/C6YWVTVM24O4SEGIIDLTWA5NUA/profile', {
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
