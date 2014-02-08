
var should = require('should');
var TinyRest = require('../lib/tinyrest'),
    utils = require('../lib/utils');


describe('utils', function () {
    describe('querystring', function () {
        it('should create a querystring with special characters escaped', function (done) {
            var t = new TinyRest({provider:'twitter'});
            utils.qs.call(t, 'api', {one:"!*()'",two:2})
                .should.equal('/1.1/api.json?one=%21%2a%28%29%27&two=2');
            done();
        });
    });
    describe('response', function () {
        it('should not throw error on missing callback', function (done) {
            utils.response()(null, {}, {});
            done();
        });
        it('should return on error', function (done) {
            utils.response(function (err, res, body) {
                err.should.equal('err');
                res.should.equal('res');
                body.should.equal('body');
                done();
            })('err', 'res', 'body');
        });
        it('should try to parse body string as JSON', function (done) {
            utils.response(function (err, res, body) {
                if (err) return done(err);
                should.deepEqual(body, {data:'data'});
                done();
            })(null, {statusCode:200}, '{"data":"data"}');
        });
        it('should return parse error on body string', function (done) {
            utils.response(function (err, res, body) {
                err.message.should.equal('Parse error!')
                body.should.equal('<html>');
                done();
            })(null, {statusCode:200}, '<html>');
        });
        it('should return error on non successful status code', function (done) {
            utils.response(function (err, res, body) {
                should.deepEqual(err, {data:'data'});
                should.deepEqual(body, {data:'data'});
                done();
            })(null, {statusCode:500}, '{"data":"data"}');
        });
        it('should succeed on JSON body', function (done) {
            utils.response(function (err, res, body) {
                if (err) return done(err);
                should.deepEqual(body, {data:'data'});
                done();
            })(null, {statusCode:200}, {data:'data'});
        });
    });
});
