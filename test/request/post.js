
var purest = require('../../lib/provider'),
    providers = require('../../config/providers'),
    cred = require('../../config/credentials');


describe('post', function () {
    var p = {};
    before(function (done) {
        for (var name in providers) {
            var provider = providers[name];
            p[name] = new purest(provider.oauth
                ? {provider:name, key:cred.app[name].key, secret:cred.app[name].secret}
                : {provider:name});
        }
        done();
    });

    it.skip('post twitter resource', function (done) {
        p.twitter.post('statuses/update', {
            oauth:{token:cred.user.twitter.token, secret:cred.user.twitter.secret},
            form:{status:'Message on '+new Date()}
        },
        function (err, res, body) {
            if (err) return error(err, done);
            body.source.should.equal('<a href="http://outofindex.com" rel="nofollow">purest</a>');
            done();
        });
    });
    it.skip('post linkedin resource', function (done) {
        p.linkedin.post('people/~/shares', {
            oauth:{token:cred.user.linkedin.token, secret:cred.user.linkedin.secret},
            form:{
                comment:'Message on '+new Date(),
                visibility:{code:'anyone'}
            }
        },
        function (err, res, body) {
            if (err) return error(err, done);
            body.updateKey.should.match(/^UNIU-\d+-\d+-SHARE$/);
            body.updateUrl.should.match(/^http:.*/);
            done();
        });
    });
    it.skip('post facebook resource', function (done) {
        p.facebook.post('me/feed', {
            qs:{access_token: cred.user.facebook.token},
            form:{message: 'Message on '+new Date()}
        },
        function (err, res, body) {
            if (err) return error(err, done);
            body.id.should.match(/\d+_\d+/);
            done();
        });
    });
    it.skip('post stocktwits resource', function (done) {
        p.stocktwits.post('messages/create', {
            qs:{access_token: cred.user.stocktwits.token},
            form:{body: 'Message on '+new Date()}
        },
        function (err, res, body) {
            if (err) return error(err, done);
            body.message.source.id.should.equal(1348);
            body.message.source.title.should.equal('purest');
            done();
        });
    });
});

function error (err, done) {
    return (err instanceof Error)
        ? done(err)
        : (console.log(err) || done(new Error('Network error!')));
}
