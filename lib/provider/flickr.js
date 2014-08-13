
var url = require('url');
var moth = require('mashape-oauth');


// flickr expects the oauth data encoded
// inside the multipart body instead of the headers
function sign (provider, api, options) {
    var client = new moth.OAuth({
        consumerKey: provider.key,
        consumerSecret: provider.secret,
        version: '1.0',
        signatureMethod: 'HMAC-SHA1'
    });

    var photo = options.form.photo;
    delete options.form.photo;

    var requestOptions = {
        method: 'POST',
        protocol: 'https',
        hostname: 'up.flickr.com',
        pathname: '/services/'+options.api,
        query: options.form
    };

    var str = url.format(requestOptions),
        signed = client.signUrl(str, options.oauth.token, options.oauth.secret, 'POST');

    var opts = url.parse(signed, true);
    opts.query.photo = photo;

    return opts.query;
}

function flickr () {

    this.options.beforeMultipart = function (provider, api, options) {
        options.form = sign(provider, api, options);
    }

    this.options.afterMultipart = function (provider, api, options) {
        delete options.oauth;
    }
}

exports = module.exports = flickr;
