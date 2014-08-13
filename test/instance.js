
var should = require('should');
var purest = require('../lib/provider');


describe('instance', function () {
    it('throw an error on non specified provider', function () {
        (function () {
            var p = new purest();
        }).should.throw('purest: provider option is required!');
    });
    it('throw an error on non existing provider', function () {
        (function () {
            var p = new purest({provider:'dood'});
        }).should.throw('purest: non existing provider!');
    });
    it('receive provider name', function () {
        var p = new purest({provider:'facebook'});
        p.facebook.should.equal(true);
        p.name.should.equal('facebook');
        p.domain.should.equal('https://graph.facebook.com');
    });
    it('receive oauth app credentials', function () {
        var p = new purest({provider:'twitter',
            consumerKey:'app-key',
            consumerSecret:'app-secret'
        });
        p.consumerKey.should.equal('app-key');
        p.consumerSecret.should.equal('app-secret');
    });
    it('receive oauth app credentials through shortcuts', function () {
        var p = new purest({provider:'twitter',
            key:'app-key', secret:'app-secret'
        });
        p.consumerKey.should.equal('app-key');
        p.consumerSecret.should.equal('app-secret');
    });
    it('set an API version', function () {
        var p = new purest({provider:'stackexchange', version:'2.1'});
        p.version.should.equal('2.1');
    });
    it('set an API domain name', function () {
        var p = new purest({provider:'coderbits', domain:'https://api.coderbits.com'});
        p.domain.should.equal('https://api.coderbits.com');
    });
    it('set an API name', function () {
        var p = new purest({provider:'google', api:'youtube'});
        p.api.should.equal('youtube');
    });
    it('support multiple instances at once', function () {
        var github = new purest({provider:'github'});
        var stackexchange = new purest({provider:'stackexchange'});
        
        github.name.should.equal('github');
        stackexchange.name.should.equal('stackexchange');
        
        var options = {headers:{}};
        github.options.get('api', options);
        should.deepEqual(options, {headers:{'User-Agent':'purest'}});

        var options = {headers:{}};
        stackexchange.options.get('api', options);
        should.deepEqual(options, {headers:{}, encoding:null});
    });
    it('expose the default request method', function () {
        purest.request.should.be.type('function');
    });
});
