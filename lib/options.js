
var utils = require('./utils');


function Options () {}
Options.prototype.defaults = function (args) {
    return {
        qs: args.params,
        form: args.data,
        json: true,
        oauth: this.oauth ? {
            consumer_key: this.consumerKey,
            consumer_secret: this.consumerSecret,
            token: args.options.token,
            token_secret: args.options.secret
        } : null
    }
}
Options.prototype.get = function (options, args) {}
Options.prototype.post = function (options, args) {}
Options.prototype.upload = function (api, options, args) {
    if (!args.options.upload) return;
    options.headers = {'content-type': 'multipart/form-data'};
    options.multipart = this.multipart(api, args)
    delete options.form;
    delete options.json;
}
Options.prototype.supported = function (mime) {
    var supported = ['image/gif', 'image/jpeg', 'image/png'];
    if (supported.indexOf(mime) == -1) {
        throw new Error('Unsupported media type.');
    }
}
Options.prototype.multipart = function (api, args) {
    var multipartItems = [];
    for (key in args.data) {
        var multipartItem = {};

        if (key == this.uploadApi[api]) {
            var contentDisposition = 'form-data; name="'+key+'"; filename="'+args.options.upload+'"';

            var mime = utils.mime(args.options.upload);
            this.supported(mime);
            contentType = mime;
            multipartItem['content-transfer-encoding'] = 'utf8';
        }
        else {
            var contentDisposition = 'form-data; name="'+key+'"',
                contentType = 'text/plain';
        }

        multipartItem['content-disposition'] = contentDisposition;
        multipartItem['content-type'] = contentType;
        multipartItem.body = args.data[key];

        multipartItems.push(multipartItem);
    }

    return multipartItems;
}

exports = module.exports = Options;
