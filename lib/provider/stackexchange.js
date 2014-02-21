
function stackexchange () {

    this.options.get = function (options, args) {
        options.encoding = null;
    }

    this.options.post = function (options, args) {
        options.encoding = null;
    }
}

exports = module.exports = stackexchange;
