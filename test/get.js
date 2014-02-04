
var TinyRest = require('../lib/tinyrest'),
    cred = require('./credentials');


describe.skip('get', function () {
    it('should get bitly resource', function (done) {
        var t = new TinyRest({provider:'bitly'});
        t.get('bitly_pro_domain', {access_token:cred.user.bitly.token,domain:'nyti.ms'}, function (err, res, body) {
            if (err) return (err instanceof Error) ? done(err) : (console.log(err)||done(new Error('Network error!')));
            body.data.domain.should.equal('nyti.ms');
            body.data.bitly_pro_domain.should.equal(true);
            done();
        });
    });
    it('should get stocktwits resource', function (done) {
        var t = new TinyRest({provider:'stocktwits'});
        t.get('streams/user/StockTwits', function (err, res, body) {
            if (err) return (err instanceof Error) ? done(err) : (console.log(err)||done(new Error('Network error!')));
            body.response.status.should.equal(200);
            body.messages.length.should.equal(30);
            done();
        });
    });
    it('should get facebook resource', function (done) {
        var t = new TinyRest({provider:'facebook'});
        t.get('me/groups', {access_token:cred.user.facebook.token, fields:'id,name'}, function (err, res, body) {
            if (err) return (err instanceof Error) ? done(err) : (console.log(err)||done(new Error('Network error!')));
            body.data.length.should.equal(2);
            Object.keys(body.data[0]).length.should.equal(2);
            body.data[0].id.should.equal('313807222041302');
            body.data[0].name.should.equal('Facebook Developers');
            done();
        });
    });
    it('should get facebook fql resource', function (done) {
        var t = new TinyRest({provider:'facebook'});
        t.get('fql', {access_token:cred.user.facebook.token,
            q:'SELECT friend_count FROM user WHERE uid = 100006399333306'}, function (err, res, body) {
            if (err) return (err instanceof Error) ? done(err) : (console.log(err)||done(new Error('Network error!')));
            body.data[0].friend_count.should.equal(1);
            done();
        });
    });
    it('should get rubygems resource', function (done) {
        var t = new TinyRest({provider:'rubygems'});
        t.get('gems/rails', function (err, res, body) {
            if (err) return (err instanceof Error) ? done(err) : (console.log(err)||done(new Error('Network error!')));
            body.name.should.equal('rails');
            body.platform.should.equal('ruby');
            done();
        });
    });
    it('should get linkedin resource', function (done) {
        var t = new TinyRest({provider:'linkedin',
            consumerKey:cred.app.linkedin.key,
            consumerSecret:cred.app.linkedin.secret});
        t.get('companies', {
            t_token:cred.user.linkedin.token,
            t_secret:cred.user.linkedin.secret,
            'email-domain':'apple.com'
        }, function (err, res, body) {
            if (err) return (err instanceof Error) ? done(err) : (console.log(err)||done(new Error('Network error!')));
            body.values[0].id.should.equal(162479);
            body.values[0].name.should.equal('Apple');
            done();
        });
    });
    it('should get twitter resource', function (done) {
        var t = new TinyRest({provider:'twitter',
            consumerKey:cred.app.twitter.key,
            consumerSecret:cred.app.twitter.secret});
        t.get('users/show', {
            t_token:cred.user.twitter.token,
            t_secret:cred.user.twitter.secret,
            screen_name:'mightymob'
        }, function (err, res, body) {
            if (err) return (err instanceof Error) ? done(err) : (console.log(err)||done(new Error('Network error!')));
            body.id.should.equal(1504092505);
            body.screen_name.should.equal('mightymob');
            done();
        });
    });
    it('should get soundcloud resource', function (done) {
        var t = new TinyRest({provider:'soundcloud'});
        t.get('users', {oauth_token:cred.user.soundcloud.token, q:'thriftworks'}, function (err, res, body) {
            if (err) return (err instanceof Error) ? done(err) : (console.log(err)||done(new Error('Network error!')));
            body[0].username.should.equal('Thriftworks');
            done();
        });
    });
});
