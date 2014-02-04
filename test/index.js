
var TinyRest = require('../lib/tinyrest');


describe('tinyrest', function () {
    
    describe('common', function () {
        it('should throw an error on non specified provider', function (done) {
            (function () {
                var t = new TinyRest();
            }).should.throw('TinyRest: provider option is required!');
            done();
        });
        it('should throw an error on non existing provider', function (done) {
            (function () {
                var t = new TinyRest({provider:'dood'});
            }).should.throw('TinyRest: non existing provider!');
            done();
        });
        it('should create a querystring', function (done) {
            var t = new TinyRest({provider:'bitly'});
            t.toQueryString({one:'1',two:2})
                .should.equal('one=1&two=2');
            done();
        });
    });

    require('./instance');
    require('./path');
    require('./querystring');

    // network
    require('./error');
    require('./get');
    require('./post');
    require('./upload');
});
