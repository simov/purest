
var utils = require('../utils');


function stocktwits () {

    this.options.multipart = function (args) {
        var multipartItems = [];
        for (key in args.data) {
            var multipartItem = {};

            if (key == 'chart') {
                var contentDisposition = 'form-data; name="chart"; filename="'+args.options.file+'"';

                var supported = ['image/gif', 'image/jpeg', 'image/png'];
                if (supported.indexOf(args.options.mime) == -1) {
                    throw new Error('Unsupported media type.');
                }
                contentType = args.options.mime;
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
}

exports = module.exports = stocktwits;
