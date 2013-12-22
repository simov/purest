
var fs = require('fs');
var should = require('should');

var TinyRest = require('../lib/tinyrest');
try {
    var cred = require('./credentials');
} catch (e) {
    var cred = null;
}


describe('tinyrest', function () {
    describe('methods', function () {
        // provider
        it('should throw an error on non specified provider', function (done) {
            (function () {
                var t = new TinyRest();
            }).should.throw('TinyRest: provider option is required!');
            done();
        });
        it('should throw an error on non existing provider', function (done) {
            (function () {
                var t = new TinyRest({provider:'dood'});
            }).should.throw('TinyRest: non existing provider!');
            done();
        });
        // ctor
        it('should create bily instance', function (done) {
            var t = new TinyRest({provider:'bitly'}, 'alabala');
            t.provider.bitly.should.equal(true);
            t.provider.version.should.equal('v3');
            t.provider.endpoint.should.equal('https://api-ssl.bitly.com');
            done();
        });
        it('should create stocktwits instance', function (done) {
            var t = new TinyRest({provider:'stocktwits'});
            t.provider.stocktwits.should.equal(true);
            t.provider.version.should.equal('2');
            t.provider.endpoint.should.equal('https://api.stocktwits.com');
            done();
        });
        it('should create linkedin instance', function (done) {
            var t = new TinyRest({provider:'linkedin'});
            t.provider.linkedin.should.equal(true);
            t.provider.version.should.equal('v1');
            t.provider.endpoint.should.equal('http://api.linkedin.com');
            done();
        });
        it('should create twitter instance', function (done) {
            var t = new TinyRest({provider:'twitter'});
            t.provider.twitter.should.equal(true);
            t.provider.version.should.equal('1.1');
            t.provider.endpoint.should.equal('https://api.twitter.com');
            done();
        });
        // path
        it('should create bitly path', function (done) {
            var t = new TinyRest({provider:'bitly'});
            t.provider.createPath('link/clicks')
                .should.equal('/v3/link/clicks');
            done();
        });
        it('should create stocktwits path', function (done) {
            var t = new TinyRest({provider:'stocktwits'});
            t.provider.createPath('account/verify')
                .should.equal('/api/2/account/verify.json');
            done();
        });
        it('should create linkedin path', function (done) {
            var t = new TinyRest({provider:'linkedin'});
            t.provider.createPath('people')
                .should.equal('/v1/people');
            done();
        });
        it('should create twitter path', function (done) {
            var t = new TinyRest({provider:'twitter'});
            t.provider.createPath('users/show')
                .should.equal('/1.1/users/show.json');
            done();
        });
        // querystring
        it('should create a querystring', function (done) {
            var t = new TinyRest({provider:'bitly'});
            t.toQueryString({one:'1',two:2})
                .should.equal('one=1&two=2');
            done();
        });
        // path+querystring
        it('should get bitly path', function (done) {
            var t = new TinyRest({provider:'bitly'});
            t.getPath('link/clicks',{link:'http://bitly.com/1cZKMQh'})
                .should.equal('/v3/link/clicks?link=http%3A%2F%2Fbitly.com%2F1cZKMQh');
            done();
        });
        it('should get stocktwits path', function (done) {
            var t = new TinyRest({provider:'stocktwits'});
            t.getPath('search',{q:'stocktwits'})
                .should.equal('/api/2/search.json?q=stocktwits');
            done();
        });
        it('should get linkedin path', function (done) {
            var t = new TinyRest({provider:'linkedin'});
            t.getPath('companies',{'email-domain':'apple.com'})
                .should.equal('/v1/companies?email-domain=apple.com');
            done();
        });
        it('should get twitter path', function (done) {
            var t = new TinyRest({provider:'twitter'});
            t.getPath('users/show',{'screen_name':'mightymob'})
                .should.equal('/1.1/users/show.json?screen_name=mightymob');
            done();
        });
    });
    describe.skip('api error', function () {
        it('should return stocktwits api error', function (done) {
            var t = new TinyRest({provider:'stocktwits'});
            t.get('streams/user/nonexisting', function (err, res, body) {
                err.response.status.should.equal(404);
                err.errors[0].message.should.equal('User not found');
                done();
            });
        });
    });
    // get
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
    });
    // post
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
    // upload
    describe.skip('upload', function () {
        it('should upload image to twitter', function (done) {
            var t = new TinyRest({provider:'twitter',
                consumerKey:cred.app.twitter.key,
                consumerSecret:cred.app.twitter.secret});
            t.post('statuses/update_with_media', {
                t_token:cred.user.twitter.token,
                t_secret:cred.user.twitter.secret,
                t_mime:'image/jpeg'
            }, {
                status:'Message on '+new Date(),
                'media[]':fs.readFileSync('/home/mighty/hdd/images/cat4.jpg')
            },
            function (err, res, body) {
                if (err) return (err instanceof Error) ? done(err) : (console.log(err)||done(new Error('Network error!')));
                console.log(body);
                body.source.should.equal('<a href="http://outofindex.com" rel="nofollow">TinyRest</a>');
                body.entities.media[0].should.be.an.instanceOf(Object);
                done();
            });
        });
    });
});
