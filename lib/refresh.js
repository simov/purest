
var query = require('querystring');
var request = require('request');
var utils = require('./utils');
var providers = require('../config/providers');


// app:{key,secret} user:{token,secret} options:{}
function OAuth1 (provider) {
    return function (app, user, options, done) {
        var url = providers[this.name].__provider.refresh;
        var qs = utils.sign({
            signature:'plaintext',
            method:'POST',
            url:url,
            app:app,
            user:user,
            params:options
        });
        request.post(url, {qs:qs}, function (err, res, body) {
            done(err, res, query.parse(body));
        });
    }.bind(provider);
}

// app:{key,secret} refresh:''
function OAuth2 (provider) {
    return function (app, refresh, done) {
        var url = providers[this.name].__provider.refresh;
        request.post(url, {
            form:{
                grant_type:'refresh_token',
                client_id:app.key,
                client_secret:app.secret,
                refresh_token:refresh
            },
            json:true
        }, done);
    }.bind(provider);
}

exports = module.exports = function (provider) {
    switch (true) {
        case /yahoo/.test(provider.name):
            return new OAuth1(provider);
        case /asana|heroku|google|box|live|paypal|digitalocean/.test(provider.name):
            return new OAuth2(provider);
        default: return undefined;
    }
}
