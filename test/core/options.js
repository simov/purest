
var should = require('should');
var purest = require('../../lib/provider'),
    Options = require('../../lib/options');


describe('options', function () {

    describe('get', function () {
        describe('github', function () {
            it('user defined User-Agent headers', function () {
                var p = new purest({provider:'github'});
                var options = {headers:{'User-Agent':'AwesomeApp'}};
                p.options.get.call(p, 'endpoint', options);
                should.deepEqual(options, {headers:{'User-Agent':'AwesomeApp'}});
            });
            it('set User-Agent headers', function () {
                var p = new purest({provider:'github'});
                var options = {headers:{}};
                p.options.get.call(p, 'endpoint', options);
                should.deepEqual(options, {headers:{'User-Agent':'Purest'}});
            });
        });
        describe('gmaps', function () {
            it('set binary encoding for certain APIs', function () {
                var p = new purest({provider:'gmaps'});
                var options = {};
                p.options.get.call(p, 'endpoint', options);
                should.deepEqual(options, {});
                p.options.get.call(p, 'streetview', options);
                should.deepEqual(options, {encoding:null});
                options = {};
                p.options.get.call(p, 'staticmap', options);
                should.deepEqual(options, {encoding:null});
            });
        });
        describe('google', function () {
            describe('contacts', function () {
                it('set GData-Version to 3.0 by default', function () {
                    var p = new purest({provider:'google'});
                    var options = {headers:{}, qs:{}, api:'contacts'};
                    p.options.get.call(p, 'endpoint', options);
                    options.headers['GData-Version'].should.equal('3.0');
                });
                it('user defined GData-Version', function () {
                    var p = new purest({provider:'google'});
                    var options = {headers:{'GData-Version':'2.0'}, qs:{}, api:'contacts'};
                    p.options.get.call(p, 'endpoint', options);
                    options.headers['GData-Version'].should.equal('2.0');
                });
                it('return json by default', function () {
                    var p = new purest({provider:'google'});
                    var options = {headers:{}, qs:{}, api:'contacts'};
                    p.options.get.call(p, 'endpoint', options);
                    options.qs.alt.should.equal('json');
                });
                it('specify return type', function () {
                    var p = new purest({provider:'google'});
                    var options = {headers:{}, qs:{alt:'rss'}, api:'contacts'};
                    p.options.get.call(p, 'endpoint', options);
                    options.qs.alt.should.equal('rss');
                });
            });
        });
        describe('linkedin', function () {
            it('set x-li-format to json by default', function () {
                var p = new purest({provider:'linkedin', key:'k', secret:'s'});
                var options = {headers:{}, oauth:{token:'t', secret:'ts'}};
                p.options.get.call(p, 'endpoint', options);
                options.headers['x-li-format'].should.equal('json');
            });
            it('user defined x-li-format', function () {
                var p = new purest({provider:'linkedin', key:'k', secret:'s'});
                var options = {headers:{'x-li-format':'jsonp'}, oauth:{token:'t', secret:'ts'}};
                p.options.get.call(p, 'endpoint', options);
                options.headers['x-li-format'].should.equal('jsonp');
            });
        });
        describe('stackexchange', function () {
            it('set request encoding to binary', function () {
                var p = new purest({provider:'stackexchange'});
                var options = {};
                p.options.get.call(p, 'endpoint', options);
                should.deepEqual(options, {encoding:null});
            });
        });
    });

    describe('post', function () {
        
    });

    describe('oauth', function () {
        it('throw error on missing credentials', function () {
            (function () {
                var p = new purest({provider:'twitter', secret:'s'});
                p.options.oauth.call(p, {token:'t', secret:'ts'});
            }).should.throw('Missing OAuth credentials!');
            (function () {
                var p = new purest({provider:'twitter', key:'k'});
                p.options.oauth.call(p, {token:'t', secret:'ts'});
            }).should.throw('Missing OAuth credentials!');
            (function () {
                var p = new purest({provider:'twitter', key:'k', secret:'s'});
                p.options.oauth.call(p, {secret:'ts'});
            }).should.throw('Missing OAuth credentials!');
            (function () {
                var p = new purest({provider:'twitter', key:'k', secret:'s'});
                p.options.oauth.call(p, {token:'ts'});
            }).should.throw('Missing OAuth credentials!');
        });
        it('use consumer key/secret provided from the ctor', function () {
            var p = new purest({provider:'twitter', key:'k', secret:'s'}),
                options = {oauth:{token:'t', secret:'ts'}};
            p.options.oauth.call(p, options);
            options.oauth.consumer_key.should.equal('k');
            options.oauth.consumer_secret.should.equal('s');
        });
        it('use consumer key/secret provided as parameters', function () {
            var p = new purest({provider:'twitter', key:'k', secret:'s'}),
                options = {oauth:{consumer_key:'ck', consumer_secret:'cs', token:'t', secret:'s'}};
            p.options.oauth.call(p, options);
            options.oauth.consumer_key.should.equal('ck');
            options.oauth.consumer_secret.should.equal('cs');
        });
        it('set user token/secret', function () {
            var p = new purest({provider:'twitter', key:'k', secret:'s'}),
                options = {oauth:{token:'t', token_secret:'ts'}};
            p.options.oauth.call(p, options);
            options.oauth.token.should.equal('t');
            options.oauth.token_secret.should.equal('ts');
        });
        it('set user token/secret through token_secret shortcut', function () {
            var p = new purest({provider:'twitter', key:'k', secret:'s'}),
                options = {oauth:{token:'t', secret:'ts'}};
            p.options.oauth.call(p, options);
            options.oauth.token.should.equal('t');
            options.oauth.token_secret.should.equal('ts');
        });
    });
    
    describe('upload', function () {
        it('pass on missing upload option', function () {
            var p = new purest({provider:'twitter'});
            var options = {};
            p.options.upload(p, 'endpoint', options);
            should.deepEqual(options, {});
        });
        it('pass on missing upload provider', function () {
            var p = new purest({provider:'coderbits'});
            var options = {upload:'cat.jpg'};
            p.options.upload(p, 'endpoint', options);
            should.deepEqual(options, {upload:'cat.jpg'});
        });
        it('pass on missing upload api', function () {
            var p = new purest({provider:'twitter'});
            var options = {upload:'cat.jpg'};
            p.options.upload(p, 'upload_image', options);
            should.deepEqual(options, {upload:'cat.jpg'});
        });
        it('set content-type to multipart/form-data', function () {
            var p = new purest({provider:'twitter'});
            var options = {upload:'cat.jpg', headers:{}};
            p.options.upload(p, 'statuses/update_with_media', options);
            options.headers['content-type'].should.equal('multipart/form-data');
        });
        it('remove form and json options', function () {
            var p = new purest({provider:'twitter'});
            var options = {upload:'cat.jpg', headers:{}, form:{'media[]':''}, json:true};
            p.options.upload(p, 'statuses/update_with_media', options);
            should.equal(options.form, undefined);
            should.equal(options.json, undefined);
        });
    });
    
    describe('multipart', function () {
        it('generate multipart/form-data', function () {
            var p = new purest({provider:'twitter'});
            var options =
                {upload:'cat.jpg', headers:{}, form:{'media[]':'...', status:'tweet'}};
            p.options.upload(p, 'statuses/update_with_media', options);
            should.deepEqual(options.multipart, [{
                    'content-disposition': 'form-data; name="media[]"; filename="cat.jpg"',
                    'content-type': 'image/jpeg',
                    'content-transfer-encoding': 'binary',
                    body: '...'}, {
                    'content-disposition': 'form-data; name="status"',
                    'content-type': 'text/plain',
                    'content-transfer-encoding': 'utf8',
                    body: 'tweet'}
            ]);
        });
    });

    describe('beforeMultipart', function () {
        
    });

    describe('afterMultipart', function () {
        
    });
});
