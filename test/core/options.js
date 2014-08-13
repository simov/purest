
var should = require('should');
var purest = require('../../lib/provider'),
    Options = require('../../lib/options');


describe('options', function () {
    
    describe('upload', function () {
        it('pass on missing upload option', function () {
            var p = new purest({provider:'twitter'});
            var options = {};
            p.options.upload(p, 'api', options);
            should.deepEqual(options, {});
        });
        it('pass on missing upload provider', function () {
            var p = new purest({provider:'coderbits'});
            var options = {upload:'cat.jpg'};
            p.options.upload(p, 'api', options);
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

    describe('oauth', function () {
        it('throw error on missing credentials', function () {
            (function () {
                var options = new Options();
                options.oauth.call({secret:'s'}, {token:'t', secret:'ts'});
            }).should.throw('Missing OAuth credentials!');
            (function () {
                var options = new Options();
                options.oauth.call({key:'k'}, {token:'t', secret:'ts'});
            }).should.throw('Missing OAuth credentials!');
            (function () {
                var options = new Options();
                options.oauth.call({key:'k', secret:'s'}, {secret:'ts'});
            }).should.throw('Missing OAuth credentials!');
            (function () {
                var options = new Options();
                options.oauth.call({key:'s', secret:'s'}, {token:'ts'});
            }).should.throw('Missing OAuth credentials!');
        });
        it('use consumer key/secret provided from the ctor', function () {
            var options = new Options();
            var args = {oauth:{token:'t', secret:'ts'}};
            options.oauth.call({key:'k', secret:'s'}, args);
            args.oauth.consumer_key.should.equal('k');
            args.oauth.consumer_secret.should.equal('s');
        });
        it('use consumer key/secret provided as parameters', function () {
            var options = new Options();
            var args = {oauth:{consumer_key:'ck', consumer_secret:'cs', token:'t', secret:'s'}};
            options.oauth.call({key:'k', secret:'s'}, args);
            args.oauth.consumer_key.should.equal('ck');
            args.oauth.consumer_secret.should.equal('cs');
        });
        it('set user token/secret', function () {
            var options = new Options();
            var args = {oauth:{token:'t', token_secret:'ts'}};
            options.oauth.call({key:'k', secret:'s'}, args);
            args.oauth.token.should.equal('t');
            args.oauth.token_secret.should.equal('ts');
        });
        it('set user token/secret through token_secret shortcut', function () {
            var options = new Options();
            var args = {oauth:{token:'t', secret:'ts'}};
            options.oauth.call({key:'k', secret:'s'}, args);
            args.oauth.token.should.equal('t');
            args.oauth.token_secret.should.equal('ts');
        });
    });

    describe('get', function () {
        describe('stackexchange', function () {
            it('set request encoding to binary', function () {
                var p = new purest({provider:'stackexchange'});
                var options = {};
                p.options.get.call(p, 'api', options);
                should.deepEqual(options, {encoding:null});
            });
        });
        describe('github', function () {
            it('set user agent headers', function () {
                var p = new purest({provider:'github'});
                var options = {headers:{}};
                p.options.get.call(p, 'api', options);
                should.deepEqual(options, {headers:{'User-Agent':'Purest'}});
            });
        });
        describe('linkedin', function () {
            it('set json headers', function () {
                var p = new purest({provider:'linkedin', key:'k', secret:'s'});
                var options = {headers:{}, oauth:{token:'t', secret:'ts'}};
                p.options.get.call(p, 'api', options);
                options.headers['x-li-format'].should.equal('json');
            });
        });
        describe('gmaps', function () {
            it('set encoding to binary on certain APIs', function () {
                var p = new purest({provider:'gmaps'});
                var options = {};
                p.options.get.call(p, 'api', options);
                should.deepEqual(options, {});
                p.options.get.call(p, 'streetview', options);
                should.deepEqual(options, {encoding:null});
                options = {};
                p.options.get.call(p, 'staticmap', options);
                should.deepEqual(options, {encoding:null});
            });
        });
        describe('google', function () {
            it('contacts API - set headers', function () {
                var p = new purest({provider:'google'});
                var options = {headers:{}, qs:{}, api:'contacts'};
                p.options.get.call(p, 'endpoint', options);
                options.headers['GData-Version'].should.equal('3.0');
            });
            it('contacts API - return json by default', function () {
                var p = new purest({provider:'google'});
                var options = {headers:{}, qs:{}, api:'contacts'};
                p.options.get.call(p, 'endpoint', options);
                options.qs.alt.should.equal('json');
            });
            it('contacts API - specify return type', function () {
                var p = new purest({provider:'google'});
                var options = {headers:{}, qs:{alt:'rss'}, api:'contacts'};
                p.options.get.call(p, 'endpoint', options);
                options.qs.alt.should.equal('rss');
            });
        });
    });

    describe('url', function () {
        describe('twitter', function () {
            it('escape !*()\' (RFC3986 URI symbols) on POST request', function () {
                var p = new purest({provider:'twitter'});
                var options = {form:{one:"!*()'",two:2}};
                p.url('api', options).should
                    .equal('https://api.twitter.com/1.1/api.json?one=%21%2a%28%29%27&two=2');
            });
        });
        describe('gmaps', function () {
            it('append json on missing return format', function () {
                var p = new purest({provider:'gmaps'});
                p.url('api', {}).should.equal('https://maps.googleapis.com/maps/api/api');
                p.url('timezone', {}).should.equal('https://maps.googleapis.com/maps/api/timezone/json');
                p.url('timezone/xml', {}).should.equal('https://maps.googleapis.com/maps/api/timezone/xml');
                p.url('timezone/json', {}).should.equal('https://maps.googleapis.com/maps/api/timezone/json');
            });
        });
    });
});
