
var utils = require('../utils');


function twitter () {
    this.url = function (api, args) {
        if (args.data && !args.options.upload) {
            return this.endpoint + utils.qs.call(this, api, args.data);
        } else {
            return this.endpoint + this.createPath(api);
        }
    }

    this.options.post = function (options, args) {
        // delete options.qs;
        delete options.form;
    }

    this.options.multipart = function (args) {
        var multipartItems = [];
        for (key in args.data) {
            var multipartItem = {};

            var contentDisposition = 'form-data; name="' + key + '"',
                contentType = 'text/plain',
                body = args.data[key];

            if (key == 'media[]') {
                var supported = ['image/gif', 'image/jpeg', 'image/png'];
                if (supported.indexOf(args.options.mime) == -1) {
                    throw new Error('Unsupported media type.');
                }
                contentType = args.options.mime;
                multipartItem['content-transfer-encoding'] = 'utf8';
            }

            multipartItem['content-disposition'] = contentDisposition;
            multipartItem['content-type'] = contentType;
            multipartItem.body = body;

            multipartItems.push(multipartItem);
        }

        return multipartItems;
    }
}

exports = module.exports = twitter;
