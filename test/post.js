
var TinyRest = require('../lib/tinyrest'),
    cred = require('./credentials');


describe.skip('post', function () {
    var t = null;
    before(function (done) {
        t = {
            twitter: new TinyRest({provider:'twitter',
                consumerKey:cred.app.twitter.key,
                consumerSecret:cred.app.twitter.secret
            }),
            linkedin: new TinyRest({provider:'linkedin',
                consumerKey:cred.app.linkedin.key,
                consumerSecret:cred.app.linkedin.secret
            }),
            facebook: new TinyRest({provider:'facebook'}),
            bitly: new TinyRest({provider:'bitly'}),
            stocktwits: new TinyRest({provider:'stocktwits'}),
            soundcloud: new TinyRest({provider:'soundcloud'}),
            github: new TinyRest({provider:'github'}),
            stackexchange: new TinyRest({provider:'stackexchange'}),
            rubygems: new TinyRest({provider:'rubygems'})
        };
        done();
    });
    it('should post twitter resource', function (done) {
        t.twitter.post('statuses/update', {
            options:{token:cred.user.twitter.token, secret:cred.user.twitter.secret},
            data:{status:'Message on '+new Date()}
        },
        function (err, res, body) {
            if (err) return error(err, done);
            body.source.should.equal('<a href="http://outofindex.com" rel="nofollow">TinyRest</a>');
            done();
        });
    });
    it('should post linkedin resource', function (done) {
        t.linkedin.post('people/~/shares', {
            options:{token:cred.user.linkedin.token, secret:cred.user.linkedin.secret},
            data:{
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
    it('should post facebook resource', function (done) {
        t.facebook.post('me/feed', {
            params:{access_token: cred.user.facebook.token},
            data:{message: 'Message on '+new Date()}
        },
        function (err, res, body) {
            if (err) return error(err, done);
            body.id.should.match(/\d+_\d+/);
            done();
        });
    });
    it('should post stocktwits resource', function (done) {
        t.stocktwits.post('messages/create', {
            params:{access_token: cred.user.stocktwits.token},
            data:{body: 'Message on '+new Date()}
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
