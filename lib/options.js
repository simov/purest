
var mime = require('mime-types');
var upload = require('../config/upload');


function Options () {
    this._upload = new Upload();
    this.multipart = new Multipart();
}

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
    if (!this._upload.before(provider, endpoint, options)) return;
    options.headers['content-type'] = 'multipart/form-data';

    this.multipart.before(provider, endpoint, options);

    options.multipart = this._upload.create(this.multipart, provider, endpoint, options);

    this.multipart.after(provider, endpoint, options);
    this._upload.after(provider, endpoint, options);
}


function Upload () {}

Upload.prototype.before = function (provider, endpoint, options) {
    if (!options.upload || !upload[provider.name]) return;
    if (!upload[provider.name][endpoint]) return;
    return true;
}

Upload.prototype.create = function (multipart, provider, endpoint, options) {
    return multipart.create(provider, endpoint, options);
}

Upload.prototype.after = function (provider, endpoint, options) {
    delete options.form;
    delete options.json;
    delete options.upload;
}


function Multipart () {}

Multipart.prototype.text = function (key, content) {
    return {
        'content-disposition': 'form-data; name="'+key+'"',
        'content-type': 'text/plain',
        'content-transfer-encoding': 'utf8',
        body: content
    };
}

Multipart.prototype.file = function (key, file, content) {
    return {
        'content-disposition': 'form-data; name="'+key+'"; filename="'+file+'"',
        'content-type': mime.lookup(file),
        'content-transfer-encoding': 'binary',
        body: content
    };
}

Multipart.prototype.item = function (key, data, target, options) {
    if (key == target) {
        return ('string'===typeof options.upload)
            ? this.file(key, options.upload, data)
            : this.file(key, data.filename, data.content);
    } else {
        return this.text(key, data);
    }
}

Multipart.prototype.before = function (provider, endpoint, options) {}

Multipart.prototype.create = function (provider, endpoint, options) {
    var multipartItems = [];
    for (key in options.form) {
        var data = options.form[key],
            target = upload[provider.name][endpoint].key;

        if (data instanceof Array) {
            for (var i=0; i < data.length; i++) {
                multipartItems.push(this.item(key, data[i], target, options));
            }
        }
        else {
            multipartItems.push(this.item(key, data, target, options));
        }
    }
    return multipartItems;
}

Multipart.prototype.after = function (provider, endpoint, options) {}


exports = module.exports = Options;
