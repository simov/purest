
function gmaps () {

    this.options.get = function (options, args) {
        if (args.options && args.options.binary) options.encoding = null;
    }
}

exports = module.exports = gmaps;
