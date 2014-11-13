
var fs = require('fs'),
    path = require('path'),
    should = require('should');
var purest = require('../../lib/provider'),
    providers = require('../../config/providers');
var image = path.resolve(__dirname, '../fixtures/cat.png'),
    audio = path.resolve(__dirname, '../fixtures/beep.mp3'),
    pdf = path.resolve(__dirname, '../fixtures/coffee.pdf');


describe('upload', function () {
    require('../utils/credentials');
    var cred = {
        app:require('../../config/app'),
        user:require('../../config/user')
    };
    var p = {};
    before(function () {
        for (var name in providers) {
            var provider = providers[name];
            p[name] = new purest(provider.__provider.oauth
                ? {provider:name, key:cred.app[name].key, secret:cred.app[name].secret}
                : {provider:name});
        }
    });

    describe('asana', function () {
        it('upload', function (done) {
            var id = '16202185639027';
            p.asana.post('tasks/'+id+'/attachments', {
                auth: {bearer:cred.user.asana.token},
                formData:{
                    file:fs.createReadStream(image)
                }
            },
            function (err, res, body) {
                debugger;
                if (err) return error(err, done);
                body.data.name.should.equal('cat.png');
                done();
            });
        });
    });
    describe('box content', function () {
        var file = {};
        it('upload', function (done) {
            p.box.post('files/content', {
                api:'upload',
                auth:{bearer:cred.user.box.token},
                qs:{parent_id:0},
                formData:{filename:fs.createReadStream(image)}
            }, function (err, res, body) {
                debugger;
                if (err) return error(err, done);
                body.entries[0].name.should.equal('cat.png');
                file = body.entries[0];
                done();
            });
        });
        it('download', function (done) {
            p.box.get('files/'+file.id+'/content', {
                auth:{bearer:cred.user.box.token}
            }, function (err, res, body) {
                debugger;
                if (err) return error(err, done);
                fs.writeFileSync('cat.png', body, 'binary');
                fs.statSync('cat.png').size.should.equal(22025);
                done();
            });
        });
        after(function (done) {
            p.box.del('files/'+file.id, {
                auth:{bearer:cred.user.box.token}
            }, function (err, res, body) {
                debugger;
                if (err) return error(err, done);
                fs.unlinkSync('cat.png');
                done();
            });
        });
    });
    describe('box view', function () {
        it.skip('upload', function (done) {
            // works - need to figure out a testing scheme
            p.box.post('documents', {
                api:'view-upload',
                headers: {
                    'Authorization':'Token '+cred.user.box.viewapikey,
                    'content-type':'multipart/form-data'
                },
                formData:{
                    name:'coffee.pdf',
                    file:fs.readFileSync(pdf)
                }
            }, function (err, res, body) {
                debugger;
                if (err) return error(err, done);
                body.type.should.equal('document');
                body.status.should.equal('queued');
                done();
            });
        });
    });
    it('facebook', function (done) {
        p.facebook.post('me/photos', {
            qs:{
                access_token:cred.user.facebook.token,
                message:'Sent on '+new Date()
            },
            formData:{
                source:fs.createReadStream(image)
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
    describe('flickr', function () {
        it('upload', function (done) {
            p.flickr.post('', {
                api:'upload',
                oauth:{token:cred.user.flickr.token, secret:cred.user.flickr.secret},
                qs:{
                    title:'Sent on '+new Date(),
                    description:'...',
                    is_public:0
                },
                formData: {
                    title:'Sent on '+new Date(),
                    description:'...',
                    is_public:0,
                    photo:fs.createReadStream(image)
                }
            },
            function (err, res, body) {
                debugger;
                if (err) return error(err, done);
                res.statusCode.should.equal(200);
                done();
            });
        });
        it('replace', function (done) {
            p.flickr.post('', {
                api:'replace',
                oauth:{token:cred.user.flickr.token, secret:cred.user.flickr.secret},
                qs: {
                    photo_id:'14887285783'
                },
                formData: {
                    photo_id:'14887285783',
                    photo:fs.createReadStream(image)
                }
            },
            function (err, res, body) {
                debugger;
                if (err) return error(err, done);
                res.statusCode.should.equal(200);
                done();
            });
        });
    });
    it('foursquare', function (done) {
        p.foursquare.post('users/self/update', {
            qs:{
                oauth_token:cred.user.foursquare.token,
                v:'20140503'
            },
            formData:{
                photo:fs.createReadStream(image)
            }
        },
        function (err, res, body) {
            debugger;
            if (err) return error(err, done);
            body.meta.code.should.equal(200);
            done();
        });
    });
    describe('google', function () {
        it('drive', function (done) {
            p.google.post('files', {
                api:'upload-drive',
                qs:{
                    access_token:cred.user.google.token,
                    uploadType:'multipart'
                },
                multipart: [
                    {
                        'Content-Type':'application/json',
                        body:JSON.stringify({
                            title:'cat.png'
                        })
                    },
                    {
                        'Content-Type':'image/png',
                        body:fs.createReadStream(image)
                    }
                ]
            },
            function (err, res, body) {
                debugger;
                if (err) return error(err, done);
                body.title.should.equal('cat.png');
                body.fileSize.should.equal('22025');
                done();
            });
        });
    });
    it('mailgun', function (done) {
        p.mailgun.post(cred.user.mailgun.domain+'/messages', {
            auth:{user:'api',pass:cred.user.mailgun.apikey},
            formData:{
                from:'purest@mailinator.com',
                to:'purest@mailinator.com,purest2@mailinator.com',
                subject:'Purest is awesome! (mailgun+attachments)',
                html:'<h1>Purest is awesome!</h1>',
                text:'True idd!',
                attachment:[fs.createReadStream(image), fs.createReadStream(audio)]
            }
        },
        function (err, res, body) {
            debugger;
            if (err) return error(err, done);
            body.message.should.be.type('string');
            body.id.should.be.type('string');
            done();
        });
    });
    it('sendgrid', function (done) {
        p.sendgrid.post('mail.send', {
            formData:{
                api_user:cred.user.sendgrid.user,
                api_key:cred.user.sendgrid.pass,
                from:'purest@mailinator.com',
                to:['purest@mailinator.com','purest2@mailinator.com'],
                subject:'Purest is awesome! (sendgrid+attachments)',
                html:'<h1>Purest is awesome!</h1>',
                text:'True idd!',
                'files[cat.png]':fs.createReadStream(image),
                'files[beep.mp3]':fs.createReadStream(audio)
            }
        },
        function (err, res, body) {
            debugger;
            if (err) return error(err, done);
            body.message.should.equal('success');
            done();
        });
    });
    it('slack', function (done) {
        p.slack.post('files.upload', {
            qs:{
                token:cred.user.slack.token,
                filename:'cat',
                title:'Sent on '+new Date()
            },
            formData:{
                file:fs.createReadStream(image)
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
            qs:{
                oauth_token:cred.user.soundcloud.token
            },
            formData:{
                'track[title]':'Sent on '+new Date(),
                'track[asset_data]':fs.createReadStream(audio)
            }
        },
        function (err, res, body) {
            debugger;
            if (err) return error(err, done);
            body.kind.should.equal('track');
            done();
        });
    });
    it('stocktwits', function (done) {
        p.stocktwits.post('messages/create', {
            qs:{
                access_token:cred.user.stocktwits.token
            },
            formData:{
                body:'Sent on '+new Date(),
                chart:fs.createReadStream(image)
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
    it('twitter', function (done) {
        p.twitter.post('statuses/update_with_media', {
            oauth:{token:cred.user.twitter.token, secret:cred.user.twitter.secret},
            formData:{
                status:'Sent on '+new Date(),
                'media[]':fs.createReadStream(image)
            }
        },
        function (err, res, body) {
            debugger;
            if (err) return error(err, done);
            body.entities.media[0].should.be.an.instanceOf(Object);
            done();
        });
    });
});

function error (err, done) {
    return (err instanceof Error)
        ? done(err)
        : (console.log(err) || done(new Error('Network error!')));
}
