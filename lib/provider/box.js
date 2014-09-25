
var upload = require('../../config/upload');


function box () {

    this.options._upload.before = function (provider, endpoint, options) {
        if (!options.upload || !upload[provider.name]) return;
        if (!/files\/(?:.*\/)?content/.test(endpoint)) return;
        if (options.api != 'upload') return;
        return true;
    }

    this.options._upload.create = function (multipart, provider, endpoint, options) {
        return multipart.create(provider, 'files/content', options);
    }
}

exports = module.exports = box;
