
var upload = require('../../config/upload');


function mailgun () {

    this.options._upload.before = function (provider, endpoint, options) {
        if (!options.upload || !upload[provider.name]) return;
        if (!/.*\/messages/.test(endpoint)) return;
        if (!options.form.attachment) return;
        return true;
    }

    this.options._upload.create = function (multipart, provider, endpoint, options) {
        return multipart.create(provider, 'messages', options);
    }
}

exports = module.exports = mailgun;
