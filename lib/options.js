
var utils = require('./utils');

var upload = require('../config/upload');


function Options () {}

Options.prototype.get = function (api, options) {}
Options.prototype.post = function (api, options) {}

Options.prototype.upload = function (provider, api, options) {
    if (!options.upload || !upload[provider.name] || !upload[provider.name][api]) return;
    options.headers['content-type'] = 'multipart/form-data';
    options.multipart = this.multipart(provider, api, options)
    delete options.form;
    delete options.json;
}

Options.prototype.multipart = function (provider, api, options) {
    var multipartItems = [];
    for (key in options.form) {
        var multipartItem = {};

        if (key == upload[provider.name][api].key) {
            var contentDisposition = 'form-data; name="'+key+'"; filename="'+options.upload+'"';

            var mime = utils.mime(options.upload);
            this.supported(provider, api, mime);
            contentType = mime;
            multipartItem['content-transfer-encoding'] = 'utf8';
        }
        else {
            var contentDisposition = 'form-data; name="'+key+'"',
                contentType = 'text/plain';
        }

        multipartItem['content-disposition'] = contentDisposition;
        multipartItem['content-type'] = contentType;
        multipartItem.body = options.form[key];

        multipartItems.push(multipartItem);
    }

    return multipartItems;
}

Options.prototype.supported = function (provider, api, mime) {
    var supported = upload[provider.name][api].types;
    if (supported.length && supported.indexOf(mime) == -1) {
        throw new Error('Unsupported media type.');
    }
}

Options.prototype.oauth = function (options) {
    options.oauth = options.oauth||{};
    options.oauth = {
        consumer_key: options.oauth.consumer_key||this.consumerKey,
        consumer_secret: options.oauth.consumer_secret||this.consumerSecret,
        token: options.oauth.token,
        token_secret: options.oauth.secret||options.oauth.token_secret
    }
    if (!options.oauth.consumer_key || !options.oauth.consumer_secret ||
        !options.oauth.token || !options.oauth.token_secret)
        throw new Error('Missing OAuth credentials!');
}

exports = module.exports = Options;
