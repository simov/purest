
var utils = require('../utils'),
    config = require('../../config/providers');


function flickr () {

    // flickr expects the oauth data encoded
    // inside the multipart body
    this.options.multipart.before = function (provider, endpoint, options) {

        var photo = options.form.photo;
        delete options.form.photo;

        var api = config.flickr.api[options.api];

        var qs = utils.sign({
            signature:'HMAC-SHA1',
            method:'POST',
            url:[api.domain, api.path].join('/'),
            app:{key:provider.key, secret:provider.secret},
            user:{token:options.oauth.token, secret:options.oauth.token_secret},
            params:options.form
        });

        qs.photo = photo;
        options.form = qs;
    }

    this.options.multipart.after = function (provider, endpoint, options) {
        delete options.oauth;
    }
}

exports = module.exports = flickr;
