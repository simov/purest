
var should = require('should');
var purest = require('../lib/provider'),
    Options = require('../lib/options');


describe('options', function () {
    
    describe('upload', function () {
        it('pass on missing upload option', function (done) {
            var p = new purest({provider:'twitter'});
            var options = {};
            p.options.upload(p, 'api', options);
            should.deepEqual(options, {});
            done();
        });
        it('pass on missing upload provider', function (done) {
            var p = new purest({provider:'coderbits'});
            var options = {upload:'cat.jpg'};
            p.options.upload(p, 'api', options);
            should.deepEqual(options, {upload:'cat.jpg'});
            done();
        });
        it('pass on missing upload api', function (done) {
            var p = new purest({provider:'twitter'});
            var options = {upload:'cat.jpg'};
            p.options.upload(p, 'upload_image', options);
            should.deepEqual(options, {upload:'cat.jpg'});
            done();
        });
        it('set the content-type to multipart/form-data', function (done) {
            var p = new purest({provider:'twitter'});
            var options = {upload:'cat.jpg', headers:{}};
            p.options.upload(p, 'statuses/update_with_media', options);
            options.headers['content-type'].should.equal('multipart/form-data');
            done();
        });
        it('remove the form and json options', function (done) {
            var p = new purest({provider:'twitter'});
            var options = {upload:'cat.jpg', headers:{}, form:{'media[]':''}, json:true};
            p.options.upload(p, 'statuses/update_with_media', options);
            should.equal(options.form, undefined);
            should.equal(options.json, undefined);
            done();
        });
    });
    
    describe('multipart', function () {
        it.skip('throw an error on unsupported media type', function (done) {
            var p = new purest({provider:'twitter'});
            var options = {upload:'cat.tiff', headers:{}, form:{'media[]':'...'}};
            (function () {
                p.options.upload(p, 'statuses/update_with_media', options);
            }).should.throw('Unsupported media type.');
            done();
        });
        it('generate multipart/form-data', function (done) {
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
            done();
        });
    });

    describe('get', function () {
        it('set stackexchange get options', function (done) {
            var p = new purest({provider:'stackexchange'});
            var options = {};
            p.options.get.call(p, 'api', options);
            should.deepEqual(options, {encoding:null});
            done();
        });
        it('set github get options', function (done) {
            var p = new purest({provider:'github'});
            var options = {headers:{}};
            p.options.get.call(p, 'api', options);
            should.deepEqual(options, {headers:{'User-Agent':'purest'}});
            done();
        });
        it('set linkedin get options', function (done) {
            var p = new purest({provider:'linkedin',
                consumerKey:'a', consumerSecret:'b'});
            var options = {headers:{}, oauth:{token:'a', secret:'b'}};
            p.options.get.call(p, 'api', options);
            options.headers['x-li-format'].should.equal('json');
            done();
        });
        it('set encoding to binary on certain gmaps APIs', function (done) {
            var p = new purest({provider:'gmaps'});
            var options = {};
            p.options.get.call(p, 'api', options);
            should.deepEqual(options, {});
            p.options.get.call(p, 'streetview', options);
            should.deepEqual(options, {encoding:null});
            options = {};
            p.options.get.call(p, 'staticmap', options);
            should.deepEqual(options, {encoding:null});
            done();
        });
    });

    describe('oauth', function () {
        it('throw an error on missing credentials', function (done) {
            (function () {
                var options = new Options();
                options.oauth.call({consumerSecret:'.'}, {token:'.', secret:'.'});
            }).should.throw('Missing OAuth credentials!');
            (function () {
                var options = new Options();
                options.oauth.call({consumerKey:'.'}, {token:'.', secret:'.'});
            }).should.throw('Missing OAuth credentials!');
            (function () {
                var options = new Options();
                options.oauth.call({consumerKey:'.', consumerSecret:'.'}, {secret:'.'});
            }).should.throw('Missing OAuth credentials!');
            (function () {
                var options = new Options();
                options.oauth.call({consumerKey:'.', consumerSecret:'.'}, {token:'.'});
            }).should.throw('Missing OAuth credentials!');
            done();
        });
        it('use consumer key/secret provided from the ctor', function (done) {
            var options = new Options();
            var args = {oauth:{token:'.', secret:'.'}};
            options.oauth.call({consumerKey:'.', consumerSecret:'.'}, args);
            args.oauth.consumer_key.should.equal('.');
            args.oauth.consumer_secret.should.equal('.');
            done();
        });
        it('use consumer key/secret provided as parameters', function (done) {
            var options = new Options();
            var args = {oauth:{consumer_key:'-', consumer_secret:'-', token:'.', secret:'.'}};
            options.oauth.call({consumerKey:'.', consumerSecret:'.'}, args);
            args.oauth.consumer_key.should.equal('-');
            args.oauth.consumer_secret.should.equal('-');
            done();
        });
        it('accept user token/secret', function (done) {
            var options = new Options();
            var args = {oauth:{token:'.', secret:'.'}};
            options.oauth.call({consumerKey:'.', consumerSecret:'.'}, args);
            args.oauth.token.should.equal('.');
            args.oauth.token_secret.should.equal('.');

            args = {oauth:{token:'.', token_secret:'.'}};
            options.oauth.call({consumerKey:'.', consumerSecret:'.'}, args);
            args.oauth.token.should.equal('.');
            args.oauth.token_secret.should.equal('.');
            done();
        });
    });

    describe('url', function () {
        // escape  OAuth's  RFC3986's symbols
        it('escape !*()\' for twitter on POST request', function (done) {
            var p = new purest({provider:'twitter'});
            var options = {form:{one:"!*()'",two:2}};
            p.url('api', options).should
                .equal('https://api.twitter.com/1.1/api.json?one=%21%2a%28%29%27&two=2');
            done();
        });
        it('append json on missing gmaps format', function (done) {
            var p = new purest({provider:'gmaps'});
            p.url('api', {}).should.equal('https://maps.googleapis.com/maps/api/api');
            p.url('timezone', {}).should.equal('https://maps.googleapis.com/maps/api/timezone/json');
            p.url('timezone/xml', {}).should.equal('https://maps.googleapis.com/maps/api/timezone/xml');
            p.url('timezone/json', {}).should.equal('https://maps.googleapis.com/maps/api/timezone/json');
            done();
        });
    });
});
