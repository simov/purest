
var mime = require('mime-types');

var upload = require('../config/upload');


function Options () {}

Options.prototype.get = function (endpoint, options) {}
Options.prototype.post = function (endpoint, options) {}

Options.prototype.oauth = function (options) {
    options.oauth = options.oauth||{};
    options.oauth = {
        consumer_key: options.oauth.consumer_key||this.key,
        consumer_secret: options.oauth.consumer_secret||this.secret,
        token: options.oauth.token,
        token_secret: options.oauth.secret||options.oauth.token_secret
    }
    if (!options.oauth.consumer_key || !options.oauth.consumer_secret ||
        !options.oauth.token || !options.oauth.token_secret)
        throw new Error('Missing OAuth credentials!');
}

Options.prototype.upload = function (provider, endpoint, options) {
    if (!options.upload || !upload[provider.name] || !upload[provider.name][endpoint]) return;
    options.headers['content-type'] = 'multipart/form-data';
    
    this.beforeMultipart(provider, endpoint, options);
    options.multipart = this.multipart(provider, endpoint, options);
    this.afterMultipart(provider, endpoint, options);
    
    delete options.form;
    delete options.json;
    delete options.upload;
}

Options.prototype.beforeMultipart = function (provider, endpoint, options) {}
Options.prototype.afterMultipart = function (provider, endpoint, options) {}

Options.prototype.multipart = function (provider, endpoint, options) {
    var multipartItems = [];
    for (key in options.form) {
        var multipartItem = {},
            contentDisposition, contentType, contentEncoding;

        if (key == upload[provider.name][endpoint].key) {
            contentDisposition = 'form-data; name="'+key+'"; filename="'+options.upload+'"';
            contentType = mime.lookup(options.upload);
            contentEncoding = 'binary';
        }
        else {
            contentDisposition = 'form-data; name="'+key+'"';
            contentType = 'text/plain';
            contentEncoding = 'utf8';
        }

        multipartItem['content-disposition'] = contentDisposition;
        multipartItem['content-type'] = contentType;
        multipartItem['content-transfer-encoding'] = contentEncoding;
        multipartItem.body = options.form[key];

        multipartItems.push(multipartItem);
    }

    return multipartItems;
}

exports = module.exports = Options;
