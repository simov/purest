
var express = require('express'),
    hogan = require('hogan.js'),
    consolidate = require('consolidate');

var app = express();

app.configure(function() {
    
    app.set('port', process.env.PORT || 3000);
    app.set('views', __dirname);
    app.set('view engine', 'html');
    // app.set('view cache', true);
    app.engine('html', consolidate.hogan);

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


var passport = require('passport'),
    cred = require('../../test/credentials');

['twitter', 'facebook', 'linkedin', 'soundcloud', 'stocktwits', 'bitly']
.forEach(function (provider) {
    
    var options = {};
    var key    = /(twitter|linkedin)/.test(provider) ? 'consumerKey'    : 'clientID';
    var secret = /(twitter|linkedin)/.test(provider) ? 'consumerSecret' : 'clientSecret';

    options[key] = cred.app[provider].key;
    options[secret] = cred.app[provider].secret;
    options.callbackURL = ['http://','localhost:',app.get('port'),'/connect/',provider,'/callback'].join('');
    options.passReqToCallback = true;

    var strategy = new (require('passport-'+provider).Strategy)(options, function (req, token, secret, profile, done) {
        console.log('account', '->', profile.username);
        console.log('token', '->', token);
        console.log('secret', '->', secret);
        done();
    });

    passport.use(strategy);
});

app.get('/connect/twitter', passport.authorize('twitter', { failureRedirect:'/', successRedirect:'/' }));
app.get('/connect/twitter/callback', passport.authorize('twitter', { failureRedirect:'/', successRedirect:'/' }));

app.get('/connect/facebook', passport.authorize('facebook', { scope: ['publish_actions', 'publish_stream', 'read_stream', 'manage_pages', 'user_groups', 'friends_groups'], failureRedirect:'/', successRedirect:'/' }));
app.get('/connect/facebook/callback', passport.authorize('facebook', { failureRedirect:'/', successRedirect:'/' }));

app.get('/connect/linkedin', passport.authorize('linkedin', { scope: ['r_basicprofile', 'r_fullprofile', 'r_emailaddress', 'r_network', 'r_contactinfo', 'rw_nus', 'rw_company_admin', 'rw_groups', 'w_messages'], failureRedirect:'/', successRedirect:'/' }));
app.get('/connect/linkedin/callback', passport.authorize('linkedin', { failureRedirect:'/', successRedirect:'/' }));

app.get('/connect/stocktwits', passport.authorize('stocktwits', { scope: ['read','watch_lists','publish_messages','publish_watch_lists','follow_users','follow_stocks'], failureRedirect:'/', successRedirect:'/' }));
app.get('/connect/stocktwits/callback', passport.authorize('stocktwits', { failureRedirect:'/', successRedirect:'/' }));

app.get('/connect/soundcloud', passport.authenticate('soundcloud', { failureRedirect:'/', successRedirect:'/' }));
app.get('/connect/soundcloud/callback', passport.authenticate('soundcloud', { failureRedirect:'/', successRedirect:'/' }));

app.get('/connect/bitly', passport.authenticate('bitly', { failureRedirect:'/', successRedirect:'/' }));
app.get('/connect/bitly/callback', passport.authenticate('bitly', { failureRedirect:'/', successRedirect:'/' }));


app.get('/', function (req, res) {
    res.render('app');
});

app.listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
});
