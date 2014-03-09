
var TinyRest = require('../../lib/tinyrest'),
    providers = require('../../config/providers'),
    cred = require('../credentials');


describe('error', function () {
    var t = {};
    before(function (done) {
        for (var name in providers) {
            var provider = providers[name];
            if (provider.oauth) {
                t[name] = new TinyRest({provider:name,
                    consumerKey:cred.app[name].key,
                    consumerSecret:cred.app[name].secret
                });
            } else {
                t[name] = new TinyRest({provider:name});
            }
        }
        done();
    });

    it.skip('should return stocktwits api error', function (done) {
        t.stocktwits.get('streams/user/nonexisting', function (err, res, body) {
            err.response.status.should.equal(404);
            err.errors[0].message.should.equal('User not found');
            done();
        });
    });
});
