
var should = require('should');
var TinyRest = require('../lib/tinyrest');
try {
    var cred = require('./access-tokens');
} catch (e) {
    var cred = null;
}


describe('tinyrest', function () {
    it('should throw an error on non specified provider', function (done) {
        (function () {
            var tr = new TinyRest();
        }).should.throw('TinyRest: provider option is required!');
        done();
    });
    it('should throw an error on non existing provider', function (done) {
        (function () {
            var tr = new TinyRest({provider:'dood'});
        }).should.throw('TinyRest: non existing provider!');
        done();
    });
    it('should create bily instance', function (done) {
        var tr = new TinyRest({provider:'bitly'}, 'alabala');
        tr.provider.version.should.equal('v3');
        tr.provider.endpoint.should.equal('https://api-ssl.bitly.com');
        done();
    });
    it('should create stocktwits instance', function (done) {
        var tr = new TinyRest({provider:'stocktwits'});
        tr.provider.version.should.equal('2');
        tr.provider.endpoint.should.equal('https://api.stocktwits.com');
        done();
    });
    it('should create linkedin instance', function (done) {
        var tr = new TinyRest({provider:'linkedin'});
        tr.provider.version.should.equal('v1');
        tr.provider.endpoint.should.equal('http://api.linkedin.com');
        done();
    });
    it('should create twitter instance', function (done) {
        var tr = new TinyRest({provider:'twitter'});
        tr.provider.version.should.equal('1.1');
        tr.provider.endpoint.should.equal('https://api.twitter.com');
        done();
    });
    it('should create bitly path', function (done) {
        var tr = new TinyRest({provider:'bitly'});
        tr.provider.createPath('link/clicks')
            .should.equal('/v3/link/clicks');
        done();
    });
    it('should create stocktwits path', function (done) {
        var tr = new TinyRest({provider:'stocktwits'});
        tr.provider.createPath('account/verify')
            .should.equal('/api/2/account/verify.json');
        done();
    });
    it('should create linkedin path', function (done) {
        var tr = new TinyRest({provider:'linkedin'});
        tr.provider.createPath('people')
            .should.equal('/v1/people');
        done();
    });
    it('should create twitter path', function (done) {
        var tr = new TinyRest({provider:'twitter'});
        tr.provider.createPath('users/show')
            .should.equal('/1.1/users/show.json');
        done();
    });
    it('should create a querystring', function (done) {
        var tr = new TinyRest({provider:'bitly'});
        tr.toQueryString({one:'1',two:2})
            .should.equal('one=1&two=2');
        done();
    });
    it('should get bitly path', function (done) {
        var tr = new TinyRest({provider:'bitly'});
        tr.getPath('link/clicks',{link:'http://bitly.com/1cZKMQh'})
            .should.equal('/v3/link/clicks?link=http://bitly.com/1cZKMQh');
        done();
    });
    it('should get stocktwits path', function (done) {
        var tr = new TinyRest({provider:'stocktwits'});
        tr.getPath('search',{q:'stocktwits'})
            .should.equal('/api/2/search.json?q=stocktwits');
        done();
    });
    it('should get linkedin path', function (done) {
        var tr = new TinyRest({provider:'linkedin'});
        tr.getPath('companies',{'email-domain':'apple.com'})
            .should.equal('/v1/companies?email-domain=apple.com');
        done();
    });
    it('should get twitter path', function (done) {
        var tr = new TinyRest({provider:'twitter'});
        tr.getPath('users/show',{'screen_name':'mightymob'})
            .should.equal('/1.1/users/show.json?screen_name=mightymob');
        done();
    });
    it('should get bitly resource', function (done) {
        var tr = new TinyRest({provider:'bitly'});
        tr.get('bitly_pro_domain', {access_token:cred.bitly,domain:'nyti.ms'}, function (err, data, res) {
            if (err) return (err instanceof Error) ? done(err) : (console.log(err)||done(new Error('Network error!')));
            data.data.domain.should.equal('nyti.ms');
            data.data.bitly_pro_domain.should.equal(true);
            done();
        });
    });
    it('should get stocktwits resource', function (done) {
        var tr = new TinyRest({provider:'stocktwits'});
        tr.get('streams/user/StockTwits', function (err, data, res) {
            if (err) return (err instanceof Error) ? done(err) : (console.log(err)||done(new Error('Network error!')));
            data.response.status.should.equal(200);
            data.messages.length.should.equal(30);
            done();
        });
    });
    it('should get linkedin resource', function (done) {
        var tr = new TinyRest({provider:'linkedin',
            consumerKey:cred.linkedin.consumer.key,
            consumerSecret:cred.linkedin.consumer.secret});
        tr.get('companies', {
            oauth_token:cred.linkedin.user.token,
            oauth_token_secret:cred.linkedin.user.secret,
            'email-domain':'apple.com'
        }, function (err, data, res) {
            if (err) return (err instanceof Error) ? done(err) : (console.log(err)||done(new Error('Network error!')));
            data.values[0].id.should.equal(162479);
            data.values[0].name.should.equal('Apple');
            done();
        });
    });
    it('should get twitter resource', function (done) {
        var tr = new TinyRest({provider:'twitter',
            consumerKey:cred.twitter.consumer.key,
            consumerSecret:cred.twitter.consumer.secret});
        tr.get('users/show', {
            oauth_token:cred.twitter.user.token,
            oauth_token_secret:cred.twitter.user.secret,
            'screen_name':'mightymob'
        }, function (err, data, res) {
            if (err) return (err instanceof Error) ? done(err) : (console.log(err)||done(new Error('Network error!')));
            data.id.should.equal(1504092505);
            data.screen_name.should.equal('mightymob');
            done();
        });
    });
});
