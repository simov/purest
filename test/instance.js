
var should = require('should');
var TinyRest = require('../lib/tinyrest');


describe('instance', function () {
    it('should create twitter instance', function (done) {
        var t = new TinyRest({provider:'twitter',
            consumerKey:'app-key',
            consumerSecret:'app-secret'
        });
        t.twitter.should.equal(true);
        t.version.should.equal('1.1');
        t.domain.should.equal('https://api.twitter.com');
        t.oauth.should.equal(true);
        t.consumerKey.should.equal('app-key');
        t.consumerSecret.should.equal('app-secret');
        done();
    });
    it('should create linkedin instance', function (done) {
        var t = new TinyRest({provider:'linkedin',
            consumerKey:'app-key',
            consumerSecret:'app-secret'
        });
        t.linkedin.should.equal(true);
        t.version.should.equal('v1');
        t.domain.should.equal('http://api.linkedin.com');
        t.oauth.should.equal(true);
        t.consumerKey.should.equal('app-key');
        t.consumerSecret.should.equal('app-secret');
        done();
    });
    it('should create facebook instance', function (done) {
        var t = new TinyRest({provider:'facebook'});
        t.facebook.should.equal(true);
        t.version.should.equal('');
        t.domain.should.equal('https://graph.facebook.com');
        done();
    });
    it('should create stocktwits instance', function (done) {
        var t = new TinyRest({provider:'stocktwits'});
        t.stocktwits.should.equal(true);
        t.version.should.equal('2');
        t.domain.should.equal('https://api.stocktwits.com');
        done();
    });
    it('should create bily instance', function (done) {
        var t = new TinyRest({provider:'bitly'});
        t.bitly.should.equal(true);
        t.version.should.equal('v3');
        t.domain.should.equal('https://api-ssl.bitly.com');
        done();
    });
    it('should create soundcloud instance', function (done) {
        var t = new TinyRest({provider:'soundcloud'});
        t.soundcloud.should.equal(true);
        t.version.should.equal('');
        t.domain.should.equal('https://api.soundcloud.com');
        done();
    });
    it('should create github instance', function (done) {
        var t = new TinyRest({provider:'github'});
        t.github.should.equal(true);
        t.version.should.equal('');
        t.domain.should.equal('https://api.github.com');
        done();
    });
    it('should create stackexchange instance', function (done) {
        var t = new TinyRest({provider:'stackexchange'});
        t.stackexchange.should.equal(true);
        t.version.should.equal('2.2');
        t.domain.should.equal('https://api.stackexchange.com');
        done();
    });
    it('should create google instance', function (done) {
        var t = new TinyRest({provider:'google'});
        t.google.should.equal(true);
        t.version.should.equal('');
        t.domain.should.equal('https://www.googleapis.com');
        done();
    });
    it('should create rubygems instance', function (done) {
        var t = new TinyRest({provider:'rubygems'});
        t.rubygems.should.equal(true);
        t.version.should.equal('v1');
        t.domain.should.equal('https://rubygems.org');
        done();
    });
    it('should create coderbits instance', function (done) {
        var t = new TinyRest({provider:'coderbits'});
        t.coderbits.should.equal(true);
        t.version.should.equal('');
        t.domain.should.equal('https://coderbits.com');
        done();
    });

    it('should support multiple instances at once', function (done) {
        var t = new TinyRest({provider:'twitter'});
        var l = new TinyRest({provider:'linkedin'});
        var f = new TinyRest({provider:'facebook'});
        
        t.twitter.should.equal(true);
        l.linkedin.should.equal(true);
        f.facebook.should.equal(true);
        
        t.url('api', {
            data: {param:"!*()'"},
            options: {upload: false}
        }).should.equal('https://api.twitter.com/1.1/api.json?param=%21%2a%28%29%27');
        
        l.url('api', {
            data: {param:"!*()'"},
            options: {upload: false}
        }).should.equal('http://api.linkedin.com/v1/api');

        var options = {form:{}};
        t.options.post(options);
        should.deepEqual(options, {});

        var options = {form:{}};
        f.options.post(options);
        should.deepEqual(options, {form:{}});
        
        done();
    });
});
