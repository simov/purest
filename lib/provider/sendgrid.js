
var mime = require('mime-types');
var upload = require('../../config/upload');


function text (key, data) {
    var multipartItem = {}, contentDisposition, contentType, contentEncoding;

    contentDisposition = 'form-data; name="'+key+'"';
    contentType = 'text/plain';
    contentEncoding = 'utf8';

    multipartItem['content-disposition'] = contentDisposition;
    multipartItem['content-type'] = contentType;
    multipartItem['content-transfer-encoding'] = contentEncoding;
    multipartItem.body = data;

    return multipartItem
}
function file (key, data) {
    var multipartItem = {}, contentDisposition, contentType, contentEncoding;
    
    contentDisposition = 'form-data; name="files['+key+']"; filename="'+key+'"';
    contentType = mime.lookup(key);
    contentEncoding = 'binary';

    multipartItem['content-disposition'] = contentDisposition;
    multipartItem['content-type'] = contentType;
    multipartItem['content-transfer-encoding'] = contentEncoding;
    multipartItem.body = data;

    return multipartItem;
}

function sendgrid () {

    this.options.multipart = function (provider, endpoint, options) {
        var multipartItems = [];
        for (key in options.form) {
            var data = options.form[key];

            if (data instanceof Array) {
                for (var i=0; i < data.length; i++) {
                    (key == upload[provider.name][endpoint].key)
                    // binary
                    ? multipartItems.push(file(data[i].filename, data[i].content))
                    // text
                    : multipartItems.push(text(key, data[i]));
                }
            }
            else {
                multipartItems.push(text(key, data));
            }
        }

        return multipartItems;
    }

    this.options.upload = function (provider, endpoint, options) {
        if (!options.upload || !upload[provider.name] || !upload[provider.name][endpoint]) return;
        // check for key
        if (!options.form.files || !options.form.files.length) return;

        options.headers['content-type'] = 'multipart/form-data';
        options.multipart = this.multipart(provider, endpoint, options);
        delete options.form;
        delete options.json;
        delete options.upload;
    }
}

exports = module.exports = sendgrid;
