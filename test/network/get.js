
var TinyRest = require('../../lib/provider'),
    providers = require('../../config/providers'),
    cred = require('../../config/credentials');


describe('get', function () {
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
    
    it.skip('get twitter resource', function (done) {
        t.twitter.get('users/show', {
            oauth:{token:cred.user.twitter.token, secret:cred.user.twitter.secret},
            qs:{screen_name:'mightymob'}
        }, function (err, res, body) {
            if (err) return error(err, done);
            body.id.should.equal(1504092505);
            body.screen_name.should.equal('mightymob');
            done();
        });
    });
    it.skip('get linkedin resource', function (done) {
        t.linkedin.get('companies', {
            oauth:{token:cred.user.linkedin.token, secret:cred.user.linkedin.secret},
            qs:{'email-domain':'apple.com'}
        }, function (err, res, body) {
            if (err) return error(err, done);
            body.values[0].id.should.equal(162479);
            body.values[0].name.should.equal('Apple');
            done();
        });
    });
    it.skip('get facebook resource', function (done) {
        t.facebook.get('me/groups', {
            qs:{access_token:cred.user.facebook.token, fields:'id,name'}
        }, function (err, res, body) {
            if (err) return error(err, done);
            body.data.length.should.equal(2);
            Object.keys(body.data[0]).length.should.equal(2);
            body.data[0].id.should.equal('313807222041302');
            body.data[0].name.should.equal('Facebook Developers');
            done();
        });
    });
    it.skip('get facebook fql resource', function (done) {
        t.facebook.get('fql', {
            qs:{
                access_token:cred.user.facebook.token,
                q:'SELECT friend_count FROM user WHERE uid = 100006399333306'}
        }, function (err, res, body) {
            if (err) return error(err, done);
            body.data[0].friend_count.should.equal(1);
            done();
        });
    });
    it.skip('get bitly resource', function (done) {
        t.bitly.get('bitly_pro_domain', {
            qs:{access_token:cred.user.bitly.token, domain:'nyti.ms'}
        }, function (err, res, body) {
            if (err) return error(err, done);
            body.data.domain.should.equal('nyti.ms');
            body.data.bitly_pro_domain.should.equal(true);
            done();
        });
    });
    it.skip('get stocktwits resource', function (done) {
        t.stocktwits.get('streams/user/StockTwits', function (err, res, body) {
            if (err) return error(err, done);
            body.response.status.should.equal(200);
            body.messages.length.should.equal(30);
            done();
        });
    });
    it.skip('get soundcloud resource', function (done) {
        t.soundcloud.get('users', {
            qs:{oauth_token:cred.user.soundcloud.token, q:'thriftworks'}
        }, function (err, res, body) {
            if (err) return error(err, done);
            body[0].username.should.equal('Thriftworks');
            done();
        });
    });
    it.skip('get github resource', function (done) {
        t.github.get('users/simov', {
            qs:{access_token:cred.user.github.token}
        }, function (err, res, body) {
            if (err) return error(err, done);
            body.login.should.equal('simov');
            body.name.should.equal('simo');
            done();
        });
    });
    it.skip('get foursquare resource', function (done) {
        t.foursquare.get('users/81257627', {
            qs:{oauth_token:cred.user.foursquare.token, v:'20140503'}
        }, function (err, res, body) {
            if (err) return error(err, done);
            body.response.user.firstName.should.equal('Simo');
            done();
        });
    });
    it.skip('get stackexchange resource', function (done) {
        t.stackexchange.get('users', {
            qs:{
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
    it.skip('get rubygems resource', function (done) {
        t.rubygems.get('gems/rails', function (err, res, body) {
            if (err) return error(err, done);
            body.name.should.equal('rails');
            body.platform.should.equal('ruby');
            done();
        });
    });
    it.skip('get coderbits resource', function (done) {
        t.coderbits.get('simov', function (err, res, body) {
            if (err) return error(err, done);
            body.username.should.equal('simov');
            done();
        });
    });
    it.skip('get wikimapia resource', function (done) {
        t.wikimapia.get('', {
            qs: {
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

    describe('yahoo', function () {
        it.skip('get social resource', function (done) {
            t.yahoo.get('user/C6YWVTVM24O4SEGIIDLTWA5NUA/profile', {
                oauth:{
                    token:cred.user.yahoo.token, secret:cred.user.yahoo.secret
                },
                api:'social'
            }, function (err, res, body) {
                if (err) return error(err, done);
                body.profile.nickname.should.equal('Simeon')
                done();
            });
        });
        it.skip('get yql resource', function (done) {
            t.yahoo.get('yql', {
                oauth:{
                    token:cred.user.yahoo.token, secret:cred.user.yahoo.secret
                },
                api:'query',
                qs:{q:'SELECT * FROM social.profile WHERE guid=me'}
            }, function (err, res, body) {
                if (err) return error(err, done);
                body.query.results.profile.nickname.should.equal('Simeon');
                done();
            });
        });
        it.skip('get geo resource', function (done) {
            t.yahoo.get("places.q('Central Park, New York')", {
                api:'where',
                qs:{appid:cred.app.yahoo.req_key}
            }, function (err, res, body) {
                if (err) return error(err, done);
                body.places.place[0].admin1.should.equal('New York');
                done();
            });
        });
    });

    describe('google', function () {
        it.skip('get google+ resource', function (done) {
            t.google.get('people/106189723444098348646', {
                api:'plus',
                qs:{
                    access_token:cred.user.google.token
                }
            }, function (err, res, body) {
                if (err) return error(err, done);
                body.displayName.should.equal('Larry Page');
                done();
            });
        });
        it.skip('get youtube resource', function (done) {
            t.google.get('channels', {
                api:'youtube',
                qs:{
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
        it.skip('get youtube analytics resource', function (done) {
            t.google.get('reports', {
                api:'youtube/analytics',
                qs:{
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
        it.skip('get drive resource', function (done) {
            t.google.get('about', {
                api:'drive',
                qs:{
                    access_token:cred.user.google.token
                }
            }, function (err, res, body) {
                if (err) return error(err, done);
                body.user.isAuthenticatedUser.should.equal(true);
                done();
            });
        });
        it.skip('get freebase resource', function (done) {
            t.google.get('search', {
                api:'freebase',
                qs:{
                    access_token:cred.user.google.token,
                    query:'Thriftworks'
                }
            }, function (err, res, body) {
                if (err) return error(err, done);
                body.result[0].name.should.equal('Thriftworks');
                done();
            });
        });
        it.skip('get tasks resource', function (done) {
            t.google.get('users/@me/lists', {
                api:'tasks',
                qs:{
                    access_token:cred.user.google.token
                }
            }, function (err, res, body) {
                if (err) return error(err, done);
                body.items[0].title.should.equal('Default List');
                done();
            });
        });
        it.skip('get urlshortener resource', function (done) {
            t.google.get('url', {
                api:'urlshortener',
                qs:{
                    key:cred.app.google.req_key,
                    shortUrl:'http://goo.gl/0wkZ4V'
                }
            }, function (err, res, body) {
                if (err) return error(err, done);
                body.longUrl.should.equal('http://nodejs.org/');
                done();
            });
        });
        it.skip('get pagespeed resource', function (done) {
            t.google.get('runPagespeed', {
                api:'pagespeedonline',
                qs:{
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
        it.skip('get streetview resource', function (done) {
            t.gmaps.get('streetview', {
                qs:{
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
        it.skip('get staticmap resource', function (done) {
            t.gmaps.get('staticmap', {
                qs:{
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
        it.skip('get geocode resource', function (done) {
            t.gmaps.get('geocode/json', {
                qs:{
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
        it.skip('get directions resource', function (done) {
            t.gmaps.get('directions/json', {
                qs:{
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
        it.skip('get timezone resource', function (done) {
            t.gmaps.get('timezone/json', {
                qs:{
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
        it.skip('get elevation resource', function (done) {
            t.gmaps.get('elevation/json', {
                qs:{
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
        it.skip('get distancematrix resource', function (done) {
            t.gmaps.get('distancematrix/json', {
                qs:{
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
