
var TinyRest = require('../lib/tinyrest');


describe('instance', function () {
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
    it('should create facebook instance', function (done) {
        var t = new TinyRest({provider:'facebook'});
        t.provider.facebook.should.equal(true);
        t.provider.version.should.equal('');
        t.provider.endpoint.should.equal('https://graph.facebook.com');
        done();
    });
    it('should create rubygems instance', function (done) {
        var t = new TinyRest({provider:'rubygems'});
        t.provider.rubygems.should.equal(true);
        t.provider.version.should.equal('v1');
        t.provider.endpoint.should.equal('https://rubygems.org');
        done();
    });
    it('should create soundcloud instance', function (done) {
        var t = new TinyRest({provider:'soundcloud'});
        t.provider.soundcloud.should.equal(true);
        t.provider.version.should.equal('');
        t.provider.endpoint.should.equal('https://api.soundcloud.com');
        done();
    });
});
