
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
var providers = [
    'twitter', 'facebook', 'linkedin', 'soundcloud', 'stocktwits',
    'bitly', 'github', 'stackexchange', 'google', 'yahoo'];


providers.forEach(function (provider) {
    
    var options = {};
    var key    = /(twitter|linkedin|yahoo)/.test(provider) ? 'consumerKey'    : 'clientID';
    var secret = /(twitter|linkedin|yahoo)/.test(provider) ? 'consumerSecret' : 'clientSecret';
    var host = process.argv[2] ? process.argv[2] : 'localhost:'+app.get('port');

    options[key] = cred.app[provider].key;
    options[secret] = cred.app[provider].secret;
    options.callbackURL = ['http://',host,'/connect/',provider,'/callback'].join('');
    options.passReqToCallback = true;
    if (provider == 'stackexchange') options.key = cred.app[provider].req_key;

    var Strategy = (function () {
        var postfix = '', classname = 'Strategy';
        switch (provider) {
            case 'google': postfix = '-oauth'; classname = 'OAuth2Strategy'; break;
            case 'yahoo': postfix = '-oauth'; break;
        }
        return require('passport-'+provider+postfix)[classname];
    }());
    var strategy = new Strategy(options, function (req, token, secret, profile, done) {
        console.log('account', '->', profile.username);
        console.log('token', '->', token);
        console.log('secret', '->', secret);
        req.session.oauth = {
            provider:req.url.replace(/\/connect\/(.*)\/callback.*/,'$1'),
            token:token, secret:secret, profile:JSON.stringify(profile, null, 4)
        };
        done();
    });

    passport.use(strategy);
});


var permissions = {
    twitter:[],
    facebook:['publish_actions', 'publish_stream', 'read_stream', 'manage_pages', 'user_groups', 'friends_groups'],
    linkedin:['r_basicprofile', 'r_fullprofile', 'r_emailaddress', 'r_network', 'r_contactinfo', 'rw_nus', 'rw_company_admin', 'rw_groups', 'w_messages'],
    stocktwits:['read','watch_lists','publish_messages','publish_watch_lists','follow_users','follow_stocks'],
    soundcloud:['non-expiring'],
    bitly:[],
    github:[],
    stackexchange:[],
    google:[
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/youtube.readonly',
        'https://www.googleapis.com/auth/drive.readonly',
        'https://www.googleapis.com/auth/freebase',
        'https://www.googleapis.com/auth/tasks',
        'https://www.googleapis.com/auth/yt-analytics.readonly'
    ],
    yahoo:[]
};

for (var provider in permissions) {
    var method = /(soundcloud|bitly|yahoo)/.test(provider) ? 'authenticate' : 'authorize';

    app.get('/connect/'+provider, passport[method](provider, {scope:permissions[provider], failureRedirect:'/', successRedirect:'/'}));
    app.get('/connect/'+provider+'/callback', passport[method](provider, {failureRedirect:'/', successRedirect:'/'}));
}


app.get('/', function (req, res) {
    var params = [],
        oauth = req.session.oauth||{};
    delete req.session.oauth;
    providers.forEach(function (provider) {
        params.push({url:'/connect/'+provider, text:provider,
            credentials: (oauth && oauth.provider == provider) ? oauth : null
        });
    });
    res.render('template', {providers:params});
});

app.listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
});
