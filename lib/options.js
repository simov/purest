
var mime = require('mime-types');


function Options () {
    this._upload = new Upload();
    this.multipart = new Multipart();
}

Options.prototype.get = function (endpoint, options) {}
Options.prototype.post = function (endpoint, options) {}
Options.prototype.put = function (endpoint, options) {}
Options.prototype.del = function (endpoint, options) {}

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
    if (!options.upload || !provider.multipart) return;
    if (!provider.multipart[endpoint]) return;
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

Multipart.prototype.text = function (key, data) {
    return {
        'content-disposition': 'form-data; name="'+key+'"',
        'content-type': 'text/plain',
        'content-transfer-encoding': 'utf8',
        body: data
    };
}

Multipart.prototype.file = function (key, file, data) {
    return {
        'content-disposition': 'form-data; name="'+key+'"; filename="'+file+'"',
        'content-type': mime.lookup(file),
        'content-transfer-encoding': 'binary',
        body: data
    };
}

Multipart.prototype.before = function (provider, endpoint, options) {}

Multipart.prototype.create = function (provider, endpoint, options) {
    var items = [];
    var file = options.upload,
        target = provider.multipart[endpoint];

    for (key in options.form) {
        var data = options.form[key];

        if (key == target) {
            if (file instanceof Array) {
                for (var i=0; i < file.length; i++) {
                    items.push(this.file(key, file[i], data[i]));
                }
            }
            else {
                items.push(this.file(key, file, data));
            }
        }
        else {
            if (data instanceof Array) {
                for (var i=0; i < data.length; i++) {
                    items.push(this.text(key, data[i]));
                }
            }
            else {
                items.push(this.text(key, data));
            }
        }
    }

    return items;
}

Multipart.prototype.after = function (provider, endpoint, options) {}


exports = module.exports = Options;
