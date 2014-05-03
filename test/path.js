
var TinyRest = require('../lib/provider');


describe('path', function () {
    it('create /version/api path', function (done) {
        var providers = ['bitly', 'linkedin', 'stackexchange', 'gmaps'];
        for (var i=0; i < providers.length; i++) {
            var t = new TinyRest({provider:providers[i]});
            t.createPath('api/method').should.equal('/'+t.version+'/api/method');
        }
        done();
    });
    it('create /api path', function (done) {
        var providers = ['facebook', 'github', 'wikimapia'];
        for (var i=0; i < providers.length; i++) {
            var t = new TinyRest({provider:providers[i]});
            t.createPath('api/method').should.equal('/api/method');
        }
        done();
    });
    it('create /api/version/method.json path', function (done) {
        var providers = ['stocktwits', 'rubygems'];
        for (var i=0; i < providers.length; i++) {
            var t = new TinyRest({provider:providers[i]});
            t.createPath('api/method').should.equal('/api/'+t.version+'/api/method.json');
        }
        done();
    });
    it('create /version/api.json path', function (done) {
        var providers = ['twitter'];
        for (var i=0; i < providers.length; i++) {
            var t = new TinyRest({provider:providers[i]});
            t.createPath('api/method').should.equal('/'+t.version+'/api/method.json');
        }
        done();
    });
    it('create /api.json path', function (done) {
        var providers = ['soundcloud', 'coderbits'];
        for (var i=0; i < providers.length; i++) {
            var t = new TinyRest({provider:providers[i]});
            t.createPath('api/method').should.equal('/api/method.json');
        }
        done();
    });

    describe('same domain', function () {
        it('create /api/version/method path - api set in the ctor', function (done) {
            var apis = ['plus', 'youtube', 'drive', 'freebase', 'pagespeedonline'],
                google = require('../config/providers').google;
            for (var i=0; i < apis.length; i++) {
                var t = new TinyRest({provider:'google', api:apis[i]});
                t.createPath('api/method',{})
                    .should.equal('/'+apis[i]+'/'+google.api[apis[i]]+'/api/method');
            }
            done();
        });
        it('create /api/version/method path - api set in the params', function (done) {
            var apis = ['plus', 'youtube', 'drive', 'freebase', 'pagespeedonline'],
                google = require('../config/providers').google;
            for (var i=0; i < apis.length; i++) {
                var t = new TinyRest({provider:'google'});
                t.createPath('api/method',{api:apis[i]})
                    .should.equal('/'+apis[i]+'/'+google.api[apis[i]]+'/api/method');
            }
            done();
        });
        it('predefine an api version', function (done) {
            var t = new TinyRest({provider:'google'});
            t.createPath('api/method',{api:'freebase', version:'4.4'})
                .should.equal('/freebase/4.4/api/method');
            done();
        });
    });
});
