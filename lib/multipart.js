
var mime = require('mime-types');


function Multipart (provider, config) {
    this.provider = provider;
    this.endpoints = config||null;
}

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

Multipart.prototype.create = function (endpoint, options) {
    return this._create(endpoint, options);
}

Multipart.prototype._create = function (endpoint, options) {
    var items = [];
    var file = options.upload,
        target = this.endpoints[endpoint];

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


exports = module.exports = Multipart;
