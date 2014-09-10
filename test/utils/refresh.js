
var query = require('querystring');
var request = require('request');

var utils = require('../../lib/utils'),
    cred = require('../../config/credentials');


exports = module.exports = {
    // https://developer.yahoo.com/oauth/guide/oauth-refreshaccesstoken.html
    yahoo: function (done) {
        var url = 'https://api.login.yahoo.com/oauth/v2/get_token';
        var qs = utils.sign({
            signature:'plaintext',
            method:'POST',
            url:url,
            app:cred.app.yahoo,
            user:cred.user.yahoo,
            params:{
                oauth_session_handle:'AMPK7VM5Vbs4yQAOdkBzZs8Z0B9ODS2k9KpL6OvZ3a6SFS.yFQMxmw--'
            }
        });
        request.post(url, {qs:qs}, function (err, res, body) {
            done(err, res, query.parse(body));
        });
    },
    // https://github.com/Asana/oauth-examples#token-exchange-endpoint
    asana: function (done) {
        var url = 'https://app.asana.com/-/oauth_token';
        request.post(url, {
            qs:{
                grant_type:'refresh_token',
                client_id:cred.app.asana.key,
                client_secret:cred.app.asana.secret,
                refresh_token:cred.user.asana.refresh
            },
            json:true
        }, done);
    },
    // https://devcenter.heroku.com/articles/oauth#token-refresh
    heroku: function (done) {
        var url = 'https://id.heroku.com/oauth/token';
        request.post(url, {
            qs:{
                grant_type:'refresh_token',
                client_id:cred.app.heroku.key,
                client_secret:cred.app.heroku.secret,
                // redirect_ur:'https://passport-oauth.herokuapp.com/connect/heroku/callback',
                refresh_token:cred.user.heroku.refresh
            },
            json:true
        }, done);
    },
    // https://developers.google.com/accounts/docs/OAuth2WebServer?hl=fr#refresh
    google: function (done) {
        var url = 'https://accounts.google.com/o/oauth2/token';
        request.post(url, {
            form:{
                grant_type:'refresh_token',
                client_id:cred.app.google.key,
                client_secret:cred.app.google.secret,
                // redirect_ur:'https://passport-oauth.googleapp.com/connect/google/callback',
                refresh_token:cred.user.google.refresh
            },
            json:true
        }, done);
    }
};
