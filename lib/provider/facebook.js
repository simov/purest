
function facebook () {
    this.options.multipart = function (args) {
        var multipartItems = [];
        for (key in args.data) {
            var multipartItem = {};

            var contentDisposition = 'form-data; name="files"; filename="'+args.options.file+'"',
                contentType = 'text/plain',
                body = args.data[key];

            if (key == 'source') {
                var supported = ['image/gif', 'image/jpeg', 'image/png', 'image/bmp', 'image/tiff'];
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

exports = module.exports = facebook;
