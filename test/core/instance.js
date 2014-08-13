
var should = require('should');
var purest = require('../../lib/provider');


describe('instance', function () {
    it('throw error on non specified provider', function () {
        (function () {
            var p = new purest();
        }).should.throw('purest: provider option is required!');
    });
    it('throw error on non existing provider', function () {
        (function () {
            var p = new purest({provider:'dood'});
        }).should.throw('purest: non existing provider!');
    });
    it('set provider', function () {
        var p = new purest({provider:'facebook'});
        p.facebook.should.equal(true);
        p.name.should.equal('facebook');
        p.domain.should.equal('https://graph.facebook.com');
    });
    it('set oauth app credentials', function () {
        var p = new purest({provider:'twitter',
            consumerKey:'app-key',
            consumerSecret:'app-secret'
        });
        p.key.should.equal('app-key');
        p.secret.should.equal('app-secret');
    });
    it('set oauth app credentials through shortcuts', function () {
        var p = new purest({provider:'twitter',
            key:'app-key', secret:'app-secret'
        });
        p.key.should.equal('app-key');
        p.secret.should.equal('app-secret');
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
        should.deepEqual(options, {headers:{'User-Agent':'Purest'}});

        var options = {headers:{}};
        stackexchange.options.get('api', options);
        should.deepEqual(options, {headers:{}, encoding:null});
    });
    it('expose the default request method', function () {
        purest.request.should.be.type('function');
    });
});
