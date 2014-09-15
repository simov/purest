
var mime = require('mime-types');
var upload = require('../../config/upload');


function sendgrid () {

    this.options._upload.before = function (provider, endpoint, options) {
        if (!options.upload || !upload[provider.name]) return;
        if (!upload[provider.name][endpoint]) return;
        if (!options.form.files) return;
        return true;
    }

    this.options.multipart.file = function (key, file, content) {
        return {
            'content-disposition': 'form-data; name="'+key+'['+file+']"; filename="'+file+'"',
            'content-type': mime.lookup(file),
            'content-transfer-encoding': 'binary',
            body: content
        };
    }
}

exports = module.exports = sendgrid;
