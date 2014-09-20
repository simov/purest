
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
    it('set oauth flag', function () {
        var p = new purest({provider:'twitter'});
        p.oauth.should.equal(true);
    });
    it('set API version', function () {
        var p = new purest({provider:'stackexchange', version:'2.1'});
        p.version.should.equal('2.1');
    });
    it('set API domain name', function () {
        var p = new purest({provider:'coderbits', domain:'https://api.coderbits.com'});
        p.domain.should.equal('https://api.coderbits.com');
    });
    it('set API path', function () {
        var p = new purest({provider:'flickr'});
        p.path.should.equal('services/rest');
    });
    it('set API name', function () {
        var p = new purest({provider:'google', api:'youtube'});
        p.api.should.equal('youtube');
    });
    it('set all available APIs for a provider', function () {
        var p = new purest({provider:'flickr'});
        should.deepEqual(p.apis, {
            upload:{domain:'https://up.flickr.com', path:'services/upload'},
            replace:{domain:'https://up.flickr.com', path:'services/replace'}
        });
    });
    it('support multiple instances', function () {
        var google = new purest({provider:'google'});
        var gmaps = new purest({provider:'gmaps'});

        google.name.should.equal('google');
        gmaps.name.should.equal('gmaps');

        var options = {api:'contacts', headers:{}};
        google.options.get('endpoing', options);
        should.deepEqual(options.headers, {'GData-Version':'3.0'});

        var options = {};
        gmaps.options.get('streetview', options);
        should.deepEqual(options, {encoding:null});

        var options = {api:'contacts', headers:{}};
        google.url.get('endpoint', options)
            .should.equal('https://www.google.com/m8/feeds/endpoint');

        var options = {api:'contacts', headers:{}};
        gmaps.url.get('geocode', options)
            .should.equal('https://maps.googleapis.com/maps/api/geocode/json');
    });
    it('expose the default request method', function () {
        purest.request.should.be.type('function');
    });
});
