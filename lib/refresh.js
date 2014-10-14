
var query = require('querystring');
var request = require('request');
var utils = require('./utils');


// app:{key,secret} user:{token,secret} options:{}
function OAuth1 (provider) {
    return function (app, user, options, done) {
        var url = provider._refresh;
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
        var url = provider._refresh;
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

function aboutme (provider) {
    return function (apikey, user, pass, done) {
        provider.query()
            .update('user/login/'+user)
            .where({
                client_id:apikey,
                grant_type:'password',
                password:pass
            })
            .request(done);	
    };
}

exports = module.exports = function (provider) {
    if (provider.oauth2 && provider._refresh) {
        return new OAuth2(provider);
    }
    else if (/yahoo/.test(provider.name)) {
        return new OAuth1(provider);
    }
    else if (/aboutme/.test(provider.name)) {
        return new aboutme(provider);
    }
}
