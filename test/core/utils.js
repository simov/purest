
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
    describe('response', function () {
        it('don\'t throw error on missing callback', function (done) {
            utils.response()(null, {}, {});
            done();
        });
        it('return on error', function (done) {
            utils.response(function (err, res, body) {
                err.should.equal('err');
                res.should.equal('res');
                body.should.equal('body');
                done();
            })('err', 'res', 'body');
        });
        it('try to parse body string as JSON', function (done) {
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
        it('decompress a gzip encoded body', function (done) {
            zlib.gzip('{"data":"data"}', function (err, encoded) {
                utils.response(function (err, res, body) {
                    if (err) return done(err);
                    should.deepEqual(body, {data:'data'});
                    done();
                })(null, {statusCode:200,headers:{'content-encoding':'gzip'}}, encoded);
            });
        });
        it('decompress a deflate encoded body', function (done) {
            zlib.deflate('{"data":"data"}', function (err, encoded) {
                utils.response(function (err, res, body) {
                    if (err) return done(err);
                    should.deepEqual(body, {data:'data'});
                    done();
                })(null, {statusCode:200,headers:{'content-encoding':'deflate'}}, encoded);
            });
        });
    });
});
