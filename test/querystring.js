
var TinyRest = require('../lib/tinyrest');


describe('querystring', function () {
    it('should get bitly path', function (done) {
        var t = new TinyRest({provider:'bitly'});
        t.getPath('link/clicks',{link:'http://bitly.com/1cZKMQh'})
            .should.equal('/v3/link/clicks?link=http%3A%2F%2Fbitly.com%2F1cZKMQh');
        done();
    });
    it('should get stocktwits path', function (done) {
        var t = new TinyRest({provider:'stocktwits'});
        t.getPath('search',{q:'stocktwits'})
            .should.equal('/api/2/search.json?q=stocktwits');
        done();
    });
    it('should get linkedin path', function (done) {
        var t = new TinyRest({provider:'linkedin'});
        t.getPath('companies',{'email-domain':'apple.com'})
            .should.equal('/v1/companies?email-domain=apple.com');
        done();
    });
    it('should get twitter path', function (done) {
        var t = new TinyRest({provider:'twitter'});
        t.getPath('users/show',{'screen_name':'mightymob'})
            .should.equal('/1.1/users/show.json?screen_name=mightymob');
        done();
    });
    it('should get facebook path', function (done) {
        var t = new TinyRest({provider:'facebook'});
        t.getPath('me/groups',{fields:'id,name'})
            .should.equal('/me/groups?fields=id%2Cname');
        done();
    });
    it('should get rubygems path', function (done) {
        var t = new TinyRest({provider:'rubygems'});
        t.getPath('search',{query:'rails'})
            .should.equal('/api/v1/search.json?query=rails');
        done();
    });
    it('should get soundcloud path', function (done) {
        var t = new TinyRest({provider:'soundcloud'});
        t.getPath('tracks',{genres:'dnb'})
            .should.equal('/tracks.json?genres=dnb');
        done();
    });
});
