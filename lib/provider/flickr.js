
var url = require('url');
var moth = require('mashape-oauth');

var upload = require('../../config/upload');


// flickr expects the oauth data encoded
// inside the multipart body instead of the headers
function sign (provider, api, options) {
    var client = new moth.OAuth({
        consumerKey: provider.consumerKey,
        consumerSecret: provider.consumerSecret,
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

    this.options.upload = function (provider, api, options) {
        if (!options.upload || !upload[provider.name] || !upload[provider.name][api]) return;
        options.headers['content-type'] = 'multipart/form-data';

        options.form = sign(provider, api, options);

        options.multipart = this.multipart(provider, api, options)

        delete options.oauth;
        delete options.form;
        delete options.json;
    }
}

exports = module.exports = flickr;
