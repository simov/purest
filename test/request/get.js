
var purest = require('../../lib/provider'),
    providers = require('../../config/providers'),
    cred = require('../../config/credentials');


describe('get', function () {
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

    it('get twitter resource', function (done) {
        p.twitter.get('users/show', {
            oauth:{token:cred.user.twitter.token, secret:cred.user.twitter.secret},
            qs:{screen_name:'mightymob'}
        }, function (err, res, body) {
            if (err) return error(err, done);
            body.id.should.equal(1504092505);
            body.screen_name.should.equal('mightymob');
            done();
        });
    });
    it('get linkedin resource', function (done) {
        p.linkedin.get('companies', {
            oauth:{token:cred.user.linkedin.token, secret:cred.user.linkedin.secret},
            qs:{'email-domain':'apple.com'}
        }, function (err, res, body) {
            if (err) return error(err, done);
            body.values[0].id.should.equal(162479);
            body.values[0].name.should.equal('Apple');
            done();
        });
    });
    it('get facebook resource', function (done) {
        p.facebook.get('me/groups', {
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
    it('get facebook fql resource', function (done) {
        p.facebook.get('fql', {
            qs:{
                access_token:cred.user.facebook.token,
                q:'SELECT friend_count FROM user WHERE uid = 100006399333306'}
        }, function (err, res, body) {
            if (err) return error(err, done);
            body.data[0].friend_count.should.equal(1);
            done();
        });
    });
    it('get bitly resource', function (done) {
        p.bitly.get('bitly_pro_domain', {
            qs:{access_token:cred.user.bitly.token, domain:'nyti.ms'}
        }, function (err, res, body) {
            if (err) return error(err, done);
            body.data.domain.should.equal('nyti.ms');
            body.data.bitly_pro_domain.should.equal(true);
            done();
        });
    });
    it('get stocktwits resource', function (done) {
        p.stocktwits.get('streams/user/StockTwits', function (err, res, body) {
            if (err) return error(err, done);
            body.response.status.should.equal(200);
            body.messages.length.should.equal(30);
            done();
        });
    });
    it('get soundcloud resource', function (done) {
        p.soundcloud.get('users', {
            qs:{oauth_token:cred.user.soundcloud.token, q:'thriftworks'}
        }, function (err, res, body) {
            if (err) return error(err, done);
            body[0].username.should.equal('Thriftworks');
            done();
        });
    });
    it('get github resource', function (done) {
        p.github.get('users/simov', {
            qs:{access_token:cred.user.github.token}
        }, function (err, res, body) {
            if (err) return error(err, done);
            body.login.should.equal('simov');
            body.name.should.equal('simo');
            done();
        });
    });
    it('get foursquare resource', function (done) {
        p.foursquare.get('users/81257627', {
            qs:{oauth_token:cred.user.foursquare.token, v:'20140503'}
        }, function (err, res, body) {
            if (err) return error(err, done);
            body.response.user.firstName.should.equal('Simo');
            done();
        });
    });
    it('get stackexchange resource', function (done) {
        p.stackexchange.get('users', {
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
    it('get rubygems resource', function (done) {
        p.rubygems.get('gems/rails', function (err, res, body) {
            if (err) return error(err, done);
            body.name.should.equal('rails');
            body.platform.should.equal('ruby');
            done();
        });
    });
    it('get coderbits resource', function (done) {
        p.coderbits.get('simov', function (err, res, body) {
            if (err) return error(err, done);
            body.username.should.equal('simov');
            done();
        });
    });
    it('get wikimapia resource', function (done) {
        p.wikimapia.get('', {
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
        it('get social resource', function (done) {
            p.yahoo.get('user/C6YWVTVM24O4SEGIIDLTWA5NUA/profile', {
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
        it('get yql resource', function (done) {
            p.yahoo.get('yql', {
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
        it('get geo resource', function (done) {
            p.yahoo.get("places.q('Central Park, New York')", {
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
        it('get google+ resource', function (done) {
            p.google.get('people/106189723444098348646', {
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
        it('get youtube resource', function (done) {
            p.google.get('channels', {
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
        it('get youtube analytics resource', function (done) {
            p.google.get('reports', {
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
        it('get drive resource', function (done) {
            p.google.get('about', {
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
        it('get freebase resource', function (done) {
            p.google.get('search', {
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
        it('get tasks resource', function (done) {
            p.google.get('users/@me/lists', {
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
        it('get urlshortener resource', function (done) {
            p.google.get('url', {
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
        it('get pagespeed resource', function (done) {
            p.google.get('runPagespeed', {
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
        it('get contacts', function (done) {
            p.google.get('default/full', {
                api:'m8/feeds/contacts',
                qs:{
                    access_token:cred.user.google.token
                }
            }, function (err, res, body) {
                debugger;
                if (err) return error(err, done);
                res.statusCode.should.equal(200);
                done();
            });
        });
    });
    
    describe('google maps', function () {
        it('get streetview resource', function (done) {
            p.gmaps.get('streetview', {
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
        it('get staticmap resource', function (done) {
            p.gmaps.get('staticmap', {
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
        it('get geocode resource', function (done) {
            p.gmaps.get('geocode/json', {
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
        it('get directions resource', function (done) {
            p.gmaps.get('directions/json', {
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
        it('get timezone resource', function (done) {
            p.gmaps.get('timezone/json', {
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
        it('get elevation resource', function (done) {
            p.gmaps.get('elevation/json', {
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
        it('get distancematrix resource', function (done) {
            p.gmaps.get('distancematrix/json', {
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
