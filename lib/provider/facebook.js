
function facebook () {

    this.options.supported = function (mime) {
        var supported = ['image/gif', 'image/jpeg', 'image/png', 'image/bmp', 'image/tiff'];
        if (supported.indexOf(mime) == -1) {
            throw new Error('Unsupported media type.');
        }
    }

    this.options.uploadApi = {
        'me/photos': 'source'
    }
}

exports = module.exports = facebook;
