
var should = require('should'),
    zlib = require('zlib');
var purest = require('../../lib/provider'),
    utils = require('../../lib/utils');


describe('utils', function () {
    describe('uri', function () {
        it('escape RFC3986 characters', function () {
            utils.uri.rfc3986("!*()'").should.equal('%21%2a%28%29%27');
        });
        it('create qs', function () {
            utils.uri.qs({a:"!*()'",b:2})
                .should.equal('a=%21%2a%28%29%27&b=2');
        });
    });

    describe('user agent', function () {
        it('create headers object', function () {
            var options = {};
            utils.agent(options);
            should.deepEqual(options.headers, {'User-Agent':'Purest'});
        });
        it('extend headers object', function () {
            var options = {headers:{'Content-Type':'...'}};
            utils.agent(options);
            should.deepEqual(options.headers, {'Content-Type':'...', 'User-Agent':'Purest'});
        });
        it('override user agent', function () {
            var options = {headers:{'user-agent':'Cat'}};
            utils.agent(options);
            should.deepEqual(options.headers, {'user-agent':'Cat'});
        });
    });

    describe('response', function () {
        it('don\'t throw error on missing callback', function () {
            utils.response()(null, {}, {});
        });
        it('return on error', function () {
            utils.response(function (err, res, body) {
                err.should.be.an.instanceOf(Error);
            })(new Error());
        });

        describe('parse string response', function () {
            it('content-encoding: application/json', function (done) {
                utils.response(function (err, res, body) {
                    if (err) return done(err);
                    should.deepEqual(body, {data:'data'});
                    done();
                })(
                    null,
                    {statusCode:200,headers:{'content-encoding':'application/json'}},
                    '{"data":"data"}'
                );
            });
            it('content-type: text/javascript', function (done) {
                utils.response(function (err, res, body) {
                    if (err) return done(err);
                    should.deepEqual(body, {data:'data'});
                    done();
                })(
                    null,
                    {statusCode:200,headers:{'content-type':'text/javascript'}},
                    '{"data":"data"}'
                );
            });
            it('content-type: application/json', function (done) {
                utils.response(function (err, res, body) {
                    if (err) return done(err);
                    should.deepEqual(body, {data:'data'});
                    done();
                })(
                    null,
                    {statusCode:200,headers:{'content-type':'application/json'}},
                    '{"data":"data"}'
                );
            });
            it('handle flickr response', function (done) {
                utils.response(function (err, res, body) {
                    if (err) return done(err);
                    should.deepEqual(body, {data:'data'});
                    done();
                })(
                    null,
                    {statusCode:200,headers:{'content-type':'text/javascript'}},
                    'jsonFlickrApi({"data":"data"})'
                );
            });
            it('return parse error on malformed json', function (done) {
                utils.response(function (err, res, body) {
                    err.message.should.equal('Parse error!')
                    body.should.equal('<html>');
                    done();
                })(
                    null,
                    {statusCode:200,headers:{'content-encoding':'application/json'}},
                    '<html>'
                );
            });
        });

        it('return error on non successful status code', function (done) {
            utils.response(function (err, res, body) {
                should.deepEqual(err, {data:'data'});
                should.deepEqual(body, {data:'data'});
                done();
            })(
                null,
                {statusCode:500,headers:{'content-encoding':'application/json'}},
                '{"data":"data"}'
            );
        });
        it('succeed on JSON body', function (done) {
            utils.response(function (err, res, body) {
                if (err) return done(err);
                should.deepEqual(body, {data:'data'});
                done();
            })(null, {statusCode:200,headers:{}}, {data:'data'});
        });
    });
});
