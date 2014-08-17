
var fs = require('fs'),
    path = require('path');
var purest = require('../../lib/provider'),
    providers = require('../../config/providers');
var image = path.resolve(__dirname, '../fixtures/cat.png'),
    audio = path.resolve(__dirname, '../fixtures/beep.mp3');


describe('upload', function () {
    require('../utils/credentials');
    var cred = require('../../config/credentials');
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
            upload:'cat.png',
            form:{
                status:'Sent on '+new Date(),
                'media[]':fs.readFileSync(image)
            }
        },
        function (err, res, body) {
            debugger;
            if (err) return error(err, done);
            body.entities.media[0].should.be.an.instanceOf(Object);
            done();
        });
    });
    it('facebook', function (done) {
        p.facebook.post('me/photos', {
            upload:'cat.png',
            qs:{
                access_token:cred.user.facebook.token,
                message:'Sent on '+new Date()
            },
            form:{
                source:fs.readFileSync(image)
            }
        },
        function (err, res, body) {
            debugger;
            if (err) return error(err, done);
            body.id.should.match(/\d+/);
            body.post_id.should.match(/\d+_\d+/);
            done();
        });
    });
    it('stocktwits', function (done) {
        p.stocktwits.post('messages/create', {
            upload:'cat.png',
            qs:{
                access_token:cred.user.stocktwits.token
            },
            form:{
                body:'Sent on '+new Date(),
                chart:fs.readFileSync(image)
            }
        },
        function (err, res, body) {
            debugger;
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
            upload:'cat.png',
            form: {
                title:'Sent on '+new Date(),
                description:'...',
                is_public:0, is_friend:1, is_family:1, hidden:2,
                photo:fs.readFileSync(image)
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
            upload:'cat.png',
            form: {
                photo_id:'14887285783',
                photo:fs.readFileSync(image)
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
            upload:'cat.png',
            qs:{
                oauth_token:cred.user.foursquare.token, v:'20140503'
            },
            form:{
                photo:fs.readFileSync(image)
            }
        },
        function (err, res, body) {
            debugger;
            if (err) return error(err, done);
            body.meta.code.should.equal(200);
            done();
        });
    });
    it('asana', function (done) {
        var id = '15384754640287';
        p.asana.post('tasks/'+id+'/attachments', {
            auth: {bearer:cred.user.asana.token},
            upload:'cat.png',
            form:{
                file:fs.readFileSync(image)
            }
        },
        function (err, res, body) {
            debugger;
            if (err) return error(err, done);
            body.data.name.should.equal('cat.png');
            done();
        });
    });
    it('slack', function (done) {
        p.slack.post('files.upload', {
            upload:'cat.png',
            qs:{
                token:cred.user.slack.token,
                filename:'cat',
                title:'Sent on '+new Date()
            },
            form:{
                file:fs.readFileSync(image)
            }
        },
        function (err, res, body) {
            debugger;
            if (err) return error(err, done);
            body.ok.should.equal(true);
            body.file.name.should.equal('cat');
            done();
        });
    });
    it('soundcloud', function (done) {
        p.soundcloud.post('tracks', {
            upload:'beep.mp3',
            qs:{
                oauth_token:cred.user.soundcloud.token
            },
            form:{
                'track[title]':'Sent on '+new Date(),
                'track[asset_data]':fs.readFileSync(audio)
            }
        },
        function (err, res, body) {
            debugger;
            if (err) return error(err, done);
            body.kind.should.equal('track');
            done();
        });
    });
});

function error (err, done) {
    return (err instanceof Error)
        ? done(err)
        : (console.log(err) || done(new Error('Network error!')));
}
