
var TinyRest = require('../../lib/provider'),
    providers = require('../../config/providers'),
    cred = require('../../config/credentials');


describe('post', function () {
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
    it.skip('should post twitter resource', function (done) {
        t.twitter.post('statuses/update', {
            oauth:{token:cred.user.twitter.token, secret:cred.user.twitter.secret},
            form:{status:'Message on '+new Date()}
        },
        function (err, res, body) {
            if (err) return error(err, done);
            body.source.should.equal('<a href="http://outofindex.com" rel="nofollow">TinyRest</a>');
            done();
        });
    });
    it.skip('should post linkedin resource', function (done) {
        t.linkedin.post('people/~/shares', {
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
    it.skip('should post facebook resource', function (done) {
        t.facebook.post('me/feed', {
            qs:{access_token: cred.user.facebook.token},
            form:{message: 'Message on '+new Date()}
        },
        function (err, res, body) {
            if (err) return error(err, done);
            body.id.should.match(/\d+_\d+/);
            done();
        });
    });
    it.skip('should post stocktwits resource', function (done) {
        t.stocktwits.post('messages/create', {
            qs:{access_token: cred.user.stocktwits.token},
            form:{body: 'Message on '+new Date()}
        },
        function (err, res, body) {
            if (err) return error(err, done);
            body.message.source.id.should.equal(1348);
            body.message.source.title.should.equal('TinyRest');
            done();
        });
    });
});

function error (err, done) {
    return (err instanceof Error)
        ? done(err)
        : (console.log(err) || done(new Error('Network error!')));
}
