
var TinyRest = require('../lib/tinyrest');


describe.skip('error', function () {
    it('should return stocktwits api error', function (done) {
        var t = new TinyRest({provider:'stocktwits'});
        t.get('streams/user/nonexisting', function (err, res, body) {
            err.response.status.should.equal(404);
            err.errors[0].message.should.equal('User not found');
            done();
        });
    });
});
