
var fs = require('fs');
var TinyRest = require('../lib/tinyrest');


describe.skip('upload', function () {
    it('should upload image to twitter', function (done) {
        var t = new TinyRest({provider:'twitter',
            consumerKey:cred.app.twitter.key,
            consumerSecret:cred.app.twitter.secret});
        t.post('statuses/update_with_media', {
            t_token:cred.user.twitter.token,
            t_secret:cred.user.twitter.secret,
            t_mime:'image/jpeg'
        }, {
            status:'Message on '+new Date(),
            'media[]':fs.readFileSync('/home/mighty/hdd/images/cat4.jpg')
        },
        function (err, res, body) {
            if (err) return (err instanceof Error) ? done(err) : (console.log(err)||done(new Error('Network error!')));
            console.log(body);
            body.source.should.equal('<a href="http://outofindex.com" rel="nofollow">TinyRest</a>');
            body.entities.media[0].should.be.an.instanceOf(Object);
            done();
        });
    });
});
