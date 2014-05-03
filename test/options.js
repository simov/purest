
var should = require('should');
var TinyRest = require('../lib/provider'),
    Options = require('../lib/options');


describe('options', function () {
    
    describe('upload', function () {
        it('pass on missing upload option', function (done) {
            var t = new TinyRest({provider:'twitter'});
            var options = {};
            t.options.upload(t, 'api', options);
            should.deepEqual(options, {});
            done();
        });
        it('pass on missing upload provider', function (done) {
            var t = new TinyRest({provider:'coderbits'});
            var options = {upload:'cat.jpg'};
            t.options.upload(t, 'api', options);
            should.deepEqual(options, {upload:'cat.jpg'});
            done();
        });
        it('pass on missing upload api', function (done) {
            var t = new TinyRest({provider:'twitter'});
            var options = {upload:'cat.jpg'};
            t.options.upload(t, 'upload_image', options);
            should.deepEqual(options, {upload:'cat.jpg'});
            done();
        });
        it('set the content-type to multipart/form-data', function (done) {
            var t = new TinyRest({provider:'twitter'});
            var options = {upload:'cat.jpg', headers:{}};
            t.options.upload(t, 'statuses/update_with_media', options);
            options.headers['content-type'].should.equal('multipart/form-data');
            done();
        });
        it('remove the form and json options', function (done) {
            var t = new TinyRest({provider:'twitter'});
            var options = {upload:'cat.jpg', headers:{}, form:{'media[]':''}, json:true};
            t.options.upload(t, 'statuses/update_with_media', options);
            should.equal(options.form, undefined);
            should.equal(options.json, undefined);
            done();
        });
    });
    
    describe('multipart', function () {
        it('throw an error on unsupported media type', function (done) {
            var t = new TinyRest({provider:'twitter'});
            var options = {upload:'cat.tiff', headers:{}, form:{'media[]':'...'}};
            (function () {
                t.options.upload(t, 'statuses/update_with_media', options);
            }).should.throw('Unsupported media type.');
            done();
        });
        it('generate image multipart/form-data', function (done) {
            var t = new TinyRest({provider:'twitter'});
            var options = {upload:'cat.jpg', headers:{}, form:{'media[]':'...'}};
            t.options.upload(t, 'statuses/update_with_media', options);
            should.deepEqual(options.multipart,
                [ { 'content-transfer-encoding': 'utf8',
                'content-disposition': 'form-data; name="media[]"; filename="cat.jpg"',
                'content-type': 'image/jpeg',
                body: '...'} ]);
            done();
        });
        it('generate images and text multipart/form-data', function (done) {
            var t = new TinyRest({provider:'twitter'});
            var options = {upload:'cat.jpg', headers:{}, form:{'media[]':'...', status:'tweet'}};
            t.options.upload(t, 'statuses/update_with_media', options);
            should.deepEqual(options.multipart,
                [ { 'content-transfer-encoding': 'utf8',
                'content-disposition': 'form-data; name="media[]"; filename="cat.jpg"',
                'content-type': 'image/jpeg',
                body: '...'},
                { 'content-disposition': 'form-data; name="status"',
                    'content-type': 'text/plain',
                    body: 'tweet' } ]);
            done();
        });
    });

    describe('get', function () {
        it('set stackexchange get options', function (done) {
            var t = new TinyRest({provider:'stackexchange'});
            var options = {};
            t.options.get.call(t, 'api', options);
            should.deepEqual(options, {encoding:null});
            done();
        });
        it('set github get options', function (done) {
            var t = new TinyRest({provider:'github'});
            var options = {headers:{}};
            t.options.get.call(t, 'api', options);
            should.deepEqual(options, {headers:{'User-Agent':'TinyRest'}});
            done();
        });
        it('set linkedin get options', function (done) {
            var t = new TinyRest({provider:'linkedin'});
            var options = {headers:{}};
            t.options.get.call(t, 'api', options);
            options.headers['x-li-format'].should.equal('json');
            done();
        });
        it('set encoding to binary on certain gmaps APIs', function (done) {
            var t = new TinyRest({provider:'gmaps'});
            var options = {};
            t.options.get.call(t, 'api', options);
            should.deepEqual(options, {});
            t.options.get.call(t, 'streetview', options);
            should.deepEqual(options, {encoding:null});
            options = {};
            t.options.get.call(t, 'staticmap', options);
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
            var t = new TinyRest({provider:'twitter'});
            var options = {form:{one:"!*()'",two:2}};
            t.url('api', options).should
                .equal('https://api.twitter.com/1.1/api.json?one=%21%2a%28%29%27&two=2');
            done();
        });
        it('append json on missing gmaps format', function (done) {
            var t = new TinyRest({provider:'gmaps'});
            t.url('api', {}).should.equal('https://maps.googleapis.com/maps/api/api');
            t.url('timezone', {}).should.equal('https://maps.googleapis.com/maps/api/timezone/json');
            t.url('timezone/xml', {}).should.equal('https://maps.googleapis.com/maps/api/timezone/xml');
            t.url('timezone/json', {}).should.equal('https://maps.googleapis.com/maps/api/timezone/json');
            done();
        });
    });
});
