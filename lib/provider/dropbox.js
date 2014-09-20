
function dropbox () {

    this.options.get = function (endpoint, options) {
        if (options.api == 'files')
            options.encoding = null;
    }
}

exports = module.exports = dropbox;
