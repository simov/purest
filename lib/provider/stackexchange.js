
function stackexchange () {

    this.options.get = function (endpoint, options) {
        options.encoding = null;
    }

    this.options.post = function (endpoint, options) {
        options.encoding = null;
    }
}

exports = module.exports = stackexchange;
