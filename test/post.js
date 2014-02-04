
var TinyRest = require('../lib/tinyrest'),
    cred = require('./credentials');


describe.skip('post', function () {
    it('should post stocktwits resource', function (done) {
        var t = new TinyRest({provider:'stocktwits'});
        t.post('messages/create',
            {access_token: cred.user.stocktwits.token},
            {body: 'Message on '+new Date()},
        function (err, res, body) {
            if (err) return (err instanceof Error) ? done(err) : (console.log(err)||done(new Error('Network error!')));
            body.message.source.id.should.equal(1348);
            body.message.source.title.should.equal('TinyRest');
            done();
        });
    });
    it('should post facebook resource', function (done) {
        var t = new TinyRest({provider:'facebook'});
        t.post('me/feed',
            {access_token: cred.user.facebook.token},
            {message: 'Message on '+new Date()},
        function (err, res, body) {
            if (err) return (err instanceof Error) ? done(err) : (console.log(err)||done(new Error('Network error!')));
            body.id.should.be.instanceOf(String);
            done();
        });
    });
    it('should post linkedin resource', function (done) {
        var t = new TinyRest({provider:'linkedin',
            consumerKey:cred.app.linkedin.key,
            consumerSecret:cred.app.linkedin.secret});
        t.post('people/~/shares', {
            t_token:cred.user.linkedin.token,
            t_secret:cred.user.linkedin.secret
        }, {
            comment:'Message on '+new Date(),
            visibility:{code:'anyone'}
        },
        function (err, res, body) {
            if (err) return (err instanceof Error) ? done(err) : (console.log(err)||done(new Error('Network error!')));
            body.updateKey.should.match(/^UNIU-\d+-\d+-SHARE$/);
            body.updateUrl.should.match(/^http:.*/);
            done();
        });
    });
    it('should post twitter resource', function (done) {
        var t = new TinyRest({provider:'twitter',
            consumerKey:cred.app.twitter.key,
            consumerSecret:cred.app.twitter.secret});
        t.post('statuses/update', {
            t_token:cred.user.twitter.token,
            t_secret:cred.user.twitter.secret
        }, {
            status:'Message on '+new Date()
        },
        function (err, res, body) {
            if (err) return (err instanceof Error) ? done(err) : (console.log(err)||done(new Error('Network error!')));
            body.source.should.equal('<a href="http://outofindex.com" rel="nofollow">TinyRest</a>');
            done();
        });
    });
});
