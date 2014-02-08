
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
    });

    require('./instance');
    require('./path');
    require('./utils');

    // network
    require('./error');
    require('./get');
    require('./post');
    require('./upload');
});
