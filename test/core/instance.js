
var should = require('should');
var Purest = require('../../lib/provider');


describe('instance', function () {
    it('throw error on non specified provider', function () {
        (function () {
            var p = new Purest();
        }).should.throw('Purest: provider option is required!');
    });
    it('throw error on non existing provider', function () {
        (function () {
            var p = new Purest({provider:'dood'});
        }).should.throw('Purest: non existing provider!');
    });

    it('oauth app credentials', function () {
        var p = new Purest({provider:'twitter',
            consumerKey:'app-key',
            consumerSecret:'app-secret'
        });
        p.key.should.equal('app-key');
        p.secret.should.equal('app-secret');
    });
    it('oauth app credentials through shortcuts', function () {
        var p = new Purest({provider:'twitter',
            key:'app-key', secret:'app-secret'
        });
        p.key.should.equal('app-key');
        p.secret.should.equal('app-secret');
    });
    it('oauth flag', function () {
        var p = new Purest({provider:'twitter'});
        p.oauth.should.equal(true);
    });

    it('API version', function () {
        var p = new Purest({provider:'stackexchange'});
        p.version.should.equal('2.2');
        var p = new Purest({provider:'stackexchange',version:'5.0'});
        p.version.should.equal('5.0');
    });
    it('API domain', function () {
        var p = new Purest({provider:'coderbits'});
        p.domain.should.equal('https://coderbits.com');
        var p = new Purest({provider:'coderbits',domain:'https://api.coderbits.com'});
        p.domain.should.equal('https://api.coderbits.com');
    });
    it('API path', function () {
        var p = new Purest({provider:'flickr'});
        p.path.should.equal('services/rest');
        var p = new Purest({provider:'flickr',path:'rest/api'});
        p.path.should.equal('rest/api');
    });
    it('API return data type', function () {
        var p = new Purest({provider:'twitter'});
        p.type.should.equal('');
        var p = new Purest({provider:'twitter',type:'xml'});
        p.type.should.equal('xml');
    });
    it('API path format', function () {
        var p = new Purest({provider:'twitter'});
        p.format.should.equal('version/endpoint.type');
    });

    it('throw on non existing API', function () {
        (function () {
            var p = new Purest({provider:'google', api:'yahoo'});
        }).should.throw('Purest: non existing API!');
        (function () {
            var p = new Purest({provider:'twitter', api:'yahoo'});
        }).should.throw('Purest: non existing API!');
    });
    it('API name', function () {
        var p = new Purest({provider:'google', api:'plus'});
        p.api.should.equal('plus');
    });
    it('APIs', function () {
        var p = new Purest({provider:'flickr'});
        should.deepEqual(p.apis, {
            upload:{domain:'https://up.flickr.com',format:'path',path:'services/upload'},
            replace:{domain:'https://up.flickr.com',format:'path',path:'services/replace'}
        });
    });

    it('multipart config', function () {
        var p = new Purest({provider:'box'});
        should.deepEqual(p.multipart, {'files/content':'filename'});
    });
    it('provider name, flag', function () {
        var p = new Purest({provider:'facebook'});
        p.facebook.should.equal(true);
        p.name.should.equal('facebook');
    });

    it('override', function () {
        var p = new Purest({provider:'stackexchange'});
        var options = {};
        p.options.get.call(p,'endpoint',options);
        should.deepEqual(options, {encoding:null})
    });
    it('refresh', function () {
        var p = new Purest({provider:'google'});
        p.refresh.should.be.type('function');
    });

    it('support multiple instances', function () {
        var google = new Purest({provider:'google'}),
            stackexchange = new Purest({provider:'stackexchange'});

        google.name.should.equal('google');
        stackexchange.name.should.equal('stackexchange');

        var options = {api:'contacts', headers:{}};
        google.options.get('endpoint', options);
        should.deepEqual(options.headers, {'GData-Version':'3.0'});

        var options = {};
        stackexchange.options.get('endpoint', options);
        should.deepEqual(options, {encoding:null});
    });
    it('expose the default request method', function () {
        Purest.request.should.be.type('function');
    });
});
