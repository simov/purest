
var refresh = require('../utils/refresh');


describe('refresh', function () {
    it('yahoo', function (done) {
        refresh.yahoo(function (err, res, body) {
            if (err) return done(err);
            body.oauth_token.should.be.type('string');
            body.oauth_token_secret.should.be.type('string');
            body.oauth_expires_in.should.equal('3600');
            body.oauth_session_handle.should.be.type('string');
            done();
        });
    });
    it('asana', function (done) {
        refresh.asana(function (err, res, body) {
            if (err) return done(err);
            body.access_token.should.be.type('string');
            body.token_type.should.equal('bearer');
            body.expires_in.should.equal(3600);
            done();
        });
    });
    it('heroku', function (done) {
        refresh.heroku(function (err, res, body) {
            if (err) return done(err);
            body.access_token.should.be.type('string');
            body.refresh_token.should.be.type('string');
            body.token_type.should.equal('Bearer');
            body.expires_in.should.equal(7199);
            done();
        });
    });
    it('google', function (done) {
        refresh.google(function (err, res, body) {
            if (err) return done(err);
            body.access_token.should.be.type('string');
            body.token_type.should.equal('Bearer');
            body.expires_in.should.equal(3600);
            done();
        });
    });
});
