
var should = require('should');
var TinyRest = require('../lib/provider');


describe('instance', function () {
    it('throw an error on non specified provider', function (done) {
        (function () {
            var t = new TinyRest();
        }).should.throw('TinyRest: provider option is required!');
        done();
    });
    it('throw an error on non existing provider', function (done) {
        (function () {
            var t = new TinyRest({provider:'dood'});
        }).should.throw('TinyRest: non existing provider!');
        done();
    });
    it('receive provider name', function (done) {
        var t = new TinyRest({provider:'facebook'});
        t.facebook.should.equal(true);
        t.name.should.equal('facebook');
        t.domain.should.equal('https://graph.facebook.com');
        done();
    });
    it('receive oauth app credentials', function (done) {
        var t = new TinyRest({provider:'twitter',
            consumerKey:'app-key',
            consumerSecret:'app-secret'
        });
        t.consumerKey.should.equal('app-key');
        t.consumerSecret.should.equal('app-secret');
        done();
    });
    it('set an API version', function (done) {
        var t = new TinyRest({provider:'stackexchange', version:'2.1'});
        t.version.should.equal('2.1');
        done();
    });
    it('set an API domain name', function (done) {
        var t = new TinyRest({provider:'coderbits', domain:'https://api.coderbits.com'});
        t.domain.should.equal('https://api.coderbits.com');
        done();
    });
    it('set an API name', function (done) {
        var t = new TinyRest({provider:'google', api:'youtube'});
        t.api.should.equal('youtube');
        done();
    });
    it('support multiple instances at once', function (done) {
        var github = new TinyRest({provider:'github'});
        var stackexchange = new TinyRest({provider:'stackexchange'});
        
        github.name.should.equal('github');
        stackexchange.name.should.equal('stackexchange');
        
        var options = {headers:{}};
        github.options.get('api', options);
        should.deepEqual(options, {headers:{'User-Agent':'TinyRest'}});

        var options = {headers:{}};
        stackexchange.options.get('api', options);
        should.deepEqual(options, {headers:{}, encoding:null});

        done();
    });
    it('expose the default request method', function (done) {
        TinyRest.request.should.be.type('function');
        done();
    });
});
