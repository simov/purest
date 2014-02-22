
var TinyRest = require('../lib/tinyrest'),
    cred = require('./credentials');


describe.skip('get', function () {
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
            google: new TinyRest({provider:'google'}),
            rubygems: new TinyRest({provider:'rubygems'}),
            coderbits: new TinyRest({provider:'coderbits'})
        };
        done();
    });
    it('should get twitter resource', function (done) {
        t.twitter.get('users/show', {
            options:{token:cred.user.twitter.token, secret:cred.user.twitter.secret},
            params:{screen_name:'mightymob'}
        }, function (err, res, body) {
            if (err) return error(err, done);
            body.id.should.equal(1504092505);
            body.screen_name.should.equal('mightymob');
            done();
        });
    });
    it('should get linkedin resource', function (done) {
        t.linkedin.get('companies', {
            options:{token:cred.user.linkedin.token, secret:cred.user.linkedin.secret},
            params:{'email-domain':'apple.com'}
        }, function (err, res, body) {
            if (err) return error(err, done);
            body.values[0].id.should.equal(162479);
            body.values[0].name.should.equal('Apple');
            done();
        });
    });
    it('should get facebook resource', function (done) {
        t.facebook.get('me/groups', {
            params:{access_token:cred.user.facebook.token, fields:'id,name'}
        }, function (err, res, body) {
            if (err) return error(err, done);
            body.data.length.should.equal(2);
            Object.keys(body.data[0]).length.should.equal(2);
            body.data[0].id.should.equal('313807222041302');
            body.data[0].name.should.equal('Facebook Developers');
            done();
        });
    });
    it('should get facebook fql resource', function (done) {
        t.facebook.get('fql', {params:{
            access_token:cred.user.facebook.token,
            q:'SELECT friend_count FROM user WHERE uid = 100006399333306'}
        }, function (err, res, body) {
            if (err) return error(err, done);
            body.data[0].friend_count.should.equal(1);
            done();
        });
    });
    it('should get bitly resource', function (done) {
        t.bitly.get('bitly_pro_domain', {
            params:{access_token:cred.user.bitly.token, domain:'nyti.ms'}
        }, function (err, res, body) {
            if (err) return error(err, done);
            body.data.domain.should.equal('nyti.ms');
            body.data.bitly_pro_domain.should.equal(true);
            done();
        });
    });
    it('should get stocktwits resource', function (done) {
        t.stocktwits.get('streams/user/StockTwits', function (err, res, body) {
            if (err) return error(err, done);
            body.response.status.should.equal(200);
            body.messages.length.should.equal(30);
            done();
        });
    });
    it('should get soundcloud resource', function (done) {
        t.soundcloud.get('users', {
            params:{oauth_token:cred.user.soundcloud.token, q:'thriftworks'}
        }, function (err, res, body) {
            if (err) return error(err, done);
            body[0].username.should.equal('Thriftworks');
            done();
        });
    });
    it('should get github resource', function (done) {
        t.github.get('users/simov', {
            params:{access_token:cred.user.github.token}
        }, function (err, res, body) {
            if (err) return error(err, done);
            body.login.should.equal('simov');
            body.name.should.equal('simo');
            done();
        });
    });
    it('should get stackexchange resource', function (done) {
        t.stackexchange.get('users', {
            params:{
                key:cred.app.stackexchange.req_key,
                access_token:cred.user.stackexchange.token,
                site:'stackoverflow',
                sort:'reputation',
                order:'desc'
            }
        }, function (err, res, body) {
            if (err) return error(err, done);
            body.items.length.should.equal(30);
            done();
        });
    });
    it('should get google+ resource', function (done) {
        t.google.get('people/101800879428372142716', {
            options:{api:'plus'},
            params:{
                access_token:cred.user.google.token
            }
        }, function (err, res, body) {
            if (err) return error(err, done);
            body.displayName.should.equal('Simeon Velichkov');
            done();
        });
    });
    it('should get youtube resource', function (done) {
        t.google.get('channels', {
            options:{api:'youtube'},
            params:{
                access_token:cred.user.google.token,
                part:'id,statistics',
                id:'UCar6nMFGfuv254zn5vDyVaA'
            }
        }, function (err, res, body) {
            if (err) return error(err, done);
            body.items[0].id.should.equal('UCar6nMFGfuv254zn5vDyVaA');
            done();
        });
    });
    it('should get drive resource', function (done) {
        t.google.get('about', {
            options:{api:'drive'},
            params:{
                access_token:cred.user.google.token
            }
        }, function (err, res, body) {
            if (err) return error(err, done);
            body.user.isAuthenticatedUser.should.equal(true);
            done();
        });
    });
    it('should get freebase resource', function (done) {
        t.google.get('search', {
            options:{api:'freebase'},
            params:{
                access_token:cred.user.google.token,
                query:'Thriftworks'
            }
        }, function (err, res, body) {
            if (err) return error(err, done);
            body.result[0].name.should.equal('Thriftworks');
            done();
        });
    });
    it('should get rubygems resource', function (done) {
        t.rubygems.get('gems/rails', function (err, res, body) {
            if (err) return error(err, done);
            body.name.should.equal('rails');
            body.platform.should.equal('ruby');
            done();
        });
    });
    it('should get coderbits resource', function (done) {
        t.coderbits.get('simov', function (err, res, body) {
            if (err) return error(err, done);
            body.username.should.equal('simov');
            done();
        });
    });
});

function error (err, done) {
    return (err instanceof Error)
        ? done(err)
        : (console.log(err) || done(new Error('Network error!')));
}
