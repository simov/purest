
function stackexchange () {

    this.options.get = function (api, options) {
        options.encoding = null;
    }

    this.options.post = function (api, options) {
        options.encoding = null;
    }
}

exports = module.exports = stackexchange;
