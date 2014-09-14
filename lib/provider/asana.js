
var upload = require('../../config/upload');


function asana () {

    this.options.upload = function (provider, endpoint, options) {
        if (!options.upload || !upload[provider.name]) return;
        if (!/tasks\/.*\/attachments/.test(endpoint)) return;

        options.headers['content-type'] = 'multipart/form-data';
        options.multipart = this.multipart(provider, 'tasks/attachments', options);
        delete options.form;
        delete options.json;
        delete options.upload;
    }
}

exports = module.exports = asana;
