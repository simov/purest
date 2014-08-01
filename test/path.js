
var purest = require('../lib/provider');


describe('path', function () {
    it('create /version/api path', function () {
        var providers = ['bitly', 'linkedin', 'stackexchange', 'gmaps'];
        for (var i=0; i < providers.length; i++) {
            var t = new purest({provider:providers[i]});
            t.createPath('api/method').should.equal('/'+t.version+'/api/method');
        }
    });
    it('create /api path', function () {
        var providers = ['facebook', 'github', 'wikimapia'];
        for (var i=0; i < providers.length; i++) {
            var t = new purest({provider:providers[i]});
            t.createPath('api/method').should.equal('/api/method');
        }
    });
    it('create /api/version/method.json path', function () {
        var providers = ['stocktwits', 'rubygems'];
        for (var i=0; i < providers.length; i++) {
            var t = new purest({provider:providers[i]});
            t.createPath('api/method').should.equal('/api/'+t.version+'/api/method.json');
        }
    });
    it('create /version/api.json path', function () {
        var providers = ['twitter'];
        for (var i=0; i < providers.length; i++) {
            var t = new purest({provider:providers[i]});
            t.createPath('api/method').should.equal('/'+t.version+'/api/method.json');
        }
    });
    it('create /api.json path', function () {
        var providers = ['soundcloud', 'coderbits'];
        for (var i=0; i < providers.length; i++) {
            var t = new purest({provider:providers[i]});
            t.createPath('api/method').should.equal('/api/method.json');
        }
    });

    describe('same domain', function () {
        it('create /api/version/method path - api set in the ctor', function () {
            var apis = ['plus', 'youtube', 'drive', 'freebase', 'pagespeedonline'],
                google = require('../config/providers').google;
            for (var i=0; i < apis.length; i++) {
                var t = new purest({provider:'google', api:apis[i]});
                t.createPath('api/method',{})
                    .should.equal('/'+apis[i]+'/'+google.api[apis[i]].version+'/api/method');
            }
        });
        it('create /api/version/method path - api set in the params', function () {
            var apis = ['plus', 'youtube', 'drive', 'freebase', 'pagespeedonline'],
                google = require('../config/providers').google;
            for (var i=0; i < apis.length; i++) {
                var t = new purest({provider:'google'});
                t.createPath('api/method',{api:apis[i]})
                    .should.equal('/'+apis[i]+'/'+google.api[apis[i]].version+'/api/method');
            }
        });
        it('predefine an api version', function () {
            var t = new purest({provider:'google'});
            t.createPath('api/method',{api:'freebase', version:'4.4'})
                .should.equal('/freebase/4.4/api/method');
        });
    });

    describe('url', function () {
        it('get domain from api.name.domain', function () {
            var p = new purest({provider:'google'});
            p.url('api/method', {api:'plus'})
                .should.equal('https://www.googleapis.com/plus/v1/api/method')
        });
        it('get domain from provider.domain', function () {
            var p = new purest({provider:'google'});
            p.url('api/method', {api:'m8/feeds'})
                .should.equal('https://www.google.com/m8/feeds/api/method');
        });
    });
});
