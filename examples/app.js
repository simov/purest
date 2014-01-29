
var express = require('express'),
    hogan = require('hogan.js'),
    consolidate = require('consolidate');

var app = express();

app.configure(function() {
    // config

    app.set('port', process.env.PORT || 3000);
    app.set('views', __dirname);
    app.set('view engine', 'html');
    // app.set('view cache', true);
    app.engine('html', consolidate.hogan);

    // middleware

    app.use(express.cookieParser('very secret - required'));
    app.use(express.session());
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(__dirname + '/public'));
});

app.configure('development', function() {
    app.use(express.errorHandler());
});


var passport = require('passport');

var TwitterStrategy = require('passport-twitter').Strategy,
    BitlyStrategy = require('passport-bitly').Strategy,
    SoundcloudStrategy = require('passport-soundcloud').Strategy;

passport.use(new TwitterStrategy({
        consumerKey:'JcUnnvfEBZvlTqGOJxmx0w', // simo 1 app
        consumerSecret:'deu3YCb0M3Qi6HKUVVgqBEwQ2YmhVLCwVAB4J7OM',
        callbackURL:'http://' + 'localhost:' + app.get('port')  + '/connect/twitter/callback',
        passReqToCallback:true
    }, function (req, token, secret, profile, done) {
        console.log('account', '->', profile.username);
        console.log('token', '->', token);
        console.log('secret', '->', secret);
        console.log('-------------------------------');
        
        done();
    }
));
passport.use(new BitlyStrategy({
        clientID:'7a4862495479086bd98970535cbc3a6aa36a3029', // Kojongi app
        clientSecret:'67f3fea668e4871c303eb4f27e12bffe6fe3fdba',
        callbackURL:'http://' + 'localhost:' + app.get('port')  + '/connect/bitly/callback',
        passReqToCallback:true
    }, function (req, token, secret, profile, done) {
        console.log('account', '->', profile);
        console.log('token', '->', token);
        console.log('secret', '->', secret);
        console.log('-------------------------------');
        
        done();
    }
));
passport.use(new SoundcloudStrategy({
        clientID:'5f895a1c316123865dd06189837496aa', // 
        clientSecret:'4089eb40412ee26c3521a81d2094f541',
        callbackURL:'http://' + 'localhost:' + app.get('port')  + '/connect/soundcloud/callback',
        passReqToCallback:true
    }, function (req, token, secret, profile, done) {
        console.log('account', '->', profile);
        console.log('token', '->', token);
        console.log('secret', '->', secret);
        console.log('-------------------------------');
        
        done();
    }
));

app.get('/connect/twitter', passport.authorize('twitter', { failureRedirect:'/', successRedirect:'/' }));
app.get('/connect/twitter/callback', passport.authorize('twitter', { failureRedirect:'/', successRedirect:'/' }));

app.get('/connect/bitly', passport.authenticate('bitly', { failureRedirect:'/', successRedirect:'/' }));
app.get('/connect/bitly/callback', passport.authenticate('bitly', { failureRedirect:'/', successRedirect:'/' }));

app.get('/connect/soundcloud', passport.authenticate('soundcloud', { failureRedirect:'/', successRedirect:'/' }));
app.get('/connect/soundcloud/callback', passport.authenticate('soundcloud', { failureRedirect:'/', successRedirect:'/' }));


app.get('/', function (req, res) {
    res.render('app');
});


app.listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
});
