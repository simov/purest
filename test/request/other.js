
var purest = require('../../lib/provider'),
    providers = require('../../config/providers');


describe('verbs', function () {
    require('../utils/credentials');
    var cred = {
        app:require('../../config/app'),
        user:require('../../config/user')
    };
    var p = {};
    before(function () {
        for (var name in providers) {
            var provider = providers[name];
            p[name] = new purest(provider.__provider.oauth
                ? {provider:name, key:cred.app[name].key, secret:cred.app[name].secret}
                : {provider:name});
        }
    });

    describe('absolute url', function () {
        it('aboutme', function (done) {
            p.aboutme.get('https://api.about.me/api/v2/json/user/view/simeonv', {
                headers:{Authorization:'Basic '+cred.user.aboutme.apikey}
            }, function (err, res, body) {
                debugger;
                if (err) return error(err, done);
                body.user_name.should.equal('simeonv');
                done();
            });
        });
    });

    describe('options', function () {
        it('yahoo', function (done) {
            p.yahoo.get('yql', {
                api:'yql',
                method:'OPTIONS',
                oauth:{
                    token:cred.user.yahoo.token, secret:cred.user.yahoo.secret
                }
            }, function (err, res, body) {
                if (err) return error(err, done);
                res.headers.allow
                    .should.equal('GET, HEAD, POST, PUT, DELETE, TRACE, OPTIONS');
                done();
            });
        });
    });

    describe('head', function () {
        
    });

    describe('put', function () {
        
    });

    describe('delete', function () {
        
    });

    describe('patch', function () {
        
    });
});

function error (err, done) {
    return (err instanceof Error)
        ? done(err)
        : (console.log(err) || done(new Error('Network error!')));
}
