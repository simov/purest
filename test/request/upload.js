
var fs = require('fs');
var purest = require('../../lib/provider'),
    providers = require('../../config/providers'),
    cred = require('../../config/credentials');


describe('upload', function () {
    var p = {};
    before(function (done) {
        for (var name in providers) {
            var provider = providers[name];
            p[name] = new purest(provider.oauth
                ? {provider:name, key:cred.app[name].key, secret:cred.app[name].secret}
                : {provider:name});
        }
        done();
    });

    it('twitter', function (done) {
        p.twitter.post('statuses/update_with_media', {
            oauth:{token:cred.user.twitter.token, secret:cred.user.twitter.secret},
            upload:'cat1.png',
            form:{
                status:'Message on '+new Date(),
                'media[]':fs.readFileSync('/home/mighty/hdd/images/cat1.png')
            }
        },
        function (err, res, body) {
            if (err) return error(err, done);
            body.source.should.equal('<a href="http://outofindex.com" rel="nofollow">purest</a>');
            body.entities.media[0].should.be.an.instanceOf(Object);
            done();
        });
    });
    it('facebook', function (done) {
        p.facebook.post('me/photos', {
            upload:'cat1.png',
            qs:{
                access_token:cred.user.facebook.token,
                message:'Message on '+new Date()
            },
            form:{
                source:fs.readFileSync('/home/mighty/hdd/images/cat1.png')
            }
        },
        function (err, res, body) {
            if (err) return error(err, done);
            body.id.should.match(/\d+/);
            body.post_id.should.match(/\d+_\d+/);
            done();
        });
    });
    it('stocktwits', function (done) {
        p.stocktwits.post('messages/create', {
            upload:'cat1.png',
            qs:{
                access_token:cred.user.stocktwits.token
            },
            form:{
                body:'Message on '+new Date(),
                chart:fs.readFileSync('/home/mighty/hdd/images/cat1.png')
            }
        },
        function (err, res, body) {
            if (err) return error(err, done);
            body.response.status.should.equal(200);
            body.message.entities.chart.should.be.an.instanceOf(Object);
            done();
        });
    });
    it('flickr upload', function (done) {
        p.flickr.post('', {
            oauth:{token:cred.user.flickr.token, secret:cred.user.flickr.secret},
            api:'upload',
            upload:'cat1.png',
            form: {
                title: 'My cat is awesome',
                description: 'very cute',
                is_public: 0, is_friend: 1, is_family: 1, hidden: 2,
                photo:fs.readFileSync('/home/mighty/hdd/images/cat1.png')
            }
        },
        function (err, res, body) {
            debugger;
            if (err) return error(err, done);
            res.statusCode.should.equal(200);
            done();
        });
    });
    it('flickr replace', function (done) {
        p.flickr.post('', {
            oauth:{token:cred.user.flickr.token, secret:cred.user.flickr.secret},
            api:'replace',
            upload:'cat1.png',
            form: {
                photo_id:'14887285783',
                photo:fs.readFileSync('/home/mighty/hdd/images/cat1.png')
            }
        },
        function (err, res, body) {
            debugger;
            if (err) return error(err, done);
            res.statusCode.should.equal(200);
            done();
        });
    });
    it('foursquare', function (done) {
        p.foursquare.post('users/self/update', {
            upload:'cat1.png',
            qs:{
                oauth_token:cred.user.foursquare.token, v:'20140503'
            },
            form:{
                photo:fs.readFileSync('/home/mighty/hdd/images/cat1.png')
            }
        },
        function (err, res, body) {
            if (err) return error(err, done);
            body.meta.code.should.equal(200);
            done();
        });
    });
});

function error (err, done) {
    return (err instanceof Error)
        ? done(err)
        : (console.log(err) || done(new Error('Network error!')));
}
