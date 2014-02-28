
var TinyRest = require('../lib/tinyrest'),
    cred = require('./credentials');


describe.skip('get', function () {
    var t = null;
    before(function (done) {
        t = {
            twitter: new TinyRest({provider:'twitter',
                consumerKey:cred.app.twitter.key,
                consumerSecret:cred.app.twitter.secret
            }),
            linkedin: new TinyRest({provider:'linkedin',
                consumerKey:cred.app.linkedin.key,
                consumerSecret:cred.app.linkedin.secret
            }),
            facebook: new TinyRest({provider:'facebook'}),
            bitly: new TinyRest({provider:'bitly'}),
            stocktwits: new TinyRest({provider:'stocktwits'}),
            soundcloud: new TinyRest({provider:'soundcloud'}),
            github: new TinyRest({provider:'github'}),
            stackexchange: new TinyRest({provider:'stackexchange'}),
            google: new TinyRest({provider:'google'}),
            gmaps: new TinyRest({provider:'gmaps'}),
            rubygems: new TinyRest({provider:'rubygems'}),
            coderbits: new TinyRest({provider:'coderbits'}),
            wikimapia: new TinyRest({provider:'wikimapia'})
        };
        done();
    });
    it('should get twitter resource', function (done) {
        t.twitter.get('users/show', {
            options:{token:cred.user.twitter.token, secret:cred.user.twitter.secret},
            params:{screen_name:'mightymob'}
        }, function (err, res, body) {
            if (err) return error(err, done);
            body.id.should.equal(1504092505);
            body.screen_name.should.equal('mightymob');
            done();
        });
    });
    it('should get linkedin resource', function (done) {
        t.linkedin.get('companies', {
            options:{token:cred.user.linkedin.token, secret:cred.user.linkedin.secret},
            params:{'email-domain':'apple.com'}
        }, function (err, res, body) {
            if (err) return error(err, done);
            body.values[0].id.should.equal(162479);
            body.values[0].name.should.equal('Apple');
            done();
        });
    });
    it('should get facebook resource', function (done) {
        t.facebook.get('me/groups', {
            params:{access_token:cred.user.facebook.token, fields:'id,name'}
        }, function (err, res, body) {
            if (err) return error(err, done);
            body.data.length.should.equal(2);
            Object.keys(body.data[0]).length.should.equal(2);
            body.data[0].id.should.equal('313807222041302');
            body.data[0].name.should.equal('Facebook Developers');
            done();
        });
    });
    it('should get facebook fql resource', function (done) {
        t.facebook.get('fql', {params:{
            access_token:cred.user.facebook.token,
            q:'SELECT friend_count FROM user WHERE uid = 100006399333306'}
        }, function (err, res, body) {
            if (err) return error(err, done);
            body.data[0].friend_count.should.equal(1);
            done();
        });
    });
    it('should get bitly resource', function (done) {
        t.bitly.get('bitly_pro_domain', {
            params:{access_token:cred.user.bitly.token, domain:'nyti.ms'}
        }, function (err, res, body) {
            if (err) return error(err, done);
            body.data.domain.should.equal('nyti.ms');
            body.data.bitly_pro_domain.should.equal(true);
            done();
        });
    });
    it('should get stocktwits resource', function (done) {
        t.stocktwits.get('streams/user/StockTwits', function (err, res, body) {
            if (err) return error(err, done);
            body.response.status.should.equal(200);
            body.messages.length.should.equal(30);
            done();
        });
    });
    it('should get soundcloud resource', function (done) {
        t.soundcloud.get('users', {
            params:{oauth_token:cred.user.soundcloud.token, q:'thriftworks'}
        }, function (err, res, body) {
            if (err) return error(err, done);
            body[0].username.should.equal('Thriftworks');
            done();
        });
    });
    it('should get github resource', function (done) {
        t.github.get('users/simov', {
            params:{access_token:cred.user.github.token}
        }, function (err, res, body) {
            if (err) return error(err, done);
            body.login.should.equal('simov');
            body.name.should.equal('simo');
            done();
        });
    });
    it('should get stackexchange resource', function (done) {
        t.stackexchange.get('users', {
            params:{
                key:cred.app.stackexchange.req_key,
                access_token:cred.user.stackexchange.token,
                site:'stackoverflow',
                sort:'reputation',
                order:'desc'
            }
        }, function (err, res, body) {
            if (err) return error(err, done);
            body.items.length.should.equal(30);
            done();
        });
    });
    it('should get rubygems resource', function (done) {
        t.rubygems.get('gems/rails', function (err, res, body) {
            if (err) return error(err, done);
            body.name.should.equal('rails');
            body.platform.should.equal('ruby');
            done();
        });
    });
    it('should get coderbits resource', function (done) {
        t.coderbits.get('simov', function (err, res, body) {
            if (err) return error(err, done);
            body.username.should.equal('simov');
            done();
        });
    });
    it('should get wikimapia resource', function (done) {
        t.wikimapia.get('', {
            params: {
                key:cred.app.wikimapia.req_key,
                function:'place.search',
                q:'Central Park, New York, NY',
                lat:'40.7629025',
                lon:'-73.9826439',
                format:'json'
            }
        }, function (err, res, body) {
            if (err) return error(err, done);
            body.count.should.equal(5);
            done();
        });
    });

    describe('google APIs', function () {
        it('should get google+ resource', function (done) {
            t.google.get('people/106189723444098348646', {
                options:{api:'plus'},
                params:{
                    access_token:cred.user.google.token
                }
            }, function (err, res, body) {
                if (err) return error(err, done);
                body.displayName.should.equal('Larry Page');
                done();
            });
        });
        it('should get youtube resource', function (done) {
            t.google.get('channels', {
                options:{api:'youtube'},
                params:{
                    access_token:cred.user.google.token,
                    part:'id, snippet, contentDetails, statistics, status, topicDetails',
                    forUsername:'RayWilliamJohnson'
                }
            }, function (err, res, body) {
                if (err) return error(err, done);
                body.items[0].snippet.title.should.equal('RayWilliamJohnson');
                done();
            });
        });
        it('should get youtube analytics resource', function (done) {
            t.google.get('reports', {
                options:{api:'youtube/analytics'},
                params:{
                    access_token:cred.user.google.token,
                    ids:'channel==UCar6nMFGfuv254zn5vDyVaA',
                    metrics:'views',
                    'start-date':'2014-01-15',
                    'end-date':'2014-02-15'
                }
            }, function (err, res, body) {
                if (err) return error(err, done);
                body.rows.should.be.an.instanceOf(Array);
                done();
            });
        });
        it('should get drive resource', function (done) {
            t.google.get('about', {
                options:{api:'drive'},
                params:{
                    access_token:cred.user.google.token
                }
            }, function (err, res, body) {
                if (err) return error(err, done);
                body.user.isAuthenticatedUser.should.equal(true);
                done();
            });
        });
        it('should get freebase resource', function (done) {
            t.google.get('search', {
                options:{api:'freebase'},
                params:{
                    access_token:cred.user.google.token,
                    query:'Thriftworks'
                }
            }, function (err, res, body) {
                if (err) return error(err, done);
                body.result[0].name.should.equal('Thriftworks');
                done();
            });
        });
        it('should get tasks resource', function (done) {
            t.google.get('users/@me/lists', {
                options:{api:'tasks'},
                params:{
                    access_token:cred.user.google.token
                }
            }, function (err, res, body) {
                if (err) return error(err, done);
                body.items[0].title.should.equal('Default List');
                done();
            });
        });
        it('should get urlshortener resource', function (done) {
            t.google.get('url', {
                options:{api:'urlshortener'},
                params:{
                    key:cred.app.google.req_key,
                    shortUrl:'http://goo.gl/0wkZ4V'
                }
            }, function (err, res, body) {
                if (err) return error(err, done);
                body.longUrl.should.equal('http://nodejs.org/');
                done();
            });
        });
        it('should get pagespeed resource', function (done) {
            t.google.get('runPagespeed', {
                options:{api:'pagespeedonline'},
                params:{
                    key:cred.app.google.req_key,
                    url:'http://www.amazon.com/'
                }
            }, function (err, res, body) {
                if (err) return error(err, done);
                body.responseCode.should.equal(200);
                done();
            });
        });
    });
    
    describe('google maps', function () {
        it('should get streetview resource', function (done) {
            t.gmaps.get('streetview', {
                options:{binary:true},
                params:{
                    key:cred.app.google.req_key,
                    location:'40.7828647,-73.9653551',
                    size:'400x400',
                    sensor:false
                }
            }, function (err, res, body) {
                if (err) return error(err, done);
                (require('fs')).writeFileSync('streetview.jpg', body, 'binary');
                done();
            });
        });
        it('should get staticmap resource', function (done) {
            t.gmaps.get('staticmap', {
                options:{binary:true},
                params:{
                    key:cred.app.google.req_key,
                    center:'40.7828647,-73.9653551',
                    size:'640x640',
                    zoom:15,
                    format:'jpg',
                    sensor:false
                }
            }, function (err, res, body) {
                if (err) return error(err, done);
                (require('fs')).writeFileSync('staticmap.jpg', body, 'binary');
                done();
            });
        });
        it('should get geocode resource', function (done) {
            t.gmaps.get('geocode/json', {
                params:{
                    key:cred.app.google.req_key,
                    address:'Central Park, New York, NY',
                    sensor:false
                }
            }, function (err, res, body) {
                if (err) return error(err, done);
                body.results[0].formatted_address
                    .should.equal('Central Park, New York, NY, USA');
                done();
            });
        });
        it('should get directions resource', function (done) {
            t.gmaps.get('directions/json', {
                params:{
                    key:cred.app.google.req_key,
                    origin:'Central Park, New York, NY',
                    destination:'New York, New Jersey',
                    sensor:false
                }
            }, function (err, res, body) {
                if (err) return error(err, done);
                body.routes[0].summary
                    .should.equal('79th Street Transverse and Central Park West');
                done();
            });
        });
        it('should get timezone resource', function (done) {
            t.gmaps.get('timezone/json', {
                params:{
                    key:cred.app.google.req_key,
                    location:'40.7828647,-73.9653551',
                    timestamp:'1331161200',
                    sensor:false
                }
            }, function (err, res, body) {
                if (err) return error(err, done);
                body.timeZoneName.should.equal('Eastern Standard Time');
                done();
            });
        });
        it('should get elevation resource', function (done) {
            t.gmaps.get('elevation/json', {
                params:{
                    key:cred.app.google.req_key,
                    locations:'40.7828647,-73.9653551',
                    sensor:false
                }
            }, function (err, res, body) {
                if (err) return error(err, done);
                body.results[0].elevation.should.equal(34.39545059204102);
                done();
            });
        });
        it('should get distancematrix resource', function (done) {
            t.gmaps.get('distancematrix/json', {
                params:{
                    key:cred.app.google.req_key,
                    origins:'40.7828647,-73.9653551',
                    destinations:'40.7873463,-74.0108939',
                    sensor:false
                }
            }, function (err, res, body) {
                if (err) return error(err, done);
                body.rows[0].elements[0].distance.text.should.equal('11.3 km');
                body.rows[0].elements[0].duration.text.should.equal('18 mins');
                done();
            });
        });
    });
});

function error (err, done) {
    return (err instanceof Error)
        ? done(err)
        : (console.log(err) || done(new Error('Network error!')));
}
