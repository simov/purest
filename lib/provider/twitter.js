
var utils = require('../utils');
var upload = require('../../config/upload');


function twitter () {

    this.url.get = function (endpoint, options) {
        options = options||{};
        // posting but not uploading
        if (options.form && !upload[endpoint]) {

            var qs = utils.uri.qs(options.form);

            var path = [this.provider.domain, this.create(endpoint, options) + (qs && ('?'+qs))].join('/');
            delete options.form;
            return path;
        }
        // get
        else {
            return [this.provider.domain, this.create(endpoint, options)].join('/');
        }
    }
}

exports = module.exports = twitter;
