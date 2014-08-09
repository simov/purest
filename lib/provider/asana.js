
var upload = require('../../config/upload');


function asana () {

    this.options.upload = function (provider, api, options) {
        if (!options.upload || !upload[provider.name]) return;
        if (!/tasks\/.*\/attachments/.test(api)) return;

        options.headers['content-type'] = 'multipart/form-data';
        options.multipart = this.multipart(provider, 'tasks/attachments', options)
        delete options.form;
        delete options.json;
    }
}

exports = module.exports = asana;
