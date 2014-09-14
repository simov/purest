
var utils = require('../utils');
var upload = require('../../config/upload');


function twitter () {

    this.url = function (endpoint, options) {
        options = options||{};
        // posting but not uploading
        if (options.form && !upload[endpoint]) {

            var qs = utils.uri.qs(options.form);

            var path = [this.domain, this.createPath(endpoint, options) + (qs && ('?'+qs))].join('/');
            delete options.form;
            return path;
        }
        // get
        else {
            return [this.domain, this.createPath(endpoint, options)].join('/');
        }
    }
}

exports = module.exports = twitter;
